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
  const dispatcher = interaction.options.getString("dispatcher");
  const member = interaction.member as GuildMember;

  if (!member?.roles.cache.has(globals.roleIDForDispatchSettings)) 
    return interaction.reply({content: `You don't have permissions to set this`, ephemeral: true});

  if (typeof dispatcher !== "string")
    return interaction.reply({content: "Something failed :(", ephemeral: true});

  globals.mainDispatcher = dispatcher;

  return interaction.reply({content: `Dispatch is now: ${dispatcher}!`});
}