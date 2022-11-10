const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder, ButtonStyle } = require('discord.js');
const Utils = require("../dist/index");
require("dotenv").config();

const client = new Discord.Client({
    intents: [
        "Guilds"
    ]
});

const commands = [
    new SlashCommandBuilder()
    .setName("test")
    .setDescription("Run tests")
];

// Place your client and guild ids here
const clientId = '988586195237888011';
const guildId = '842575277249921074';

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.on("interactionCreate", async i => {
    if(!i.isChatInputCommand()) return;

    new Utils.Pages()
    .setEmbeds([
        new Discord.EmbedBuilder()
        .setTitle("Embed 1")
        .setDescription("This is an embed page you can put anything you want on it!")
        .setColor("Blurple"),
        new Discord.EmbedBuilder()
        .setTitle("Embed 2")
        .setColor("Blurple")
        .setDescription("Pages also supports Discord.js v14!")
    ])
    .setComponents([
        new Discord.ButtonBuilder()
        .setLabel("Custom Button")
        .setStyle(ButtonStyle.Success)
        .setCustomId("custom-button"),
        new Discord.ButtonBuilder()
        .setLabel("Learn More")
        .setStyle(ButtonStyle.Link)
        .setURL("https://npm.im/utilsfordiscordjs")
    ])
    .setEventListener(i => i.reply({
        ephemeral: true,
        embeds: [
            new Discord.EmbedBuilder()
            .setTitle("Custom Button")
            .setColor("Blurple")
            .setDescription("This is a custom button. You can do anything with it! You can also use the `setEventListener` function to recieve interactions for custom components.\n\n>>> **TIP**\n*You can also use select menus!*")
        ]
    }))
    .send(i, {
        disableCustomButtons: false
    });
})

client.login(process.env.TOKEN);

setTimeout(() => {
    process.exit();
}, 60000);