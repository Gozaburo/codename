const codenames = require('./codenames');

module.exports = {
	name: 'reset',
	description: 'If game instance is older than an hour, anyone can reset. If game is less than an hour old, only people playing can vote to reset',
	guildOnly: 'true',
	args: 'false',
	voters: new Set(),
	execute: function(message,args) {
		if (!codenames.gameState.playing) return message.channel.send('There is no game of codenames to reset');
		const hour = 3600000;
		const timeElapsed = Date.now() - codenames.timeStart;
		if (timeElapsed > hour) {
			codenames.redSpy = undefined;
			codenames.blueSpy = undefined;
			codenames.redPlayers = new Set();
			codenames.bluePlayers = new Set();
			codenames.timeStart = undefined;
			codenames.Board = [];
			codenames.gameState = {
				playing: false,
				gameStart: false,
				givingHint: false,
				playingTeam: undefined,
				guesses: 0,
			}
			this.voters = new Set();
			return message.channel.send('Game reset')
		} else {
			const eligibleVoters = new Set(codenames.bluePlayers);
			for (let player of codenames.redPlayers) eligibleVoters.add(player)
			eligibleVoters.add(codenames.blueSpy);
			eligibleVoters.add(codenames.redSpy);
			if (!eligibleVoters.has(message.author.id)) return message.channel.send('The codenames game is less than an hour old. You must be in the game to vote to reset it');
			if (this.voters.has(message.author.id)) {
				this.voters.delete(message.author.id);
				return message.reply(`You have cancelled your vote to reset the game. ${this.voters.size}/${Math.floor(eligibleVoters.size/2)} votes remain`);
			} else {
				this.voters.add(message.author.id);
				if (this.voters.size >= Math.floor(eligibleVoters.size/2)) {
					message.channel.send('The people have voted to reset the gmae');
					codenames.redSpy = undefined;
					codenames.blueSpy = undefined;
					codenames.redPlayers = new Set();
					codenames.bluePlayers = new Set();
					codenames.timeStart = undefined;
					codenames.Board = [];
					codenames.gameState = {
						playing: false,
						gameStart: false,
						givingHint: false,
						playingTeam: undefined,
						guesses: 0,
					}
					this.voters = new Set();
					return;
				} else {
					this.voters.add(message.author.id);
					message.reply(`You have casted a vote to reset the game. ${this.voters.size}/${Math.floor(eligibleVoters.size/2)} votes remain`);
				}
			}
		}
	}
}