const main = require('../index.js');

module.exports = {
  name: 'leaderboard',
  aliases: ['leaderboard'],
  description: 'Get your personal score on this DM or Guild',
  cooldown: 5,
  async execute(message, args) {
    const locationid = message.guild.id;
    if (!locationid) {
      locationid = message.channel.id;
    }
    let listofPeople = await main.keyv.get(locationid);
    listofPeople = listofPeople.split(',');
    listofPeople.shift(); // extra index at the start to remove
    const leaderboard = [];
    for (const person of listofPeople) {
      leaderboard.push([person.split(':')[1], await main.keyv.get(person)]);
    }

    leaderboard.sort((first, second) => second[1] - first[1]);

    let leaderString = '';
    for (const entry of leaderboard) {
      leaderString += `:small_blue_diamond: ${entry[0]}: ${entry[1]} points\n`;
    }

    message.channel.send(leaderString);
  },
};
