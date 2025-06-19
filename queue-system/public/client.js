const socket = io();

// Elemen DOM
const currentNumberEl = document.getElementById('currentNumber');
const latestNumberEl = document.getElementById('latestNumber');
const getNumberBtn = document.getElementById('getNumber');
const yourNumberDiv = document.getElementById('yourNumber');
const userNumberEl = document.getElementById('userNumber');

// Update informasi antrian
socket.on('queueUpdate', (data) => {
  currentNumberEl.textContent = data.current;
  latestNumberEl.textContent = data.latest;
});

// Ambil nomor antrian baru
getNumberBtn.addEventListener('click', () => {
  socket.emit('getQueueNumber');
  
  socket.once('queueUpdate', (data) => {
    yourNumberDiv.classList.remove('hidden');
    userNumberEl.textContent = data.latest;
  });
});