import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import puppeteer from 'puppeteer';
import path from 'path';
import animeGenerator from '../../implementation/imageGeneration/animeImageGeneration';

const data = new SlashCommandBuilder()
  .setName('generateimage')
  .setDescription('generateImage')
  .addStringOption((option) =>
    option
      .setName('query')
      .setDescription('The search query')
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName('model')
      .setDescription('The model')
      .addChoices(
        { name: 'Counterfeit-V3', value: 'Counterfeit-V3' },
        {
          name: 'Anime Lineart / Manga-like (线稿/線画/マンガ風/漫画风) Style (Recomended)',
          value: 'Anime Lineart / Manga-like (线稿/線画/マンガ風/漫画风) Style',
        },
        {
          name: 'Pastel-Mix [Stylized Anime Model] (Recomended)',
          value: 'Pastel-Mix [Stylized Anime Model]',
        },
        {
          name: 'Yae Miko | Realistic Genshin LORA',
          value: 'Yae Miko | Realistic Genshin LORA',
        },
        { name: 'A-Mecha Musume A素体机娘', value: 'A-Mecha Musume A素体机娘' },
        { name: 'Nyan Mix', value: 'Nyan Mix' },
        {
          name: 'Makima (Chainsaw Man) LoRA',
          value: 'Makima (Chainsaw Man) LoRA',
        },
        {
          name: 'Lucy (Cyberpunk Edgerunners) LoRA',
          value: 'Lucy (Cyberpunk Edgerunners) LoRA',
        },
        {
          name: 'MeinaMix',
          value: 'MeinaMix',
        },
        {
          name: 'GhostMix',
          value: 'GhostMix',
        },
        {
          name: 'Cetus-Mix',
          value: 'Cetus-Mix',
        },
        {
          name: 'ToonYou',
          value: 'ToonYou',
        },
        {
          name: 'Gacha splash LORA',
          value: 'Gacha splash LORA',
        },
        {
          name: 'MIX-Pro-V4 (Recomended)',
          value: 'MIX-Pro-V4',
        },
        {
          name: 'MeinaPastel (Recomended)',
          value: 'MeinaPastel',
        },
        {
          name: 'Anime Tarot Card Art Style LoRA (塔罗牌/タロットカード)',
          value: 'Anime Tarot Card Art Style LoRA (塔罗牌/タロットカード)',
        },
        {
          name: '【Checkpoint】YesMix',
          value: '【Checkpoint】YesMix',
        },
        {
          name: 'Night Sky YOZORA Style Model (Recomended)',
          value: 'Night Sky YOZORA Style Model',
        },
        {
          name: 'MeinaUnreal',
          value: 'MeinaUnreal',
        },
      )
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName('custom_model')
      .setDescription('Input a custom model')
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName('resolution_x')
      .setDescription('Input a Resolution for X')
      .addChoices(
        { name: '256', value: '256' },
        { name: '512', value: '512' },
        { name: '768', value: '768' },
        { name: '1024', value: '1024' },
        { name: '2048', value: '2048' },
      ),
  )
  .addStringOption((option) =>
    option
      .setName('resolution_y')
      .setDescription('Input a Resolution for Y')
      .addChoices(
        { name: '256', value: '256' },
        { name: '512', value: '512' },
        { name: '768', value: '768' },
        { name: '1024', value: '1024' },
        { name: '2048', value: '2048' },
      ),
  );

const execute = async (interaction: CommandInteraction) => {
  animeGenerator(interaction);
};

const command = {
  data,
  execute,
};

export default command;
