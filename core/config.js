const fs = require("fs");
const path = require("path");

function loadJSON(file) {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, "../", file), "utf-8"));
}

const config = loadJSON("config/config.json");
const placeholders = loadJSON("config/placeholders.json");

module.exports = { config, placeholders };