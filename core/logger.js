const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const latestPath = path.join(logDir, "latest.txt");

const time = () => new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York" });
const fullTime = () =>
  new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    hour12: false
  }).replace(/[/,: ]/g, "-");

const archiveOldLog = () => {
  if (fs.existsSync(latestPath)) {
    const newName = `${logDir}/${fullTime()}.txt`;
    fs.renameSync(latestPath, newName);
  }
};
archiveOldLog();

const logStream = fs.createWriteStream(latestPath, { flags: "a" });

function log(...args) {
  const formatted = `[${time()}] ${args.join(" ")}`;
  console.log(chalk.gray(formatted));
  logStream.write(formatted + "\n");
}

function error(...args) {
  const formatted = `[${time()}] [ERROR] ${args.join(" ")}`;
  console.log(chalk.red(formatted));
  logStream.write(formatted + "\n");
}

module.exports = { log, error };