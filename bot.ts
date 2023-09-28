// Import necessary modules
import { Client, GatewayIntentBits } from 'discord.js';

// Create a new Discord client with intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,           // Enable guild-related events
    GatewayIntentBits.GuildMessages    // Enable message-related events
  ]
});

// Set your Discord bot token
const TOKEN = 'MTE1Njg2MzI2NzkyMzMxNjc3Nw.GprvnP.lDxRxtvcF_klc9_HfvJB4MuZvfkK137LKdNJlI';

// Register an event for when the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

// Register an event for when a message is received
client.on('messageCreate', (message) => {
  // Check if the message is from a bot or doesn't start with a specific command prefix
  if (message.author.bot || !message.content.startsWith('!dota2')) {
    return;
  }

  // Your Dota 2 API logic here to fetch and send Dota 2 details
  // Example: Send a message indicating Dota 2 details will be displayed
  message.channel.send('Fetching Dota 2 details...');
});

// Log in to Discord with your bot's token
client.login(TOKEN);
