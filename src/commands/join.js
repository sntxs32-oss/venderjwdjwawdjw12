const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    name: 'join',
    async execute(message, args, client) {
        // Verifica se o usuário que digitou está em um canal de voz
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.reply("❌ Você precisa entrar em um canal de voz primeiro!");
        }

        try {
            // Conecta à call
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
                selfDeaf: true, // O bot entra "surdo" para economizar internet/CPU
            });

            return message.reply(`✅ Conectado com sucesso em: **${voiceChannel.name}**`);

        } catch (error) {
            console.error("Erro ao entrar na call:", error);
            return message.reply("❌ Houve um erro ao tentar entrar no canal de voz.");
        }
    }
};