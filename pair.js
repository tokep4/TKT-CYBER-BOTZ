const express = require('express');
const fs = require('fs');
const path = require('path');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const { spawn } = require('child_process');
const zlib = require('zlib'); // <- gzip ke liye
const {
  default: makeWASocket,
  useMultiFileAuthState,
  delay,
  Browsers,
  makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');
const { makeid } = require('./gen-id');

const router = express.Router();
const TEMP_DIR = path.join(__dirname, 'temp');

// 🔧 Ensure directories exist
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

function removeFile(dirPath) {
  try {
    if (fs.existsSync(dirPath)) fs.rmSync(dirPath, { recursive: true, force: true });
  } catch (e) {
    console.log('⚠️ Cleanup Error:', e.message);
  }
}

router.get('/', async (req, res) => {
  const id = makeid();
  const sessionPath = path.join(TEMP_DIR, id);
  const number = (req.query.number || '').replace(/[^0-9]/g, '');

  if (!number) return res.status(400).send({ error: '❌ Number parameter missing!' });

  async function startPairing() {
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    try {
      const browsers = ['Safari', 'Chrome', 'Firefox', 'Opera']; 
      const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];

      const sock = makeWASocket({
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
        },
        printQRInTerminal: false,
        browser: Browsers.macOS(randomBrowser),
        syncFullHistory: false,
        logger: pino({ level: 'silent' }),
        generateHighQualityLinkPreview: true,
      });

      if (!sock.authState.creds.registered) {
        await delay(1000);
        const code = await sock.requestPairingCode(number);
        if (!res.headersSent) res.send({ code });
      }

      sock.ev.on('creds.update', saveCreds);

      sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
        if (connection === 'open') {
          await delay(3000);
          const credsFile = path.join(sessionPath, 'creds.json');

          try {
            const credsData = fs.readFileSync(credsFile, 'utf-8');

            // 🔥 GZIP + Base64
            const compressed = zlib.gzipSync(credsData);
            const base64Session = 'ALI-MD≈' + compressed.toString('base64');

            let pfp;
            try {
              pfp = await sock.profilePictureUrl(sock.user.id, 'image');
            } catch {
              pfp = 'https://files.catbox.moe/zauvq6.jpg';
            }

            const caption = `*👋🏻 ʜᴇʏ ᴛʜᴇʀᴇ, ᴀʟɪ-ᴍᴅ ʙᴏᴛ ᴜsᴇʀ!*

*🔐 ʏᴏᴜʀ sᴇssɪᴏɴ ɪᴅ ɪs ʀᴇᴀᴅʏ!*
*⚠️ ᴅᴏ ɴᴏᴛ sʜᴀʀᴇ ᴛʜɪs ɪᴅ ᴡɪᴛʜ ᴀɴʏᴏɴᴇ.*

 *🪀 ᴄʜᴀɴɴᴇʟ:*  
*https://whatsapp.com/channel/0029VaoRxGmJpe8lgCqT1T2h*

 *🖇️ ʀᴇᴘᴏ:*
*https://github.com/ALI-INXIDE/ALI-MD*

> *© ᴘσωєʀє∂ ву αℓι м∂⎯꯭̽💀🚩*`;

            await sock.sendMessage(sock.user.id, { text: base64Session });
            await delay(500);
            await sock.sendMessage(sock.user.id, {
              text: caption,
              contextInfo: {
                externalAdReply: {
                  title: '🎀 ALI-MD Session Connected!',
                  thumbnailUrl: pfp,
                  sourceUrl: 'https://whatsapp.com/channel/0029VaoRxGmJpe8lgCqT1T2h',
                  mediaType: 1,
                  renderLargerThumbnail: true
                }
              }
            });

          } catch (e) {
            console.error('❌ Error saving session:', e);
          }

          await delay(1500);
          sock.ws.close();
          removeFile(sessionPath);
          console.log(`✅ ${sock.user.id} Session Generated!`);
          setTimeout(() => process.exit(0), 1500);
        }

        if (connection === 'close') {
          const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
          console.log('⚠️ Connection closed, reason:', reason);
          if (reason !== 401) {
            await delay(5000);
            startPairing();
          }
        }
      });

    } catch (err) {
      console.log('❌ Pairing Failed:', err.message);
      removeFile(sessionPath);
      if (!res.headersSent) res.send({ code: '❗ Error generating pairing code.' });
    }
  }

  return await startPairing();
});

module.exports = router;
