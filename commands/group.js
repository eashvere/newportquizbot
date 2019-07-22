const main = require('../index.js');

module.exports = {
  name: 'group',
  description: 'Create a group',
  guildOnly: true,
  args: true,
  usage: '<GroupName>',
  async execute(message, args) {
    const tournament = main.tournaments[message.channel.id];
    if (!tournament) {
      message.channel.send(`Hey! There's no tournament in this channel. .setup to start`);
    }
    await tournament.group_(message, args[0]);
  },
};
