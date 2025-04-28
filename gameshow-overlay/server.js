// server.js

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BACKUP_FILE = path.join(__dirname, 'backup.json');
const ADMIN_PASSWORD = "admin1234";

// 📦 Speicher für aktuellen Status
let aktuellerStatus = {
  team1: "",
  team2: "",
  score1: 0,
  score2: 0,
  spieleliste: []
};

/* Backup beim Start laden */
if (fs.existsSync(BACKUP_FILE)) {
  const data = fs.readFileSync(BACKUP_FILE, 'utf-8');
  aktuellerStatus = JSON.parse(data);
  console.log("✅ Backup erfolgreich geladen.");
} else {
  console.log("⚠️ Kein Backup gefunden, starte leer.");
}

// Öffentlichen Ordner bereitstellen
app.use(express.static('public'));
app.use(express.json());

// Zuschauer Overlay
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Admin Steuerung
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/admin.html');
});

// Passwort Check
app.post('/check-password', (req, res) => {
  const { password } = req.body;
  res.json({ success: password === ADMIN_PASSWORD });
});

// WebSocket-Verbindungen
io.on('connection', (socket) => {
  console.log('Ein Client verbunden.');

  // Aktuellen Status senden
  socket.emit('updateOverlay', aktuellerStatus);

  // Änderungen empfangen
  socket.on('updateOverlay', (data) => {
    aktuellerStatus = { ...data };
    io.emit('updateOverlay', aktuellerStatus);
    saveBackup();
  });

  socket.on('disconnect', () => {
    console.log('Ein Client hat die Verbindung getrennt.');
  });
});

/* Backup speichern */
function saveBackup() {
  fs.writeFileSync(BACKUP_FILE, JSON.stringify(aktuellerStatus, null, 2));
  console.log("💾 Backup gespeichert.");
}

// Server starten
http.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
