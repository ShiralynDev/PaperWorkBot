import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { globals } from "../globals";

export const data = new SlashCommandBuilder()
  .setName("setdispatcher")
  .setDescription("Sets dispatcher to be autofilled for cards")
  .addStringOption(option =>
    option
      .setName('dispatcher')
      .setDescription('Dispatcher to be set')
      .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()
  const dispatcher = interaction.options.getString("dispatcher");
  const member = interaction.member as GuildMember;

  if (!member?.roles.cache.has(globals.roleIDForDispatchSettings)) 
    return interaction.editReply({content: `You don't have permissions to set this`, ephemeral: true});

  if (typeof dispatcher !== "string")
    return interaction.editReply({content: "Something failed :(", ephemeral: true});

  globals.mainDispatcher = dispatcher;

  return interaction.editReply({content: `Dispatch is now: ${dispatcher}!`});
}