const {prefix} = require('../config.json');
module.exports = {
	name: 'help',
	description: 'lists every available command or info about a specific command',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message,args) {
		const data = [];
		const {commands} = message.client;
		console.log(message.client);
		if (!args.length) {
			data.push("Here's a list of all my commands:");
			data.push(commands.map(cmd => cmd.name).join(', '));
			data.push(`\nYou can send \`${prefix}help <command name>\` to get info on a specific command!`);
			return message.author.send(data, {split: true})
			.then(() => {
				if (message.channel.type === 'dm') return;
				message.reply('DM Sent');
			})
			.catch(e => {
				console.error(`Could not reply to ${message.author.tag}.\n`, error);
				message.reply('It seems like I cannot DM you. Do you have DMs disabled?');
			})
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));
		if (!command) {
			return message.reply('Invalid command');
		}
		data.push(`**Name:** ${command.name}`);
		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
		message.channel.send(data, {split: true});
	}
}