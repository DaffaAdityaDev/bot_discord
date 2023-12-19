import {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import axios from 'axios';

const data = new SlashCommandBuilder()
  .setName('weather')
  .setDescription('Get the current weather for a specific city')
  .addStringOption((option) =>
    option.setName('city').setDescription('Name of the city').setRequired(true),
  );

const execute = async (interaction: CommandInteraction) => {
  const city = interaction.options.get('city', true).value as string;
  try {
    const response = await axios.get(
      `https://goweather.herokuapp.com/weather/${city}`,
    );
    const weather = response.data;

    const embed = new EmbedBuilder()
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
    const embed = new EmbedBuilder()
      .setColor('#ff0000') // Red color for errors
      .setTitle('An error occurred')
      .setDescription(`Details: ${(error as Error).message}`)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
};
const command = {
  data,
  execute,
};

export default command;
