import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { userTrainMap } from "../trainNumbers";

export const data = new SlashCommandBuilder()
  .setName("unclaimtrain")
  .setDescription("Removes you from the claimed train list and will not ping you anymore")

export async function execute(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id;


  delete userTrainMap[userId];
  return interaction.reply({content: `You will not be pinged anymore`, ephemeral: true});
}