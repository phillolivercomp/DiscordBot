var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        logger.info("Received message from " + user + ": " + message)
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Ping!'
                });
                break;
            case 'info':
                bot.sendMessage({
                    to: channelID,
                    message: ""
                })
                break;
            case 'summon':
                const serverID = bot.channels[channelID].guild_id;
                const userVoiceChannel = bot.servers[serverID].members[userID].voice_channel_id
                if(userVoiceChannel){
                  bot.sendMessage({
                    to: channelID,
                    message: "Joining voice channel"
                  })
                  bot.joinVoiceChannel( userVoiceChannel, function(error, events){
                    events.on('speaking', function(userID, SSRC, speakingBool){
                      console.log("%s is %s", userID, (speakingBool ? "speaking" : "done speaking") );
                    })
                  });
                }
                else{
                  bot.sendMessage({
                    to: channelID,
                    message: "User not in voice channel"
                  })
                }
                break;
            default:
                logger.error('Command not recognised')
         }
     }
});
