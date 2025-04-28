// server.js

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

const PORT = process.env.PORT || 3000;

// Admin Passwort
const ADMIN_PASSWORD = "admin1234"; // Hier kannst du dein eigenes Passwort setzen

// Öffentlichen Ordner bereitstellen
app.use(express.static('public'));
app.use(express.json());

// Route für Zuschauer (Overlay)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Route für Admin (Steuerung)
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/admin.html');
});

// Passwort-Überprüfung
app.post('/check-password', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// WebSocket-Verbindungen behandeln
io.on('connection', (socket) => {
  console.log('Ein Client verbunden.');

  socket.on('updateOverlay', (data) => {
    io.emit('updateOverlay', data); // Broadcast an ALLE Clients
  });

  socket.on('disconnect', () => {
    console.log('Ein Client hat die Verbindung getrennt.');
  });
});

// Server starten
http.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
