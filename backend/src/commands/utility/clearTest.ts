import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction, TextChannel, ChannelType } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('cleartest')
  .setDescription('Clears all messages in the test channel');

const execute = async (interaction: CommandInteraction) => {
  if (!interaction.guild) return;
  const testChannel = interaction.guild.channels.cache.find(channel => channel.name === 'test' && channel.type === ChannelType.GuildText) as TextChannel;
  if (!testChannel) return;
  const messages = await testChannel.messages.fetch();
  testChannel.bulkDelete(messages);
  await interaction.reply('Cleared all messages in the test channel!');
};

const command = {
  data,
  execute
};

export default command;