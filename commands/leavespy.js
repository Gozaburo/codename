const codenames = require('./codenames');
const {prefix} = require('../config.json');
module.exports = {
	name: 'leavespy',
	description: 'relinquishes power if the game has not started and if the user is currently a spymaster',
	guildOnly: true,
	execute(message,args) {
		if (!codenames.gameState.playing) {
			return message.channel.send(`There is no instance of codenames running in this guild. Use ${prefix}codenames to start a new game`)
		}
		if (codenames.gameState.gameStart) {
			return message.channel.send('You cannot leave a team once a game started');
		}
		if (codenames.redSpy === message.author.id) {
			codenames.redSpy = undefined;
			return message.channel.send(`${message.author.username} has relinquished their responsibilities as the red spymaster!`);
		}
		else if (codenames.blueSpy === message.author.id) {
			codenames.blueSpy = undefined;
			return message.channel.send(`${message.author.username} has relinquished their responsibilities as the blue spymaster!`);
		}
		else {
			return message.channel.send(`You were not a spymaster`);
		}
	}
}