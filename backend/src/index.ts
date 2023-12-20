import fs from 'fs';
import path from 'path';
import {
  Client,
  ClientOptions,
  Collection,
  GatewayIntentBits,
} from 'discord.js';
import dotenv from 'dotenv';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

dotenv.config();

class BotClient extends Client {
  commands: Collection<string, any>;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
  }
}

const client = new BotClient({ intents: [GatewayIntentBits.Guilds] });

const commands = [];
const commandFolders = fs.readdirSync(path.join(__dirname, '/commands'));

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(path.join(__dirname, '/commands', folder))
    .filter((file) => file.endsWith('.ts'));
  for (const file of commandFiles) {
    const command = require(
      path.join(__dirname, '/commands', folder, file),
    ).default;
    if (command && 'data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${path.join(
          __dirname,
          '/commands',
          folder,
          file,
        )} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN!);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    const data = (await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        process.env.GUILD_ID!,
      ),
      { body: commands },
    )) as unknown[];

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    try {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    } catch (replyError) {
      console.error('Failed to reply to interaction:', replyError);
    }
  }
});

client.once('ready', () => {
  console.log('Ready!');
});

client.login(process.env.BOT_TOKEN);
