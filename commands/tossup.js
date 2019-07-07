import {readTossup} from '../functions/reading.js';
import {findBestMatch} from 'string-similarity';
import {categories, aliases} from '../index.js';

module.exports = {
  name: 'tossup',
  aliases: ['t', 'q', 'tossup'],
  description: 'Get a Tossup Question',
  usage: '<category>',
  cooldown: 5,
  async execute(msg, args) {
    let category = args[0];
    let text = args[1];
    let voiceChannel;

    if (msg.channel.type === 'dm' || msg.channel.type === 'group') {
      text = true;
    }

    if (!text) {
      text = false;
      if (!msg.member.voiceChannel) {
        await msg.reply(`Because you didn't join a voice channel, I can't talk to you!. Join it and .t ! Or ask for a text question`);
        return;
      }
      voiceChannel = msg.member.voiceChannel;
    }

    if (category) {
      const res = findBestMatch(category, categories.concat(Object.keys(aliases)));
      if (res.bestMatch.rating > 0.6) {
        category = res.bestMatch.target;
      } else {
        await msg.reply(`I'm sorry I don't understand your category. Try typing it out fully. You can check all the categories using .c`);
        return;
      }
      if (category in aliases) {
        category = aliases[category];
      }
      console.log(`${msg.author.username} ordered a Tossup of type ${category}`);
    } else {
      console.log(`${msg.author.username} ordered a random Tossup`);
    }

    await readTossup(msg.client, msg.channel, category=category, text=text, voiceChannel=voiceChannel);
  },
};
