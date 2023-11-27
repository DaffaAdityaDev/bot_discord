import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

const execute = async (interaction: CommandInteraction) => {
  await interaction.reply('Pong!');
};

const command = {
  data,
  execute
};

export default command;