const codenames = require('./codenames');
const { prefix } = require('../config.json');
module.exports = {
	name: 'join',
	description: 'joins player to desired team',
	guildOnly: true,
	args: true,
	execute(message,args) {
		if (!codenames.gameState.playing) {
			return message.channel.send(`There is no instance of codenames in this guild. Please type ${prefix}codenames to start a game`);
		}
		if (codenames.gameState.gameStart) {
			return message.channel.send(`There is currently a game of codenames being played in this guild. Please wait until it is over. You can use !reset if the game has lasted over an hour`);
		}
		if (args.length > 1) {
			return message.channel.send('Too many arguments');
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
		team = args[0].toLowerCase();
		if (team === 'red') {
			codenames.redPlayers.add(message.author.id);
			message.channel.send(`${message.author.username} has elected to guess for the red team`);
			return;
		}
		if (team === 'blue') {
			codenames.bluePlayers.add(message.author.id);
			message.channel.send(`${message.author.username} has elected to guess for the blue team`);
			return;
		}
		else {
			return message.channel.send(`Please specify to join the red or the blue team using ${prefix}join <color>`);
		}
	}
}