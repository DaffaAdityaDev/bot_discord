'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const discord_js_1 = require('discord.js');
const data = new discord_js_1.SlashCommandBuilder()
  .setName('cleartest')
  .setDescription('Clears all messages in the test channel');
const execute = async (interaction) => {
  if (!interaction.guild) return;
  const testChannel = interaction.guild.channels.cache.find(
    (channel) =>
      channel.name === 'test' &&
      channel.type === discord_js_1.ChannelType.GuildText,
  );
  if (!testChannel) return;
  const messages = await testChannel.messages.fetch();
  testChannel.bulkDelete(messages);
  await interaction.reply('Cleared all messages in the test channel!');
};
const command = {
  data,
  execute,
};
exports.default = command;
