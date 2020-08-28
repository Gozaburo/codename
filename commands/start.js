const codenames = require('./codenames.js');
const {prefix} = require('../config.json');
const board = require('./board.js');
const {MessageAttachment} = require('discord.js');
module.exports = {
	name: 'start',
	description: 'starts game if instance of codenames is running and all slots are filled',
	guildOnly: true,
	async execute(message,args) {
		if (!codenames.gameState.playing) {
			return message.channel.send(`There is no game instance of codenames running. Type ${prefix}codenames to initiate a new game`);
		}
		if (codenames.gameState.gameStart) {
			return message.channel.send(`There is currently a game of codenames being played in this guild. Please wait until it is over. You can use ${prefix}reset if the game has lasted over an hour`);
		}
		if (codenames.bluePlayers.size != 0 && codenames.redPlayers.size != 0 && codenames.redSpy && codenames.blueSpy) {
			codenames.gameState.gameStart = true;
			codenames.timeStart = Date.now();
			message.channel.send(`Starting game of codenames. Creating board...`);
			const cardCounter = require('../words/cardsLeft');
			const redCards = cardCounter.red();
			const blueCards = cardCounter.blue();
			let boardImage;
			let spyBoard;
			await require('../words/playerBoard')(codenames.Board)
				.then(imageBuffer => {
					boardImage = new MessageAttachment(imageBuffer);
				})
				.catch(e => {
					message.channel.send('The bot fucked up somewhere');
					console.error(e);
					return;
				});
			await require('../words/spyBoard')(codenames.Board)
				.then(imageBuffer => {
					spyBoard = new MessageAttachment(imageBuffer);
				})
				.catch(e => {
					message.channel.send('The bot fucked up somewhere');
					console.error(e);
					return;
				})
			if (redCards > blueCards) {
				message.channel.send(`Red team starts with ${redCards} cards, blue team starts with ${blueCards} cards. Red team goes first`, boardImage);
				codenames.gameState.playingTeam = 'RED';
			} else {
				message.channel.send(`Blue team starts with ${blueCards} cards, red team starts with ${redCards} cards. Blue team goes first`, boardImage);
				codenames.gameState.playingTeam = 'BLUE';
			}
			codenames.gameState.givingHint = true;
			message.client.users.fetch(codenames.redSpy)
			.then(user => {
				user.send(`Use ${prefix}hint <# of related words> in the main channel to give a hint during your turn`, spyBoard);
			})
			.catch(e => {
				message.channel.send('I fucked up somewhere of trying to get the red spy');
				console.error(e);
			});
			message.client.users.fetch(codenames.blueSpy)
			.then(user => {
				user.send(`Use ${prefix}hint <# of related words> in the main channel to give a hint during your turn`, spyBoard);
			})
			.catch(e => {
				message.channel.send('I fucked up somewhere of trying to get the blue spy');
				console.error(e);
			});
			return;
		} else {
			return message.channel.send('All the player slots have not been filled. Each team needs 1 spy master and at least 1 guesser');
		}
	}
}