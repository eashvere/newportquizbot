const main = require('../index.js');

module.exports = {
  name: 'score',
  description: 'Get your score and your team score',
  guildOnly: true,
  async execute(message, args) {
    const tournament = main.tournaments[message.channel.id];
    if (!tournament) {
      message.channel.send(`Hey! There's no tournament in this channel. .setup to start`);
    }
    await tournament.score(message);
  },
};
