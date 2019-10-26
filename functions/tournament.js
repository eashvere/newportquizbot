import {readTossup, readBonus, scorePlayersKeyv} from './reading.js';
import {groupVote} from './voting.js';

/**
 * Group Class
 */
class Group {
  /**
   *
   * @param {String} name name of group
   * @param {Array} members List of User classes of the members of group
   */
  constructor(name, members) {
    this.name = name;
    this.members = members;
  }
}


/**
 * A class that hold all the information of a team
 */
class Team {
  /**
     *
     * @param {String} name The name of the teams
     * @param {Array} members A list of the team members
     * @param {Guild} guild The guild the tournament is happening on
     * @param {User} captain The captain of the team
     * @param {Integer} score The teams overall score
     */
  constructor(name, members, guild, captain, score) {
    this.name = name;
    this.members = members;
    this.guild = guild;
    this.captain = captain;
    this.score = score || 0;
  }

  /**
   * @return {String} The name of the Team
   */
  toString() {
    return this.name;
  };
}

/**
 * A class that hold player information
 */
class Player {
  /**
     *
     * @param {User} member The User class of the Player
     * @param {Guild} guild The guild that the Player is on
     * @param {Integer} score The score that the Player has contributed
     */
  constructor(member, guild, score) {
    this.member = member;
    this.guild = guild;
    this.score = score || 0;
  }

  /**
   * @return {String} The username of the player
   */
  toString() {
    return this.member.username;
  }
}

/**
 *
 * @param {User} member
 *
 * @return {String} The nickname or the username
 */
const getUserName = (member) => {
  return member.nickname ? member.nickname : member.username;
};

/**
 * Tournament Class
 */
export class Tournament {
  /**
   *
   * @param {Channel} channel The channel where the Tourney happens
  */
  constructor(channel) {
    this.channel = channel;
    this.teams = [];
    this.groups = [];
    this.players = [];
  }

  /**
 *
 * @param {User} member
 *
 * @return {Group} The Group object that contains the person.
 */
  getGroup(member) {
    for (const group of this.groups) {
      for (const memberGroup of group.members) {
        if (member.id === memberGroup.id) {
          return group;
        }
      }
    }
    return null;
  }

  /**
 *
 * @param {User} member
 * @param {Guild} guild
 *
 * @return {Team} Team which the member is a part of
 */
  getTeam(member, guild) {
    for (const team of this.teams) {
      for (const player of team.members) {
        if (member.id == player.member.id && guild.id === player.guild.id) {
          return team;
        }
      }
    }
    return null;
  }

  /**
 * This function gets the User class of someone who text name is inputted.
 * @param {User} member
 * @param {Guild} guild
 *
 * @return {User} The player
 */
  getPlayer(member, guild) {
    for (const team of this.teams) {
      for (const player of team.members) {
        if ((member === player.member.username || member === player.member.nickname) && guild.id === player.guild.id) {
          return player;
        }
      }
    }
    return null;
  }

  /**
   *
   * @param {String} teamname
   * @param {Guild} guild
   *
   * @return {Team} The team
   */
  serializeTeams(teamname, guild) {
    for (const team of this.teams) {
      if (team.name === teamname && team.guild === guild) {
        return team;
      }
    }
  }

  /**
   *
   * @param {Message} message The message command to create grouop
   * @param {String} name The name of the group
   */
  async group_(message, name) {
    return new Promise(async (resolve, reject) => {
      if (this.groups.some((eachGroup) => {
        return eachGroup.name === name;
      })) {
        await this.channel.send(`That group already exists!`);
        return;
      }
      group.push(new Group(name, message.author));
      await this.channel.send(`New group ${name} created!`);
      resolve();
    });
  }

  /**
   *
   * @param {String} message The command message
   */
  async myGroup(message) {
    return new Promise(async (resolve, reject) => {
      group = this.getGroup(message.author);
      if (group !== null) {
        await this.channel.send(`You're in Group: ${group.name}`);
      } else {
        await this.channel.send(`You're not in a team`);
      }
      resolve();
    });
  }

  /**
   *
   * @param {Message} message The command message
   * @param {String} name The team name
   */
  async team_(message, name) {
    return new Promise(async (resolve, reject) => {
      let player;
      if (this.teams.some((eachTeam) => {
        return eachTeam.name === name;
      })) {
        await this.channel.send(`That team already exists!`);
        return reject(new Error('Team Already exists'));
      }

      if (this.getTeam(message.author, message.guild) !== null) {
        await this.channel.send(`You're already in a Team!`);
        return reject(new Error('Already in Team'));
      } else {
        player = new Player(message.author, message.guild);
        this.players.push(player);
      }

      const team = new Team(name, [player], message.guild, player);
      this.teams.push(team);
      await this.channel.send(`New Team ${name} created! Type .join ${name} to join ${getUserName(message.author)}`);
      resolve();
    });
  }
  /**
   *
   * @param {Message} message The command message
   */
  async teams_(message) {
    return new Promise(async (resolve, reject) => {
      const teamsinguild = [];
      for (const team of this.teams) {
        if (team.guild === message.guild) {
          teamsinguild.push(team);
        }
      }
      if (teamsinguild.length > 0) {
        const teamlist = teamsinguild.map((team) => `:small_blue_diamond: ${team.name}\n`);
        const teamliststring = `Current teams in ${message.guild.name}: \n` + teamlist.sort().join('');
        await this.channel.send(teamliststring);
      } else {
        await this.channel.send(`No teams have been made in this server`);
      }
      resolve();
    });
  }

  /**
   *
   * @param {Message} message The command message
   */
  async myteam(message) {
    return new Promise(async (resolve, reject) => {
      const team = this.getTeam(message.author, message.guild);
      if (team) {
        await this.channel.send(`You're on team: ${team.name} commanded by ${getUserName(team.captain.member)}`);
      } else {
        await this.channel.send(`You're not in a team`);
      }
      resolve();
    });
  }

  /**
   *
   * @param {Message} message The command message
   * @param {GuildMember} newCaptain The new captain of the team
   */
  async captain(message, newCaptain=null) {
    return new Promise(async (resolve, reject) => {
      const team = this.getTeam(message.author, message.guild);
      if (team) {
        if (!newCaptain) {
          await this.channel.send(`${getUserName(team.captain.member)} is the captain of your team ${team.name}`);
          return;
        }
        if (team.captain.member === message.author) {
          newCaptain = this.getPlayer(newCaptain, message.guild);
          if (team.members.map((t) => t.member.id).includes(newCaptain.member.id)) {
            team.captain = newCaptain;
            await this.channel.send(`New team captain of ${team.name}: ${getUserName(team.captain.member)}`);
          } else {
            await this.channel.send(`${getUserName(team.captain.member)} is not on your team`);
          }
        } else {
          await this.channel.send(`You aren't the captain of ${team.name}`);
        }
      } else {
        await this.channel.send(`You're not in a team!`);
      }

      resolve();
    });
  }

  /**
   *
   * @param {Message} message The command message
   * @param {String} name The name of the team to join
   */
  async join(message, name) {
    return new Promise(async (resolve, reject) => {
      if (this.getPlayer(message.author, message.guild)) {
        await this.channel.send(`You're already in a team. Leave to join another`);
        return reject(new Error('Already in Team'));
      }
      for (const team of this.teams) {
        if (team.name === name) {
          const player = new Player(message.author, message.guild);
          team.members.push(player);
          await this.channel.send(`${getUserName(message.author)} is not on your team`);
          return reject(new Error('Player not on your team'));
        }
      }
      await this.channel.send(`I couldn't find the team you wanted to join`);
    });
  }

  /**
   *
   * @param {Message} message The command message
   * @param {String} name The name of the team to leave
   */
  async leave(message, name=null) {
    return new Promise(async (resolve, reject) => {
      const memberTeam = this.getTeam(message.author, message.guild);
      if (!name) {
        if (!memberTeam) {
          await this.channel.send(`You're not in a team`);
          return reject(new Error('Not on a Team'));
        }
      }

      if (memberTeam && (memberTeam.name === name || !name)) {
        if (memberTeam.members.length === 1) {
          await this.channel.send(`You're last person on this team. By Leaving you have deleted it. You can always create a new one with .team <team_name>`);
          this.teams.splice(this.teams.indexOf(memberTeam), 1);
          return resolve();
        }
        if (message.author === memberTeam.captain.member) {
          const captainDefer = memberTeam.members.map((member) => `:small_blue_diamond: ${getUserName(member.member)} + \n`);
          await this.channel.send(`You're the captain of the team! Defer captainship to your team mates
                                  .captain @user.\nTeam members:\n` + captainDefer.join(''));
          return;
        }

        memberTeam.members.splice(memberTeam.members.indexOf(this.getPlayer(message.author, message.guild)), 1);
        await this.channel.send(`Left ${name}`);
        return resolve();
      }
      await this.channel.send(`You're not in a team by that name`);
      reject(new Error('Not in a Team by Name'));
    });
  }

  /**
   *
   * @param {Message} message The command Message
   * @param {Array} teamsInGame The teams in game
   */
  async tournament(message, teamsInGame) {
    new Promise(async (resolve, reject) => {
      teamsInGame = teamsInGame.length > 0 ? teamsInGame : '';
      const callerTeam = this.getTeam(message.author, message.guild);
      if (!callerTeam) {
        await this.channel.send(`You should make a team first`);
        return reject(new Error('Create Team first'));
      }
      if (callerTeam.captain.member !== message.author) {
        await this.channel.send(`You can't start a tournament unless you're a captain`);
        return reject(new Error('Must be Captain'));
      }
      if (!teamsInGame) {
        teamsInGame = this.teams.filter((team) => team.guild === message.guild);
        for (const x of teamsInGame) {
          x.score = 0;
        }
        const tourneystartstring = `Starting tournament with:\n` + teamsInGame.map((x) => `:small_blue_diamond: ${x.name} \n`).join('');
        await this.channel.send(tourneystartstring);
      } else {
        const teamNames = teamsInGame.split(' ');
        if (teamNames.length < 2) {
          await this.channel.send(`You must have atleast 2 teams to start a tournament`);
          return reject(new Error('Need 2 Teams'));
        }
        teamsInGame = [];
        for (const teamname of teamNames) {
          teamsInGame.push(serializeTeams(teamname, message.guild));
        }
        for (const team of teamsInGame) {
          if (!this.teams.map((t) => t.name).includes(team)) {
            await this.channel.send(`Check your spelling. Teams in this server are:\n` + this.teams.map((t_) => `:small_blue_diamond: + ${t_.name} + \n`));
            return reject(new Error('Check Spelling of Teams'));
          }
        }
      }

      const bonus = await groupVote(this.channel, `Would you like bonuses?`);
      bonus ? await this.channel.send(`We're doing bonuses`) : this.channel.send(`I guess we're not doing bonuses`);

      let numQuestions = 20;
      // await this.channel.send(`Ok how many questions do you want. Default is ${numQuestions}`);
      const numberOfQuestions = (response) => {
        response = parseInt(response.content, 10);
        if (!isNaN(response)) return true;
        return false;
      };
      /* this.channel.awaitMessages(numberOfQuestions, {maxMatches: 1, time: 10000, errors: ['time']})
          .then(async (collected) => {
            numQuestions = collected.first().content.parseInt();
            await this.channel.send(`Ok, We're playing ${numQuestions} questions`);
          })
          .catch(async (err) => {
            if (err) {
              console.error(err);
            }
            await this.channel.send(`Ok, defaulting to ${numQuestions} questions`);
          });*/

      const checkEdit = (response) => {
        return ['yes', 'y', 'ye', 'yeet', 'teams', 'tossup', 'bonus'].includes(response.content.toLowerCase());
      };

      const changeTournamenBeforeStarting = async () => {
        await this.channel.send(`Tournament Starting! This is you're setup:\nTeams competing: ` + teamsInGame.map((t_) => t_.name).join(', ') + `\nNumber of Tossups: ${numQuestions}\nBonus Questions: ${bonus}\n If this correct type yes. To edit type teams or tossup`);
        return new Promise(async (resolve, reject) => {
          this.channel.awaitMessages(checkEdit, {maxMatches: 1, time: 15000, errors: ['time']})
              .then(async (response) => {
                response = response.first().content;

                if (['yes', 'y', 'ye', 'yeet'].includes(response)) {
                  await this.channel.send(`Tournament Starting. Good Luck`);
                  resolve();
                } else if (response === 'teams') {
                  await this.channel.send(`Ok, re-enter the list of team competing, separated by spaces`);

                  this.channel.awaitMessages((response) => true, {maxMatches: 1, time: 15000})
                      .then(async (response) => {
                        response = response.content;
                        teamNames = response.split(' ');
                        if (teamNames.length < 2) {
                          await this.channel.send(`You must have atleast 2 teams to start a tournament`);
                          return reject(new Error('Need 2 Teams'));
                        }
                        for (const team of teamNames) {
                          if (!this.teams.map((t) => t.name).includes(team)) {
                            await this.channel.send(`Check your spelling. Teams in this server are:\n` + this.teams.map((t_) => `:small_blue_diamond: + ${t_.name} + \n`));
                            return reject(new Error('Check Spelling of Teams'));
                          }
                        }
                        teamsInGame = [];
                        for (const teamname of teamNames) {
                          teamsInGame.push(serializeTeams(teamname, message.guild));
                        }
                        await changeTournamenBeforeStarting();
                        resolve();
                      }).catch(async (err) => {
                        if (err) {
                          console.error(err);
                        }
                        await this.channel.send(`Ok you didn't respond. We'll just continue`);
                        resolve();
                      });
                } else if (response === 'tossup') {
                  await this.channel.send(`Ok how many questions do you want. Original is ${numQuestions}`);
                  this.channel.awaitMessages(numberOfQuestions, {maxMatches: 1, time: 10000, errors: ['time']})
                      .then(async (collected) => {
                        numQuestions = parseInt(collected.first().content, 10);
                        await this.channel.send(`Ok, We're playing ${numQuestions} questions`);
                        await changeTournamenBeforeStarting();
                        resolve();
                      })
                      .catch(async (err) => {
                        if (err) {
                          console.error(err);
                        }
                        await this.channel.send(`Ok, defaulting to ${numQuestions} questions`);
                        resolve();
                      });
                }
              }).catch( async (error) => {
                await this.channel.send(`You didn't respond, we'll just continue on`);
                resolve();
              });
        });
      };

      await changeTournamenBeforeStarting();

      const playerlist = [];
      for (const t of teamsInGame) {
        playerlist.push(t.members);
      }
      for (let i=0; i<numQuestions; i++) {
        await this.channel.send(`Tossup ${i+1} of ${numQuestions} questions`);
        const correctWrong = await readTossup(this.channel);
        for (const user of correctWrong.power) {
          this.getTeam(user, this.channel.guild).score += 15;
        }
        for (const user of correctWrong.correct) {
          this.getTeam(user, this.channel.guild).score += 10;
        }
        for (const user of correctWrong.negs) {
          this.getTeam(user, this.channel.guild).score -= 5;
        }
        await scorePlayersKeyv(correctWrong);

        let powercorrect;
        if (correctWrong.power.length > 0) {
          powercorrect = correctWrong.power;
        } else if (correctWrong.correct.length > 0) {
          powercorrect = correctWrong.correct;
        } else {
          powercorrect = '';
        }

        if (powercorrect && bonus) {
          console.log(this.getTeam(powercorrect[0], this.channel.guild).members.map((player) => player.member.id));
          const bonusRight = await readBonus(this.channel, this.getTeam(powercorrect[0], this.channel.guild).members.map((player) => player.member.id));
          this.getTeam(powercorrect[0], this.channel.guild).score += (bonusRight.length * 10);
        }
      }

      teamsInGame.sort((a, b) => {
        return b.score-a.score;
      });

      await this.channel.send(`Tournament Done! Final Leaderboard:\n` + teamsInGame.map((t) => `:small_blue_diamond: ${t.name}: ${t.score} points\n`).join(''));
      resolve();
    });
  }
  /**
   *
   * @param {Message} message The command message
   */
  async score(message) {
    return new Promise(async (resolve, reject) => {
      const team = this.getTeam(message.author, message.guild);
      const player = this.getPlayer(message.author, message.guild);
      if (team) {
        await this.channel.send(`Your team has ${team.score} points\nYou've scored ${player.score} of them`);
      }
      resolve();
    });
  }

  /**
   *
   * @param {Message} message The command message
   */
  async scores(message) {
    return new Promise(async (resolve, reject) => {
      let scores = '';
      for (const team of this.teams.filter((x) => x.guild == message.guild)) {
        scores += `:small_blue_diamond:${team.name}: ${team.score} points\n`;
      }

      await this.channel.send(scores);
    });
  }
}
