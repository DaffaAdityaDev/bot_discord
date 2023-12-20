'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const fs_1 = __importDefault(require('fs'));
const path_1 = __importDefault(require('path'));
const discord_js_1 = require('discord.js');
const dotenv_1 = __importDefault(require('dotenv'));
const rest_1 = require('@discordjs/rest');
const v9_1 = require('discord-api-types/v9');
dotenv_1.default.config();
class BotClient extends discord_js_1.Client {
  constructor(options) {
    super(options);
    this.commands = new discord_js_1.Collection();
  }
}
const client = new BotClient({
  intents: [discord_js_1.GatewayIntentBits.Guilds],
});
const commands = [];
const commandFolders = fs_1.default.readdirSync(
  path_1.default.join(__dirname, '/commands'),
);
for (const folder of commandFolders) {
  const commandFiles = fs_1.default
    .readdirSync(path_1.default.join(__dirname, '/commands', folder))
    .filter((file) => file.endsWith('.ts'));
  for (const file of commandFiles) {
    const command = require(
      path_1.default.join(__dirname, '/commands', folder, file),
    ).default;
    if (command && 'data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${path_1.default.join(
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
const rest = new rest_1.REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );
    const data = await rest.put(
      v9_1.Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      { body: commands },
    );
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
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});
client.once('ready', () => {
  console.log('Ready!');
});
client.login(process.env.BOT_TOKEN);
