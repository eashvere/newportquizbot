const main = require('../index.js');

module.exports = {
  name: 'overall',
  aliases: ['overall'],
  description: 'Get your personal score on this DM or Guild',
  cooldown: 5,
  async execute(message, args) {
    let locationid;
    try {
      locationid = message.guild.id;
    } catch (error) {
      if (!locationid) {
        locationid = message.channel.id;
      }
    }
    const userid = locationid + ':' + message.author.username + ':' + message.author.id;
    if (userid) {
      const score = await main.keyv.get(userid);
      message.channel.send(`Hey ${message.author.username}, You've racked up ${score} points`);
    } else {
      message.channel.send(`I can't find you, but you can play to start flexin!`);
    }
  },
};
