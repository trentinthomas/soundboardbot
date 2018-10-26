const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const opus = require('opusscript');

const soundsFolder = './sounds/';
const fs = require('fs');

let vc = null;
let voiceConnection = null;
client.on("ready", () => {
  console.log("I am ready!");
});
let prefix = config.prefix;
client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return; //no botception

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "play") {
        if( voiceConnection != null ){
            voiceConnection.playFile(`./sounds/${args[0]}.m4a`);
        } else {
            message.channel.send(`please have the bot join a channel first with ${prefix}join`);
        }
        
    }

    if (command === "join") {
        vc = message.member.voiceChannel;
        vc.join()
        .then(connection => voiceConnection = connection)
        .catch(console.error);
        
    }
    if (command === "leave") {
        vc.leave();
        voiceConnection = null;
    }
    if (command === "help") {
        helpList = "";
        helpList += "**play**: play a particular file by doing play {filename}. Use list command to find available sounds\n";
        helpList += "**join**: join the current voice channel you are in.\n";
        helpList += "**leave**: leave the current channel the bot is in\n";
        helpList += "**help**: this command dum dum.\n";
        helpList += "**list**: list all available sounds to play";
        message.channel.send(helpList);
    }

    if (command === "list") {
        fs.readdir(soundsFolder, (err, files) => {
            let filesList = "**List of Files you can play**\n======================================\n\n";
            files.forEach( file => {
                
                filesList += file.split(".")[0]+"\n";
            })
            message.channel.send(`${filesList}`);
        })
        
    }
});
 
client.login(config.token);