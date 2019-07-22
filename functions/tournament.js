import {readTossup, readBonus, scorePlayersKeyv} from './reading.js';

const teams = [];
const groups = [];
const players = [];

/**
 * Group Class
 */
class Group {
  /**
   *
   * @param {String} name name of group
   * @param {Array} members id of members of group
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
  constructor(name, members, guild, captain, score=0) {
    this.name = name;
    this.members = members;
    this.guild = guild;
    this.captain = captain;
    this.score = score;
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
  constructor(member, guild, score=0) {
    this.member = member;
    this.guild = guild;
    this.score = score;
  }

  /**
   * @return {String} The username of the player
   */
  toString() {
    return this.member.username;
  }
}

const getGroup = (member) => {
  for (group of groups) {
    if (group.members.includes(member)) {
      return group;
    }
  }
  return null;
};

const getTeam = (member, guild) => {
  for (team of teams) {
    for (player of team.members) {
      if (member == player.member && guild === player.guild) {
        return team;
      }
    }
  }
  return null;
};

const getPlayer = (member, guild) => {
  for (team of teams) {
    for (player of team.members) {
      if (member == player.member && guild === player.guild) {
        return player;
      }
    }
  }
  return null;
};

const serializeTeams = (teamname, guild) => {
  for (team of teams) {
    if (team.name === teamname && team.guild === guild) {
      return team;
    }
  }
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
  }

  /**
   *
   * @param {Message} message The message command to create grouop
   * @param {String} name The name of the group
   */
  async group_(message, name) {
    return new Promise(async (resolve, reject) => {
      if (groups.some((eachGroup) => {
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
      group = getGroup(message.author);
      if (group !== null) {
        await this.channel.send(group.name);
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
      if (teams.some((eachTeam) => {
        return eachTeam.name === name;
      })) {
        await this.channel.send(`That team already exists!`);
        return reject(new Error('Team Already exists'));
      }

      if (get_team(message.author, message.guild) !== null) {
        await this.channel.send(`You're already in a Team!`);
        return reject(new Error('Already in Team'));
      } else {
        player = new Player(message.author, message.guild);
        players.push(player);
      }

      const team = new Team(message.guild, name, message.author, []);
      team.members.push(player);
      teams.push(team);
      if (message.author.nickname) {
        await this.channel.send(`New Team ${name} created! Type .join ${name} to join ${message.author.nickname}`);
      } else {
        await this.channel.send(`New Team ${name} created! Type .join ${name} to join ${message.author.username}`);
      }
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
      for (team of teams) {
        if (team.guild === message.guild) {
          teamsinguild.push(team);
        }
      }
      if (teamsinguild) {
        const teamlist = teamsinguild.map((team) => `:small_blue_diamond: ${team.name} + \n`);
        const teamliststring = `Current teams in ${message.gulid.name}: \n` + teamlist.sort().join('');
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
      team = getTeam(message.author, message.guild);
      if (team) {
        await this.channel.send(team.name);
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
      team = getTeam(message.author, message.guild);
      if (team) {
        if (!newCaptain) {
          await this.channel.send(`${(team.captain.nickname) ? team.captain.nickname : team.captain.username} is the captain of your team ${team.name}`);
          return;
        }
        if (team.captain === message.author) {
          if (team.membes.includes(getPlayer(new_captain, message.guild))) {
            team.captain = newCaptain;
            await this.channel.send(`New team captain of ${team.name}: ${(team.captain.nickname) ? team.captain.nickname : team.captain.username}`);
          } else {
            await this.channel.send(`${(team.captain.nickname) ? team.captain.nickname : team.captain.username} is not on your team`);
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
      if (getPlayer(message.author, message.server)) {
        await this.channel.send(`You're already in a team. Leave to join another`);
        return reject(new Error('Already in Team'));
      }
      for (team of teams) {
        if (team.name === name) {
          const player = new Player(message.author, message.guild);
          team.members.push(player);
          await this.channel.send(`${(message.author.nickname) ? message.author.nickname : message.author.username} is not on your team`);
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
      const memberTeam = getTeam(message.author, message.guild);
      if (!name) {
        if (!memberTeam) {
          await this.channel.send(`You're not in a team`);
          return reject(new Error('Not on a Team'));
        }
      }

      if (memberTeam && (memberTeam.name === name || !name)) {
        if (memberTeam.members.length === 1) {
          await this.channel.send(`You're last person on this team. Leaving will delete it. You can always create a new one with .team <team_name>`);
          teams.splice(array.indexOf(memberTeam), 1);
          return resolve();
        }
        if (message.author === memberTeam.captain) {
          const captainDefer = memberTeam.members.map((member) => `:small_blue_diamond: ${member.username} + \n`);
          await this.channel.send(`You're the captain of the team! Defer captainship to your team mates
                                  .captain @user.\nTeam members:\n` + captainDefer.join(''));
          return;
        }

        memberTeam.members.splice(memberTeam.members.indexOf(getPlayer(message.author, message.guild)), 1);
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
  async tournament(message, teamsInGame=null) {
    new Promise(async (resolve, reject) => {
      const callerTeam = getTeam(message.author, message.guild);
      if (!callerTeam) {
        await this.channel.send(`You should make a team first`);
        return reject(new Error('Create Team first'));
      }
      if (callerTeam.captain !== message.author) {
        await this.channel.send(`You can't a tournament unless you're a captain`);
        return reject(new Error('Must be Captain'));
      }
      if (!teamsInGame) {
        teamsInGame = teams.filter((team) => team.guild === message.guild);
        for (x of teamsInGame) {
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
        for (teamname of teamNames) {
          teamsInGame.push(serializeTeams(teamname, message.guild));
        }
        for (team of teamsInGame) {
          if (!teams.map((t) => t.name).includes(team)) {
            await this.channel.send(`Check your spelling. Teams in this server are:\n` + teams.map((t_) => `:small_blue_diamond: + ${t_.name} + \n`));
            return reject(new Error('Check Spelling of Teams'));
          }
        }
      }

      let bonus;
      const bonusvote = await groupVote(this.channel, `Would you like bonuses?`);
      if (bonusvote) {
        bonus = true;
        await this.channel.send(`We're doing bonuses`);
      } else {
        bonus = false;
        await this.channel.send(`I guess we're not doing bonuses`);
      }

      let numQuestions = 20;
      await this.channel.send(`Ok how many questions do you want. Default is ${numQuestions}`);
      const numberOfQuestions = (response) => {
        return typeof(response) === 'number';
      };
      this.channel.awaitMessages(numberOfQuestions, {maxMatches: 1, time: 10000, errors: ['time']})
          .then(async (collected) => {
            numQuestions = collected.first().content.parseInt();
            await this.channel.send(`Ok, We're playing ${numQuestions} questions`);
          })
          .catch(async (err) => {
            if (err) {
              console.error(err);
            }
            await this.channel.send(`Ok, defaulting to ${numQuestions} questions`);
          });

      await this.channel.send(`Tournament Starting! This is you're setup:\nTeams competing` + teamsInGame.map((t_) => t_.name).join(', ') + `\nNumber of Tossups: ${numQuestions}\nBonus Questions: ${bonus}\n If this correct type yes. To edit type teams or tossup`);

      const checkEdit = (response) => {
        return ['yes', 'y', 'ye', 'yeet', 'teams', 'tossup', 'bonus'].includes(response.content.lower());
      };

      const response = await this.channel.awaitMessages(checkEdit, numberOfQuestions, {maxMatches: 1, time: 15000, errors: ['time']}).first().content;

      if (['yes', 'y', 'ye', 'yeet'].includes(response)) {
        await this.channel.send(`Tournament Starting. Good Luck`);
      } else if (response === 'teams') {
        await this.channel.send(`Ok, re-enter the list of team competing, separated by spaces`);
        msg = await this.channel.awaitMessages((response) => true, {maxMatches: 1, time: 15000});
        teamNames = teamsInGame.split(' ');
        if (teamNames.length < 2) {
          await this.channel.send(`You must have atleast 2 teams to start a tournament`);
          return reject(new Error('Need 2 Teams'));
        }
        teamsInGame = [];
        for (teamname of teamNames) {
          teamsInGame.push(serializeTeams(teamname, message.guild));
        }
        for (team of teamsInGame) {
          if (!teams.map((t) => t.name).includes(team)) {
            await this.channel.send(`Check your spelling. Teams in this server are:\n` + teams.map((t_) => `:small_blue_diamond: + ${t_.name} + \n`));
            return reject(new Error('Check Spelling of Teams'));
          }
        }
      } else if (response === 'tossup') {
        await this.channel.send(`Ok how many questions do you want. Original is ${numQuestions}`);
        this.channel.awaitMessages(numberOfQuestions, {maxMatches: 1, time: 10000, errors: ['time']})
            .then(async (collected) => {
              numQuestions = collected.first().content.parseInt();
              await this.channel.send(`Ok, We're playing ${numQuestions} questions`);
            })
            .catch(async (err) => {
              if (err) {
                console.error(err);
              }
              await this.channel.send(`Ok, defaulting to ${numQuestions} questions`);
            });
      }

      const playerlist = [];
      for (t of teamsInGame) {
        console.log(t.members);
        playerlist.push(t.members);
      }
      console.log(playerlist);
      for (let i=0; i<numQuestions; i++) {
        await this.channel.send(`Tossup ${i+1} of ${numQuestions} questions`);
        setTimeout(async () => {
          const correctWrong = await readTossup(this.channel);
          for (user of correctWrong.power) {
            getTeam(powercorrect[0], this.channel.guild).score += 15;
          }
          for (user of correctWrong.correct) {
            getTeam(powercorrect[0], this.channel.guild).score += 10;
          }
          for (user of correctWrong.negs) {
            getTeam(powercorrect[0], this.channel.guild).score -= 5;
          }
          await scorePlayersKeyv(correctWrong);
          const powercorrect = correctWrong.power ? correctWrong.power : correctWrong.correct;
          const bonusRight = await readBonus(channel, getTeam(powercorrect[0], this.channel.guild).members.map((player) => player.member.id));
          getTeam(powercorrect[0], this.channel.guild).score += (bonusRight.length * 10);
          await scorePlayersKeyv({correct: bonusRight.map((user) => user.id)});
        }, 1000);
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
      const team = getTeam(message.author, message.guild);
      const player = getPlayer(message.author, message.guild);
      if (team) {
        await this.channel.send(`Your team has ${team.score}\nYou've scored ${player.score} of them`);
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
      scores = '';
      for (team of teams.filter((x) => x.guild == message.guild)) {
        scores += `:small_blue_diamond:${team.name}: ${team.score} points\n`;
      }

      await this.channel.send(scores);
    });
  }
}
