const codenames = require('./codenames');
const {prefix} = require('../config.json');
module.exports = {
	name: 'leave',
	description: 'leaves respective team if the sender is a guesser on a team',
	guildOnly: true,
	execute(message,args) {
		if (!codenames.gameState.playing) {
			return message.channel.send(`There is no instance of codenames running in this guild. Use ${prefix}codenames to start a new game`)
		}
		if (codenames.gameState.gameStart) {
			return message.channel.send('You cannot leave a team once a game started');
		}
		if (codenames.bluePlayers.has(message.author.id)) {
			codenames.bluePlayers.delete(message.author.id);
			return message.channel.send(`${message.author.username} has left the blue team.`);
		}
		else if (codenames.redPlayers.has(message.author.id)) {
			codenames.redPlayers.delete(message.author.id);
			return message.channel.send(`${message.author.username} has left the red team`);
		}
		else {
			return message.channel.send(`You were not guessing for a team.`);
		}
	}
}