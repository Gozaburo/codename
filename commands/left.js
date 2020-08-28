const cardCounter = require('../words/cardsLeft');
const {gameState} = require('./codenames');
const {prefix} = require('../config.json');
module.exports = {
	name: 'left',
	description: 'tells the player how many unguessed words of each team are left',
	guildOnly: true,
	args: false,
	execute(message,args) {
		if (!gameState.playing) return message.channel.send(`There is no instance of codenames running in this guild. Use ${prefix}codenames to start a game`);
		if (!gameState.gameStart) return message.channel.send(`The game of codenames hasn't started. Use ${prefix}start once all the players are ready`);
		const redCards = cardCounter.redLeft();
		const blueCards = cardCounter.blueLeft();
		return message.channel.send(`There are **${redCards}** red cards left and **${blueCards}** blue cards left`);
	}
}