const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Partials,
  EmbedBuilder,
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

const DOTA_HERO_LIST_API_URL =
  "https://www.dota2.com/datafeed/herolist?language=english";
const DOTA_HERO_DATA_API_URL =
  "https://www.dota2.com/datafeed/herodata?language=english";

function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
    const heroName = removeDiacritics(
      message.content.replace(/^!fe01-dota /, "")
    ); // Updated substring length
    console.log("heroName: ", heroName);

    try {
      const response = await axios.get(`${DOTA_HERO_LIST_API_URL}`);
      let heroes = response.data.result.data.heroes;
      heroes.sort((a, b) => a.name.localeCompare(b.name));
      const hero = heroes.find(
        (h) =>
          h.name_loc.replace(/[^a-zA-Z]/g, "").toLowerCase() ===
          heroName.replace(/[^a-zA-Z]/g, "").toLowerCase()
      );
      console.log("hero: ", hero);

      if (hero) {
        const responseDetail = await axios.get(
          `${DOTA_HERO_DATA_API_URL}&hero_id=${hero.id}`
        );
        const heroDetail = responseDetail.data.result.data.heroes[0];
        console.log("heroDetail: ", heroDetail);

        const about = heroDetail.hype_loc.replace(/<\/?b>/g, "");
        const heroImg = heroDetail.name.split("_").slice(3).join("_");
        const primaryType = heroDetail.primary_attr;
        let heroTypeImg;
        let heroTypeName;
        if (primaryType === 0) {
          heroTypeName = "STRENGTH";
          heroTypeImg =
            "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_strength.png";
        } else if (primaryType === 1) {
          heroTypeName = "AGILITY";
          heroTypeImg =
            "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_agility.png";
        } else if (primaryType === 2) {
          heroTypeName = "INTELLIGENCE";
          heroTypeImg =
            "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_intelligence.png";
        } else {
          heroTypeName = "UNIVERSAL";
          heroTypeImg =
            "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_universal.png";
        }

        // inside a command, event listener, etc.
        const embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(`${heroDetail.name_loc}`)
          .setURL(
            `https://www.dota2.com/hero/${heroDetail.name_loc
              .replace(/\s+/g, "")
              .toLowerCase()}`
          )
          .setAuthor({
            name: `${heroDetail.name_loc} (${heroTypeName})`,
            iconURL: `${heroTypeImg}`,
          })
          .setDescription(`${heroDetail.npe_desc_loc}`)
          .setThumbnail(
            `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroImg}.png`
          )
          .addFields({ name: "About", value: `${about}` });

        message.channel.send({ embeds: [embed] });

        for (let ability of heroDetail.abilities) {
          const skillName = ability.name_loc;
          const skillImg = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability.name}.png`;
          const skillDesc = ability.desc_loc.replace(/%\w+%/g, function (match) {
            let propName = match.slice(1, -1);
            for(let item of ability.special_values) {
              if (item.name === propName) {
                  return item.values_float[0];
              }
            }
            return match;
          });
          const skillEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setAuthor({
              name: `${skillName}`,
              iconURL: `${skillImg}`,
            })
            .setDescription(`${skillDesc}`)
            .setThumbnail(`${skillImg}`);

          message.channel.send({ embeds: [skillEmbed] });
        }
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
