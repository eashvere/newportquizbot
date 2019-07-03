import {getTossup} from './quizdb.js';
import {compareTwoStrings} from 'string-similarity';
const util = require('util');
const say = require('say');
const index = require('../index.js');
const path = require('path');

/**
 * Check if an answer is correct
 * @param   {String} given The person input
 * @param   {String} answer The correct answer raw
 * @param   {Boolean} formatted Whether the thing is formatted
 * @param   {Boolean} isPrompt Whether we are prompting
 *
 * @return  {String} Either 'y', 'n', or 'p' for yes, no, or prompt
 */
function match(given, answer, formatted, isPrompt) {
  const strong = [];
  let i = 0;
  let marker = 0;
  let tag = false;
  let prompt = false;
  let match = 'n';
  if (formatted) {
    answer = answer.replace('<u>', '').replace('</u>', '').replace('<em>', '').replace('</em>', '');
    console.log(answer);
    while (i < answer.length) {
      if (answer[i] === '<' && (answer.substring(i+1, i+7) === 'strong' || answer.substring(i+1, i+3) === 'em') && !tag) {
        tag = true;
        while (answer[i] !== '>') {
          i += 1;
        }
        i += 1;
        marker = i;
      }

      if (answer[i] === '<' && (answer.substring(i+1, i+8) === '/strong' || answer.substring(i+1, i+4) === '/em') && tag) {
        strong.push(answer.substring(marker, i).trim());
        tag = false;
      }
      i += 1;
    }

    for (const bold of strong) {
      const numWords = bold.split(' ').length;
      console.log(`Length: ${numWords}`);
      for (i = 0; i < given.split(' ').length - numWords + 1; i++) {
        const phrase = given.split(' ').slice(i, i + numWords).join(' ');
        const ratio = compareTwoStrings(phrase.toLowerCase(), bold.toLowerCase());
        console.log(`Bold: ${bold}, Phrase: ${phrase}, Ratio: ${ratio}`);
        // console.log(ratio > 0.75);
        if (ratio > 0.75) {
          // console.log('This is happening');
          match = 'y';
          // console.log(match);
          return 'y';
        }
        if (ratio > 0.55) {
          prompt = true;
        }
      }
    };

    if (!isPrompt && prompt) {
      match = 'p';
      return 'p';
    } else {
      return match;
    }
  } else {
    answer = answer.replace('<em>', '').replace('</em>', '');
    const answers = answer.replace('The ', '').split(' ');
    const givens = given.split(' ');
    let prompt = false;
    for (const word of answers) {
      for (const w of givens) {
        const ratio = compareTwoStrings(w.toLowerCase(), word.toLowerCase());
        console.log(`Given: ${w}, Answer:${word}`);
        console.log(`The ratio is ${ratio}`);
        // console.log(ratio > 0.8);
        if (ratio > 0.8) {
          // console.log('This is happening');
          match = 'y';
          // console.log(match);
          return 'y';
        }
        if (ratio > 0.55) {
          prompt = true;
        }
      }
    }
    if (!isPrompt && prompt) {
      match = 'p';
      return 'p';
    }
    return match;
  }
}


/**
 * Print the Answer
 * @param   {channel} channel Where to print
 * @param   {String} answer The correct answer raw
 * @param   {Boolean} formatted Whether the thing is formatted
 *
 */
async function printAnswer(channel, answer, formatted) {
  if (!formatted) {
    // await channel.send(printme);
    await console.log(`The answer to this question is ${answer}`);
    return;
  }
  answer = answer.replace('<u>', '').replace('</u>', '');
  let strongtag = false;
  let emtag = false;
  let printme = '';
  let i = 0;
  while (i < answer.length) {
    if (answer[i] === '<' && answer.substring(i+1, i+7) === 'strong' && !strongtag) {
      strongtag = true;
      while (answer[i] !== '>') {
        i += 1;
      }
      printme += '**';
    } else if (answer[i] === '<' && answer.substring(i+1, i+3) === 'em' && !emtag) {
      emtag = true;
      while (answer[i] !== '>') {
        i += 1;
      }
      if (printme.length >= 2 && printme[printme.length - 2] === '*') {
        printme += ' *';
      } else {
        printme += '*';
      }
    } else if (answer[i] === '<' && answer.substring(i+1, i+8) === '/strong' && strongtag) {
      strongtag = false;
      while (answer[i] !== '>') {
        i += 1;
      }
      printme += '**';
    } else if (answer[i] === '<' && answer.substring(i+1, i+4) === '/em' && emtag) {
      emtag = false;
      while (answer[i] !== '>') {
        i += 1;
      }
      printme += '*';
    } else {
      if (answer[i] === '<') {
        break;
      }
      printme += answer[i];
    }
    i += 1;
  }
  // await channel.send(printme);
  console.log(`The answer to this question is ${answer}`);
}

/**
 * Get a Question and read it in a voice channel
 * @param   {Client} client The Bot
 * @param   {Channel} channel The location of the question order
 * @param   {String} category The category for the question
 * @param   {Boolean} text Whether the question should be kept to text only
 * @param   {VoiceChannel} voiceChannel The voiceChannel, if there is one, that the asker is part of
 *
 */
export async function readTossup(client, channel, category='', text=true, voiceChannel='') {
  let correct = false;
  let reading = false;
  let paused = false;
  let buzz = false;
  const gTossup = util.promisify(getTossup);
  let q;
  let answercheck;
  let dispatcher; // The voiceChannel controller!

  gTossup(category, 1).then( async (res) => {
    let isPower = res.power; // Whether power has occured yet

    printAnswer(channel, res.answer, res.answer.includes('/strong'));

    if (index.events.listeners('buzz').length > 0) {
      index.events.removeAllListeners('buzz');
    }

    index.events.on('buzz', async (msg) => {
      if (channel.id !== msg.channel.id || buzz) return;

      if (voiceChannel) dispatcher.pause();
      paused = true;
      buzz = true;
      const filter = (response) => {
        return response.content.length > 0 && !response.author.bot;
      };

      /* let promptLoopCounter = 3;
      const promptLoop = () => {
        console.log('You\'ve gone into the prompt loop');
        channel.awaitMessages(filter, {maxMatches: 1, time: 10000, errors: ['time']})
            .then( async (collected) => {
              collected = collected.first();
              console.log(collected);
              if (promptLoopCounter < 1) {
                answercheck = 'n';
                return;
              }
              channel.send(`You have ${promptLoopCounter} prompt chances left`);

              answercheck = await match(collected.content, res.answer, res.answer.includes('</strong'), true);
              promptLoopCounter -= 1;
              if (answercheck === 'p') {
                channel.send(`Prompt`);
                await promptLoop();
              }
              return;
            })
            .catch((err) => {
              console.log(err);
              answercheck = 'n';
            });
      }; */

      await channel.send(`${msg.author.username} has the floor! You have 5 seconds to answer!`);

      channel.awaitMessages(filter, {maxMatches: 1, time: 10000, errors: ['time']})
          .then( async (collected) => {
            collected = collected.first();
            console.log(`The user submitted: ${collected.content}`);
            answercheck = await match(collected.content, res.answer, res.answer.includes('</strong'));
            console.log(`The match function returns: ${answercheck}`);

            /* if (answercheck === 'p') {
              await channel.send('Prompt'); // TODO FINISH PROMPTING
              await promptLoop();
            } */
            if (answercheck === 'y') {
              correct = true;
              if (isPower) {
                await channel.send(`Amazing Job ${collected.author.username}, you answered correctly in power! You get 15 points!`);
              } else {
                await channel.send(`Correct! ${collected.author.username}, 10 points!`);
              }
              if (voiceChannel) dispatcher.end();
              return;
            }
            if (answercheck === 'n' || answercheck === 'p') {
              await channel.send(`Oof you got it wrong`);
              if (reading) {
                await channel.send(`Since you answered while reading, you've been negged 5 points`);
              } else {
                await channel.send(`Since you buzzed after the question was done, you're off the hook`);
              }
            }

            if (voiceChannel) dispatcher.resume();
            paused = false;
          })
          .catch( async (collected) => {
            console.log(collected);
            await channel.send(`Bruh, you didn't answer`);
            if (reading) {
              await channel.send(`Since you answered while reading, you've been negged 5 points`);
            } else {
              await channel.send(`Since you buzzed after the question was done, you're off the hook`);
            }

            if (voiceChannel) dispatcher.resume();
            paused = false;
          });
    });

    if (text) {
      reading = true;
      const qArray = res.text.split(' ');
      let interval;
      let value = 5;

      q = qArray.slice(0, 7).join(' ');
      const update = (msg, index) => {
        if (value > qArray.length) {
          reading = false;
          clearInterval(interval);
          channel.send(`Players have 15 seconds to finish this question`)
              .then(() => {
                setTimeout(() => {
                  if (!correct) {
                    channel.send(`Your 15 seconds are up`);
                  }
                }, 15000);
              });
        }
        if (paused) return;
        q += ' ' + qArray.slice(value, value+7).join(' ');
        msg.edit(q);
        value += 7;
        if (q.includes('(*)')) {
          isPower = false;
        }
      };

      channel.send(q).then((msg) => {
        interval = setInterval(function() {
          update(msg, value);
        }, 1600);
      });
    } else {
      isPower = false;
      res.text = res.text.replace('\"', '');
      // console.log(res.text);
      const pathToSoundFile = path.join(__dirname, 'extras/question.wav');
      say.export(res.text, 'Microsoft David Desktop', 1, pathToSoundFile, (err) => {
        if (err) {
          return console.error(err);
        }
        console.log('Text has been saved to question.wav.');

        voiceChannel.join()
            .then((connection) => {
              reading = true;
              dispatcher = connection.playFile(pathToSoundFile);

              dispatcher.on('end', () => {
                reading = false;
                if (correct) return;
                channel.send(`Players have 15 seconds to finish this question`)
                    .then(() => {
                      setTimeout( async () => {
                        if (!correct) {
                          channel.send(`Your 15 seconds are up`);
                        }
                        dispatcher.destroy();
                        connection.disconnect();
                      }, 15000);
                    });
              });
            })
            .catch(console.error);
      });
    }
  }).catch((err) => {
    console.error(err);
  });
}
