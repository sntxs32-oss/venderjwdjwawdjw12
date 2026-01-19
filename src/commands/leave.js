const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'leave',
    async execute(message, args, client) {
        // Busca a conexão ativa do bot no servidor atual
        const connection = getVoiceConnection(message.guild.id);

        if (!connection) {
            return message.reply("❌ Eu não estou em nenhum canal de voz neste servidor!");
        }

        try {
            // Finaliza a conexão e sai da call
            connection.destroy();
            return message.reply("👋 Saí da call com sucesso!");

        } catch (error) {
            console.error("Erro ao sair da call:", error);
            return message.reply("❌ Ocorreu um erro ao tentar sair do canal de voz.");
        }
    }
};