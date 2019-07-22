const main = require('../index.js');

module.exports = {
  name: 'tournament',
  description: 'Start a tournament',
  guildOnly: true,
  usage: '<Team1> <Team2> <Team3> ...',
  async execute(message, args) {
    const tournament = main.tournaments[message.channel.id];
    if (!tournament) {
      message.channel.send(`Hey! There's no tournament in this channel. .setup to start`);
    }
    await tournament.tournament(message, args);
  },
};
