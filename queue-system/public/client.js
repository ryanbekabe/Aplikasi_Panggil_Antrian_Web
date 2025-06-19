const socket = io();

// Elemen DOM
const currentNumberEl = document.getElementById('currentNumber');
const latestNumberEl = document.getElementById('latestNumber');
const getNumberBtn = document.getElementById('getNumber');
const yourNumberDiv = document.getElementById('yourNumber');
const userNumberEl = document.getElementById('userNumber');

// Tidak perlu bell dan suara di halaman ambil nomor
// Hapus/matikan kode bell dan suara di sini
let lastCurrentNumber = null;

// Update informasi antrian
socket.on('queueUpdate', (data) => {
  latestNumberEl.textContent = data.latest;
});

// Ambil nomor antrian baru
getNumberBtn.addEventListener('click', () => {
  socket.emit('getQueueNumber');
  socket.once('queueUpdate', (data) => {
    yourNumberDiv.classList.remove('hidden');
    userNumberEl.textContent = data.latest;
    // Simpan nomor user jika ingin digunakan di halaman lain
    localStorage.setItem('userNumber', data.latest);
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