import {kickMember} from '../functions/mainten.js';
import {readQuestion} from '../functions/reading.js';
const config = require('../config.json');

/**
 * Handle the message event
 * @param   {any} client The Discord client
 * @param   {Message} msg what was sent by the person
 *
 */
export default async function message(client, msg) {
  if (msg.author.bot) return;

  if (msg.content.startsWith('!prefix')) {
    msg.reply('***My Prefix is: ' + config.prefix + '!***')
        .then((sent) => console.log(`Sent a about prefix reply to ${msg.author.username}`))
        .catch(console.error);
  }

  await kickMember(msg);

  await readQuestion(msg);
};
