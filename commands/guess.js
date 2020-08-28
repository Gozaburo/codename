const codenames = require('./codenames');
const {prefix} = require('../config.json');
const { MessageAttachment, Message } = require('discord.js');
const cardCounter = require('../words/cardsLeft');
module.exports = {
	name: 'guess',
	description: 'allows guessing team players to guess a word',
	guildOnly: 'true',
	args: true,
	usage: '<guessed word>',
	async execute(message,args) {
		if (!codenames.gameState.playing) return message.channel.send(`Game has not been initialized. Use ${prefix}codenames to initialize a game`);
		if (!codenames.gameState.gameStart) return message.channel.send(`Game has not started. Make sure all the players are ready then use ${prefix}start to start the game`);
		if (codenames.gameState.givingHint) return message.channel.send(`The ${codenames.gameState.playingTeam} team is currently giving a hint`);
		if (codenames.gameState.guesses === 0) return message.channel.send(`There are no more guesses to be made this round`);
		if (args.length > 1) return message.channel.send('You can only guess one word at a time');
		const guesser = message.author.id;
		const canGuess = codenames.gameState.playingTeam === 'RED' ? codenames.redPlayers : codenames.bluePlayers;
		if (!canGuess.has(guesser)) return message.channel.send(`You are not on the ${codenames.gameState.playingTeam} team`);
		const guessedWord = args[0];
		const word = codenames.Board.find(word => word.word === guessedWord.toUpperCase());
		if (!word) return message.channel.send(`${guessedWord} is not on the board. Use ${prefix}board to view the board`);
		if (word.guessed) return message.channel.send(`That word has already been guessed, try a different word. Use ${prefix}board to view the board`);
		word.guessed = true;
		if (word.team === 'ASSASSIN') {
			const winningTeam = codenames.gameState.playing === 'RED' ? 'Blue' : 'Red';
			codenames.redPlayers = new Set();
			codenames.bluePlayers = new Set();
			codenames.redSpy = undefined;
			codenames.blueSpy = undefined;
			codenames.timeStart = undefined;
			codenames.gameState.gameStart = false;
			codenames.gameState.playing = false;
			codenames.gameState.givingHint = false;
			codenames.gameState.playingTeam = undefined;
			codenames.gameState.guesses = 0;
			require('../words/spyBoard')(codenames.Board)
				.then(attachment => {
					const realAttachment = new MessageAttachment(attachment);
					realAttachment.setName('SPOILER_A.png');
					message.channel.send(`You have just guessed the assassin. ${winningTeam} wins!`, realAttachment);
					codenames.Board = [];
				})
				.catch(e => {
					message.channel.send('The bot fucked up on doing things with the assassin');
					console.error(e);
				});
			return;
		}
		const redCards = cardCounter.redLeft();
		const blueCards = cardCounter.blueLeft();
		console.log(redCards);
		console.log(blueCards);
		if (redCards === 0 || blueCards === 0) {
			const winningTeam = redCards === 0 ? 'RED' : 'BLUE';
			codenames.redPlayers = new Set();
			codenames.bluePlayers = new Set();
			codenames.redSpy = undefined;
			codenames.blueSpy = undefined;
			codenames.timeStart = undefined;
			codenames.gameState.gameStart = false;
			codenames.gameState.playing = false;
			codenames.gameState.givingHint = false;
			codenames.gameState.playingTeam = undefined;
			codenames.gameState.guesses = 0;
			require('../words/spyBoard')(codenames.Board)
				.then(attachment => {
					const realAttachment = new MessageAttachment(attachment);
					realAttachment.setName('SPOILER_A.png');
					message.channel.send(`Congratulations ${winningTeam}, you win!`, realAttachment);
					codenames.Board = [];
				})
				.catch(e => {
					message.channel.send('The bot fucked up on doing things with resolving game win');
					console.error(e);
				})
			return;
		}
		if (word.team != codenames.gameState.playingTeam) {
			codenames.gameState.givingHint = true;
			codenames.gameState.playingTeam = codenames.gameState.playingTeam === 'RED' ? 'BLUE' : 'RED';
			codenames.gameState.guesses = 0;
			let playerBoard = await require('../words/playerBoard')(codenames.Board);
			let spyBoard = await require('../words/spyBoard')(codenames.Board);
			let redSpy = await message.client.users.fetch(codenames.redSpy);
			let blueSpy = await message.client.users.fetch(codenames.blueSpy);
			const playerBuffer = new MessageAttachment(playerBoard);
			const spyBuffer = new MessageAttachment(spyBoard);
			message.channel.send(`Incorrect guess, the ${codenames.gameState.playingTeam} team is now giving a hint`, playerBuffer);
			redSpy.send('Da board',spyBuffer);
			blueSpy.send('Da board',spyBuffer);
			return;
		} else {
			let spyBoard = await require('../words/spyBoard')(codenames.Board);
			let playerBoard = await require('../words/playerBoard')(codenames.Board);
			const spyBuffer = new MessageAttachment(spyBoard);
			const playerBuffer = new MessageAttachment(playerBoard);
			codenames.gameState.guesses -= 1;
			if (codenames.gameState.guesses === 0) {
				message.channel.send(`Correct. The ${codenames.gameState.playingTeam} team is out of guesses. Switching teams`, playerBuffer);
				codenames.gameState.givingHint = true;
				codenames.gameState.playingTeam = codenames.gameState.playingTeam === 'RED' ? 'BLUE' : 'RED';
			} else {
				message.channel.send(`Correct. The ${codenames.gameState.playingTeam} team has ${codenames.gameState.guesses} left. Type !end to end the turn`, playerBuffer);
			}
			let redSpy = await message.client.users.fetch(codenames.redSpy);
			let blueSpy = await message.client.users.fetch(codenames.blueSpy);
			redSpy.send('Da board', spyBuffer);
			blueSpy.send('Da board', spyBuffer);
		}
		return;
	}
}