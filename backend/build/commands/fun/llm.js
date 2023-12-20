'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const discord_js_1 = require('discord.js');
const data = new discord_js_1.SlashCommandBuilder()
  .setName('llm')
  .setDescription('Interacts with the LLM')
  .addStringOption((option) =>
    option
      .setName('message')
      .setDescription('The message to send to the LLM')
      .setRequired(true),
  );
let conversationStates = {};
const execute = async (interaction) => {
  if (interaction && interaction.options) {
    const userMessage = interaction.options.get('message')?.value;
    const context = interaction.options.get('context')?.value;
    const TOKEN = 32768;
    if (userMessage) {
      if (interaction.channel) {
        const initialResponse = await interaction.reply({
          content: 'Processing your request...',
          ephemeral: false,
        });
        const userMessageString = userMessage.toString();
        const conversationState = await manageConversationState(
          interaction,
          userMessageString,
        );
        let propms = `
        System: 
        I want you to become a full-on software development machine.
        You write world class software that works on the spot.
        You will create clean, fast, efficient, and secure code.
        You will always have debug mode enabled.
        You will review the code internally and refactor it to make it more DRY and adopt the SOLID programming principles.
        You only care about performance, efficiency and security.
        You will always check for proper declared variables and arrays.
        You will not write sample code.
        You will write functional code.
        You will only do it in the way I ask you to.
        You will not write yes or no, thanks or you're welcome.
        Just how I structured it.
        
        Correct mistakes: If a mistake is identified in a previous response, do self-reflection and acknowledge it, and correct the information promptly.
        Use relevant examples for clarification. Provide deep yet concise explanations. Provide novel perspectives and out-of-the-box thinking. Explain thought process: Share the reasoning and process behind each step and the overall solution.
        Provide multiple perspectives: Offer different viewpoints or solutions to a query when possible, simulating a group discussion. think about the problem step by step.
        it would be best if you made self-reflection to make sure the answer is correct.
        you should always preferred official documents
        What information do I already know about this topic? What information must I recall in my working memory to best answer this?
        What techniques or methods do I know that I can use to answer this question or solve this problem? How can I integrate what I already know, and recall more valuable facts, approaches, and techniques?
        And finally, with all this in mind, I will now discuss the question or problem and render my final answer.
        ---
        History: 
        ${
          conversationState.messageHistory
            ? conversationState.messageHistory
            : 'No conversation history'
        }
        ---
        Context: ${context ? context : 'No context'} 
        ---
        User: ${userMessage}
        `;
        console.log('propms:', propms);
        // Calculate the token count of the prompt
        let promptTokens = propms.split(' ').length;
        // Check if the token count exceeds the maximum token limit
        if (promptTokens > TOKEN) {
          // If the token count exceeds the maximum token limit, then truncate the prompt
          propms = propms.split(' ').slice(0, TOKEN).join(' ');
        }
        const response = await fetch(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: ['gryphe/mythomist-7b', 'mistralai/mixtral-8x7b-instruct'],
              route: 'fallback',
              // transforms: ['middle-out'],
              messages: [
                {
                  role: 'user',
                  content: propms,
                },
              ],
              max_tokens: TOKEN,
              top_p: 0.8,
              //   prompt: {
              //     text: 'You are a helpful assistant.',
              //   },
            }),
          },
        );
        const data = await response.json();
        console.log('data:', data);
        let llmResponse = '';
        if (data && data.choices && data.choices[0]) {
          // Do not prepend 'Bot' to the LLM response
          llmResponse = `A: ${data.choices[0].message.content}`;
          // rest of your code
        } else {
          console.log('No choices returned from API');
        }
        const messageChunks = splitMessage(llmResponse, 1800);
        const user = await interaction.client.users.fetch(interaction.user.id);
        try {
          await interaction.editReply(`👤 <@${user.id}> : ${userMessage}`);
        } catch (error) {
          if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 10008
          ) {
            console.log(
              'The message to be edited does not exist or has been deleted.',
            );
          } else {
            console.log('An unknown error occurred:', error);
          }
        }
        for (const chunk of messageChunks) {
          if (chunk) {
            // Prepend 'User' to the user's message
            await interaction.channel.send(chunk);
          }
        }
      } else {
        await interaction.reply({
          content: 'No channel provided',
          ephemeral: true,
        });
      }
    } else {
      await interaction.reply({
        content: 'No message provided',
        ephemeral: true,
      });
    }
  } else {
    await interaction.reply({
      content: 'No interaction provided',
      ephemeral: true,
    });
  }
};
function splitMessage(str, size) {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);
  for (let i = 0, c = 0; i < numChunks; ++i, c += size) {
    chunks[i] = str.substr(c, size);
  }
  return chunks;
}
// Define a function to manage conversation state
async function manageConversationState(interaction, userMessage) {
  if (interaction.channel) {
    const messageManager = interaction.channel.messages;
    const messageHistory = await messageManager.fetch({ limit: 5 });
    let totalTokens = 0;
    let messageHistoryText = '';
    messageHistory.forEach((message) => {
      const tokens = message.content.split(' ').length;
      if (
        totalTokens + tokens <= 32768 &&
        message.content.trim() !== '' &&
        !message.content.includes('Processing your request...')
      ) {
        messageHistoryText += `${message.author.bot ? 'A: ' : 'Q: '}${
          message.content
        }\n`;
        totalTokens += tokens;
      }
    });
    let conversationState = conversationStates[interaction.user.id];
    if (!conversationState) {
      conversationState = {
        messageHistory: '',
      };
      conversationStates[interaction.user.id] = conversationState;
    }
    // Add the user's message to the conversation history
    conversationState.messageHistory += `Q: ${userMessage}\n`;
    // Summarize the conversation history
    // Limit the size of the conversation history
    const messageHistoryLimit = 10;
    const messageHistoryArray = conversationState.messageHistory.split('\n');
    if (messageHistoryArray.length > messageHistoryLimit) {
      messageHistoryArray.splice(
        0,
        messageHistoryArray.length - messageHistoryLimit,
      );
    }
    conversationState.messageHistory = messageHistoryArray.join('\n');
    if (conversationState.messageHistory) {
      if (messageHistoryText.trim() !== '') {
        // Change the formatting to QnA
        conversationState.messageHistory = messageHistoryText
          .replace('User: ', 'Q: ')
          .replace('Bot: ', 'A: ');
      }
      conversationState.messageHistory += `Q: ${userMessage}\n`;
    } else {
      console.log('messageHistory is undefined');
    }
    return conversationStates[interaction.user.id];
  }
}
const command = {
  data,
  execute,
};
exports.default = command;
