// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = "admin1234"; // Dein Admin Passwort

// Öffentlichen Ordner freigeben
app.use(express.static('public'));
app.use(express.json());

// Startseite für alle (Overlay Ansicht)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Admin-Steuerung
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/admin.html');
});

// Passwort Check API
app.post('/check-password', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// WebSocket Kommunikation
io.on('connection', (socket) => {
  console.log('Ein Client verbunden.');

  socket.on('updateOverlay', (data) => {
    io.emit('updateOverlay', data); // An ALLE senden
  });

  socket.on('disconnect', () => {
    console.log('Ein Client hat die Verbindung getrennt.');
  });
});

// Server starten
http.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
