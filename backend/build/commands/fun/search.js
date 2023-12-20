'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const discord_js_1 = require('discord.js');
const axios_1 = __importDefault(require('axios'));
const cheerio_1 = __importDefault(require('cheerio'));
const selectRandom = () => {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
  ];
  const randomNumber = Math.floor(Math.random() * userAgents.length);
  return userAgents[randomNumber];
};
const data = new discord_js_1.SlashCommandBuilder()
  .setName('search')
  .setDescription('Searches the web')
  .addStringOption((option) =>
    option
      .setName('query')
      .setDescription('The search query')
      .setRequired(true),
  );
const execute = async (interaction) => {
  const query = interaction.options.get('query', true).value;
  const user_agent = selectRandom();
  const response = await axios_1.default.get('https://www.google.com/search', {
    params: {
      q: query,
    },
    headers: {
      'User-Agent': user_agent,
    },
  });
  const $ = cheerio_1.default.load(response.data);
  const titles = [];
  const links = [];
  const snippets = [];
  const displayedLinks = [];
  $('.g .yuRUbf h3').each((i, el) => {
    titles[i] = $(el).text();
  });
  $('.yuRUbf a').each((i, el) => {
    links[i] = $(el).attr('href') ?? '';
  });
  $('.g .VwiC3b ').each((i, el) => {
    snippets[i] = $(el).text();
  });
  $('.g .yuRUbf .NJjxre .tjvcx').each((i, el) => {
    displayedLinks[i] = $(el).text();
  });
  const organicResults = [];
  for (let i = 0; i < titles.length; i++) {
    organicResults[i] = {
      title: titles[i],
      links: links[i],
      snippet: snippets[i],
      displayedLink: displayedLinks[i],
    };
  }
  const embed = {
    color: 0x0099ff,
    title: 'Search Results',
    fields: [],
  };
  organicResults.forEach((result) => {
    if (result.links) {
      embed.fields.push({ name: result.title, value: result.links });
    }
  });
  await interaction.reply({ embeds: [embed] });
};
const command = {
  data,
  execute,
};
exports.default = command;
