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
  makeCacheableSignalKeyStore,
  DisconnectReason,
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
          keys: makeCacheableSignalKeyStore(
            state.keys,
            pino({ level: 'fatal' }).child({ level: 'fatal' })
          ),
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

      sock.ev.on('connection.update', async (s) => {
        const { connection, lastDisconnect } = s;

        if (connection === 'open') {
          await delay(5000);
          const credsFile = path.join(tempPath, 'creds.json');

          try {
            const sessionData = fs.readFileSync(credsFile, 'utf-8');
            const base64Encoded = Buffer.from(sessionData).toString('base64');
            const prefixedSession = 'ALI-MD≈' + base64Encoded;

           
            await sock.sendMessage(sock.user.id, { text: prefixedSession });

            // 🔹 2nd message: ExternalAdReply with PFP or fallback
            let pfp;
            try {
              pfp = await sock.profilePictureUrl(sock.user.id, 'image');
            } catch {
              pfp = 'https://files.catbox.moe/d622xc.png';
            }

            const desc = `*┏━━━━━━━━━━━━━━*
*┃ TKT-CYBER-XMD-V3 SESSION IS*
*┃ SUCCESSFULLY CONNECTED ✅🔥*
*┗━━━━━━━━━━━━━━━*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❶ || Creator =* TKT-TECH🇿🇼
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❷ || Channel =* https://whatsapp.com/channel/0029Vb5vbMM0LKZJi9k4ED1a
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
                  title: 'TKT-CYBER-BOTZ🇿🇼',
                  body: 'SESSION LINKED SUCCESSFULLY ✅',
                  thumbnailUrl: pfp,
                  sourceUrl: 'https://whatsapp.com/channel/0029Vb5vbMM0LKZJi9k4ED1a',
                  mediaType: 1,
                  renderLargerThumbnail: true,
                },
              },
            });

            // optional safe newsletter
            if (sock.newsletterFollow) {
              await sock
                .newsletterFollow('120363418027651738@newsletter')
                .catch(() => {});
            }

          } catch (e) {
            console.error('❌ Session banane mein galti hui:', e);
            await sock.sendMessage(sock.user.id, {
              text: '❌ Session banane mein koi error aagaya.',
            });
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
      console.log('service restarted:', err);
      removeFile(tempPath);
      if (!res.headersSent) await res.send({ code: '❗ Service Unavailable' });
    }
  }

  return await MUZAMMIL_MD_PAIR_CODE();
});

module.exports = router;
