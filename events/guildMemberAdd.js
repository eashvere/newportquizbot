/**
 * Message a new server member with rules and actions
 * @param   {any} client the Discord client
 * @param   {any} member the person who sent it
 *
 */
export default function guildMemberAdd(client, member) {
  member.send(`Welcome to the Newport Knowledge Bowl Server!

    We **DO NOT** tolerate any type of **troll, spam, or harrassment**
    Keep all offtopic discussion to the #off-topic channel

    Packet Reading will occur in the #packet channel
    **BE SURE TO JOIN THE PACKET READING VOICE CHANNEL TO HEAR QUESTIONS** 
    
    **IMPORTANT!!! CHANGE YOUR NICKNAME TO YOUR REAL NAME**
    Right-click/Hold the server name and choose Change Nickname or use '/nick'
    
    If you don't go to Newport, add your school/org in brackets ex. QuizBowler [Redmond]
    **YOU WILL BE KICKED FOR NOT FOLLOWING THESE INSTRUCTIONS** `);
};
