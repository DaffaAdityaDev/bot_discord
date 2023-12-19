import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import axios from 'axios';
import cheerio from 'cheerio';

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

const data = new SlashCommandBuilder()
  .setName('search')
  .setDescription('Searches the web')
  .addStringOption((option) =>
    option
      .setName('query')
      .setDescription('The search query')
      .setRequired(true),
  );

const execute = async (interaction: CommandInteraction) => {
  const query = interaction.options.get('query', true).value as string;
  const user_agent = selectRandom();
  const response = await axios.get('https://www.google.com/search', {
    params: {
      q: query,
    },
    headers: {
      'User-Agent': user_agent,
    },
  });

  const $ = cheerio.load(response.data);
  const titles: string[] = [];
  const links: string[] = [];
  const snippets: string[] = [];
  const displayedLinks: string[] = [];

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

  const embed: {
    color: number;
    title: string;
    fields: { name: string; value: string }[];
  } = {
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

export default command;
