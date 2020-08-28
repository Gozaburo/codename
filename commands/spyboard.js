const spyBoard = require("../words/spyBoard");

const codenames = require('./codenames');
const {prefix} = require('../config.json');
const {MessageAttachment} = require('discord.js');
module.exports = {
	name: 'spyboard',
	description: 'dms player if spymaster the master spyboard',
	guildOnly: true,
	args: false,
	execute(message,args) {
		if (!codenames.gameState.playing) {
			return message.channel.send(`Game has not been intialized. Use ${prefix}codenames to start a game`);
		}
		if (!codenames.gameState.gameStart) {
			return message.channel.send(`Game has been initialized but not started. Use ${prefix}start to start the game once all the players are ready`);
		}
		if (codenames.blueSpy != message.author.id && codenames.redSpy != message.author.id) {
			return message.channel.send('You must be a spymaster to use this command');
		}
		const Board = codenames.Board;
		require('../words/spyBoard')(Board)
			.then(buffer => {
				const attachment = new MessageAttachment(buffer);
				message.author.send('Da Spyboard', attachment);
				return message.channel.send('DM Sent');
			})
			.catch(e => {
				return message.channel.send('The bot fucked up');
			});
		return;
	}
}