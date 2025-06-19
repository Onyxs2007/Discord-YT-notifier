const axios = require("axios");
const { config } = require("./config");
const { log, error } = require("./logger");

async function fetchLatestVideo() {
  try {
    const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        key: config.youtubeApiKey,
        channelId: config.channelId,
        part: "snippet",
        order: "date",
        type: "video",
        maxResults: 1
      }
    });

    return res.data.items[0];
  } catch (err) {
    error("Failed to fetch video:", err.message);
    return null;
  }
}

async function fetchVideoDetails(videoId) {
  try {
    const res = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
      params: {
        key: config.youtubeApiKey,
        part: "contentDetails,processingDetails",
        id: videoId
      }
    });
    return res.data.items[0];
  } catch (err) {
    error("Failed to fetch video details:", err.message);
    return null;
  }
}

function parseDuration(iso) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const match = iso.match(regex);
  const h = parseInt(match[1] || 0), m = parseInt(match[2] || 0), s = parseInt(match[3] || 0);
  return `${h > 0 ? h + "h " : ""}${m}m ${s}s`;
}

function detectVideoType(video) {
  const title = video.snippet.title.toLowerCase();
  if (title.includes("shorts")) return "Short";
  if (title.includes("premiere")) return "Premiere";
  if (title.includes("stream")) return "Stream";
  return "Video";
}

module.exports = { fetchLatestVideo, fetchVideoDetails, parseDuration, detectVideoType };