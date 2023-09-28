const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const TOKEN = 'MTE1Njg2MzI2NzkyMzMxNjc3Nw.GD2sDp.ASC1RJk2NRzrTvXFU2yjSbw0Qc931wZv4XIRYE';
const OPEN_DOTA_API_URL = 'https://api.opendota.com/api/';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
}); 

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!fe01-dota')) {
    const heroName = message.content.substring(10).toLowerCase(); // Updated substring length

    console.log(`Received command: !fe01-dota ${heroName}`); // Debugging line

    try {
      const response = await axios.get(`${OPEN_DOTA_API_URL}heroes`);
      const heroes = response.data;
      const hero = heroes.find((h) => h.localized_name.toLowerCase() === heroName);

      if (hero) {
        const embed = new MessageEmbed()
          .setTitle(hero.localized_name)
          .addField('Primary Attribute', hero.primary_attr)
          .addField('Attack Type', hero.attack_type)
          .addField('Roles', hero.roles.join(', '));

        message.channel.send({ embeds: [embed] });
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
