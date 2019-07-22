import {Tournament} from '../commands/tournament.js';
import {groupVote} from '../functions/voting.js';
const main = require('../index.js');

module.exports = {
  name: 'setup',
  description: 'setup a Tournament for your channel',
  guildOnly: true,
  async execute(message) {
    if (Object.keys(main.tournaments).includes(message.channel.id)) {
      await message.channel.send(`WAIT! There's already a tournament in this channel`);
      if (!groupVote(message.channel, 'Should we destroy our current Tournament and remake it')) {
        await message.channel.send(`Keeping...`);
        return;
      } else {
        await message.channel.send(`Destroying...`);
      }
    }
    tournament = new Tournament(message.channel);
    main.tournament[message.channel.id] = tournament;
  },
};
