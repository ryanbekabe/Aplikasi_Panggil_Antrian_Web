const socket = io();

// Elemen DOM
const currentNumberEl = document.getElementById('currentNumber');
const latestNumberEl = document.getElementById('latestNumber');
const callNextBtn = document.getElementById('callNext');

// Update informasi antrian
audioDingDong = new Audio('https://cdn.freesound.org/previews/331/331567_1585910-lq.mp3'); // sumber: freesound.org DINGDONG.wav

// Tambahkan elemen untuk memilih loket
document.addEventListener('DOMContentLoaded', () => {
  const buttonsDiv = document.querySelector('.buttons');
  const loketSelect = document.createElement('select');
  loketSelect.id = 'loketSelect';
  for (let i = 1; i <= 5; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Loket ${i}`;
    loketSelect.appendChild(opt);
  }
  buttonsDiv.insertBefore(loketSelect, callNextBtn);
});

// Panggil nomor berikutnya
callNextBtn.addEventListener('click', () => {
  const loket = document.getElementById('loketSelect').value;
  socket.emit('callNext', Number(loket));
});

// Tampilkan info loket tujuan
socket.on('queueUpdate', (data) => {
  currentNumberEl.textContent = data.current;
  latestNumberEl.textContent = data.latest;
  // Animasi flash jika currentNumber berubah
  currentNumberEl.classList.remove('flash');
  void currentNumberEl.offsetWidth; // trigger reflow
  currentNumberEl.classList.add('flash');
  // Suara notifikasi
  audioDingDong.play();
  // Tampilkan info loket jika ada
  let loketInfo = document.getElementById('loketInfo');
  if (!loketInfo) {
    loketInfo = document.createElement('div');
    loketInfo.id = 'loketInfo';
    loketInfo.className = 'loket-info';
    currentNumberEl.parentNode.appendChild(loketInfo);
  }
  if (data.loket) {
    loketInfo.textContent = `Menuju Loket ${data.loket}`;
  } else {
    loketInfo.textContent = '';
  }
});