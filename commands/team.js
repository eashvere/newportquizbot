const main = require('../index.js');

module.exports = {
  name: 'team',
  description: 'Create a new team',
  guildOnly: true,
  args: true,
  usage: '<TeamName>',
  async execute(message, args) {
    const tournament = main.tournaments[message.channel.id];
    if (!tournament) {
      message.channel.send(`Hey! There's no tournament in this channel. .setup to start`);
    }
    await tournament.team_(message, args[0]);
  },
};
