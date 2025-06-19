# Sistem Antrian Berbasis Web

Aplikasi sistem antrian berbasis web yang dibangun menggunakan Node.js dan Socket.IO untuk komunikasi real-time.

## Fitur

- Pengambilan nomor antrian secara digital
- Tampilan nomor antrian saat ini dan terakhir
- Panel admin untuk memanggil nomor antrian berikutnya
- Pembaruan data secara real-time di semua perangkat yang terhubung
- Antarmuka yang responsif dan mudah digunakan

## Prasyarat

- Node.js (versi 14.x atau lebih baru)
- NPM (Node Package Manager)
- Browser web modern

## Instalasi

1. Clone repositori ini atau download sebagai ZIP
   ```
   git clone https://github.com/username/sistem-antrian.git
   cd sistem-antrian
   ```

2. Install dependensi yang diperlukan
   ```
   npm install
   ```

3. Jalankan server
   ```
   node server.js
   ```

4. Buka aplikasi di browser
   - Halaman utama: http://localhost:3000
   - Halaman admin: http://localhost:3000/admin.html

## Struktur Proyek

```
sistem-antrian/
├── node_modules/
├── public/
│   ├── admin.html     # Halaman admin untuk memanggil antrian
│   ├── admin.js       # JavaScript untuk halaman admin
│   ├── client.js      # JavaScript untuk halaman utama
│   ├── index.html     # Halaman utama untuk pengambilan nomor
│   └── style.css      # Stylesheet untuk semua halaman
├── server.js          # Server Node.js dengan Socket.IO
├── package.json
└── README.md
```

## Penggunaan

### Halaman Utama (Pengunjung)
- Pengunjung dapat melihat nomor antrian saat ini dan nomor terakhir
- Klik tombol "Ambil Nomor Antrian" untuk mendapatkan nomor antrian baru
- Nomor antrian yang diperoleh akan ditampilkan di layar

### Halaman Admin
- Admin dapat melihat nomor antrian saat ini dan nomor terakhir
- Klik tombol "Panggil Nomor Berikutnya" untuk memajukan antrian
- Perubahan akan terlihat secara real-time di semua perangkat yang terhubung

## Deployment ke Server Ubuntu

1. Pastikan Node.js dan NPM terinstal di server Ubuntu
   ```
   sudo apt update
   sudo apt install nodejs npm
   ```

2. Clone repositori atau upload file proyek ke server

3. Install dependensi
   ```
   npm install
   ```

4. Gunakan PM2 untuk menjalankan aplikasi sebagai layanan
   ```
   sudo npm install -g pm2
   pm2 start server.js --name "sistem-antrian"
   pm2 startup
   pm2 save
   ```

5. Konfigurasi Nginx sebagai reverse proxy (opsional)
   ```
   sudo apt install nginx
   ```

   Buat file konfigurasi Nginx:
   ```
   sudo nano /etc/nginx/sites-available/sistem-antrian
   ```

   Tambahkan konfigurasi berikut:
   ```
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Aktifkan konfigurasi:
   ```
   sudo ln -s /etc/nginx/sites-available/sistem-antrian /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

echo "# Aplikasi_Panggil_Antrian_Web" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/ryanbekabe/Aplikasi_Panggil_Antrian_Web.git
git push -u origin main

git add ..
git commit -m "Commit 4 - Log 5 loket panggilan terakhir"
git push 

## Lisensi

[MIT](LICENSE)