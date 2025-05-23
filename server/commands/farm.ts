import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { storage } from '../storage.js';
import { createFarmEmbed, createSuccessEmbed } from '../utils/embeds.js';
import { validateFarmData } from '../utils/validation.js';
import type { BotCommand } from '../bot.js';

export const farmCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('farm')
    .setDescription('Exibe o painel de registro de farms'),

  async execute(interaction: any) {
    try {
      const embed = createFarmEmbed();
      
      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('register_farm')
            .setLabel('🌾 REGISTRAR FARM')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🌾')
        );

      await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: false
      });

    } catch (error) {
      console.error('Error in farm command:', error);
      await interaction.reply({
        content: '❌ Erro ao exibir o painel de farms. Tente novamente.',
        ephemeral: true
      });
    }
  }
};

export async function handleFarmRegistration(interaction: any) {
  try {
    const modal = new ModalBuilder()
      .setCustomId('farm_modal')
      .setTitle('📋 Registro de Farm');

    const nameInput = new TextInputBuilder()
      .setCustomId('farm_name')
      .setLabel('Nome completo')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Digite seu nome completo')
      .setRequired(true)
      .setMaxLength(100);

    const idInput = new TextInputBuilder()
      .setCustomId('farm_id')
      .setLabel('ID do usuário')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Digite seu ID')
      .setRequired(true)
      .setMaxLength(50);

    const boxesInput = new TextInputBuilder()
      .setCustomId('farm_boxes')
      .setLabel('Quantidade de caixas')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Digite a quantidade de caixas')
      .setRequired(true)
      .setMaxLength(10);

    const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
    const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(idInput);
    const thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(boxesInput);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

    await interaction.showModal(modal);

  } catch (error) {
    console.error('Error showing farm modal:', error);
    await interaction.reply({
      content: '❌ Erro ao abrir o formulário. Tente novamente.',
      ephemeral: true
    });
  }
}

export async function handleFarmModalSubmit(interaction: any) {
  try {
    const name = interaction.fields.getTextInputValue('farm_name');
    const userId = interaction.fields.getTextInputValue('farm_id');
    const boxesStr = interaction.fields.getTextInputValue('farm_boxes');

    // Validate the data
    const validation = validateFarmData(name, userId, boxesStr);
    if (!validation.success) {
      await interaction.reply({
        content: `❌ ${validation.error}`,
        ephemeral: true
      });
      return;
    }

    const boxQuantity = parseInt(boxesStr);

    // Save to storage
    const farmData = {
      userId,
      userName: name,
      userDiscordId: interaction.user.id,
      boxQuantity
    };

    const farm = await storage.createFarm(farmData);

    // Send success message to user
    const successEmbed = createSuccessEmbed(
      'Farm registrado com sucesso! ✅',
      `**Nome:** ${name}\n**ID:** ${userId}\n**Caixas:** ${boxQuantity}\n**Registrado em:** <t:${Math.floor(Date.now() / 1000)}:F>`
    );

    await interaction.reply({
      embeds: [successEmbed],
      ephemeral: true
    });

    // Send notification to admin channel
    const adminChannelId = process.env.FARM_ADMIN_CHANNEL_ID || '1374559903414227155';
    const adminChannel = interaction.client.channels.cache.get(adminChannelId);

    if (adminChannel) {
      const adminEmbed = new EmbedBuilder()
        .setTitle('🆕 Novo Farm Registrado')
        .setColor(0x00ff00)
        .setDescription(`Um novo farm foi registrado no sistema.`)
        .addFields(
          { name: '👤 Nome', value: name, inline: true },
          { name: '🆔 ID', value: userId, inline: true },
          { name: '📦 Caixas', value: boxQuantity.toString(), inline: true },
          { name: '👥 Discord', value: `<@${interaction.user.id}>`, inline: true },
          { name: '🕐 Data/Hora', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
        )
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({ 
          text: `Farm ID: ${farm.id} | Sistema de Farms`,
          iconURL: interaction.client.user?.displayAvatarURL()
        })
        .setTimestamp();

      await adminChannel.send({ embeds: [adminEmbed] });
    }

  } catch (error) {
    console.error('Error handling farm modal submit:', error);
    await interaction.reply({
      content: '❌ Erro ao processar o registro. Tente novamente.',
      ephemeral: true
    });
  }
}
