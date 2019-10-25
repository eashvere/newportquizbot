import {Tournament} from '../functions/tournament.js';
import {groupVote} from '../functions/voting.js';
const main = require('../index.js');

module.exports = {
  name: 'setup',
  description: 'setup a Tournament for your channel',
  guildOnly: true,
  async execute(message) {
    if (Object.keys(main.tournaments).includes(message.channel.id)) {
      await message.channel.send(`WAIT! There's already a tournament in this channel`);
      const voteResult = await groupVote(message.channel, 'Should we destroy our current Tournament and remake it');
      if (!voteResult) {
        await message.channel.send(`Keeping...`);
        return;
      } else {
        await message.channel.send(`Destroying...`);
      }
    }
    const tournament = new Tournament(message.channel);
    main.tournaments[message.channel.id] = tournament;
    await message.channel.send(`Creating a Tournament`);
  },
};
