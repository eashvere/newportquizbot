const main = require('../index.js');

module.exports = {
  name: 'captain',
  description: 'Create a new captain for the team',
  guildOnly: true,
  usage: '<@NewCaptain>',
  async execute(message, args) {
    const tournament = main.tournaments[message.channel.id];
    if (!tournament) {
      message.channel.send(`Hey! There's no tournament in this channel. .setup to start`);
    }
    await tournament.captain(message, args[0]);
  },
};
