'use strict';

require('dotenv').config();

import {readdirSync} from 'fs';
import {Client, Collection} from 'discord.js';
const config = require('./config.json');
const pgp = require('pg-promise')();
const EventEmitter = require('events');
const events = new EventEmitter();

exports.categories = ['mythology', 'literature', 'trash', 'science', 'history', 'religion', 'geography', 'fine arts', 'social science', 'philosophy', 'current events'];
exports.aliases = {lit: 'literature', myth: 'mythology', sci: 'science', geo: 'geography', art: 'fine arts'};

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

const configConnection = `${process.env.USER}://${process.env.NAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.DATABASE}`;
const db = pgp(configConnection);
exports.db = db;
exports.events = events;
console.log('DB ONLINE');
const client = new Client();
client.commands = new Collection();
client.prompts = new Collection();

const commandFiles = readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.prompt) client.prompts.set(command.name, command);
  else client.commands.set(command.name, command);
}

const cooldowns = new Collection();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    game: {
      name: 'Quizbowl!',
      type: 'PLAYING',
    },
    status: 'online',
  });
});

client.on('guildMemberAdd', async (member) => {
  member.send(`Welcome to the Newport Knowledge Bowl Server!

  We **DO NOT** tolerate any type of **troll, spam, or harrassment**
  Keep all offtopic discussion to the #off-topic channel

  Packet Reading will occur in the #packet channel
  **BE SURE TO JOIN THE PACKET READING VOICE CHANNEL TO HEAR QUESTIONS** 
    
  **IMPORTANT!!! CHANGE YOUR NICKNAME TO YOUR REAL NAME**
  Right-click/Hold the server name and choose Change Nickname or use '/nick'
    
  If you don't go to Newport, add your school/org in brackets ex. QuizBowler [Redmond]
  **YOU WILL BE KICKED FOR NOT FOLLOWING THESE INSTRUCTIONS** `);
});

client.on('message', (message) => {
  if (message.author.bot) return;

  let commandName;
  let command;
  let args;

  if (!message.content.startsWith(config.prefix)) {
    if (message.content.split(' ').length === 1) {
      commandName = message.content.split(' ')[0].toLowerCase();
      command = client.prompts.get(commandName) || client.prompts.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    }
  } else {
    args = message.content.slice(config.prefix.length).split(/ +/);
    commandName = args.shift().toLowerCase();

    command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
  }

  if (!command) return;

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(process.env.BOT_TOKEN);
