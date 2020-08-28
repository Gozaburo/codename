const codenames = require('./codenames');
const {MessageAttachment} = require('discord.js');
const {prefix} = require('../config.json');
module.exports = {
	name: 'board',
	description: 'sends image of player board',
	guildOnly: true,
	args: false,
	execute(message,args) {
		if (!codenames.gameState.playing) {
			return message.channel.send(`Game has not been initialized. Use ${prefix}codenames to intialize`);
		}
		if (!codenames.gameState.gameStart) {
			return message.channel.send('Game has not started');
		}
		if (!codenames.bluePlayers.has(message.author.id) && !codenames.redPlayers.has(message.author.id) && !codenames.blueSpy != message.author.id && codenames.redSpy != message.author.id) {
			return message.channel.send('You are not playing');
		}
		const Board = codenames.Board;
		require('../words/playerBoard')(Board)
			.then(buffer => {
				const attachment = new MessageAttachment(buffer);
				message.channel.send('Da board', attachment);
			})
			.catch(e => {
				return message.channel.send(`The bot fucked up somewhere`);
			});
		return;
	}
}