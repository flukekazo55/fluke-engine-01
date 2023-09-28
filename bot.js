"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary modules
var discord_js_1 = require("discord.js");
// Create a new Discord client with intents
var client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages // Enable message-related events
    ]
});
// Set your Discord bot token
var TOKEN = 'MTE1Njg2MzI2NzkyMzMxNjc3Nw.GprvnP.lDxRxtvcF_klc9_HfvJB4MuZvfkK137LKdNJlI';
// Register an event for when the bot is ready
client.once('ready', function () {
    var _a;
    console.log("Logged in as ".concat((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag));
});
// Register an event for when a message is received
client.on('messageCreate', function (message) {
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
