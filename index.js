const fs = require("fs");
const { config, resolveChannelId } = require("./core/config");
const { log } = require("./core/logger");
const { fetchLatestVideo } = require("./core/fetcher");
const { buildEmbed } = require("./core/processor");
const { sendDiscord, startRetryLoop } = require("./core/dispatcher");
const { loadPlugins } = require("./core/pluginManager");

const LAST_FILE = "last_video.json";
const plugins = loadPlugins();
startRetryLoop();

async function getLastId() {
  return fs.existsSync(LAST_FILE)
    ? JSON.parse(fs.readFileSync(LAST_FILE)).lastVideoId
    : null;
}

function setLastId(id) {
  fs.writeFileSync(LAST_FILE, JSON.stringify({ lastVideoId: id }, null, 2));
}

async function check() {
  const video = await fetchLatestVideo();
  if (!video) return;

  const videoId = video.id.videoId;
  const lastId = await getLastId();
  if (videoId === lastId) {
    log("No new video.");
    return;
  }

  log("New video detected:", video.snippet.title);
  for (const plugin of plugins) {
    if (plugin.onNewVideo) {
      try {
        plugin.onNewVideo(video, { sendDiscord, config });
      } catch (e) {
        log(`Plugin ${plugin.name} failed: ${e.message}`);
      }
    }
  }

  const payload = await buildEmbed(video);
  if (!payload) return;

  await sendDiscord(payload);
  setLastId(videoId);
}

// Start notifier
(async () => {
  config.channelId = await resolveChannelId(config);
  log("YouTube Notifier started.");
  setInterval(check, config.checkIntervalSeconds * 1000);
  check();
})();