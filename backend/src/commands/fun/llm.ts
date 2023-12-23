import { Message, SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import dotenv from 'dotenv';
import { EmbedBuilder } from 'discord.js';
import LLM from '../../implementation/LLM/LLM';

const data = new SlashCommandBuilder()
  .setName('llm')
  .setDescription('Interacts with the LLM')
  .addStringOption((option) =>
    option
      .setName('message')
      .setDescription('The message to send to the LLM')
      .setRequired(true),
  );

let conversationStates: Record<string, any> = [];
const TOKEN = 32000;

const execute = async (interaction: CommandInteraction) => {
  LLM(interaction, conversationStates, TOKEN);
};

const command = {
  data,
  execute,
};

export default command;
