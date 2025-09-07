import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { userTrainMap } from "../trainNumbers";
import { AttachmentBuilder } from "discord.js";
import { fillPdf, pdfToPng } from "../PDFFunctions";
import { globals } from "../globals"
import fs, { glob } from "fs";

const monthAbbr = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const data = new SlashCommandBuilder()
  .setName("generateclearancecard")
  .setDescription("Generete a clearance card")
  .addStringOption(option =>
    option
      .setName('station')
      .setDescription('Station that the clearance card is from')
      .setRequired(true))
  .addStringOption(option =>
    option
      .setName('trainnumber')
      .setDescription('Conductor and Engineer No.')
      .setRequired(true))
  .addStringOption(option =>
    option
      .setName('ordernumber')
      .setDescription('...following orders for your train:')
      .setRequired(true))
  .addStringOption(option =>
    option
      .setName('time')
      .setDescription('overrides time')
      .setRequired(false))
  .addStringOption(option =>
    option
      .setName('date')
      .setDescription('Date, example: Apr. 19, 1925')
      .setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const userName = interaction.user.displayName;

  const station = interaction.options.getString("station");
  const date = `${monthAbbr[globals.gameDateTime.getMonth()-1]}. ${globals.gameDateTime.getDate()}, ${globals.gameDateTime.getFullYear()} `
  const trainnumber = interaction.options.getString("trainnumber");
  const ordernumber = interaction.options.getString("ordernumber");

  let timeString = ""; // move to function
	if (globals.gameDateTime.getHours() === 0) {
		timeString += "00";
	} else {
		if (globals.gameDateTime.getHours() <= 9) timeString += "0";
		timeString += globals.gameDateTime.getHours();
	}
	timeString += ":";
	if (globals.gameDateTime.getMinutes() === 0) {
		timeString += "00";
	} else {
		if (globals.gameDateTime.getMinutes() <= 9) timeString += "0";
		timeString += globals.gameDateTime.getMinutes();
	}

  const time = `${timeString}`;

  if (typeof station !== "string" || typeof date !== "string" || typeof trainnumber !== "string" || typeof ordernumber !== "string" || typeof time !== "string")
    return interaction.reply({content: "Something failed :(", ephemeral: true})

  await fillPdf(
  "./src/ClearanceCard.pdf",
  "./output.pdf",
  {
    Time: time,
    text_8odgx: globals.mainDispatcher,
    Engine: trainnumber,
    text_7bbka: userName,
    Date: date,
    Station: station,
    Forms: ordernumber
  }
  );

  const userIdsToPing = Object.keys(userTrainMap).filter(userId => userTrainMap[userId] === trainnumber);
  const mention = userIdsToPing.length > 0 ? userIdsToPing.map(id => `<@${id}>`).join(" ") : "";

  await pdfToPng("./output.pdf", "./output");
  const image = new AttachmentBuilder("output.png");
  await interaction.reply({ content: `${mention}`, files: [image] });
  fs.unlinkSync("output-1.png");
  fs.unlinkSync("output.png");
}