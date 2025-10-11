import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import trainOrderEmbed from "./embeds/trainOrderEmbed.json"; 
import { EmbedBuilder } from "discord.js";
import { globals, trainOrders } from "../globals"

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
      .setDescription('instructions text')
      .setRequired(true))
  .addMentionableOption(option =>
    option
      .setName('ping1')
      .setDescription('Ping YMs or whoever u need to ping')
      .setRequired(false))
  .addMentionableOption(option =>
    option
      .setName('ping2')
      .setDescription('Ping YMs or whoever u need to ping')
      .setRequired(false))
  .addMentionableOption(option =>
    option
      .setName('ping3')
      .setDescription('Ping YMs or whoever u need to ping')
      .setRequired(false))
  .addMentionableOption(option =>
    option
      .setName('ping4')
      .setDescription('Ping YMs or whoever u need to ping')
      .setRequired(false))
  .addMentionableOption(option =>
    option
      .setName('ping5')
      .setDescription('Ping YMs or whoever u need to ping')
      .setRequired(false))

export async function execute(interaction: ChatInputCommandInteraction) {
  const member = interaction.member as GuildMember;

  if (!member?.roles.cache.has(globals.roleIDForDispatchSettings)) 
    return interaction.reply({content: `You don't have permissions to do this`, ephemeral: true});

  const toText = interaction.options.getString("totext");
  const instructionsText = interaction.options.getString("instructionstext");
  const date = `${globals.gameDateTime.toLocaleString("en-US", { month: "short" })}. ${globals.gameDateTime.getDate()}, ${globals.gameDateTime.getFullYear()}`;
  const time = globals.gameDateTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const pings = [
    interaction.options.getMentionable("ping1"),
    interaction.options.getMentionable("ping2"),
    interaction.options.getMentionable("ping3"),
    interaction.options.getMentionable("ping4"),
    interaction.options.getMentionable("ping5"),
  ].filter((p): p is NonNullable<typeof p> => p !== null);

  if (!toText || !instructionsText) {
    return interaction.reply({ content: "Something failed :(", ephemeral: true });
  }

  const embedJson = JSON.parse(JSON.stringify(trainOrderEmbed));
  embedJson.fields.forEach((f: any) => {
    f.value = f.value
    .replace("{{trainOrder}}", globals.currentTrainOrder)
    .replace("{{date}}", date)
    .replace("{{to}}", toText.split(";").join("\n"))
    .replace("{{instructions}}", instructionsText.split(";").join("\n"));
  });

  embedJson.footer.text = embedJson.footer.text
    .replace("{{time}}", time)
    .replace("{{dispatcher}}", globals.mainDispatcher);

  const embed = new EmbedBuilder(embedJson);

  const pingText = pings.map(p => p.toString()).join(" ");
    await interaction.reply({
    embeds: [embed],
  });

  const orderMsg = await interaction.fetchReply();
  trainOrders[globals.currentTrainOrder] = orderMsg.id;

  globals.currentTrainOrder++;
}
