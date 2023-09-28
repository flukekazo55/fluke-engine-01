const Discord = require('discord.js');
const axios = require('axios');

const client = new Discord.Client();
const TOKEN = 'DISCORD_BOT_TOKEN';
const OPEN_DOTA_API_URL = 'https://api.opendota.com/api/';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async (message) => {
  if (message.content.startsWith('!fe01-dota2')) {
    const heroName = message.content.substring(6).toLowerCase();
    
    try {
      const response = await axios.get(`${OPEN_DOTA_API_URL}heroes`);
      const heroes = response.data;
      const hero = heroes.find((h) => h.localized_name.toLowerCase() === heroName);

      if (hero) {
        const embed = new Discord.MessageEmbed()
          .setTitle(hero.localized_name)
          .addField('Primary Attribute', hero.primary_attr)
          .addField('Attack Type', hero.attack_type)
          .addField('Roles', hero.roles.join(', '));

        message.channel.send(embed);
      } else {
        message.channel.send('Hero not found.');
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
      message.channel.send('An error occurred while fetching hero data.');
    }
  }
});

client.login(TOKEN);
