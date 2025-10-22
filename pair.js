const express = require('express');
const fs = require('fs');
const path = require('path');
const pino = require('pino');
const { makeid } = require('./gen-id');
const { Boom } = require('@hapi/boom');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  delay,
  Browsers,
  makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');

const router = express.Router();

function removeFile(FilePath) {
  try {
    if (fs.existsSync(FilePath)) fs.rmSync(FilePath, { recursive: true, force: true });
  } catch (e) {
    console.log('⚠️ Cleanup error:', e.message);
  }
}

router.get('/', async (req, res) => {
  const id = makeid();
  const tempPath = path.join(__dirname, 'temp', id);
  let num = req.query.number;

  async function MUZAMMIL_MD_PAIR_CODE() {
    const { state, saveCreds } = await useMultiFileAuthState(tempPath);
    try {
      const browsers = ['Safari', 'Chrome', 'Firefox'];
      const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];

      const sock = makeWASocket({
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' }))
        },
        printQRInTerminal: false,
        generateHighQualityLinkPreview: true,
        logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
        syncFullHistory: false,
        browser: Browsers.macOS(randomBrowser),
      });

      if (!sock.authState.creds.registered) {
        await delay(1500);
        num = num.replace(/[^0-9]/g, '');
        const code = await sock.requestPairingCode(num);
        if (!res.headersSent) await res.send({ code });
      }

      sock.ev.on('creds.update', saveCreds);

      sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
        if (connection === 'open') {
          await delay(5000);
          const credsFile = path.join(tempPath, 'creds.json');

          try {
            const sessionData = fs.readFileSync(credsFile, 'utf-8');
            const base64Encoded = Buffer.from(sessionData).toString('base64');
            const prefixedSession = 'ALI-MD≈' + base64Encoded;

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
            console.error('❌ Session creation error:', e);
            await sock.sendMessage(sock.user.id, { text: '❌ Session creation failed.' });
          }

          await delay(2000);
          await sock.ws.close();
          removeFile(tempPath);
          console.log(`👤 ${sock.user.id} Connected ✅ Restarting process...`);
          setTimeout(() => process.exit(0), 1500);
        } else if (
          connection === 'close' &&
          lastDisconnect &&
          new Boom(lastDisconnect.error)?.output?.statusCode !== 401
        ) {
          await delay(10000);
          MUZAMMIL_MD_PAIR_CODE();
        }
      });
    } catch (err) {
      console.log('Service restarted:', err);
      removeFile(tempPath);
      if (!res.headersSent) await res.send({ code: '❗ Service Unavailable' });
    }
  }

  return await MUZAMMIL_MD_PAIR_CODE();
});

module.exports = router;
