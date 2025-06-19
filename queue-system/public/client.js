const socket = io();

// Elemen DOM
const currentNumberEl = document.getElementById('currentNumber');
const latestNumberEl = document.getElementById('latestNumber');
const getNumberBtn = document.getElementById('getNumber');
const yourNumberDiv = document.getElementById('yourNumber');
const userNumberEl = document.getElementById('userNumber');

// Tambahkan suara bell jika nomor antrian user dipanggil
const audioDingDong = new Audio('https://cdn.freesound.org/previews/331/331567_1585910-lq.mp3');
let lastCurrentNumber = null;

// Update informasi antrian
socket.on('queueUpdate', (data) => {
  currentNumberEl.textContent = data.current;
  latestNumberEl.textContent = data.latest;
  // Jika userNumber muncul dan sama dengan currentNumber, mainkan bell
  const userNumber = userNumberEl ? Number(userNumberEl.textContent) : null;
  if (userNumber && data.current === userNumber && lastCurrentNumber !== data.current) {
    audioDingDong.play();
  }
  lastCurrentNumber = data.current;
});

// Ambil nomor antrian baru
getNumberBtn.addEventListener('click', () => {
  socket.emit('getQueueNumber');
  
  socket.once('queueUpdate', (data) => {
    yourNumberDiv.classList.remove('hidden');
    userNumberEl.textContent = data.latest;
  });
});

// Fungsi cetak nomor antrian
const printBtn = document.getElementById('printNumber');
if (printBtn) {
  printBtn.addEventListener('click', () => {
    const printWindow = window.open('', '', 'width=300,height=200');
    const nomor = userNumberEl.textContent;
    printWindow.document.write(`
      <html>
      <head>
        <title>Cetak Nomor Antrian</title>
        <style>
          body { margin: 0; padding: 0; text-align: center; }
          .number {
            font-size: 48px;
            font-weight: bold;
            margin: 20px 0;
          }
        </style>
      </head>
      <body onload="window.print();window.close()">
        <div class="number">${nomor}</div>
      </body>
      </html>
    `);
    printWindow.document.close();
  });
}