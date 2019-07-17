import {groupVote} from '../functions/voting.js';

module.exports = {
  name: 'vote',
  aliases: ['v'],
  description: 'Vote on a thing',
  usage: '<thing to vote>',
  cooldown: 5,
  args: true,
  async execute(msg, args) {
    const vote = await groupVote(msg.channel, args.join(' '));
    if (vote) {
      msg.channel.send(`The group has decided. We're doin it`);
    } else {
      msg.channel.send(`The group has decided. We're NOT doing it`);
    }
  },
};
