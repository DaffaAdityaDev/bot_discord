import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import axios from 'axios';
import cheerio from 'cheerio';

const data = new SlashCommandBuilder()
  .setName('naah')
  .setDescription("Nah I'D Win")
  .addStringOption((option) =>
    option
      .setName('query')
      .setDescription('The search query')
      .setRequired(true),
  );

const execute = async (interaction: CommandInteraction) => {
  const query = interaction.options.get('query', true).value as string;
  const user_agent = selectRandom();
  const imageUrls: string[] = [];
  const imageDetails: {
    title: string;
    source: string;
    link: string;
    original: string;
    thumbnail: string;
  }[] = [];
  const response = await axios
    .get(`https://www.google.com/search?q=raiden+naah+i+win&tbm=isch&ved`, {
      headers: {
        'User-Agent': user_agent,
      },
    })
    .then((response) => {
      const html = response.data;
      // console.log(response);
      // console.log(html);
      const $ = cheerio.load(html);
      const images = $('html body div.T1diZc c-wiz div.mJxzWe ').find('img');
      console.log(images.length);

      images.each((i, el) => {
        const imageUrl = $(el).attr('src');
        console.log(imageUrl);
        //  imageUrls.push(imageUrl);
      });
    });

  // console.log(imageDetails);

  await interaction.reply({
    content: 'Here are some images I found:',
    embeds: imageDetails.map((image) => ({
      title: image.title,
      description: `Source: ${image.source}\n[Original Image](${image.original})\n[Thumbnail](${image.thumbnail})`,
      image: {
        url: image.thumbnail,
      },
    })),
  });
};

const command = {
  data,
  execute,
};

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

export default command;
