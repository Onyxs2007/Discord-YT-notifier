const { placeholders } = require("./config");
const { parseDuration, detectVideoType } = require("./fetcher");

function resolvePlaceholders(video, extra = {}) {
  const data = {};

  for (const key in placeholders) {
    const path = placeholders[key];
    if (path === "__FETCH_DURATION__") {
      data[key] = extra.videoDuration || "Unknown";
    } else if (path === "__DETECT_TYPE__") {
      data[key] = detectVideoType(video);
    } else if (path.includes("{{")) {
      data[key] = path.replace(/{{(.*?)}}/g, (_, k) => data[k] || "");
    } else {
      const parts = path.split(".");
      let val = video;
      for (const p of parts) val = val?.[p];
      data[key] = val ?? "";
    }
  }

  return (str) => str.replace(/{{(.*?)}}/g, (_, key) => data[key] ?? "");
}

module.exports = { resolvePlaceholders };