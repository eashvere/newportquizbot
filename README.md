# Newport QuizBowl Bot

A fully functional QuizBowl Proctor for practice and fun

It's something I wanted to do in my freetime. 

# Usage

You can use '.help' to see all the commands

## Playing
```
.tossup
```

is the command for asking for a tossup question! You can also use .t, .q, or .question

Buzzing is simple through 'buzz'. 

If you want to choose your category, then execute '.t geography' or even its shortcut '.t geo'


## Setup

Install postgres. Create 2 databases, quizbowldb and quizbowlscores. 

Get the dump file from [quizdb.org](https://www.quizdb.org/about) website

Run ``` psql -U postgres quizbowldb < path-to-dump-file ```

Change the name of ```categories.name``` to ```categories.categories_name``` in pgAdmin or through psql


# Built with

* [NodeJS]
* [Nodemon] - Helpful dev thing
* [Discord.js] - Discord API
* [QuizDB] - Question database
* [AWS] - Bot Hosting


[NodeJS]: <https://nodejs.org/en/>
[Nodemon]: <https://nodemon.io/>
[Discord.js]: <https://discord.js.org/#/>
[QuizDB]: <https://www.quizdb.org/>
[AWS]: <https://aws.amazon.com/>
