const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const { default: makeWASocket, useMultiFileAuthState, delay, Browsers, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys')

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}
router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    async function ANAYAT-AI_PAIR_CODE() {
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
                
                if (connection == "open") {
                    await delay(5000);
                    let rf = __dirname + `/temp/${id}/creds.json`;
                    
                    function generateRandomText() {
                        const prefix = "3EB";
                        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        let randomText = prefix;
                        for (let i = prefix.length; i < 22; i++) {
                            const randomIndex = Math.floor(Math.random() * characters.length);
                            randomText += characters.charAt(randomIndex);
                        }
                        return randomText;
                    }
                    const randomText = generateRandomText();
                    try {
                        // 🔹 Base64 system instead of Mega
                        const fileBuffer = fs.readFileSync(rf);
                        const base64Data = fileBuffer.toString('base64');
                        let md = "TKT-CYBER~" + base64Data;
                        
                        let code = await sock.sendMessage(sock.user.id, { text: md });
                        
                        await sock.newsletterFollow("120363418027651738@newsletter");
                        await sock.newsletterUnmute("120363418027651738@newsletter");
                        await sock.newsletterFollow("120363418027651738@newsletter");
                        await sock.newsletterUnmute("120363418027651738@newsletter");   
                        await sock.newsletterFollow("120363418027651738@newsletter");             
                        
                        let desc = `*┏━━━━━━━━━━━━━━*
*┃TKT-CYBER-XMD-V3 SESSION IS*
*┃SUCCESSFULLY*
*┃CONNECTED ✅🔥*
*┗━━━━━━━━━━━━━━━*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❶ || Creator = TAFADZWA-TKT💨🤍*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❷ || WhatsApp Channel =* Maximum : https://whatsapp.com/channel/0029Vb5vbMM0LKZJi9k4ED1a
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❸ || Owner =* TKT-TECH🇿🇼
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❹ || Repo =* https://github.com/tkttech/TKT-CYBER-XMD-V3
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*POWERD BY TKT-TECH🇿🇼*`; 
                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "TKT-CYBER-TECH",
                                    thumbnailUrl: "https://files.catbox.moe/d622xc.png",
                                    sourceUrl: "https://whatsapp.com/channel/0029Vb5vbMM0LKZJi9k4ED1a",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }  
                            }
                        },
                        { quoted:code })
                    } catch (e) {
                        let ddd = sock.sendMessage(sock.user.id, { text: e });
                        let desc = `*┏━━━━━━━━━━━━━━*
*┃TKT-CYBER-XMD-V3 SESSION IS*
*┃SUCCESSFULLY*
*┃CONNECTED ✅🔥*
*┗━━━━━━━━━━━━━━━*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❶ || Creator = TAFADZWA-TKT👨🏻‍💻*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❷ || WhatsApp Channel =* https://whatsapp.com/channel/0029Vb5vbMM0LKZJi9k4ED1a
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❸ || Owner =* TKT-TECH🇿🇼
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❹ || Repo =* https://github.com/tkttech/TKT-CYBER-XMD-V3
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*POWERD BY TKT-TECH🇿🇼*`;
                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "TKT-CYBER-TECH",
                                    thumbnailUrl: "https://files.catbox.moe/d622xc.png",
                                    sourceUrl: "https://whatsapp.com/channel/0029Vb5vbMM0LKZJi9k4ED1a",
                                    mediaType: 2,
                                    renderLargerThumbnail: true,
                                    showAdAttribution: true
                                }  
                            }
                        },
                        { quoted:ddd })
                    }
                    await delay(10);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`👤 ${sock.user.id} 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 ✅ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...`);
                    await delay(10);
                    process.exit();
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10);
                    ANAYAT-AI_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restated");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "❗ Service Unavailable" });
            }
        }
    }
   return await ANAYAT-AI_PAIR_CODE();
});
module.exports = router;
                    
