const mineflayer = require('mineflayer');
const navigatePlugin = require('mineflayer-navigate')(mineflayer);
const config = require('./config.json')
require('./server.js');

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

  bot.on('messagestr', (message) => {
    if (message.includes('Use the command /login <password>')) {
      bot.chat(`/login ${config.auth_password}`);
    }
  });

  bot.on('chat', (username, message) => {
    if (message === '*dupe') {
      setTimeout(() => {
        findNearestDonkey();
      }, 1000);
    } else if (message === '*tpa') {
        bot.chat(`/tpa ${config.admin}`);
    } else if (message === '*dismount') {
      bot.dismount();
    } else if (message === '*kill') {
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

        setTimeout(() => {
          bot.quit();
        }, 500);
        setTimeout(() => {
          createBot(username);
        }, 5 * 1000);
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
        }, 1 * 1000);
      });
    }
  });
}

createBot(config.username);
