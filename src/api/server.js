const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Função para iniciar a API (chamada no index.js)
function iniciarAPI(dbMySQL, enviarLog, client) {

    // Rota de Login (O seu Cheat vai acessar aqui)
    app.post('/login', async (req, res) => {
        const { usuario, hwid } = req.body;

        if (!usuario || !hwid) {
            return res.status(400).json({ status: "erro", mensagem: "Dados incompletos." });
        }

        try {
            // 1. Busca o usuário no banco
            const [rows] = await dbMySQL.query("SELECT * FROM usuarios WHERE usuario = ?", [usuario]);

            if (rows.length === 0) {
                return res.status(404).json({ status: "erro", mensagem: "Usuário não encontrado." });
            }

            const user = rows[0];

            // 2. Verifica se a licença expirou
            const agora = new Date();
            const expiracao = new Date(user.expiracao);

            if (expiracao < agora) {
                return res.status(403).json({ status: "erro", mensagem: "Sua licença expirou!" });
            }

            // 3. Verifica o HWID (Vínculo com o PC)
            // Se o HWID no banco for nulo, ele vincula o HWID atual (Primeiro Login)
            if (!user.hwid_vinculado) {
                await dbMySQL.query("UPDATE usuarios SET hwid_vinculado = ? WHERE usuario = ?", [hwid, usuario]);
                enviarLog(client, "💻 HWID VINCULADO", `O usuário **${usuario}** vinculou seu primeiro HWID.`);
            } else if (user.hwid_vinculado !== hwid) {
                return res.status(403).json({ status: "erro", mensagem: "HWID não compatível! Peça reset no Discord." });
            }

            // 4. Se tudo estiver OK, retorna Sucesso e o Plano
            res.json({
                status: "sucesso",
                mensagem: "Login realizado!",
                plano: user.plano,
                expira_em: user.expiracao
            });

            console.log(`[API] Login realizado: ${usuario} | Plano: ${user.plano}`);

        } catch (error) {
            console.error("Erro na API de Login:", error);
            res.status(500).json({ status: "erro", mensagem: "Erro interno no servidor." });
        }
    });

    // Inicia o servidor Express
    app.listen(port, () => {
        console.log(`🌐 API de Login rodando na porta ${port}`);
    });
}

module.exports = { iniciarAPI };