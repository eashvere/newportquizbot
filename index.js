'use strict';

require('dotenv').config();

import {readdir} from 'fs';
import {Client} from 'discord.js';
const pgp = require('pg-promise')();

const configConnection = `${process.env.USER}://${process.env.NAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.DATABASE}`;
const db = pgp(configConnection);
exports.db = db;
console.log('DB ONLINE');
const client = new Client();

readdir('./events/', (err, files) => {
  files.forEach( (file) => {
    const eventName = file.split('.')[0];

    // CommonJS Variation!
    const eventHandler = require(`./events/${file}`);
    client.on(eventName, (...args) => eventHandler.default(client, ...args));
  });
});

client.login(process.env.BOT_TOKEN);
