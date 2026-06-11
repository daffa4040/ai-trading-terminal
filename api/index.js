const express = require('express');
const cors = require('cors');
const path = require('path');
const Groq = require('groq-sdk');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Database Harga Simulasi Dinamis untuk Demo & Presentasi
const mockStockDatabase = {
    "DMAS": { price: 174, pbv: 1.2, pe: 8.5, volume: "12M", devYield: "10.2%" },
    "CDIA": { price: 152, pbv: 0.9, pe: 11.2, volume: "2.1M", devYield: "4.5%" },
    "MMLP": { price: 278, pbv: 0.6, pe: 14.1, volume: "5.4M", devYield: "3.8%" },
    "BBCA": { price: 9800, pbv: 4.8, pe: 25.1, volume: "45M", devYield: "2.5%" },
    "GOTO": { price: 54, pbv: 1.1, pe: -3.5, volume: "500M", devYield: "0%" }
};

app.get('/api/movers', async (req, res) => {
    try {
        const gainersPool = [
            { symbol: 'DMAS', price: 174, change: "4.20" },
            { symbol: 'CDIA', price: 155, change: "3.80" },
            { symbol: 'BREN', price: 8200, change: "5.15" },
            { symbol: 'AMMN', price: 9100, change: "2.40" }
        ];
        
        const losersPool = [
            { symbol: 'GOTO', price: 52, change: "-3.70" },
            { symbol: 'MMLP', price: 274, change: "-1.80" },
            { symbol: 'ASII', price: 5100, change: "-2.10" },
            { symbol: 'TLKM', price: 2980, change: "-1.50" }
        ];

        const randomGainer = gainersPool[Math.floor(Math.random() * gainersPool.length)];
        const randomLoser = losersPool[Math.floor(Math.random() * losersPool.length)];

        res.json({ topGainer: randomGainer, topLoser: randomLoser });
    } catch (error) {
        res.status(500).json({ error: "Gagal memuat data movers" });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message, emiten, history = [] } = req.body; 
        let stockInfoString = "";

        if (emiten && mockStockDatabase[emiten]) {
            const stock = mockStockDatabase[emiten];
            stockInfoString = `[DATA PASAR STATIS ${emiten}] 
            Harga Acuan: Rp${stock.price}
            Estimasi Volume: ${stock.volume}
            Valuasi: PBV ${stock.pbv}, PE ${stock.pe}
            Dividend Yield: ${stock.devYield}`;
        }

        const systemPrompt = `Kamu adalah AI Trading Assistant profesional yang ahli di pasar modal Indonesia (IHSG). 
        ${stockInfoString ? `Gunakan data pasar simulasi berikut sebagai landasan analisam: ${stockInfoString}.` : 'Berikan analisa pasar secara makro atau teknikal umum.'} 
        Jawab pertanyaan user secara komprehensif, jangan pernah menggunakan teks placeholder. Gunakan bahasa yang rapi, analitis, dan langsung pada intinya.`;

        const apiMessages = [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: message }
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages: apiMessages,
            model: "llama-3.3-70b-versatile", 
            temperature: 0.5,
            max_tokens: 1024,
        });

        const botReply = chatCompletion.choices[0]?.message?.content || "";

        pool.execute(`INSERT INTO chat_logs (role, message, emiten_tag) VALUES (?, ?, ?)`, ['user', message, emiten || '-']).catch(() => {});
        pool.execute(`INSERT INTO chat_logs (role, message, emiten_tag) VALUES (?, ?, ?)`, ['bot', botReply, emiten || '-']).catch(() => {});

        res.json({ reply: botReply });
    } catch (error) {
        console.error("Groq Error:", error);
        res.status(500).json({ reply: 'Sistem analisis AI sedang memproses pembaruan. Silakan coba beberapa saat lagi.' });
    }
});

module.exports = app;

if (require.main === module) {
    app.listen(3000, () => console.log('Terminal Trading Aktif & Stabil di http://localhost:3000'));
}