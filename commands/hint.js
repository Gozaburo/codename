const codenames = require('./codenames');
const {prefix} = require('../config.json');
const { Board } = require('./codenames');
module.exports = {
	name: 'hint',
	description: 'only allowed to be used by current spymaster while codenames.gamestate.givinghint is true',
	args: true,
	async execute(message,args) {
		if (!codenames.gameState.playing) {
			return message.channel.send(`Game has not been initialized. Use ${prefix}codenames to initialize a game`);
		}
		if (!codenames.gameState.gameStart) {
			return message.channel.send(`Game has not started. Make sure all the players are ready then use ${prefix}start to start the game`);
		}
		if (!codenames.gameState.givingHint) {
			return message.channel.send(`The ${codenames.gameState.playingTeam} is currently guessing`);
		}
		if (args.length > 2) {
			return message.channel.send('Hints can only be 1 word');
		}
		if (isNaN(args[1]) || args[1] < 0) {
			return message.channel.send('Please enter a number greater than or equal to 0');
		}
		const hintGiverID = codenames.gameState.playingTeam === 'RED' ? codenames.redSpy : codenames.blueSpy;
		if (message.author.id != hintGiverID) {
			return message.channel.send("You are not the current hint giver.");
		}
		const hint = args[0].toUpperCase();
		const violatedWords = [];
		Board.forEach(word => {
			if (!word.guessed && hint.includes(word.word)) {
				violatedWords.push(word.word);
			}
		});
		let user;
		await message.client.users.fetch(hintGiverID)
			.then(u => {
				user = u;
			})
			.catch(e => {
				return message.channel.send('I fucked up at getting the hintgiving spy master');
			})
		if (violatedWords.length == 0) {
			codenames.gameState.givingHint = false;
			codenames.gameState.guesses = parseInt(args[1]) + 1;
			return message.channel.send(`${user.username} has given a clue for the ${codenames.gameState.playingTeam} team. The clue is **${hint}** with **${args[1]}** related words. ${codenames.gameState.playingTeam} gets **${parseInt(args[1])+1}** guesses`);
		} else {
			return message.channel.send(`At least one of the unguessed words on the board is inside your clue. Words violated: ${violatedWords.join(', ')}`);
		}
	}
}