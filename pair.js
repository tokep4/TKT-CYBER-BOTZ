const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const { default: makeWASocket, useMultiFileAuthState, delay, Browsers, makeCacheableSignalKeyStore, DisconnectReason } = require('@whiskeysockets/baileys');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function MUZAMMIL_MD_PAIR_CODE() {
        // Galti yahan thi (./temp/' + id)
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            var items = ["Safari"];
            function selectRandomItem(array) {
                var randomIndex = Math.floor(Math.random() * array.length);
                return array[randomIndex];
            }
            var randomItem = selectRandomItem(items);
            
            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.macOS(randomItem)
            });

            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            sock.ev.on('creds.update', saveCreds);
            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                
                if (connection === "open") {
                    await delay(5000);
                    // Galti yahan bhi thi ('/temp/' + id)
                    let rf = __dirname + `/temp/${id}/creds.json`;

                    try {
                        // Read the creds.json file
                        const sessionData = fs.readFileSync(rf, 'utf-8');
                        // Encode the session data to Base64
                        const base64Encoded = Buffer.from(sessionData).toString('base64');
                        // Add the prefix
                        const prefixedSession = "TKT-CYBER~" + base64Encoded;
                        
                        // Send the prefixed Base64 session string to the user
                        let message = `*✅ APKA BASE64 SESSION ID TAYAR HAI ✅*\n\nNeechay diye gaye code ko copy karke apne bot ke SESSION_ID mein paste kar dein.\n\n*Developer:TAFADZWA-TKT*`;
                        await sock.sendMessage(sock.user.id, { text: message });
                        await sock.sendMessage(sock.user.id, { text: prefixedSession });

                        let desc = `*┏━━━━━━━━━━━━━━*
*┃TKT-CYBER-XMD-V3 SESSION IS*
*┃SUCCESSFULLY*
*┃CONNECTED ✅🔥*
*┗━━━━━━━━━━━━━━━*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❶ || Creator = *TKT-TECH🇿🇼*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❷ || https://whatsapp.com/channel/0029Vb5vbMM0LKZJi9k4ED1a
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❸ || Owner =* https://wa.me/+263718095555?text=HEY+TKT-CYBER-BOTZ+OWNER
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❹ || Repo =* https://github.com/tkttech/TKT-CYBER-XMD-V3
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*💙ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴛᴀꜰᴀᴅᴢᴡᴀ-ᴛᴋᴛ💛*`; 
                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "TKT-CYBER-BOTZ🇿🇼",
                                    thumbnailUrl: "https://files.catbox.moe/d622xc.png",
                                    sourceUrl: "https://whatsapp.com/channel/0029Vb5vbMM0LKZJi9k4ED1a",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }  
                            }
                        });
                        await sock.newsletterFollow("120363418027651738@newsletter");
                        
                    } catch (e) {
                        console.error("Session banane mein galti hui:", e);
                        await sock.sendMessage(sock.user.id, { text: "❌ Session banane mein koi error aagaya." });
                    }

                    await delay(1000);
                    await sock.ws.close();
                    // Galti yahan bhi thi ('./temp/' + id)
                    await removeFile('./temp/' + id);
                    console.log(`👤 ${sock.user.id} 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 ✅ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶נג 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...`);
                    await delay(10);
                    process.exit();
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    MUZAMMIL_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restated");
            // Galti yahan bhi thi ('./temp/' + id)
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "❗ Service Unavailable" });
            }
        }
    }
    return await MUZAMMIL_MD_PAIR_CODE();
});

module.exports = router;