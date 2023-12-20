'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const discord_js_1 = require('discord.js');
const data = new discord_js_1.SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');
const execute = async (interaction) => {
  await interaction.reply('Pong!');
};
const command = {
  data,
  execute,
};
exports.default = command;
