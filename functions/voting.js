import {RichEmbed} from 'discord.js';

export const groupVote = (channel, msg) => {
  return new Promise(async function(resolve, reject) {
    const voteEmbed = new RichEmbed()
        .setTitle('Vote')
        .setDescription(msg);

    const voteMessage = await channel.send(voteEmbed);
    const votingFilter = (reaction) => {
      return ['❤', '👎'].includes(reaction.emoji.name);
    };
    try {
      await voteMessage.react('❤');
      await voteMessage.react('👎');
    } catch (error) {
      reject(error);
    }
    const results = await voteMessage.awaitReactions(votingFilter, {time: 10000});

    const resultsEmbed = new RichEmbed()
        .setTitle('Vote Results')
        .setDescription(`Results of the Vote: ${msg}`)
        .addField(`❤:`, `${results.get('❤').count-1} Votes`)
        .addField(`👎:`, `${results.get('👎').count-1} Votes`);

    channel.send(resultsEmbed);
    voteMessage.delete(0);
    resolve(results.get('❤').count-1 > results.get('👎').count-1);
  });
};
