const axios = require("axios");
const { config } = require("./config");
const { log, error } = require("./logger");

const retryQueue = [];

async function sendDiscord(payload) {
  try {
    await axios.post(config.webhookUrl, payload);
    log("Posted to Discord successfully.");
  } catch (err) {
    error("Webhook failed, queuing retry.");
    retryQueue.push(payload);
  }
}

function startRetryLoop() {
  setInterval(async () => {
    if (retryQueue.length === 0) return;
    const payload = retryQueue.shift();
    log("Retrying failed webhook post...");
    await sendDiscord(payload);
  }, config.retryDelaySeconds * 1000);
}

module.exports = { sendDiscord, startRetryLoop };