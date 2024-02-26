const mineflayer = require('mineflayer');
const navigatePlugin = require('mineflayer-navigate')(mineflayer);
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

function createBot(username) {
  const bot = mineflayer.createBot({
    host: config.host,
    username: config.username,
    auth: config.auth,
    port: config.port,
    version: config.version
  });

  navigatePlugin(bot);

  let isRidingDonkey = false;
  let donkeyEntity = null;

  bot.on('kicked', console.log)
  bot.on('error', console.log)

  bot.on("message", (message) => {
      console.log(message.toAnsi());
    });
  
  bot.on('messagestr', (message) => {
      var pass = process.env.auth_password;
      const admins = config.admin;
      const spaceIndex = message.indexOf(" ");
      if (spaceIndex === -1) return;

      if (message.includes('Use the command /register <password> <password>.')) {
        bot.chat(`/register ${pass} ${pass}`);
      }
      if (message.includes('Use the command /login <password>.')) {
        bot.chat(`/login ${pass}`);
      }
      if (admins.some(admin => message.includes(`${admin} Whispers: *dupe`))) {
          setTimeout(() => {
            findNearestDonkey();
          }, 500);
      }
    if (admins.some(admin => message.includes(`${admin} Whispers: *tpa`))) {
        requestingAdmin = message.split(" ")[0]; 
        bot.chat(`/tpa ${requestingAdmin}`); 
    } else if (message.includes('[8b8t] You must be 20000 blocks from spawn to use /tpa')) {
        if (requestingAdmin) {
            bot.chat(`/w ${requestingAdmin} Your bot must be 20000 blocks from spawn to use /tpa`);
            requestingAdmin = null;
        }
    }
      if (admins.some(admin => message.includes(`${admin} Whispers: *dismount`))) {
        bot.dismount();
      }
      if (admins.some(admin => message.includes(`${admin} Whispers: *kill`))) {
        bot.chat('/kill');
      }
  });
  
  function findNearestDonkey() {
      const donkey = bot.nearestEntity((entity) => entity.mobType === 'Donkey');

      if (donkey) {
          bot.navigate.to(donkey.position);
          bot.navigate.on('arrived', () => {
              bot.mount(donkey);
              isRidingDonkey = true;
              donkeyEntity = donkey;

            bot.once('mount', () => {
              bot.quit();
                setTimeout(() => {
                  createBot(username);
                }, 1);
              });
          });
      } else {
          bot.chat(`I can't find a donkey`);
      }
  }

  bot.on('spawn', () => {
    if (isRidingDonkey) {
      isRidingDonkey = true;
      donkeyEntity = donkey;
    } else {
      let mountTimeout;

      bot.on('mount', () => {
        clearTimeout(mountTimeout);
        mountTimeout = setTimeout(() => {
          bot.dismount();
        }, 1);
      });
    }
  });
}

createBot(config.username);
