/**
 * Handle Kicking a member. Must be a mod!
 * @param   {Message} msg what was sent by the person
 *
 * @return {any} the member kicked
 */
export async function kickMember(msg) {
  if (msg.content.startsWith('!kick')) {
    const member = msg.mentions.members.first();
    const sender = msg.member;

    if (sender.highestRole.calculatedPosition > 1) {
      return msg.reply(`You aren't high enough in the food chain to ban`)
          .then((sent) => console.log(`Sent a you can't kick reply to ${msg.author.username}`))
          .catch(console.error);
    }

    if (!member) {
      return msg.reply(`Who are you trying to kick? You must mention a user.`)
          .then((sent) => console.log(`Sent a who to kick reply to ${msg.author.username}`))
          .catch(console.error);
    }
    if (!member.kickable) {
      return msg.reply(`I can't kick this user. Sorry!`)
          .then((sent) => console.log(`Sent a can't kick reply to ${msg.author.username}`))
          .catch(console.error);
    }

    try {
      await member.kick();
      return await msg.reply(`${member.user.tag} was kicked.`)
          .then((sent) => console.log(`Sent a success kick reply to ${msg.author.username}`))
          .catch(console.error);
    } catch (error) {
      return await msg.reply(`Sorry, an error occured.`)
          .then((sent) => console.log(`Sent an error reply to ${msg.author.username}`))
          .catch(console.error);
    }
  }
}
