# 📈 AI Trading Terminal (IHSG)

Terminal Trading AI Full-Stack yang dirancang untuk menganalisa pergerakan pasar saham Indonesia (IHSG) secara interaktif. Proyek ini mengintegrasikan Large Language Model (LLM) dengan *database cloud* untuk memberikan *insight* pasar yang cerdas dan memiliki memori kontekstual.

## ✨ Fitur Utama
- **🤖 AI Market Analyst**: Ditenagai oleh Groq API (LLaMA 3.3 70B Versatile) untuk merespons *prompt* pengguna seputar analisa saham dengan kecepatan tinggi.
- **📊 Dynamic Market Movers**: Menampilkan simulasi data Top Gainer dan Top Loser (seperti DMAS, CDIA, MMLP) secara dinamis pada *dashboard* utama.
- **🧠 Contextual Memory**: Bot mampu mengingat riwayat percakapan sebelumnya sehingga pengguna dapat melakukan tanya-jawab lanjutan tanpa kehilangan konteks.
- **☁️ Cloud Database Logging**: Menyimpan seluruh log percakapan (*chat history*) secara permanen dan asinkron menggunakan TiDB Cloud.
- **🖥️ Clean UI Architecture**: Antarmuka responsif berbentuk terminal profesional *full-width*.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **AI Engine**: Groq SDK
- **Database**: TiDB Cloud (Serverless MySQL) menggunakan `mysql2`

## 🚀 Live Demo
🌐 **[Kunjungi AI Trading Terminal](https://ai-trading-terminal-brown.vercel.app/)**

---

## 💻 Panduan Instalasi Lokal (Local Setup)
Jika Anda ingin mengkloning dan menjalankan proyek ini di komputer lokal, ikuti langkah-langkah berikut:

### 1. Clone Repositori
```bash
git clone [https://github.com/daffa4040/ai-trading-terminal.git](https://github.com/daffa4040/ai-trading-terminal.git)
cd ai-trading-terminal


### 2. Instal Dependensi

Pastikan Anda sudah menginstal Node.js di komputer Anda, lalu jalankan:
Bash

npm install

### 3. Konfigurasi Environment Variables

Buat sebuah file bernama .env di root directory proyek, lalu isi dengan format kredensial berikut:
Cuplikan kode

GROQ_API_KEY=kunci_rahasia_groq_anda
FMP_API_KEY=kunci_rahasia_fmp (optional)

DB_HOST=host_tidb_cloud_anda
DB_PORT=4000
DB_USER=user_tidb_anda
DB_PASSWORD=password_tidb_anda
DB_NAME=nama_database_anda

### 4. Jalankan Server
Bash

node api/index.js

Buka browser dan navigasikan ke http://localhost:3000. Server akan secara otomatis membuat tabel chat_logs jika belum tersedia di database Anda.
👨‍💻 Tentang Pengembang

Proyek ini dikembangkan oleh Alif Daffa Hernanda.
Berpengalaman dalam pengembangan perangkat lunak menggunakan PHP, Node.js, C#, C++, dan JavaScript, dengan ketertarikan dan fokus mendalam pada bidang Machine Learning dan AI Engineering.

🔗 GitHub: @daffa4040
