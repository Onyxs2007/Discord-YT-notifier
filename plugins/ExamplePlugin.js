module.exports = {
  name: "ExamplePlugin",
  onNewVideo(video, context) {
    console.log(`[Plugin] New video uploaded: ${video.snippet.title}`);
  }
};