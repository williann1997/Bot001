import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { readyHandler } from './events/ready.js';
import { interactionCreateHandler } from './events/interactionCreate.js';
import { farmCommand } from './commands/farm.js';
import { salesCommand } from './commands/sales.js';
import { welcomeCommand } from './commands/welcome.js';

export interface BotCommand {
  data: any;
  execute: (interaction: any) => Promise<void>;
}

export class DiscordBot {
  public client: Client;
  public commands: Collection<string, BotCommand>;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.commands = new Collection();
    this.setupCommands();
    this.setupEvents();
  }

  private setupCommands() {
    const commands = [farmCommand, salesCommand, welcomeCommand];
    
    for (const command of commands) {
      this.commands.set(command.data.name, command);
    }
  }

  private setupEvents() {
    this.client.once('ready', () => readyHandler(this.client));
    this.client.on('interactionCreate', (interaction) => 
      interactionCreateHandler(interaction, this.commands)
    );
  }

  public async start() {
    const token = process.env.DISCORD_BOT_TOKEN;
    
    if (!token) {
      throw new Error('DISCORD_BOT_TOKEN is required in environment variables');
    }

    try {
      await this.client.login(token);
      console.log('Discord bot started successfully');
    } catch (error) {
      console.error('Failed to start Discord bot:', error);
      throw error;
    }
  }

  public async stop() {
    await this.client.destroy();
    console.log('Discord bot stopped');
  }
}

export const bot = new DiscordBot();
