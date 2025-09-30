import { CommandInteraction, TextChannel, SlashCommandBuilder } from "discord.js";
import { globals } from "../globals"

export const data = new SlashCommandBuilder()
  .setName("clearmessages")
  .setDescription("Clears messages in the channel set in bot settings");

export async function execute(interaction: CommandInteraction) {
  const member = interaction.member as GuildMember;
  if (!member?.roles.cache.has(globals.roleIDForOfficer)) 
    return interaction.reply({content: `You don't have permissions to do this`, ephemeral: true});

  if (!interaction.guild) 
    return interaction.reply({ content: "Not a discord server", ephemeral: true });

  const usedChannel = interaction.guild.channels.cache.get(globals.channelID) as TextChannel;
  if (!usedChannel)
    return interaction.reply({ content: "Could not get channel", ephemeral: true })

  try {
    const messages = await usedChannel.messages.fetch({ limit: 100 });
    await usedChannel.bulkDelete(messages);

    return interaction.reply({ content: "Deleted 0-100 messages", ephemeral: true })
  } catch (err) {
    return interaction.reply({ content: "Something failed", ephemeral: true })
  }
}