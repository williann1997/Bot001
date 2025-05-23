import type { Client } from 'discord.js';
import { deployCommands } from '../commands/index.js';

export async function readyHandler(client: Client) {
  console.log(`✅ Discord bot logged in as ${client.user?.tag}`);
  
  try {
    await deployCommands();
    console.log('🚀 Commands deployed successfully');
  } catch (error) {
    console.error('❌ Failed to deploy commands:', error);
  }

  // Set bot status
  client.user?.setActivity('Gerenciando farms e vendas', { type: 3 }); // Type 3 = Watching
}
