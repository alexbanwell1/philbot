/**
 * http://usejsdoc.org/
 */
const Discord = require('discord.js');
const config = require('../config.json');
const main = require('../index.js');
module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 3,
	execute(message, args) {
		const embed = new Discord.MessageEmbed().setColor(main.getSotonColour());
		const embed2 = new Discord.MessageEmbed().setColor(main.getSotonColour());
		const data = [];
		const { commands, mentions } = message.client;

		if (!args.length) {
			embed.setTitle('Here\'s a list of all my commands:')
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can send \`${config.prefix}help [command name]\` to get info on a specific command!`);
			embed.setDescription(data);
			embed2.setTitle('Here\'s a list of the things I can respond to:')
			
			embed2.setDescription(mentions.map(mention => `${mention.name.capitalize()}${mention.aliases ? ", ".concat(mention.aliases.map(alias => alias.capitalize()).join(', ')) : ""}`).join(', '));
			return message.author.send(embed).then(()=> message.author.send(embed2)
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
				}))
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
				});
		} else {
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command) {
				return message.reply('that\'s not a valid command!');
			}
			embed.setTitle(`**Name**: ${command.name}`)

			if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
			if (command.description) data.push(`**Description:** ${command.description}`);
			if (command.usage) data.push(`**Usage:** ${config.prefix}${command.name} ${command.usage}`);

			data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
			embed.setDescription(data);
			message.channel.send(embed);
		}
	},
};