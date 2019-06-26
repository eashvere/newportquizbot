/**
 * Print something when the bot comes online
 * @param   {any} client The Discord Client
 *
 */
export default function ready(client) {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    game: {
      name: 'Quizbowl!',
      type: 'PLAYING',
    },
    status: 'idle',
  });
};
