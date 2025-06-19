# 📡 YouTube Upload Notifier → Discord Webhook

A fully customizable Node.js-powered YouTube upload notifier that automatically checks your channel for new videos and sends them to a configured Discord webhook.

## ✨ Features

- 🔁 Checks for new uploads using **channel ID**
- 🔔 Sends rich Discord **embed or plain text** messages
- 🕓 Configurable **check interval** and **delayed posting** until YouTube processing finishes
- 🧩 Supports **plugin system** for custom logic
- ⚙️ Customizable placeholders and message templates
- 🧠 Optional video type detection (Shorts, Premiere, Stream)
- 💥 Retry queue for failed webhook sends
- 📦 Modular folder structure for easy debugging
- 📝 Console & file logging (`logs/latest.txt` + timestamped archives)

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash[
https://github.com/Onyxs2007/Discord-YT-notifier.git
cd discord-yt-notifier
```

### 2. Start System
```bash[
cd discord-yt-notifier
npm i
node index.js
