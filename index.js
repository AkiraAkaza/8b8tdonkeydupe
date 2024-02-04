const mineflayer = require('mineflayer');
const navigatePlugin = require('mineflayer-navigate')(mineflayer);
require('./server.js');

function createBot(username) {
  const bot = mineflayer.createBot({
    host: '8b8t.me',
    username: '0_Chiharu',
    auth: 'offline',
    port: 25565,
    version: '1.17.1'
  });

  navigatePlugin(bot);

  let isRidingDonkey = false;
  let donkeyEntity = null;

  bot.on('messagestr', (message) => {
    if (message.includes('Use the command /login <password>')) {
      bot.chat(`/login ${process.env.pass}`);
    }
  });

  bot.on('chat', (username, message) => {
    if (message === '*dupe') {
      setTimeout(() => {
        findNearestDonkey();
      }, 1000);
    } else if (message === '*tpa') {
      setTimeout(() => {
        bot.chat('/tpa 0_Ngocc');
      }, 500);
    } else if (message === '*dm') {
      if (isRidingDonkey) {
        bot.dismount();
        isRidingDonkey = false;
      } else {
        bot.chat('/home 1');
      }
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
      bot.chat('Không tìm thấy Donkey.');
    }
  }

  bot.on('spawn', () => {
    if (isRidingDonkey) {
      bot.dismount();
      isRidingDonkey = false;
    } else {
      bot.chat('/home 1');
    }
  });
}

createBot('0_Chiharu');
