const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { log } = require("./logger");

function loadJSON(file) {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, "../", file), "utf-8"));
}

const config = loadJSON("config/config.json");
const placeholders = loadJSON("config/placeholders.json");

async function resolveChannelId(config) {
  if (!config.channelId.startsWith("@")) {
    return config.channelId;
  }

  try {
    const username = config.channelId.replace("@", "");
    const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        key: config.youtubeApiKey,
        q: username,
        type: "channel",
        part: "snippet",
        maxResults: 1
      }
    });

    const foundId = res.data.items[0]?.snippet?.channelId || res.data.items[0]?.id?.channelId;
    if (!foundId) throw new Error("Channel not found via handle");

    log(`Resolved handle ${config.channelId} to channel ID: ${foundId}`);
    config.channelId = foundId;
    return foundId;
  } catch (err) {
    log(`❌ Failed to resolve handle: ${config.channelId}`);
    throw err;
  }
}

module.exports = { config, placeholders, resolveChannelId };