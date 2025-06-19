const { config } = require("./config");
const { fetchVideoDetails, parseDuration } = require("./fetcher");
const { resolvePlaceholders } = require("./placeholders");
const { log } = require("./logger");

async function buildEmbed(video) {
  const videoId = video.id.videoId;
  const details = await fetchVideoDetails(videoId);

  if (!details || !details.contentDetails) {
    log("No video content details found, skipping...");
    return null;
  }

  const duration = parseDuration(details.contentDetails.duration);
  const fill = resolvePlaceholders(video, { videoDuration: duration });

  if (!config.useEmbed) {
    const content = fill(config.customMessage);
    return { content };
  }

  const embed = {
    title: fill(config.embedTemplate.title),
    description: fill(config.embedTemplate.description),
    color: config.embedTemplate.color,
    footer: { text: fill(config.embedTemplate.footer) },
    timestamp: fill(config.embedTemplate.timestamp),
    thumbnail: { url: fill(config.embedTemplate.thumbnail) }
  };

  const content = config.pingRoleId ? `<@&${config.pingRoleId}>` : "";

  return { content, embeds: [embed] };
}

module.exports = { buildEmbed };