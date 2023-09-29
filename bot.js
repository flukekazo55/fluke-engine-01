const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Partials,
  EmbedBuilder 
} = require("discord.js"); // Import MessagePayload and MessageButton for buttons

const axios = require("axios");

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const TOKEN = "TOKEN"; // Replace with your bot token

const DOTA_HERO_LIST_API_URL = "https://www.dota2.com/datafeed/herolist?language=english";
const DOTA_HERO_DATA_API_URL = "https://www.dota2.com/datafeed/herodata?language=english";

function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return; // Ignore messages from bots.
  }

  if (!message.content) {
    // Handle messages without content, such as system messages or interactions.
    // For example, you can check the message type:
    if (message.type === "PINS_ADD") {
      // Handle a pinned message event.
    } else if (message.type === "GUILD_MEMBER_JOIN") {
      // Handle a new member joining the server.
    }
    return;
  }

  if (message.content.startsWith("!fe01-dota")) {
    const heroName = removeDiacritics(message.content.replace(/^!fe01-dota /, '')); // Updated substring length
    console.log("heroName: ", heroName);

    try {
      const response = await axios.get(`${DOTA_HERO_LIST_API_URL}`);
      let heroes = response.data.result.data.heroes;
      heroes.sort((a, b) => a.name.localeCompare(b.name));
      const hero = heroes.find((h) => h.name_loc.replace(/[^a-zA-Z]/g, '').toLowerCase() === heroName.replace(/[^a-zA-Z]/g, '').toLowerCase());
      console.log("hero: ", hero);

      if (hero) {
        const responseDetail = await axios.get(`${DOTA_HERO_DATA_API_URL}&hero_id=${hero.id}`);
        const heroDetail = responseDetail.data.result.data.heroes[0];
        console.log("heroDetail: ", heroDetail);

        const about = heroDetail.hype_loc.replace(/<\/?b>/g, '');
        const heroImg = heroDetail.name.split("_").slice(3).join("_");

        // inside a command, event listener, etc.
        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${heroDetail.name_loc}`)
        .setURL(`https://www.dota2.com/hero/${heroDetail.name_loc.replace(/\s+/g, '').toLowerCase()}`)
        .setDescription(`${heroDetail.npe_desc_loc}`)
        .addFields(
          { name: 'About', value: `${about}` },
        )
        .setImage(`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroImg}.png`)
        .setTimestamp()

        message.channel.send({embeds: [embed]});
      } else {
        message.channel.send("ไม่พบข้อมูล...");
      }
    } catch (error) {
      console.error("Error fetching hero data:", error);
      message.channel.send("An error occurred while fetching hero data.");
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  await interaction.deferReply();

  if (!interaction.isButton()) return;

  if (interaction.customId === "view_hero") {
    const heroInfo = "ต่างคนต่างคิด ชีวิตคนละแบบ...";
    interaction.followUp({ content: heroInfo });
  }
});

client.login(TOKEN);
