import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { userTrainMap } from "../trainNumbers";

export const data = new SlashCommandBuilder()
  .setName("claimtrain")
  .setDescription("Pings you when there are new orders for your train")
  .addStringOption(option =>
    option
      .setName('trainnumber')
      .setDescription('Train number that you want pings for')
      .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  const trainNumber = interaction.options.getString("trainnumber");
  const userId = interaction.user.id;

  if (typeof trainNumber != "string")
    return interaction.reply({content: "Something failed :(", ephemeral: true})


  if (userTrainMap[userId]) {
    delete userTrainMap[userId];
    userTrainMap[userId] = trainNumber;
    return interaction.reply({content: `Claim changed to ${trainNumber} you will now be pinged for it instead!`, ephemeral: true});
  }

  userTrainMap[userId] = trainNumber;
  return interaction.reply({content: `You will be pinged for train ${trainNumber}!`, ephemeral: true});
}