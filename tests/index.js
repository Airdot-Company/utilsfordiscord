const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('discord.js');
const Utils = require("../dist/index");
require("dotenv").config();
const logger = new Utils.Logger();

logger.Info("Starting tests");
logger.Warn("createEvent() is deprecated, use createMessage() instead");
logger.Error("Tests failed...");

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
        logger.Info('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        logger.Info('Successfully reloaded application (/) commands.');
    } catch (error) {
        logger.Error(error);
    }
})();

client.on("interactionCreate", async i => {
    if (!i.isChatInputCommand()) return;

    logger.Info("Received and executing interaction...");

    try {
        new Utils.Pages()
            .setEmbeds([
                new Discord.EmbedBuilder()
                    .setTitle("Embed 1")
                    .setDescription("This is an embed page you can put anything you want on it!"),
                new Discord.EmbedBuilder()
                    .setTitle("Embed 2")
                    .setDescription("Pages also supports Discord.js v14!")
            ])
           .setPreset("ShowAll")
            .send(i);
    } catch(e){
        logger.Error(e);
    }
})

client.login(process.env.TOKEN);