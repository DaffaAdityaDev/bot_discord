'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const discord_js_1 = require('discord.js');
const data = new discord_js_1.SlashCommandBuilder()
  .setName('visualize')
  .setDescription('Visualizes an algorithm or data structure')
  .addStringOption((option) =>
    option
      .setName('type')
      .setDescription('Type of algorithm or data structure to visualize')
      .setRequired(true)
      .addChoices({ name: 'Bubble Sort', value: 'bubbleSort' }),
  )
  .addStringOption((option) =>
    option.setName('array').setDescription('Array to sort').setRequired(false),
  )
  .addIntegerOption((option) =>
    option
      .setName('length')
      .setDescription('Length of default array')
      .setRequired(false),
  );
const execute = async (interaction) => {
  const numberEmojis = {
    0: '0️',
    1: '1️',
    2: '2️',
    3: '3️',
    4: '4️',
    5: '5️',
    6: '6️',
    7: '7️',
    8: '8️',
    9: '9️',
    10: '🔟',
  };
  const swappedNumberEmojis = {
    0: '0️⃣',
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣',
    10: '🔟',
  };
  const type = interaction.options.get('type', true).value;
  if (type === 'bubbleSort') {
    try {
      await interaction.deferReply();
      const arrayOption = interaction.options.get('array');
      const lengthOption = interaction.options.get('length');
      let arr;
      if (arrayOption && typeof arrayOption.value === 'string') {
        arr = JSON.parse(arrayOption.value);
      } else {
        const length =
          lengthOption && typeof lengthOption.value === 'number'
            ? lengthOption.value
            : 10;
        arr = Array.from({ length }, () => Math.floor(Math.random() * 40)); // Generate random numbers between 0 and 40
      }
      const { steps, swaps } = bubbleSort(arr);
      let stepsString = `Initial array: ${arr
        .map((num) => numberEmojis[num])
        .join(' ➡️ ')}\n`;
      steps.forEach((step, index) => {
        let stepString = step
          .map((num, i) => {
            if (
              swaps[index] &&
              (num === swaps[index][0] || num === swaps[index][1])
            ) {
              return swappedNumberEmojis[num]; // Highlight the swapped numbers
            }
            return numberEmojis[num];
          })
          .join(' ➡️ ');
        stepsString += `Step ${index + 1}: ${stepString}\n`;
      });
      const embed = new discord_js_1.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Bubble Sort Visualization')
        .setDescription(stepsString);
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      if (
        error instanceof discord_js_1.DiscordjsError &&
        error.code ===
          discord_js_1.Constants.APIErrors.InteractionAlreadyReplied
      ) {
        console.error('Already replied to this interaction.');
      } else {
        throw error;
      }
    }
  }
};
const command = {
  data,
  execute,
};
function bubbleSort(arr) {
  const steps = [arr.slice()];
  const swaps = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swaps.push([arr[j], arr[j + 1]]);
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push(arr.slice());
      }
    }
  }
  return { steps, swaps };
}
exports.default = command;
