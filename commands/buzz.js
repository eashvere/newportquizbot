/**
 * At some point this file will be useless. In reality, buzzing shoulded be a command and should integrated into .t.
 * There should be some type of .awaitMessages, but I'm not smart enough, so this is the workaround.
 */

const index = require('../index.js');

module.exports = {
  name: 'buzz',
  aliases: ['b', 'buzz'],
  description: 'How you should buzz',
  execute(message, args) {
    index.events.emit('buzz', message);
  },
};
