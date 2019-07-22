const index = require('../index.js');

module.exports = {
  name: 'skip',
  aliases: ['s', 'skip', 'Skip', 'S'],
  description: 'How you should skip a question',
  prompt: true,
  execute(message, args) {
    const skipEventName = 'skip' + message.channel.id;
    index.events.emit(skipEventName, message);
  },
};
