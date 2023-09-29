const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Partials,
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

const TOKEN =
  "MTE1Njg2MzI2NzkyMzMxNjc3Nw.GQlmv6.moAtXa2uHxXDzX1slul8v-xkjnL21XMC9m8c0Y"; // Replace with your bot token
const OPEN_DOTA_API_URL = "https://api.opendota.com/api/";

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  console.log(
    "===================================================================================================="
  );
  console.log("message: ", message);

  if (message.author.bot) {
    return; // Ignore messages from bots.
  }

  const banList = ["gun_nies", "ไอ้แจ็คคคค!!!"];
  if (banList.find((x) => x === message.author.username)) {
    const embed = {
      title: `สวัสดี คุณ ${message.author.globalName}`,
      fields: [
        {
          name: "",
          value: `ควยไรไอ้ ${message.author.globalName} ตกใจน่ะสิ อืมๆ เข้าใจๆ...`,
        },
      ],
    };
    message.channel.send({ embeds: [embed] });
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
    const heroName = message.content.split(/\s+/)[1]; // Updated substring length
    try {
      const response = await axios.get(`${OPEN_DOTA_API_URL}heroes`);
      const heroes = response.data;
      const hero = heroes.find(
        (h) => h.localized_name.toLowerCase().include(heroName)
      );
      if (hero) {
        const embed = {
          title: hero.localized_name,
          fields: [
            { name: "Primary Attribute", value: hero.primary_attr },
            { name: "Attack Type", value: hero.attack_type },
            { name: "Roles", value: hero.roles.join(", ") },
          ],
        };

        // Create a button to view more hero information
        const button = new ButtonBuilder()
          .setCustomId("view_hero")
          .setLabel("รายละเอียด")
          .setStyle(ButtonStyle.Primary);

        // Create an action row to contain the button
        const row = new ActionRowBuilder().addComponents(button);

        // Create the message payload
        const payload = {
          content: "ข้อมูล:",
          embeds: [embed],
          components: [row],
        };

        // Send the message using MessagePayload
        message.channel.send(payload);
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
    const heroInfo = "อยากรู้อะไรนักวะห้ะ...";
    interaction.followUp({ content: heroInfo });
  }
});

client.login(TOKEN);
