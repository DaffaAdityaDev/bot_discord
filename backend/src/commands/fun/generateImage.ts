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

    // select resolution
    await page.waitForSelector(
      '#__next > div > div > div > div.style_right_wrap__VA7K5 > div.style_right_opt__mNN3y',
    );
    await page.click(
      '#__next > div > div > div > div.style_right_wrap__VA7K5 > div.style_right_opt__mNN3y',
    );

    await page.screenshot({ path: `./src/commands/fun/ss/${filename}2.1.png` });

    await page.waitForSelector(
      '#__next > div > div > div > div.style_right_wrap__VA7K5 > div.style_right_wrap_inner__rPxBK.style_scrollbar__D2GgX > div:nth-child(7) > div:nth-child(1) > div > div.flex-auto > div > div.ant-slider-handle',
    );
    const element = await page.$(
      '#__next > div > div > div > div.style_right_wrap__VA7K5 > div.style_right_wrap_inner__rPxBK.style_scrollbar__D2GgX > div:nth-child(7) > div:nth-child(1) > div > div.flex-auto > div > div.ant-slider-handle',
    );
    if (element) {
      const box = await element.boundingBox();
      if (box) {
        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;
        const endX = startX + 30; // Change this value based on how far you want to drag
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(endX, startY);
        await page.mouse.up();
      }
    }
    
    await page.screenshot({ path: `./src/commands/fun/ss/${filename}2.2.png` });

    await page.waitForSelector('#__next > div > div > div > div.style_right_wrap__VA7K5 > div.style_right_wrap_inner__rPxBK.style_scrollbar__D2GgX > div:nth-child(7) > div:nth-child(2) > div > div.flex-auto > div > div.ant-slider-handle')
    const element2 = await page.$('#__next > div > div > div > div.style_right_wrap__VA7K5 > div.style_right_wrap_inner__rPxBK.style_scrollbar__D2GgX > div:nth-child(7) > div:nth-child(2) > div > div.flex-auto > div > div.ant-slider-handle')
    if (element2) {
      const box = await element2.boundingBox();
      if (box) {
        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;
        const endX = startX + 0; // Change this value based on how far you want to drag
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(endX, startY);
        await page.mouse.up();
      }
    }

    await page.screenshot({ path: `./src/commands/fun/ss/${filename}2.3.png` });

    await page.waitForSelector(
      '#__next > div > div > div > div.style_right_wrap__VA7K5 > div.style_right_opt__mNN3y',
    );
    await page.click(
      '#__next > div > div > div > div.style_right_wrap__VA7K5 > div.style_right_opt__mNN3y',
    );

    // return

    await page.screenshot({ path: `./src/commands/fun/ss/${filename}2.5.png` });

    // Click on the "Generate" button. ---------------------------
    await page.waitForSelector('#demo-btn-generate');
    await page.click('#demo-btn-generate');
    await page.screenshot({ path: `./src/commands/fun/ss/${filename}3.png` });

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    await page.screenshot({ path: `./src/commands/fun/ss/${filename}3.5.png` });

    // Wait for the element to appear in the DOM.
    // await new Promise((resolve) => setTimeout(resolve, 20000));
    await page.waitForSelector('div.ant-spin-text', { visible: true, timeout: 100000 });
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
    // await page.waitForSelector(
    //   '#__next > div > div > div.style_preview_wrap__egOoP > div.style_info_content__50R90 > div.style_img_wrap__1rz_t > img',
    // );
    // await page.click(
    //   '#__next > div > div > div.style_preview_wrap__egOoP > div.style_info_content__50R90 > div.style_img_wrap__1rz_t > img',
    // );

    // Open the link in a new tab
    await page.evaluate(() => {
      const element = document.querySelector(
        '#__next > div > div > div.style_preview_wrap__egOoP > div.style_info_content__50R90 > div.style_img_wrap__1rz_t > img',
      );
      const link = element?.getAttribute('src');
      if (link) {
        window.open(link, '_blank');
      }
    });

    // Wait for the new tab to open
    await page.waitForTimeout(5000);

    // Get all the pages in the browser
    const pages = await browser.pages();

    // The new tab should be the last one in the array
    const newTab = pages[pages.length - 1];

    // Wait for the image to load in the new tab
    await newTab.waitForSelector('img');

    // Get the image element
    const image = await newTab.$('img');

    // Take a screenshot of only the image
    await image?.screenshot({ path: `./src/commands/fun/ss/${filename}7.png` });

    // await page.screenshot({ path: `./src/commands/fun/ss/${filename}7.5.png` });
    // const imagae = await page.$(
    //   '#__next > div > div > div.style_preview_wrap__egOoP > div.style_info_content__50R90 > div.style_img_wrap__1rz_t > img',
    // );

    // await imagae?.screenshot({
    //   path: `./src/commands/fun/ss/${filename}8.png`,
    // });

    await interaction.editReply({
      content: `
      :robot: Ini Gambar Dari Model ${model} :robot: \n
      :cold_face: Ini Gambar Lu: \n 
      ${query} 
      `,
      files: [
        {
          attachment: `./src/commands/fun/ss/${filename}7.png`,
          name: `${filename}.png`,
        },
      ],
    });

    await browser.close();
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
