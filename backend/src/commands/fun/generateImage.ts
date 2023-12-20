import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import puppeteer from 'puppeteer';
import path from 'path';

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
    option.setName('model').setDescription('The model').setRequired(false),
  );

const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const filename = path.basename(__filename, path.extname(__filename));
  await page.goto('https://omniinfer.io/demo', { waitUntil: 'networkidle0' });
  const query = interaction.options.get('query')?.value as string;
  const model = interaction.options.get('model')?.value as string;
  try {
    // wait for the selector to load
    

    if (model) {
        console.log('model');
    await page.waitForSelector(
        '#__next > div > div > div > div.style_left_wrap__hg5ZP > div.style_inner_wrap__AehDk.style_scrollbar__D2GgX > div:nth-child(3) > input',
        );
      // click and select model  ---------------------------
      await page.click(
        '#__next > div > div > div > div.style_left_wrap__hg5ZP > div.style_inner_wrap__AehDk.style_scrollbar__D2GgX > div:nth-child(3) > input',
      );
      await page.screenshot({ path: `./src/commands/fun/ss/${filename}.png` });
      // click and select model ---------------------------
      await page.waitForSelector(
        '#__next > div > div > div > div.style_left_wrap__hg5ZP > div.style_modal_wrap__u7qf9 > div.style_modal_top_fixed__tJ9QG > div:nth-child(2) > div > div > span > span > input',
      );
      await page.click(
        '#__next > div > div > div > div.style_left_wrap__hg5ZP > div.style_modal_wrap__u7qf9 > div.style_modal_top_fixed__tJ9QG > div:nth-child(2) > div > div > span > span > input',
      );
      await page.keyboard.type(model);
      await new Promise((resolve) => setTimeout(resolve, 300));
      await page.screenshot({ path: `./src/commands/fun/ss/${filename}1.png` });
      await page.waitForSelector(
        '#__next > div > div > div > div.style_left_wrap__hg5ZP > div.style_modal_wrap__u7qf9 > div.style_modal_inner__h9flk > div > div:nth-child(1) > img',
      );
      await page.click(
        '#__next > div > div > div > div.style_left_wrap__hg5ZP > div.style_modal_wrap__u7qf9 > div.style_modal_inner__h9flk > div > div:nth-child(1) > img',
      );
    }

    await page.screenshot({ path: `./src/commands/fun/ss/${filename}1.5.png` });

    if (query) {
        console.log('query');
      

      // await page.waitForSelector(
      //   '#__next > div > div > div > div.style_left_wrap__hg5ZP > div.style_modal_wrap__u7qf9 > div.style_modal_inner__h9flk > div > div:nth-child(6) > div',
      // );
      // await page.click(
      //   '#__next > div > div > div > div.style_left_wrap__hg5ZP > div.style_modal_wrap__u7qf9 > div.style_modal_inner__h9flk > div > div:nth-child(6) > div',
      // );

      // input text for image---------------------------
      await page.waitForSelector(
        '#__next > div > div > div > div.style_left_wrap__hg5ZP > div.style_inner_wrap__AehDk.style_scrollbar__D2GgX > div:nth-child(7) > textarea',
      );
      await page.click(
        '#__next > div > div > div > div.style_left_wrap__hg5ZP > div.style_inner_wrap__AehDk.style_scrollbar__D2GgX > div:nth-child(7) > textarea',
      );
      // select all text and delete
      await page.keyboard.down('Control');
      await page.keyboard.press('A');
      await page.keyboard.up('Control');
      await page.keyboard.press('Backspace');

      await page.keyboard.type(query);

      await page.screenshot({ path: `./src/commands/fun/ss/${filename}2.png` });
    }

    await page.screenshot({ path: `./src/commands/fun/ss/${filename}2.5.png` });

    // Click on the "Generate" button. ---------------------------
    await page.waitForSelector('#demo-btn-generate');
    await page.click('#demo-btn-generate');
    await page.screenshot({ path: `./src/commands/fun/ss/${filename}3.png` });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    await page.screenshot({ path: `./src/commands/fun/ss/${filename}3.5.png` });

    // Wait for the element to appear in the DOM.
    await page.waitForSelector('div.ant-spin-text', { visible: true });
    await page.screenshot({ path: `./src/commands/fun/ss/${filename}4.png` });

    // If the element is found and is visible, wait for it to disappear.
    await page.waitForSelector('div.ant-spin-text', { hidden: true });

    await page.screenshot({ path: `./src/commands/fun/ss/${filename}4.5.png` });
    await page.waitForSelector(
      '#__next > div > div > div > div.style_image_content__XoQP6.style_scrollbar__D2GgX > div > div > div',
    );
    await page.screenshot({ path: `./src/commands/fun/ss/${filename}5.png` });

    // Click on the "generated Image" button. ---------------------------
    await page.click(
      '#__next > div > div > div > div.style_image_content__XoQP6.style_scrollbar__D2GgX > div > div > div',
    );

    await page.waitForSelector(
      '#__next > div > div > div.style_preview_wrap__egOoP > div.style_info_content__50R90 > div.style_img_wrap__1rz_t > img',
      { visible: true },
    );

    await page.screenshot({ path: `./src/commands/fun/ss/${filename}6.png` });
    await page.waitForSelector(
      '#__next > div > div > div.style_preview_wrap__egOoP > div.style_info_content__50R90 > div.style_img_wrap__1rz_t > img',
    );
    await page.click(
      '#__next > div > div > div.style_preview_wrap__egOoP > div.style_info_content__50R90 > div.style_img_wrap__1rz_t > img',
    );

    await page.screenshot({ path: `./src/commands/fun/ss/${filename}7.png` });
    const imagae = await page.$(
      '#__next > div > div > div.style_preview_wrap__egOoP > div.style_info_content__50R90 > div.style_img_wrap__1rz_t > img',
    );

    // save image ------------------------------------------
    await imagae?.screenshot({
      path: `./src/commands/fun/ss/${filename}8.png`,
    });

    await interaction.editReply({
      content: `
      :robot: Ini Gambar Dari Model ${model} :robot: \n
      :cold_face: Ini Gambar Lu: \n 
      ${query} 
      `,
      files: [
        {
          attachment: `./src/commands/fun/ss/${filename}8.png`,
          name: `${filename}.png`,
        },
      ],
    });
  } catch (error) {
    console.error('An error occurred:', error);
    await interaction.editReply('Gagal Bro kaya nya kena limit tuh :joy:');
  }

  console.log('done generate Image');

  //  await interaction.reply(`Title of the page is`); // Reply to the user
};

const command = {
  data,
  execute,
};

export default command;
