import {RichEmbed} from 'discord.js';

export const groupVote = (channel, msg) => {
  return new Promise(async function(resolve, reject) {
    const voteEmbed = new RichEmbed()
        .setTitle('Vote')
        .setDescription(msg);

    const voteMessage = await channel.send(voteEmbed);
    await voteMessage.react('❤');
    await voteMessage.react('👎');

    const votingFilter = (reaction) => reaction.emoji.name === `❤` || reaction.emoji.name === `👎`;

    const results = await voteMessage.awaitReactions(votingFilter, {time: 10000});

    const yes = results.get(`❤`) ? results.get(`❤`).count-1 : 0;
    const no = results.get(`👎`) ? results.get(`👎`).count-1 : 0;

    const resultsEmbed = new RichEmbed()
        .setTitle('Vote Results')
        .setDescription(`Results of the Vote: ${msg}`)
        .addField(`❤:`, `${yes} Votes`)
        .addField(`👎:`, `${no} Votes`);

    channel.send(resultsEmbed);
    voteMessage.delete(0);
    resolve(yes > no);
  });
};
