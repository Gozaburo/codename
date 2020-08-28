const codenames = require('./codenames.js');
const {prefix} = require('../config.json');
module.exports = {
	name: 'joinspy',
	description: 'assigns sender to be a spymaster if two spymasters have not been chosen',
	guildOnly: true,
	async execute(message,args) {
		if (!codenames.gameState.playing) {
			return message.channel.send(`There is no game instance of codenames running. Type ${prefix}codenames to initiate a new game`);
		}
		if (codenames.gameState.gameStart) {
			return message.channel.send(`There is currently a game of codenames being played in this guild. Please wait until it is over. You can use ${prefix}reset if the game has lasted over an hour`);
		}
		if (codenames.redSpy === message.author.id || codenames.blueSpy === message.author.id) {
			if (codenames.redSpy === message.author.id) {
				return message.channel.send(`You cannot join a team right now. You are a spymaster for the red team. Use ${prefix}leavespy to relinquish your powers`);
			}
			else {
				return message.channel.send(`You cannot join a team right now. You are a spymaster for the blue team. Use ${prefix}leavespy to relinquish your powers`);
			}
		}
		if (codenames.bluePlayers.has(message.author.id) || codenames.redPlayers.has(message.author.id)) {
			if (codenames.bluePlayers.has(message.author.id)) {
				return message.channel.send(`You cannot join a team right now. You are guessing for the blue team. Use ${prefix}leave to leave your team`);
			}
			else {
				return message.channel.send(`You cannot join a team right now. You are guessing for the red team. Use ${prefix}leave to leave your team`);
			}
		}
		const authorID = message.author.id;
		if (codenames.redSpy && codenames.blueSpy) {
			let redSpy;
			let blueSpy;
			await message.client.users.fetch(codenames.blueSpy)
				.then(b => {
					blueSpy = b;
				});
			await message.client.users.fetch(codenames.redSpy)
				.then(r => {
					redSpy = r;
				});
			return message.channel.send(`There are already two spymasters\nBlue Spymaster: ${blueSpy.username}#${blueSpy.discriminator}\nRed Spymaster: ${redSpy.username}#${redSpy.discriminator}`);
		}
		if (!codenames.redSpy) {
			codenames.redSpy = authorID;
			return message.reply('you have elected to be the red spymaster');
		}
		else if (!codenames.blueSpy) {
			codenames.blueSpy = authorID;
			return message.reply('you have elected to be the blue spymaster');
		}
	}
}