import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { storage } from '../storage.js';
import { createSuccessEmbed } from '../utils/embeds.js';
import { validateWelcomeData } from '../utils/validation.js';
import type { BotCommand } from '../bot.js';

export const welcomeCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Envia a mensagem de boas-vindas no canal especificado'),

  async execute(interaction: any) {
    try {
      // Send welcome message to the specified channel
      const welcomeChannelId = '1373308437684813865';
      const welcomeChannel = interaction.client.channels.cache.get(welcomeChannelId);

      if (!welcomeChannel) {
        await interaction.reply({
          content: '❌ Canal de boas-vindas não encontrado.',
          ephemeral: true
        });
        return;
      }

      const embed = createWelcomeEmbed();
      
      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('register_member')
            .setLabel('👤 REGISTRAR')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('👤')
        );

      await welcomeChannel.send({
        embeds: [embed],
        components: [row]
      });

      await interaction.reply({
        content: '✅ Mensagem de boas-vindas enviada com sucesso!',
        ephemeral: true
      });

    } catch (error) {
      console.error('Error in welcome command:', error);
      await interaction.reply({
        content: '❌ Erro ao enviar mensagem de boas-vindas. Tente novamente.',
        ephemeral: true
      });
    }
  }
};

export function createWelcomeEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('👋 SEJA BEM-VINDO À FAMÍLIA!')
    .setDescription('**PREENCHA O FORMULÁRIO COM SEU NOME - ID E O CARGO QUE OCUPA**\n\nClique no botão abaixo para se registrar na nossa família!')
    .setColor(0x00ff00)
    .addFields(
      { 
        name: '📋 Informações necessárias:', 
        value: '• Nome completo\n• ID do usuário\n• Cargo que ocupa', 
        inline: false 
      },
      { 
        name: '🎯 Importante:', 
        value: '• Preencha todas as informações corretamente\n• Seu registro será analisado pela administração\n• Aguarde a confirmação do seu cadastro', 
        inline: false 
      }
    )
    .setThumbnail('https://cdn.discordapp.com/emojis/1234567890123456789.png')
    .setFooter({ 
      text: 'Sistema de Registro | Bem-vindos',
      iconURL: 'https://cdn.discordapp.com/emojis/1234567890123456789.png'
    })
    .setTimestamp();
}

export async function handleMemberRegistration(interaction: any) {
  try {
    const modal = new ModalBuilder()
      .setCustomId('member_modal')
      .setTitle('👤 Registro de Membro');

    const nameInput = new TextInputBuilder()
      .setCustomId('member_name')
      .setLabel('Nome completo')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Digite seu nome completo')
      .setRequired(true)
      .setMaxLength(100);

    const idInput = new TextInputBuilder()
      .setCustomId('member_id')
      .setLabel('ID do usuário')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Digite seu ID')
      .setRequired(true)
      .setMaxLength(50);

    const roleInput = new TextInputBuilder()
      .setCustomId('member_role')
      .setLabel('Cargo que ocupa')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Digite o cargo que você ocupa')
      .setRequired(true)
      .setMaxLength(100);

    const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
    const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(idInput);
    const thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(roleInput);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

    await interaction.showModal(modal);

  } catch (error) {
    console.error('Error showing member modal:', error);
    await interaction.reply({
      content: '❌ Erro ao abrir o formulário. Tente novamente.',
      ephemeral: true
    });
  }
}

export async function handleMemberModalSubmit(interaction: any) {
  try {
    const name = interaction.fields.getTextInputValue('member_name');
    const userId = interaction.fields.getTextInputValue('member_id');
    const role = interaction.fields.getTextInputValue('member_role');

    // Validate the data
    const validation = validateWelcomeData(name, userId, role);
    if (!validation.success) {
      await interaction.reply({
        content: `❌ ${validation.error}`,
        ephemeral: true
      });
      return;
    }

    // Save to storage (we'll add this to the schema)
    const memberData = {
      userId,
      userName: name,
      userDiscordId: interaction.user.id,
      role
    };

    // Send success message to user
    const successEmbed = createSuccessEmbed(
      'Registro enviado com sucesso! ✅',
      `**Nome:** ${name}\n**ID:** ${userId}\n**Cargo:** ${role}\n**Registrado em:** <t:${Math.floor(Date.now() / 1000)}:F>\n\n*Aguarde a análise da administração.*`
    );

    await interaction.reply({
      embeds: [successEmbed],
      ephemeral: true
    });

    // Send notification to admin channel (using the same admin channel as farms)
    const adminChannelId = process.env.WELCOME_ADMIN_CHANNEL_ID || '1374559903414227155';
    const adminChannel = interaction.client.channels.cache.get(adminChannelId);

    if (adminChannel) {
      const adminEmbed = new EmbedBuilder()
        .setTitle('👤 Novo Membro Registrado')
        .setColor(0x00ff00)
        .setDescription(`Um novo membro se registrou na família.`)
        .addFields(
          { name: '👤 Nome', value: name, inline: true },
          { name: '🆔 ID', value: userId, inline: true },
          { name: '👔 Cargo', value: role, inline: true },
          { name: '👥 Discord', value: `<@${interaction.user.id}>`, inline: true },
          { name: '🕐 Data/Hora', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
        )
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({ 
          text: `Sistema de Registro | Novos Membros`,
          iconURL: interaction.client.user?.displayAvatarURL()
        })
        .setTimestamp();

      await adminChannel.send({ embeds: [adminEmbed] });
    }

  } catch (error) {
    console.error('Error handling member modal submit:', error);
    await interaction.reply({
      content: '❌ Erro ao processar o registro. Tente novamente.',
      ephemeral: true
    });
  }
}