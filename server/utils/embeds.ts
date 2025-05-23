import { EmbedBuilder } from 'discord.js';

export function createFarmEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('🌾 Sistema de Registro de Farms')
    .setDescription('**Registre suas atividades de farm de forma organizada!**\n\nClique no botão abaixo para abrir o formulário de registro.')
    .setColor(0x00ff00)
    .addFields(
      { 
        name: '📋 Informações necessárias:', 
        value: '• Nome completo\n• ID do usuário\n• Quantidade de caixas farmadas', 
        inline: false 
      },
      { 
        name: '📊 Benefícios:', 
        value: '• Controle de produtividade\n• Histórico detalhado\n• Relatórios automáticos', 
        inline: false 
      }
    )
    .setThumbnail('https://cdn.discordapp.com/emojis/1234567890123456789.png') // Placeholder for farm icon
    .setFooter({ 
      text: 'Sistema de Gerenciamento | Farms',
      iconURL: 'https://cdn.discordapp.com/emojis/1234567890123456789.png'
    })
    .setTimestamp();
}

export function createSalesEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('💰 Sistema de Registro de Vendas')
    .setDescription('**Registre suas vendas e mantenha o controle financeiro!**\n\nClique no botão abaixo para abrir o formulário de registro.')
    .setColor(0x00ff00)
    .addFields(
      { 
        name: '📋 Informações necessárias:', 
        value: '• Nome completo\n• ID do usuário\n• Descrição da venda\n• Status de entrega\n• Valor total', 
        inline: false 
      },
      { 
        name: '📈 Benefícios:', 
        value: '• Controle de receitas\n• Histórico de vendas\n• Acompanhamento de entregas', 
        inline: false 
      }
    )
    .setThumbnail('https://cdn.discordapp.com/emojis/1234567890123456789.png') // Placeholder for sales icon
    .setFooter({ 
      text: 'Sistema de Gerenciamento | Vendas',
      iconURL: 'https://cdn.discordapp.com/emojis/1234567890123456789.png'
    })
    .setTimestamp();
}

export function createSuccessEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(0x00ff00)
    .setFooter({ text: 'Registro realizado com sucesso!' })
    .setTimestamp();
}

export function createErrorEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(0xff0000)
    .setFooter({ text: 'Erro no sistema' })
    .setTimestamp();
}
