const {prefix} = require('../config.json');
const {gameState} = require('./codenames');
module.exports = {
	name: 'turn',
	description: 'tells you which team is playing, whether they are guessing or not and how many guesses there are',
	guildOnly: true,
	execute(message,args) {
		if (!gameState.playing) return message.channel.send(`There is no instance of codenames on this channel. Use ${prefix}codenames to instantiate a game`);
		if (!gameState.gameStart) return message.channel.send(`The game has not started. Use ${prefix}start to start the game once all the players are ready`);
		const playingTeam = gameState.playingTeam;
		const givingHint = gameState.givingHint;
		if (givingHint) return message.channel.send(`The ${playingTeam} team is giving a hint`);
		else return message.channel.send(`The ${playingTeam} is guessing with ${gameState.guesses} guesses left`);
	}
}