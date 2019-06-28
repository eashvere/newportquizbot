import {getTossup} from './quizdb.js';

/**
 * Return a Question when asked for one
 * @param   {Message} msg what was sent by the person
 *
 */
export async function readQuestion(msg) {
  if (msg.content.startsWith('?q')) {
    console.log(`${msg.author.username} has ordered a question!`);
    // msg.reply('/tts This is a Question');
    getTossup();
  }
}
