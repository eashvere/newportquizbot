'use strict';

require('dotenv').config();

import {readdir} from 'fs';
import {Client} from 'discord.js';
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
