import {kickMember} from '../functions/mainten.js';

module.exports = {
  name: 'kick',
  aliases: ['kick'],
  description: 'This will kill a Member of the Guild given that they have ',
  cooldown: 100,
  guildOnly: true,
  args: true,
  execute(msg, args) {
    const member = msg.mentions.members.first();
    kickMember(msg, member);
  },
};
