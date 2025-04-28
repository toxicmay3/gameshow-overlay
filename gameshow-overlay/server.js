{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // server.js\
// Gameshow-Overlay Server\
\
const express = require('express');\
const app = express();\
const http = require('http').createServer(app);\
const \{ Server \} = require('socket.io');\
const io = new Server(http);\
\
const PORT = process.env.PORT || 3000;\
\
// Zum Schutz Admin Passwort\
const ADMIN_PASSWORD = "admin1234"; // <-- kannst du sp\'e4ter \'e4ndern\
\
app.use(express.static('public'));\
app.use(express.json());\
\
// Route f\'fcr Overlay\
app.get('/overlay', (req, res) => \{\
  res.sendFile(__dirname + '/public/overlay.html');\
\});\
\
// Route f\'fcr Admin\
app.get('/admin', (req, res) => \{\
  res.sendFile(__dirname + '/public/admin.html');\
\});\
\
// API zum Checken des Passworts\
app.post('/check-password', (req, res) => \{\
  const \{ password \} = req.body;\
  if (password === ADMIN_PASSWORD) \{\
    res.json(\{ success: true \});\
  \} else \{\
    res.json(\{ success: false \});\
  \}\
\});\
\
// Websocket-Verbindung\
io.on('connection', (socket) => \{\
  console.log('Ein Client verbunden.');\
\
  socket.on('updateOverlay', (data) => \{\
    socket.broadcast.emit('updateOverlay', data);\
  \});\
\
  socket.on('disconnect', () => \{\
    console.log('Ein Client hat die Verbindung getrennt.');\
  \});\
\});\
\
// Server starten\
http.listen(PORT, () => \{\
  console.log(`Server l\'e4uft auf Port $\{PORT\}`);\
\});\
}