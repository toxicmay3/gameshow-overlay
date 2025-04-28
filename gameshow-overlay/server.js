// server.js
// Gameshow-Overlay Server

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

const PORT = process.env.PORT || 3000;

// Zum Schutz Admin Passwort
const ADMIN_PASSWORD = "admin1234"; // Später leicht änderbar

app.use(express.static('public'));
app.use(express.json());

// Route für Overlay
app.get('/overlay', (req, res) => {
  res.sendFile(__dirname + '/public/overlay.html');
});

// Route für Steuerung (Admin)
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/steuerung.html');
});

// API zum Checken des Passworts
app.post('/check-password', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Websocket-Verbindung
io.on('connection', (socket) => {
  console.log('Ein Client verbunden.');

  socket.on('updateOverlay', (data) => {
    socket.broadcast.emit('updateOverlay', data);
  });

  socket.on('disconnect', () => {
    console.log('Ein Client hat die Verbindung getrennt.');
  });
});

// Server starten
http.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
