const fs = require("fs");
const path = require("path");
const { log } = require("./logger");

function loadPlugins() {
  const plugins = [];
  const folder = path.join(__dirname, "../plugins");

  for (const file of fs.readdirSync(folder)) {
    if (file.endsWith(".js")) {
      try {
        const plugin = require(path.join(folder, file));
        plugins.push(plugin);
        log(`Loaded plugin: ${plugin.name}`);
      } catch (e) {
        log(`Failed to load plugin ${file}: ${e.message}`);
      }
    }
  }

  return plugins;
}

module.exports = { loadPlugins };