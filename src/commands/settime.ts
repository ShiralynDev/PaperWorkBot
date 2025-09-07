import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { globals } from "../globals";

export const data = new SlashCommandBuilder()
  .setName("settime")
  .setDescription("Sets the time so bot can keep track of ingame time")
  .addStringOption(option =>
    option
      .setName('time')
      .setDescription('Time to set')
      .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  const time = interaction.options.getString("time");
  const member = interaction.member as GuildMember;

  if (!member?.roles.cache.has(globals.roleIDForOfficer)) 
    return interaction.reply({content: `You don't have permissions to set this`, ephemeral: true});

  if (typeof time !== "string")
    return interaction.reply({content: "Something failed :(", ephemeral: true}); // prob set this as a function so it can be quickly changed, like I had to do and like I will have to do as ephemeral: true is depercated

  const timeSplit = time.split(":");
  if (timeSplit.length != 2 || !parseInt(timeSplit[0]) || !parseInt(timeSplit[1]))
    return interaction.reply({content: "Something failed :(", ephemeral: true});

  globals.gameDateTime.setHours(parseInt(timeSplit[0]));
  globals.gameDateTime.setMinutes(parseInt(timeSplit[1]));
  globals.lastSetRealTime = Date.now();

  return interaction.reply({content: `Time is now set to: ${timeSplit[0]}:${timeSplit[1]}!`});
}