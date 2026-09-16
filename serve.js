const express = require('express');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

const app = express();
const PORT = Number(process.env.PORT || 3002);

const liveReloadServer = process.env.LIVE_RELOAD === 'false' ? null : livereload.createServer();
if (liveReloadServer) {
  liveReloadServer.watch(path.join(__dirname, 'dist'));
  app.use(connectLivereload());
}
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'dist', '404.html'));
});

liveReloadServer?.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

app.listen(PORT, () => {
  console.log(`🚀 Server started: http://localhost:${PORT}`);
});
