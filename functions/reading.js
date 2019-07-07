import {getTossup} from './quizdb.js';
import {compareTwoStrings} from 'string-similarity';
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
 * @return {Promise}
 */
function match(given, answer, formatted, isPrompt) {
  return new Promise(function(resolve, reject) {
    const strong = [];
    let i = 0;
    let marker = 0;
    let tag = false;
    let prompt = false;
    let match = 'n';
    if (formatted) {
      answer = answer.replace('<u>', '').replace('</u>', '').replace('<em>', '').replace('</em>', '');
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
          bold = bold.replace('<u>', '').replace('</u>', '');
          const phrase = given.split(' ').slice(i, i + numWords).join(' ');
          const ratio = compareTwoStrings(phrase.toLowerCase(), bold.toLowerCase());
          console.log(`Bold: ${bold}, Phrase: ${phrase}, Ratio: ${ratio}`);
          if (ratio > 0.75) {
            match = 'y';
            resolve(match);
          }
          if (ratio > 0.55) {
            prompt = true;
          }
        }
      };

      if (prompt) {
        match = 'p';
        resolve(match);
      } else {
        resolve(match);
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
          if (ratio > 0.8) {
            match = 'y';
            resolve(match);
          }
          if (ratio > 0.55) {
            prompt = true;
          }
        }
      }
      if (prompt) {
        match = 'p';
        resolve(match);
      }
      resolve(match);
    }
  });
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
    await channel.send(printme);
    console.log(`The answer to this question is ${answer}`);
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
  await channel.send(printme);
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
  let full = false;
  let q;
  let answercheck;
  let dispatcher; // The voiceChannel controller!
  let promptLoopCounter = 3;
  const buzzQueue = [];

  getTossup(category, 1).then( async (res) => {
    let isPower = res.power; // Whether power has occured yet

    // printAnswer(channel, res.answer, res.answer.includes('/strong'));

    const promptLoop = async (currentCorrectness, channel, filter) => {
      return new Promise(function(resolve, reject) {
        console.log('You\'ve gone into the prompt loop');
        channel.awaitMessages(filter, {maxMatches: 1, time: 10000, errors: ['time']})
            .then( async (collected) => {
              promptLoopCounter -= 1;
              collected = collected.first();
              if (promptLoopCounter < 1) {
                currentCorrectness = 'n';
                return resolve(currentCorrectness);
              }

              currentCorrectness = await match(collected.content, res.answer, res.answer.includes('</strong'), true);
              if (currentCorrectness === 'p') {
                if (promptLoopCounter === 1) {
                  channel.send(`You have ${promptLoopCounter} prompt chance left`);
                } else {
                  channel.send(`You have ${promptLoopCounter} prompt chances left`);
                }
                return resolve(await promptLoop(currentCorrectness, channel, filter));
              }

              console.log(`After Prompt, you ${currentCorrectness}`);
              return resolve(currentCorrectness);
            })
            .catch((err) => {
              if (err) {
                return reject(err);
              } else {
                return resolve('n');
              }
            });
      });
    };

    const buzzLoop = () => {
      return new Promise(async function(resolve, reject) {
        const msg = buzzQueue.shift();
        const filter = (response) => {
          return response.content.length > 0 && !response.author.bot && response.author.id === msg.author.id;
        };

        await channel.send(`${msg.author.username} has the floor! You have 10 seconds to answer!`);

        channel.awaitMessages(filter, {maxMatches: 1, time: 10000, errors: ['time']})
            .then( async (collected) => {
              collected = collected.first();
              answercheck = await match(collected.content, res.answer, res.answer.includes('</strong'));

              if (answercheck === 'p') {
                promptLoopCounter = 3;
                await channel.send('Prompt');
                answercheck = await promptLoop(answercheck, channel, filter);
              }
              if (answercheck === 'y') {
                correct = true;
                if (isPower) {
                  await channel.send(`Amazing Job ${collected.author.username}, you answered correctly in power! You get 15 points!`);
                } else {
                  await channel.send(`Correct! ${collected.author.username}, 10 points!`);
                }
                resolve(true);
              }
              if (answercheck === 'n') {
                if (reading) {
                  await channel.send(`Oof you got it wrong. During Q, Neg 5`);
                } else {
                  await channel.send(`Oof you got it wrong. After Question so 0`);
                }
              }
              resolve(false);
            })
            .catch( async (error) => {
              if (error) reject(error);
              if (reading) {
                await channel.send(`Bruh, you didn't answer. During Q, Neg 5`);
              } else {
                await channel.send(`Bruh, you didn't answer. After Question so 0`);
              }
              resolve(false);
            });
      });
    };

    const buzzEventName = 'buzz' + channel.id;

    if (index.events.listeners(buzzEventName).length > 0) {
      index.events.removeAllListeners(buzzEventName);
    }

    index.events.on(buzzEventName, async (msg) => {
      console.log(`${msg.author.username} has buzzed`);
      if (full) {
        await channel.send(`Hey! You can't buzz anymore!`);
        return;
      }
      buzzQueue.push(msg);
      if (buzz) return;

      if (voiceChannel) dispatcher.pause();
      paused = true;
      buzz = true;

      await nextBuzz();

      buzz = false;
      if (voiceChannel) dispatcher.resume();
      paused = false;
    });

    const nextBuzz = () => {
      return new Promise(async function(resolve, reject) {
        const end = await buzzLoop();
        if (end) {
          if (voiceChannel) dispatcher.end(); // Future? Dynamically chaining Promises
          return;
        }
        if (buzzQueue.length > 0) {
          resolve(await nextBuzz());
        }
        resolve(false);
      });
    };

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
                    full = true;
                    channel.send(`15 seconds are up. No more buzzes!`);
                    printAnswer(channel, res.answer, res.answer.includes('/strong'));
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
                          full = true;
                          channel.send(`15 seconds are up. No more buzzes!`);
                          printAnswer(channel, res.answer, res.answer.includes('/strong'));
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
