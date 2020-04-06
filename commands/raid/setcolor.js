const Discord = require("discord.js");

exports.run = async function(client, message, args) {
	if (!message.isAdmin) {
		return false;
	}

	let raid = await client.raid.get(client, message.channel);
	let color = args[0];
	await client.raid.setColor(client, raid, color)

	// Update our embed
	client.embed.update(client, message, raid);
};