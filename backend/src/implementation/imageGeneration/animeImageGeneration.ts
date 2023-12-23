import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import puppeteer, { Page, Browser } from 'puppeteer';
import path from 'path';

const SELECTOR = {
  SELECTOR_MODEL:
    '#__next > div > div > div > div.style_left_wrap__hg5ZP > div.style_inner_wrap__AehDk.style_scrollbar__D2GgX > div:nth-child(3) > input',
  SELECTOR_MODEL_SEARCH:
    '#__next > div > div > div > div.style_left_wrap__hg5ZP > div.style_modal_wrap__u7qf9 > div.style_modal_top_fixed__tJ9QG > div:nth-child(2) > div > div > span > span > input',
  SELECTOR_MODEL_SEARCH_RESULT:
    '#__next > div > div > div > div.style_left_wrap__hg5ZP > div.style_modal_wrap__u7qf9 > div.style_modal_inner__h9flk > div > div:nth-child(1) > img',
  SELECTOR_QUERY:
    '#__next > div > div > div > div.style_left_wrap__hg5ZP > div.style_inner_wrap__AehDk.style_scrollbar__D2GgX > div:nth-child(7) > textarea',
  SELECTOR_RESOLUTION_OPEN:
    '#__next > div > div > div > div.style_right_wrap__VA7K5 > div.style_right_opt__mNN3y',
  SELECTOR_RESOLUTION_X:
    '#__next > div > div > div > div.style_right_wrap__VA7K5 > div.style_right_wrap_inner__rPxBK.style_scrollbar__D2GgX > div:nth-child(7) > div:nth-child(1) > div > div.flex-auto > div > div.ant-slider-handle',
  SELECTOR_RESOLUTION_Y:
    '#__next > div > div > div > div.style_right_wrap__VA7K5 > div.style_right_wrap_inner__rPxBK.style_scrollbar__D2GgX > div:nth-child(7) > div:nth-child(2) > div > div.flex-auto > div > div.ant-slider-handle',
  SELECTOR_RESOLUTION_CLOSE:
    '#__next > div > div > div > div.style_right_wrap__VA7K5 > div.style_right_opt__mNN3y',
  SELECTOR_GENERATE: '#demo-btn-generate',
  SELECTOR_LOADING: 'div.ant-spin-text',
  SELECTOR_IMAGE:
    '#__next > div > div > div > div.style_image_content__XoQP6.style_scrollbar__D2GgX > div > div > div',
  SELECTOR_IMAGE_PREVIEW:
    '#__next > div > div > div.style_preview_wrap__egOoP > div.style_info_content__50R90 > div.style_img_wrap__1rz_t > img',
};

// function to wait for selector and click
async function waitAndClick(
  page: Page,
  selector: string,
  timeout?: number,
  visible?: boolean,
) {
  if (timeout) {
    await page.waitForSelector(selector, { timeout: timeout });
    await page.click(selector);
  } else if (visible) {
    await page.waitForSelector(selector, { visible: visible });
    await page.click(selector);
  } else {
    await page.waitForSelector(selector);
    await page.click(selector);
  }
}

// function to wait for selector and type text
async function WaitAndtypeIntoInput(
  page: Page,
  selector: string,
  text: string,
) {
  await page.waitForSelector(selector);
  await page.click(selector);
  await page.keyboard.type(text);
}

// function to wait for selector and type text
async function deleteTextAndTypeIntoInput(
  page: Page,
  selector: string,
  text: string,
) {
  await page.waitForSelector(selector);
  await page.click(selector);
  // select all text and delete
  await page.keyboard.down('Control');
  await page.keyboard.press('A');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');

  await page.keyboard.type(text);
}

// function to drag slider
async function dragSlider(page: Page, selector: string, distance: number) {
  await page.waitForSelector(selector);
  const element = await page.$(selector);
  if (element) {
    const box = await element.boundingBox();
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;
      const endX = startX + distance; // Change this value based on how far you want to drag
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, startY);
      await page.mouse.up();
    }
  }
}

// function to take screenshot
async function takeScreenshot(page: Page, filename: string, delay?: number) {
  await page.screenshot({ path: `./src/commands/fun/ss/${filename}.png` });
  if (delay) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

// function to open new tab
async function openNewTab(page: Page, selector: string) {
  const [newTab] = await Promise.all([
    new Promise((resolve) => page.once('popup', resolve)),
    page.evaluate((selector) => {
      const element = document.querySelector(selector);
      const link = element?.getAttribute('src');
      if (link) {
        window.open(link, '_blank');
      }
    }, selector),
  ]);

  return newTab as Page;
}

// function to handle new tab
async function handleNewTab(page: Page, filename: string, browser: Browser) {
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
}

// function to generate image
async function animeImageGeneration(interaction: CommandInteraction) {
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
      // input text for model---------------------------
      await waitAndClick(page, SELECTOR.SELECTOR_MODEL);
      await takeScreenshot(page, `${filename}1`);
      await WaitAndtypeIntoInput(page, SELECTOR.SELECTOR_MODEL_SEARCH, model);
      await takeScreenshot(page, `${filename}1.1`, 300);
      await waitAndClick(page, SELECTOR.SELECTOR_MODEL_SEARCH_RESULT);
    }

    await waitAndClick(page, SELECTOR.SELECTOR_QUERY);

    if (query) {
      console.log('query');
      // input text for query---------------------------
      await WaitAndtypeIntoInput(page, SELECTOR.SELECTOR_QUERY, query);
      await takeScreenshot(page, `${filename}2`);
      await deleteTextAndTypeIntoInput(page, SELECTOR.SELECTOR_QUERY, query);
      await takeScreenshot(page, `${filename}2.1`);
    }

    // open resolution
    await waitAndClick(page, SELECTOR.SELECTOR_RESOLUTION_OPEN);
    await takeScreenshot(page, `${filename}2.1`);
    await dragSlider(page, SELECTOR.SELECTOR_RESOLUTION_X, -10);

    await takeScreenshot(page, `${filename}2.2`);

    await waitAndClick(page, SELECTOR.SELECTOR_RESOLUTION_Y);
    await takeScreenshot(page, `${filename}2.3`);
    await dragSlider(page, SELECTOR.SELECTOR_RESOLUTION_Y, -10);
    await takeScreenshot(page, `${filename}2.4`);
    // close resolution
    await waitAndClick(page, SELECTOR.SELECTOR_RESOLUTION_CLOSE);
    await takeScreenshot(page, `${filename}2.6`);

    // click generate button
    await waitAndClick(page, SELECTOR.SELECTOR_GENERATE);
    await takeScreenshot(page, `${filename}3`);

    await takeScreenshot(page, `${filename}3.5`);

    // If the element is found and is visible, wait for it to disappear.
    await waitAndClick(page, SELECTOR.SELECTOR_LOADING, 100000, true);
    await takeScreenshot(page, `${filename}4`);

    // If the element is found and is visible, wait for it to disappear.
    await page.waitForSelector('div.ant-spin-text', { hidden: true });

    await waitAndClick(page, SELECTOR.SELECTOR_IMAGE);
    await takeScreenshot(page, `${filename}5`);

    await page.waitForSelector(
      '#__next > div > div > div.style_preview_wrap__egOoP > div.style_info_content__50R90 > div.style_img_wrap__1rz_t > img',
      { visible: true },
    );

    await page.screenshot({ path: `./src/commands/fun/ss/${filename}6.png` });

    // promise new tab
    await openNewTab(page, SELECTOR.SELECTOR_IMAGE_PREVIEW);

    // resolve new tab
    await handleNewTab(page, filename, browser);

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
}

export default animeImageGeneration;
