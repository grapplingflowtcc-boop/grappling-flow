# Grappling Flow (TCC)
Express + EJS, HTML semântico, CSS por página (mobile first), JS externo, validação no navegador e no servidor (express-validator), variáveis de ambiente com dotenv.

    npm install
    npm start        # http://localhost:3000

Código da academia (cadastro de administrador): definido em `.env` (CODIGO_ADM=GF2026).
Contas de teste: aluno daniel@grapplingflow.com / Aluno@123 · adm adm@grapplingflow.com / Admin@123

Pastas: app/public/{css,imagem,js} · app/routes/router.js · app/views/{pages,partials} · app/app.js
Logo: coloque o arquivo em app/public/imagem/logo.png (já referenciado em todas as páginas).

Rotas: / · /login (aluno ou administrador) · /cadastro · /aluno/{dashboard,checkin,perfil,avisos} · /adm/{dashboard,alunos/novo,checkins,financeiro,perfil,avisos}

Hospedagem (Render): repositório no GitHub > New Web Service > Build `npm install` > Start `npm start`.
Em Environment, crie CODIGO_ADM com o código da academia (o arquivo .env não vai para o GitHub).
