require("dotenv").config();
const fs = require("fs");
const Parser = require("rss-parser");
const parser = new Parser();

const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// ===== YT DATA =====
const CHANNEL_FILE = "./channels.json";
const DATA_FILE = "./data.json";

function getYTChannels() {
  return JSON.parse(fs.readFileSync(CHANNEL_FILE)).channelIds;
}

function saveYTChannels(channels) {
  fs.writeFileSync(CHANNEL_FILE, JSON.stringify({ channelIds: channels }, null, 2));
}

function getLastVideo(channelId) {
  if (!fs.existsSync(DATA_FILE)) return "";
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  return data.channels?.[channelId] || "";
}

function saveLastVideo(channelId, videoId) {
  let data = { channels: {} };
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  data.channels[channelId] = videoId;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ===== CHECK YOUTUBE =====
async function checkYouTube() {
  const ytChannels = getYTChannels();

  for (const ytId of ytChannels) {
    try {
      const feed = await parser.parseURL(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${ytId}`
      );

      const latest = feed.items[0];
      const lastVideo = getLastVideo(ytId);

      if (latest.id !== lastVideo) {
        saveLastVideo(ytId, latest.id);

const title = latest.title
  .toLowerCase()
  .replace(/[^a-z0-9 ]/g, ""); // remove emojis/symbols

if (
  title.includes("pathalam network") ||
  title.includes("devasuram smp")    ||
  title.includes("pathalam anarchy")    
) {
          const dcChannels = process.env.CHANNEL_IDS.split(",");

          for (const id of dcChannels) {
            try {
              const channel = await client.channels.fetch(id);
              const channelName = latest.author;

await channel.send({
  content: `Hey @everyone 👋
**${channelName}** dropped a new video!
<:aq:1491058939985526874> Watch now:
${latest.link}`
});
            } catch {}
          }
        }
      }

    } catch (err) {
      console.log("YT Error:", err.message);
    }
  }
}

// ===== EVENTS =====
client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  setInterval(checkYouTube, 5000);
});

// Slash command handler
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, { getYTChannels, saveYTChannels });
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: "Error executing command!", ephemeral: true });
  }
});

client.login(process.env.TOKEN);