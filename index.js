const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const P = require("pino");

// 👑 BOS (LID)
const BOS = [
    "256753363103992@lid",
    "58239806894330@lid",
    "273203272392894@lid"
];

// 👥 GROUP
const GROUP_ID = "120363406336317339@g.us";

// 🔥 DAFTAR KATA YANG VALID
const COMMANDS = [
    "orang masuk jam",
    "orng masuk jam",
    "orang msuk jam",
    "orng msk jam",
    "orang mask jam"
];

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: P({ level: "silent" }),
        browser: ["Windows", "Chrome", "120"]
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "open") {
            console.log("✅ BOT CONNECTED");
        }

        if (connection === "close") {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

            if (shouldReconnect) {
                setTimeout(startBot, 3000);
            }
        }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const chatId = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        const isGroup = chatId === GROUP_ID;
        const isBos = BOS.includes(sender);

        const t = text.toLowerCase();
        const isCommand = COMMANDS.some(cmd => t.includes(cmd));

        if (isGroup && isBos && isCommand) {
            await sock.sendMessage(chatId, {
                text: "irsyad alif"
            });
        }
    });
}

startBot();