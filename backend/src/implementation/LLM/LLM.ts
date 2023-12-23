import { CommandInteraction } from 'discord.js';
import dotenv from 'dotenv';
import { EmbedBuilder } from 'discord.js';

async function LLM(
  interaction: CommandInteraction,
  conversationStates: Record<string, any>,
  TOKEN: number,
) {
  if (interaction && interaction.options) {
    const userMessage = interaction.options.get('message')?.value;

    if (userMessage) {
      if (interaction.channel) {
        await interaction.reply({
          content: 'Processing your request...',
          ephemeral: false,
        });

        const userMessageString = userMessage.toString();

        const conversationState = await manageConversationState(
          interaction,
          userMessageString,
          conversationStates,
          TOKEN,
        );

        const systemProps = `
              System: 
              ---
              You are a Honest chatbot assistant that responds Anything User ask. Use History and Context to inform your answers. Before Answer Think it through Step By Step.
              Example:
              The odd numbers in this group add up to an even number: 4, 8, 9, 15, 12, 2, 1.
              A: Adding all the odd numbers (9, 15, 1) gives 25. The answer is False.
              The odd numbers in this group add up to an even number: 17,  10, 19, 4, 8, 12, 24.
              A: Adding all the odd numbers (17, 19) gives 36. The answer is True.
              The odd numbers in this group add up to an even number: 16,  11, 14, 4, 8, 13, 24.
              A: Adding all the odd numbers (11, 13) gives 24. The answer is True.
              The odd numbers in this group add up to an even number: 17,  9, 10, 12, 13, 4, 2.
              A: Adding all the odd numbers (17, 9, 13) gives 39. The answer is False.
              The odd numbers in this group add up to an even number: 15, 32, 5, 13, 82, 7, 1. 
              A:
              Example 2:
              Q: There are 15 trees in the grove. Grove workers will plant trees in the grove today. After they are done,
              there will be 21 trees. How many trees did the grove workers plant today?
              A: We start with 15 trees. Later we have 21 trees. The difference must be the number of trees they planted.
              So, they must have planted 21 - 15 = 6 trees. The answer is 6.
              Q: If there are 3 cars in the parking lot and 2 more cars arrive, how many cars are in the parking lot?
              A: There are 3 cars in the parking lot already. 2 more arrive. Now there are 3 + 2 = 5 cars. The answer is 5.
              Q: Leah had 32 chocolates and her sister had 42. If they ate 35, how many pieces do they have left in total?
              A: Leah had 32 chocolates and Leah’s sister had 42. That means there were originally 32 + 42 = 74
              chocolates. 35 have been eaten. So in total they still have 74 - 35 = 39 chocolates. The answer is 39.
              Q: Jason had 20 lollipops. He gave Denny some lollipops. Now Jason has 12 lollipops. How many lollipops
              did Jason give to Denny?
              A: Jason had 20 lollipops. Since he only has 12 now, he must have given the rest to Denny. The number of
              lollipops he has given to Denny must have been 20 - 12 = 8 lollipops. The answer is 8.
              Q: Shawn has five toys. For Christmas, he got two toys each from his mom and dad. How many toys does
              he have now?
              A: He has 5 toys. He got 2 from mom, so after that he has 5 + 2 = 7 toys. Then he got 2 more from dad, so
              in total he has 7 + 2 = 9 toys. The answer is 9.
              Q: There were nine computers in the server room. Five more computers were installed each day, from
              monday to thursday. How many computers are now in the server room?
              A: There are 4 days from monday to thursday. 5 computers were added each day. That means in total 4 * 5 =
              20 computers were added. There were 9 computers in the beginning, so now there are 9 + 20 = 29 computers.
              The answer is 29.
              Q: Michael had 58 golf balls. On tuesday, he lost 23 golf balls. On wednesday, he lost 2 more. How many
              golf balls did he have at the end of wednesday?
              A: Michael initially had 58 balls. He lost 23 on Tuesday, so after that he has 58 - 23 = 35 balls. On
              Wednesday he lost 2 more so now he has 35 - 2 = 33 balls. The answer is 33.
              Q: Olivia has $23. She bought five bagels for $3 each. How much money does she have left?
              A: She bought 5 bagels for $3 each. This means she spent $15. She has $8 left.
              Q: When I was 6 my sister was half my age. Now I’m 70 how old is my sister?
              ---
            `;

        let propms = `
            ${systemProps}
    
            ---
            Context: 
            ${
              conversationState && conversationState.length > 0
                ? conversationState
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
              transforms: ['middle-out'],
              propms: systemProps,
              messages: [
                {
                  role: 'user',
                  content: propms,
                },
              ],
              frequency_penalty: 0.5,
              n: 1,
              max_tokens: TOKEN,
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

        conversationStates[interaction.user.id].push({
          Bot: llmResponse,
        });

        const user = await interaction.client.users.fetch(interaction.user.id);

        try {
          // Prepend 'User' to the user's message
          let embed = new EmbedBuilder()
            .setTitle(data.model)
            .setDescription(userMessageString)
            .setColor('#0099ff');
          await interaction.channel.send({ embeds: [embed] });
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
}

function splitMessage(str: string, size: number) {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, c = 0; i < numChunks; ++i, c += size) {
    chunks[i] = str.substr(c, size);
  }

  return chunks;
}

async function manageConversationState(
  interaction: CommandInteraction,
  userMessage: string,
  conversationStates: Record<string, any>,
  TOKEN: number,
) {
  if (interaction.channel) {
    const messageManager = interaction.channel.messages;

    // Get the user's ID
    const userId = interaction.user.id;

    // If this user's conversation state doesn't exist, create it
    if (!conversationStates[userId]) {
      conversationStates[userId] = [];
    }

    const userIdString = userId.toString();
    // Add the user's message to the conversation state
    conversationStates[userId].push({
      [userIdString]: userMessage,
    });

    while (conversationStates[userId].length > TOKEN) {
      conversationStates[userId].shift();
    }

    console.log('conversationStates:', conversationStates[userId]);
    const result = JSON.stringify(conversationStates[userId]);
    // Return the conversation history for this user
    return result;
  }
}

export default LLM;
