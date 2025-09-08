import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { userTrainMap } from "../trainNumbers";
import { globals } from "../globals"

export const data = new SlashCommandBuilder()
  .setName("unclaimall")
  .setDescription("Clears all claims, to be used at end of session (bot restart clears claims automagically)")

export async function execute(interaction: ChatInputCommandInteraction) {
  const member = interaction.member as GuildMember;

  if (!member?.roles.cache.has(globals.roleIDForOfficer)) 
    return interaction.reply({content: `You don't have permissions to do this`, ephemeral: true});

  for (const key in userTrainMap) {
    delete userTrainMap[key];
  }

  return interaction.reply({content: `All claims cleared!`});
}