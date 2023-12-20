import { Message, SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import dotenv from 'dotenv';

const data = new SlashCommandBuilder()
  .setName('llm')
  .setDescription('Interacts with the LLM')
  .addStringOption((option) =>
    option
      .setName('message')
      .setDescription('The message to send to the LLM')
      .setRequired(true),
  );

let conversationStates: Record<string, any> = {};

const execute = async (interaction: CommandInteraction) => {
  if (interaction && interaction.options) {
    const userMessage = interaction.options.get('message')?.value;
    const context = interaction.options.get('context')?.value;
    const TOKEN = 30000;

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

        const systemProps = `
          System: 
          ---
          Answer the question based on the context below. If the
          question cannot be answered using the information provided answer
          with "I don't know".
          ---
        `;

        let propms = `
        ${systemProps}

        ---
        Context: 
        ${
          conversationState.messageHistory
            ? conversationState.messageHistory
            : 'No conversation history'
        }
        ---
      
        ---
        Question: ${userMessage}
        ---
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
              propms: systemProps,
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
          llmResponse = `${data.choices[0].message.content}`;
          // rest of your code
        } else {
          console.log('No choices returned from API');
        }

        const messageChunks = splitMessage(llmResponse, 1800);

        const user = await interaction.client.users.fetch(interaction.user.id);

        try {
          await interaction.editReply(`Q: <@${user.id}> ${userMessageString}`);
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

function splitMessage(str: string, size: number) {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, c = 0; i < numChunks; ++i, c += size) {
    chunks[i] = str.substr(c, size);
  }

  return chunks;
}

// Define a function to manage conversation state
async function manageConversationState(
  interaction: CommandInteraction,
  userMessage: string,
) {
  if (interaction.channel) {
    const messageManager = interaction.channel.messages;
    const messageHistory = await messageManager.fetch({ limit: 10 });

    let totalTokens = 0;
    let messageHistoryText = '';

    messageHistory.forEach((message: Message) => {
      const tokens = message.content.split(' ').length;
      if (
        totalTokens + tokens <= 32768 &&
        message.content.trim() !== '' &&
        !message.content.includes('Processing your request...')
      ) {
        // Check if the message already starts with 'A: ' or 'Q: '
        if (
          !message.content.startsWith('A: ') &&
          !message.content.startsWith('Q: ')
        ) {
          messageHistoryText += `${message.author.bot ? 'A: ' : 'Q: '}${
            message.content
          }\n`;
        } else {
          messageHistoryText += `${message.content}\n`;
        }
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
          .split('\n')
          .map((message) => {
            if (message.startsWith('Q:')) {
              return message;
            } else {
              return `A: ${message}`;
            }
          })
          .join('\n');
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

export default command;
