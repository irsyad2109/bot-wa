const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const P = require("pino");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: P({ level: "silent" })
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection }) => {
        if (connection === "open") {
            console.log("✅ BOT CONNECTED");
        }
    });

    // 🔥 TAMPILKAN SEMUA PESAN MASUK
    sock.ev.on("messages.upsert", ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const chatId = msg.key.remoteJid; // ID grup / chat
        const sender = msg.key.participant || msg.key.remoteJid; // pengirim

        const senderNumber = sender.replace(/[^0-9]/g, ""); // ambil angka saja

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        console.log("=================================");
        console.log("📌 ID GRUP           :", chatId);
        console.log("👤 ID BOS / PENGIRIM :", sender);
        console.log("📱 NO PENGIRIM       :", senderNumber);
        console.log("💬 PESAN             :", text);
        console.log("=================================");
    });
}

startBot();