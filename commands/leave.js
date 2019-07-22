const main = require('../index.js');

module.exports = {
  name: 'leave',
  description: 'Leave a team',
  guildOnly: true,
  usage: 'optional <TeamName>',
  async execute(message, args) {
    const tournament = main.tournaments[message.channel.id];
    if (!tournament) {
      message.channel.send(`Hey! There's no tournament in this channel. .setup to start`);
    }
    await tournament.leave(message, args[0]);
  },
};
