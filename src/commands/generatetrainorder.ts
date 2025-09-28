import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import trainOrderEmbed from "./embeds/trainOrderEmbed.json"; 
import { EmbedBuilder } from "discord.js";
import { globals } from "../globals"

export const data = new SlashCommandBuilder()
  .setName("generatetrainorder")
  .setDescription("Generete a train order")
  .addStringOption(option =>
    option
      .setName('totext')
      .setDescription('to text')
      .setRequired(true))
  .addStringOption(option =>
    option
      .setName('instructionstext')
      .setDescription('instructions text ')
      .setRequired(true))

export async function execute(interaction: ChatInputCommandInteraction) {
  const toText = interaction.options.getString("totext");
  const instructionsText = interaction.options.getString("instructionstext");
  const date = `${globals.gameDateTime.toLocaleString("en-US", { month: "short" })}. ${globals.gameDateTime.getDate()}, ${globals.gameDateTime.getFullYear()}`;
  const time = globals.gameDateTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  if (!toText || !instructionsText) {
    return interaction.reply({ content: "Something failed :(", ephemeral: true });
  }

  const embedJson = JSON.parse(JSON.stringify(trainOrderEmbed));
  embedJson.fields.forEach((f: any) => {
    f.value = f.value
    .replace("{{trainOrder}}", globals.currentTrainOrder)
    .replace("{{date}}", date)
    .replace("{{to}}", toText)
    .replace("{{instructions}}", instructionsText.split(";").join("\n"));
  });
  globals.currentTrainOrder++;

  embedJson.footer.text = embedJson.footer.text
    .replace("{{time}}", time)
    .replace("{{dispatcher}}", globals.mainDispatcher);

  const embed = new EmbedBuilder(embedJson);

  await interaction.reply({ embeds: [embed] });
}
