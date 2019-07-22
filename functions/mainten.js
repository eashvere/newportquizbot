const index = require('../index.js');

/**
 * Handle Kicking a member. Must be a mod!
 * @param   {Message} msg What was sent by the person
 * @param   {GuildMember} member The person that is being kicked
 *
 * @return {any} the member kicked
 */
export async function kickMember(msg, member) {
  const sender = msg.member;
  if (sender.highestRole.calculatedPosition < 2) {
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

/**
 * @param  {String} event The event string
 * @param  {Channel} channel The channel the command was called
 */
export async function removeCommandListener(event, channel) {
  const eventName = event + channel.id;
  if (index.events.listeners(eventName).length > 0) {
    index.events.removeAllListeners(eventName);
  }
}
/** Timer Class that replaces setTimeout */
export class Timer {
  /**
 *
 * @param {Function} callback The callback after the run
 * @param {Integer} delay The delay in milliseconds
 */
  constructor(callback, delay) {
    let timerId;
    let start;
    let remaining = delay;
    this.pause = function() {
      clearTimeout(timerId);
      remaining -= Date.now() - start;
    };
    this.resume = function() {
      start = Date.now();
      clearTimeout(timerId);
      timerId = setTimeout(callback, remaining);
    };
    this.destroy = function() {
      clearTimeout(timerId);
    };
    this.resume();
  }
}

