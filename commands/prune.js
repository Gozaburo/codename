module.exports = {
	name: `prune`,
	descrption: `deletes number of messages`,
	execute(message, args) {
		const amount = parseInt(args[0]) + 1;
		if (isNaN(amount)) {
			return message.reply(`That doesn't seem like a valid amount of messages to delete`);
		} else if (amount < 2 || amount > 100) {
			return message.reply(`Messages to delete must be between 1 and 99`);
		}
		message.channel.bulkDelete(amount, true).catch(err => {
			console.log(err);
			message.channel.send(`There was an error trying to delete messages`);
		});
	}
};