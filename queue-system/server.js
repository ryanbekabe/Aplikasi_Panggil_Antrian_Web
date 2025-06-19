const express = require('express');
const http = require('node:http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Menyajikan file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Data antrian
let queueNumber = 0;
let currentNumber = 0;
let loketMap = {}; // { nomorAntrian: nomorLoket }

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('User connected');
  
  // Kirim data antrian terbaru ke client yang baru terhubung
  socket.emit('queueUpdate', { current: currentNumber, latest: queueNumber, loket: loketMap[currentNumber] || null });
  
  // Ambil nomor antrian baru
  socket.on('getQueueNumber', () => {
    queueNumber++;
    io.emit('queueUpdate', { current: currentNumber, latest: queueNumber, loket: loketMap[currentNumber] || null });
    return queueNumber;
  });
  
  // Panggil nomor berikutnya dengan loket tujuan
  socket.on('callNext', (loket) => {
    if (currentNumber < queueNumber) {
      currentNumber++;
      loketMap[currentNumber] = loket;
      io.emit('queueUpdate', { current: currentNumber, latest: queueNumber, loket });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});