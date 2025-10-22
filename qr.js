const { makeid } = require('./gen-id');
const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("@whiskeysockets/baileys");

let router = express.Router();

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    const tempPath = './temp/' + id;

    async function GIFTED_MD_QR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState(tempPath);
        try {
            let sock = makeWASocket({
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: "silent" }),
                browser: Browsers.macOS("Desktop"),
            });

            sock.ev.on('creds.update', saveCreds);
            sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {

                if (qr && res && !res.headersSent) {
                    res.end(await QRCode.toBuffer(qr));
                }
                
                if (connection === "open") {
                    await delay(5000);
                    const credsFile = tempPath + '/creds.json';

                    try {
                        const sessionData = fs.readFileSync(credsFile, 'utf-8');
                        const base64Encoded = Buffer.from(sessionData).toString('base64');
                        const prefixedSession = "ALI-MD≈" + base64Encoded;

                        
                        await sock.sendMessage(sock.user.id, { text: prefixedSession });

            let pfp;
            try { pfp = await sock.profilePictureUrl(sock.user.id, 'image'); } 
            catch { pfp = 'https://files.catbox.moe/zauvq6.jpg'; }

            const desc = `*👋🏻 ʜᴇʏ ᴛʜᴇʀᴇ, ᴀʟɪ-ᴍᴅ ʙᴏᴛ ᴜsᴇʀ!*

*🔐 ʏᴏᴜʀ sᴇssɪᴏɴ ɪᴅ ɪs ʀᴇᴀᴅʏ!*
*⚠️ ᴅᴏ ɴᴏᴛ sʜᴀʀᴇ ᴛʜɪs ɪᴅ ᴡɪᴛʜ ᴀɴʏᴏɴᴇ.*

 *🪀 ᴄʜᴀɴɴᴇʟ:*  
*https://whatsapp.com/channel/0029VaoRxGmJpe8lgCqT1T2h*

 *🖇️ ʀᴇᴘᴏ:*
*https://github.com/ALI-INXIDE/ALI-MD*

> *© ᴘσωєʀє∂ ву αℓι м∂⎯꯭̽💀🚩*`;

            await sock.sendMessage(sock.user.id, {
              text: desc,
              contextInfo: {
                externalAdReply: {
                  title: '𝐒𝐄𝐒𝐒𝐈𝐎𝐍 𝐂𝐎𝐍𝐍𝐄𝐂𝐓 🎀',
                  thumbnailUrl: pfp,
                  sourceUrl: 'https://whatsapp.com/channel/0029VaoRxGmJpe8lgCqT1T2h',
                  mediaType: 1,
                  renderLargerThumbnail: true,
                },
              },
            });

            if (sock.newsletterFollow) await sock.newsletterFollow('120363418027651738@newsletter').catch(() => {});


                    } catch (e) {
                        console.error("Session error:", e);
                        await sock.sendMessage(sock.user.id, { text: "❌ Session creation failed." });
                    }

                    await delay(1000);
                    await sock.ws.close();
                    removeFile(tempPath);
                    console.log(`👤 ${sock.user.id} Connected ✅ Restarting process...`);
                    process.exit();
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error?.output?.statusCode != 401) {
                    await delay(10000);
                    GIFTED_MD_QR_CODE();
                }
            });
        } catch (err) {
            console.log("Service restarted:", err);
            removeFile(tempPath);
            if (res && !res.headersSent) res.send({ code: "❗ Service Unavailable" });
        }
    }

    await GIFTED_MD_QR_CODE();
});

module.exports = router;
