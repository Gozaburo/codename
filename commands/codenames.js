const {prefix} = require('../config.json');
class Codenames {
	redSpy = undefined;
	blueSpy = undefined;
	redPlayers = new Set();
	bluePlayers = new Set();
	timeStart = undefined;
	Board = [];
	gameState = {
		playing: false,
		gameStart: false,
		givingHint: false,
		playingTeam: undefined,
		guesses: 0,
	};
}
module.exports = {
	name: 'codenames',
	description: 'starts a game of codenames',
	guildOnly: true,
	redSpy: undefined,
	blueSpy: undefined,
	redPlayers: new Set(),
	bluePlayers: new Set(),
	timeStart: undefined,
	Board: [],
	gameState: {
		playing: false,
		gameStart: false,
		givingHint: false,
		playingTeam: undefined,
		guesses: 0,
	},
	async execute(message,args) {
		if (this.gameState.playing) {
			const gameTimeElapsed = Date.now() - this.timeStart;
			const hour = 3600000
			if (gameTimeElapsed > hour) {
				message.reply(`There is already an instance of codenames running in this guild. You can type ${prefix}reset to reset the game`);
			}
			else {
				const minutes = Math.floor((hour - gameTimeElapsed) / 60000);
				const seconds = Math.floor((hour - gameTimeElapsed) % 60);
				message.reply(`There is already an instance of codenames running in this guild. Please wait ${minutes}:${seconds} to use the ${prefix}reset commmand`)
			}
			return;
		}
		const wordList = await require('../words/words')()
			.then(data => {
				data.forEach(wordObj => this.Board.push(wordObj));
			});
		this.timeStart = Date.now()
		this.gameState.playing = true;
		return message.channel.send(`A new game of codenames has been started. Type ${prefix}join <red>/<blue> to join the red/blue team as guesser. Type ${prefix}joinspy to be a spymaster`);
	}
}