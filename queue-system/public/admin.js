const socket = io();

// Elemen DOM
const currentNumberEl = document.getElementById('currentNumber');
const latestNumberEl = document.getElementById('latestNumber');
const callNextBtn = document.getElementById('callNext');

// Update informasi antrian

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

// Log panggilan terakhir
let callLog = [];

function updateCallLogDisplay() {
  let logDiv = document.getElementById('callLog');
  if (!logDiv) {
    logDiv = document.createElement('div');
    logDiv.id = 'callLog';
    logDiv.className = 'call-log';
    currentNumberEl.parentNode.appendChild(logDiv);
  }
  logDiv.innerHTML = '<h3>5 Panggilan Terakhir</h3>' +
    '<ul>' +
    callLog.map(item => `<li>Nomor ${item.nomor} - Loket ${item.loket}</li>`).join('') +
    '</ul>';
}

// Tampilkan info loket tujuan
socket.on('queueUpdate', (data) => {
  currentNumberEl.textContent = data.current;
  latestNumberEl.textContent = data.latest;
  // Animasi flash jika currentNumber berubah
  currentNumberEl.classList.remove('flash');
  void currentNumberEl.offsetWidth; // trigger reflow
  currentNumberEl.classList.add('flash');
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
  // Tambahkan ke log hanya jika ada nomor dipanggil (bukan saat ambil antrian baru)
  if (
    data.current && data.loket &&
    (callLog.length === 0 || callLog[0].nomor !== data.current)
  ) {
    callLog.unshift({ nomor: data.current, loket: data.loket });
    if (callLog.length > 5) callLog = callLog.slice(0, 5);
    updateCallLogDisplay();
  }
});

// Bell dan suara hanya untuk admin
const audioDingDong = new Audio('https://cdn.freesound.org/previews/331/331567_1585910-lq.mp3');
function speakQueueNumber(nomor, loket) {
  let text = `Nomor antrian ${nomor}, silakan menuju loket ${loket}`;
  const utter = new window.SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const indoVoice = voices.find(v => v.lang.startsWith('id'));
  if (indoVoice) utter.voice = indoVoice;
  utter.rate = 1;
  window.speechSynthesis.speak(utter);
}

// Bell dan suara hanya jika event action adalah 'panggil'
socket.on('queueUpdate', (data) => {
  // ...existing code...
  // Bell dan suara hanya jika event action adalah 'panggil'
  if (data.action === 'panggil' && data.current && data.loket) {
    audioDingDong.play();
    speakQueueNumber(data.current, data.loket);
  }
  // ...existing code...
});