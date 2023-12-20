'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const discord_js_1 = require('discord.js');
const axios_1 = __importDefault(require('axios'));
const data = new discord_js_1.SlashCommandBuilder()
  .setName('weather')
  .setDescription('Get the current weather for a specific city')
  .addStringOption((option) =>
    option.setName('city').setDescription('Name of the city').setRequired(true),
  );
const execute = async (interaction) => {
  const city = interaction.options.get('city', true).value;
  try {
    const response = await axios_1.default.get(
      `https://goweather.herokuapp.com/weather/${city}`,
    );
    const weather = response.data;
    const embed = new discord_js_1.EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`:cityscape: Weather in ${city}`)
      .setDescription(
        `:thermometer: Temperature: ${weather.temperature}\n:cloud: Description: ${weather.description}`,
      )
      .setTimestamp()
      .setFooter({
        text: 'Weather Info',
        iconURL: 'https://i.imgur.com/wSTFkRM.png',
      });
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    const embed = new discord_js_1.EmbedBuilder()
      .setColor('#ff0000') // Red color for errors
      .setTitle('An error occurred')
      .setDescription(`Details: ${error.message}`)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
};
const command = {
  data,
  execute,
};
exports.default = command;
