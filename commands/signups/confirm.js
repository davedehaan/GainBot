const Discord = require("discord.js");

exports.run = async function(client, message, args) {
	// This can't be used via DM
	if (!message.guild) {
		return false;
	}

	// Make sure an argument was provided
	if (!args[0]) {
		return false;
	}

	// Retrieve our category
	let raidCategory = client.customOptions.get(message.guild, 'raidcategory');
	if (!raidCategory) {
		raidCategory = 'Raid Signups';
	}

	// Check permissions on the category
	let category = message.guild.channels.find(c => c.name == raidCategory.trim() && c.type == "category");
	if (!category) {
		return message.channel.send('Unable to modify raid.  Please create a channel category called "Raid Signups" to use this command, or use +setoption to set a "raidcategory" value. ' + raidCategory);
	}
	
	// Retrieve this user's permission for the raid category
    let permissions = category.permissionsFor(message.author);
	if (!permissions.has("MANAGE_CHANNELS")) {
		return message.channel.send('You do not have the manage channels permission for "' + raidCategory + '".  Unable to complete command.');
	}
	
	// Get the first parameter as either player, or player list.
	let players = args.shift().toLowerCase();
	// Attempt to split on comma to see if it's a list
	players = players.split(',');
	// Keep a record of which players are added
	let confirmedPlayers = [];

	let raid = await client.signups.getRaid(client, message.channel);
	// Loop through the players to confirm
	for (key in players) {
		let player = players[key];
		await client.signups.confirm(client, raid.id, player);
		confirmedPlayers.push(player);
	}

	// Update our embed
	client.embed.update(client, message, raid);

	// Notify the user which players were confirmed
	message.author.send('Added confirmation for players: ' + confirmedPlayers.join(', ') + ' for ' + message.channel.name + '.');

};