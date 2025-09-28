import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { userTrainMap } from "../trainNumbers";
import clearanceCardEmbed from "./embeds/clearanceCardEmbed.json"; 
import { EmbedBuilder } from "discord.js";
import { globals } from "../globals"

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
  const member = interaction.member as GuildMember;

  if (!member?.roles.cache.has(globals.roleIDForYM)) 
    return interaction.reply({content: `You don't have permissions to do this`, ephemeral: true});

  const userName = interaction.user.displayName;

  const station = interaction.options.getString("station");
  const trainnumber = interaction.options.getString("trainnumber");
  const ordernumber = interaction.options.getString("ordernumber");
  const date = `${globals.gameDateTime.toLocaleString("en-US", { month: "short" })}. ${globals.gameDateTime.getDate()}, ${globals.gameDateTime.getFullYear()}`;
  const time = globals.gameDateTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  if (!station || !trainnumber || !ordernumber) {
    return interaction.reply({ content: "Something failed :(", ephemeral: true });
  }

  const userIdsToPing = Object.keys(userTrainMap).filter(userId => userTrainMap[userId] === trainnumber);
  const mention = userIdsToPing.length > 0 ? userIdsToPing.map(id => `<@${id}>`).join(" ") : "";

  const embedJson = JSON.parse(JSON.stringify(clearanceCardEmbed));
  embedJson.fields.forEach((f: any) => {
    f.value = f.value
      .replace("{{station}}", station)
      .replace("{{trainnumber}}", trainnumber)
      .replace("{{ordernumber}}", ordernumber)
      .replace("{{date}}", date)
      .replace("{{time}}", time)
  });

  embedJson.footer.text = embedJson.footer.text
    .replace("{{dispatcher}}", globals.mainDispatcher)
    .replace("{{userName}}", userName);

  const embed = new EmbedBuilder(embedJson);

  await interaction.reply({ content: mention, embeds: [embed] });
}
