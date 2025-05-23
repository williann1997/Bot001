import { REST, Routes } from 'discord.js';
import { farmCommand } from './farm.js';
import { salesCommand } from './sales.js';
import { welcomeCommand } from './welcome.js';

const commands = [
  farmCommand.data.toJSON(),
  salesCommand.data.toJSON(),
  welcomeCommand.data.toJSON(),
];

export async function deployCommands() {
  const token = process.env.DISCORD_BOT_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.DISCORD_GUILD_ID || '1373298275700047963';

  if (!token || !clientId) {
    throw new Error('DISCORD_BOT_TOKEN and DISCORD_CLIENT_ID are required');
  }

  const rest = new REST().setToken(token);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error deploying commands:', error);
    throw error;
  }
}
