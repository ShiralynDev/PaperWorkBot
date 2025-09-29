import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { globals } from "./globals"

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("clientReady", async () => {
    console.log("Bot ready!");
    // deployCommands({ guildId: "1414186376810991648" }); // For quick refreshing slash commands
});

client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.login(config.DISCORD_TOKEN);

setInterval(() => {
  const now = Date.now();
  const elapsedMs = now - globals.lastSetRealTime;
  const elapsedMinutes = Math.floor(elapsedMs / 60000);

  if (elapsedMinutes > 0) {
    globals.gameDateTime.setMinutes(globals.gameDateTime.getMinutes() + elapsedMinutes);
    globals.lastSetRealTime += elapsedMinutes * 60000;
  }
}, 10000);