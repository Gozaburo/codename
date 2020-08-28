const fs = require('fs'); // Require node's native module file system
const Discord = require('discord.js'); // Require discord.js module
const Canvas = require('canvas');
const { token, prefix } = require('./config.json'); // Object destructuring seems like order doesn't matter
const cooldowns = new Discord.Collection();
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command); // Add a new client.commands key, value pair with command.name (property in .js file) as the key and the entire command object itself
	//console.log(client.commands);
}

client.once('ready', () => {
	console.log('Ready!');
});
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/); // Modified by args.shift. Array of words after the command, parsed by regex expression
	const commandName = args.shift().toLowerCase(); // First entry to lowercase (like pong or ping). Modifies args by slicing off first word (command) and setting commandName to that

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) { return; }
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply(`I can't execute that command inside DMs!`);
	}
	if (command.args && !args.length) { // If command object has args set to true (meaning it requires commands) and the length of our argument array is 0, we return the reply message
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;	
		}
		return message.channel.send(reply);
	}
	if (!cooldowns.has(command.name)) { // If our cooldowns collection doesn't have the command name as one of its keys. Can do this on a const
		cooldowns.set(command.name, new Discord.Collection()); 
	}
	const now = Date.now(); // Current time stamp
	const timestamps = cooldowns.get(command.name); // Get collection of timestamp for when the command was used
	const cooldownAmount = (command.cooldown || 3) * 1000; // Sets cooldownAmount to either the cooldown property in the command object or 3
	if (timestamps.has(message.author.id)) { // If the command has an instance of the author sending 
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	timestamps.set(message.author.id, now); // Timestamps refers to the collection fetched from cooldowns so it will modify cooldowns as well
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); // Delete the message author ID after coolDownAmount has passed.
	try {
		command.execute(message, args); // Take constant command object and call its execute property with message and args as parameters
	} catch (error) { // On error event, log the error and reply to user about error
		console.log(error);
		message.reply('there was an error trying to execute that command');
	}
});
client.login(token);

