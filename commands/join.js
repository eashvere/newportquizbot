const main = require('../index.js');

module.exports = {
  name: 'join',
  description: 'Join a team',
  guildOnly: true,
  args: true,
  usage: '<TeamName>',
  async execute(message, args) {
    const tournament = main.tournaments[message.channel.id];
    if (!tournament) {
      message.channel.send(`Hey! There's no tournament in this channel. .setup to start`);
    }
    await tournament.join(message, args[0]);
  },
};
