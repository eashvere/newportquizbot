import {readBonus, checksBeforeKeyvScoring} from '../functions/reading.js';
const main = require('../index.js');

module.exports = {
  name: 'bonus',
  aliases: ['b', 'bonus'],
  description: 'Get a Bonus Question',
  usage: 'optional <boolean VoiceOn>',
  cooldown: 5,
  async execute(msg, args) {
    let voiceOn = args[0];
    let voiceChannel;

    if (msg.channel.type === 'dm' || msg.channel.type === 'group') {
      voiceOn = false;
    }

    if (voiceOn) {
      voiceOn = true;
      if (!msg.member.voiceChannel) {
        await msg.reply(`Because you didn't join a voice channel, I can't talk to you!. Join it and .b ! Or ask for a text question`);
        return;
      }
      voiceChannel = msg.member.voiceChannel;
    }

    readBonus(msg.channel, [msg.author.id], voiceOn, voiceChannel).then(async (bonusCorrects) => {
      for (const user of bonusCorrects) {
        const [userid, currentValue] = await checksBeforeKeyvScoring(user);
        await main.keyv.set(userid, currentValue + 10);
      }
    });
  },
};
