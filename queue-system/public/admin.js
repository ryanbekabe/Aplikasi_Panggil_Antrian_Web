const socket = io();

// Elemen DOM
const currentNumberEl = document.getElementById('currentNumber');
const latestNumberEl = document.getElementById('latestNumber');
const callNextBtn = document.getElementById('callNext');

// Update informasi antrian
socket.on('queueUpdate', (data) => {
  currentNumberEl.textContent = data.current;
  latestNumberEl.textContent = data.latest;
});

// Panggil nomor berikutnya
callNextBtn.addEventListener('click', () => {
  socket.emit('callNext');
});