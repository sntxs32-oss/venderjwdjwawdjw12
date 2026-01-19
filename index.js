const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
require('dotenv').config();

// --- SERVIDOR MÍNIMO PARA O RENDER NÃO TRAVAR ---
const app = express();
app.get('/', (req, res) => res.send('🤖 Bot S7 está Online!'));
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`📡 Servidor Uptime na porta ${PORT}`));

// --- CONEXÃO COM O BANCO DE DADOS ---
const dbMySQL = require('./src/database/db'); 

// --- CONFIGURAÇÃO DO BOT COM AS INTENTS QUE VOCÊ ATIVOU ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`✅ SUCESSO: Bot logado como ${client.user.tag}`);
});

// --- TENTATIVA DE LOGIN COM TRATAMENTO DE ERRO ---
console.log("⏳ Iniciando tentativa de login no Discord...");

client.login(process.env.TOKEN).catch(err => {
    console.log("❌ ERRO AO LOGAR NO DISCORD:");
    console.log(err.message);
});