const mineflayer = require('mineflayer');
const navigatePlugin = require('mineflayer-navigate')(mineflayer);
const config = require('./config.json')
const mcData = require('minecraft-data')(config.version);
require('./keep_alive.js');

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
    var pass = config.auth_password
    if (message.includes('Use the command /register <password> <password>.')) {
      bot.chat(`/register ${pass} ${pass}`);
    }
    if (message.includes('Use the command /login <password>.')) {
      bot.chat(`/login ${pass}`);
    }
  });

  bot.on('chat', (username, message) => {
    const admins = Array.isArray(config.admin) ? config.admin : [config.admin];

    if (message === '*tpa' && admins.includes(username)) {
      bot.chat(`/tpa 0_Ngocc`); 
    } else if (message === '*dismount' && admins.includes(username)) {
      bot.dismount();
    } else if (message === '*kill' && admins.includes(username)) {
      bot.chat('/kill');
    }
  });
 
bot.on("messagestr", (message) => {
    var admins = config.admin;
    if (admins.some(admin => message.includes(`${admin} Whispers: *dupe`))) {
      setTimeout(() => {
        findNearestDonkey();
      }, 500);
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

        setTimeout(() => {
          bot.quit();
        }, 100);
        setTimeout(() => {
          createBot(username);
        }, 100);
      });
    } else {
      bot.chat(`I can't find donkey`);
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
        }, 100);
      });
    }
  });
}

createBot(config.username);
