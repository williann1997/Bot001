import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { storage } from '../storage.js';
import { createSalesEmbed, createSuccessEmbed } from '../utils/embeds.js';
import { validateSalesData } from '../utils/validation.js';
import type { BotCommand } from '../bot.js';

export const salesCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('vendas')
    .setDescription('Exibe o painel de registro de vendas'),

  async execute(interaction: any) {
    try {
      const embed = createSalesEmbed();
      
      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('register_sale')
            .setLabel('💰 REGISTRAR VENDA')
            .setStyle(ButtonStyle.Success)
            .setEmoji('💰')
        );

      await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: false
      });

    } catch (error) {
      console.error('Error in sales command:', error);
      await interaction.reply({
        content: '❌ Erro ao exibir o painel de vendas. Tente novamente.',
        ephemeral: true
      });
    }
  }
};

export async function handleSaleRegistration(interaction: any) {
  try {
    const modal = new ModalBuilder()
      .setCustomId('sale_modal')
      .setTitle('💰 Registro de Venda');

    const nameInput = new TextInputBuilder()
      .setCustomId('sale_name')
      .setLabel('Nome completo')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Digite seu nome completo')
      .setRequired(true)
      .setMaxLength(100);

    const idInput = new TextInputBuilder()
      .setCustomId('sale_id')
      .setLabel('ID do usuário')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Digite seu ID')
      .setRequired(true)
      .setMaxLength(50);

    const descriptionInput = new TextInputBuilder()
      .setCustomId('sale_description')
      .setLabel('Descrição da venda')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Descreva os itens vendidos')
      .setRequired(true)
      .setMaxLength(500);

    const statusInput = new TextInputBuilder()
      .setCustomId('sale_status')
      .setLabel('Status de entrega')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Ex: Entregue, Pendente, Em andamento')
      .setRequired(true)
      .setMaxLength(50);

    const valueInput = new TextInputBuilder()
      .setCustomId('sale_value')
      .setLabel('Valor total')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Ex: R$ 150,00')
      .setRequired(true)
      .setMaxLength(20);

    const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
    const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(idInput);
    const thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);
    const fourthActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(statusInput);
    const fifthActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(valueInput);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

    await interaction.showModal(modal);

  } catch (error) {
    console.error('Error showing sale modal:', error);
    await interaction.reply({
      content: '❌ Erro ao abrir o formulário. Tente novamente.',
      ephemeral: true
    });
  }
}

export async function handleSaleModalSubmit(interaction: any) {
  try {
    const name = interaction.fields.getTextInputValue('sale_name');
    const userId = interaction.fields.getTextInputValue('sale_id');
    const description = interaction.fields.getTextInputValue('sale_description');
    const deliveryStatus = interaction.fields.getTextInputValue('sale_status');
    const totalValue = interaction.fields.getTextInputValue('sale_value');

    // Validate the data
    const validation = validateSalesData(name, userId, description, deliveryStatus, totalValue);
    if (!validation.success) {
      await interaction.reply({
        content: `❌ ${validation.error}`,
        ephemeral: true
      });
      return;
    }

    // Save to storage
    const saleData = {
      userId,
      userName: name,
      userDiscordId: interaction.user.id,
      description,
      deliveryStatus,
      totalValue
    };

    const sale = await storage.createSale(saleData);

    // Send success message to user
    const successEmbed = createSuccessEmbed(
      'Venda registrada com sucesso! ✅',
      `**Nome:** ${name}\n**ID:** ${userId}\n**Valor:** ${totalValue}\n**Status:** ${deliveryStatus}\n**Registrado em:** <t:${Math.floor(Date.now() / 1000)}:F>`
    );

    await interaction.reply({
      embeds: [successEmbed],
      ephemeral: true
    });

    // Send notification to admin channel
    const adminChannelId = process.env.SALES_ADMIN_CHANNEL_ID || '1374613709770723440';
    const adminChannel = interaction.client.channels.cache.get(adminChannelId);

    if (adminChannel) {
      const statusColor = deliveryStatus.toLowerCase().includes('entregue') ? 0x00ff00 : 
                         deliveryStatus.toLowerCase().includes('pendente') ? 0xffff00 : 0xff9900;

      const adminEmbed = new EmbedBuilder()
        .setTitle('💰 Nova Venda Registrada')
        .setColor(statusColor)
        .setDescription(`Uma nova venda foi registrada no sistema.`)
        .addFields(
          { name: '👤 Nome', value: name, inline: true },
          { name: '🆔 ID', value: userId, inline: true },
          { name: '💵 Valor', value: totalValue, inline: true },
          { name: '📦 Status', value: deliveryStatus, inline: true },
          { name: '👥 Discord', value: `<@${interaction.user.id}>`, inline: true },
          { name: '📝 Descrição', value: description.length > 100 ? description.substring(0, 100) + '...' : description, inline: false },
          { name: '🕐 Data/Hora', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
        )
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({ 
          text: `Venda ID: ${sale.id} | Sistema de Vendas`,
          iconURL: interaction.client.user?.displayAvatarURL()
        })
        .setTimestamp();

      await adminChannel.send({ embeds: [adminEmbed] });
    }

  } catch (error) {
    console.error('Error handling sale modal submit:', error);
    await interaction.reply({
      content: '❌ Erro ao processar o registro. Tente novamente.',
      ephemeral: true
    });
  }
}
