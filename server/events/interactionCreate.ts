import type { Collection, Interaction } from 'discord.js';
import type { BotCommand } from '../bot.js';
import { handleFarmRegistration, handleFarmModalSubmit } from '../commands/farm.js';
import { handleSaleRegistration, handleSaleModalSubmit } from '../commands/sales.js';

export async function interactionCreateHandler(
  interaction: Interaction,
  commands: Collection<string, BotCommand>
) {
  try {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      await command.execute(interaction);
    }

    // Handle button interactions
    else if (interaction.isButton()) {
      switch (interaction.customId) {
        case 'register_farm':
          await handleFarmRegistration(interaction);
          break;
        case 'register_sale':
          await handleSaleRegistration(interaction);
          break;
        default:
          console.log(`Unknown button interaction: ${interaction.customId}`);
      }
    }

    // Handle modal submissions
    else if (interaction.isModalSubmit()) {
      switch (interaction.customId) {
        case 'farm_modal':
          await handleFarmModalSubmit(interaction);
          break;
        case 'sale_modal':
          await handleSaleModalSubmit(interaction);
          break;
        default:
          console.log(`Unknown modal submission: ${interaction.customId}`);
      }
    }

  } catch (error) {
    console.error('Error handling interaction:', error);
    
    const errorMessage = '❌ Ocorreu um erro ao processar sua solicitação. Tente novamente.';
    
    try {
      if (interaction.isRepliable()) {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
          await interaction.reply({ content: errorMessage, ephemeral: true });
        }
      }
    } catch (followUpError) {
      console.error('Error sending error message:', followUpError);
    }
  }
}
