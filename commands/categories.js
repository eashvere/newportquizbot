const main = require('../index.js');

module.exports = {
  name: 'categories',
  aliases: ['c', 'categories'],
  description: 'Information about the categories.',
  cooldown: 5,
  args: false,
  execute(message, args) {
    message.channel.send(main.categories + '\n' + Object.keys(main.aliases));
  },
};
