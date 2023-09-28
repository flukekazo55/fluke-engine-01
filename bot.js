const Discord = require('discord.js');
const axios = require('axios');

const client = new Discord.Client();
const TOKEN = 'MTE1Njg2MzI2NzkyMzMxNjc3Nw.G73FQe.b_X-x19HTqY5KihmNmB0bpaLYhbXhHxaT0w-s8';
const STEAM_API_KEY = '58B264FB215EB32A9EE8F8E968708C0D';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async (message) => {
  if (message.content === '!dota2info') {
    try {
      const response = await axios.get(
        `https://api.steampowered.com/IDOTA2Match_570/GetGameItems/V001/?key=${STEAM_API_KEY}`
      );

      // Parse and send Dota 2 information
      const data = response.data;
      message.channel.send('Dota 2 Game Information:');
      message.channel.send(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error fetching Dota 2 data:', error);
      message.channel.send('An error occurred while fetching Dota 2 data.');
    }
  }
});

client.login(TOKEN);
