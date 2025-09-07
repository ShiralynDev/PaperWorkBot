import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { globals } from "../globals";

export const data = new SlashCommandBuilder()
  .setName("setdate")
  .setDescription("Sets the date so bot can keep track of date")
  .addStringOption(option =>
    option
      .setName('year')
      .setDescription('year to set')
      .setRequired(true))
  .addStringOption(option =>
    option
      .setName('month')
      .setDescription('month to set')
      .setRequired(true))
  .addStringOption(option =>
    option
      .setName('day')
      .setDescription('day to set')
      .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  const year = interaction.options.getString("year");
  const month = interaction.options.getString("month");
  const day = interaction.options.getString("day");
  const member = interaction.member as GuildMember;

  if (!member?.roles.cache.has(globals.roleIDForOfficer)) 
    return interaction.reply({content: `You don't have permissions to set this`, ephemeral: true});

  if (typeof year !== "string" || typeof month !== "string" || typeof day !== "string")
    return interaction.reply({content: "Something failed :(", ephemeral: true}); // prob set this as a function so it can be quickly changed, like I had to do and like I will have to do as ephemeral: true is depercated

  if (!parseInt(year) || !parseInt(month) || !parseInt(day))
    return interaction.reply({content: "Something failed :(", ephemeral: true});

  globals.gameDateTime.setFullYear(parseInt(year), parseInt(month), parseInt(day));

  return interaction.reply({content: `Date is now set to: ${globals.gameDateTime.getFullYear()}-${globals.gameDateTime.getMonth()}-${globals.gameDateTime.getDate()}!`});
}