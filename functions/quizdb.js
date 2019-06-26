import {Client} from 'pg';

/**
 * Get a Tossup from the QuizBowl DB
 * @param   {Message} msg what was sent by the person
 *
 */
export async function getTossup() {
  const config = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'mario41566',
  };

  const client = new Client(config);

  await client.connect();
}
