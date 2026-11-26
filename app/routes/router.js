const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const CODIGO_ADM = String(process.env.CODIGO_ADM || "GF2026")
  .trim()
  .toUpperCase();
const usuarios = [
  {
    nome: "Daniel Alves",
    email: "daniel@grapplingflow.com",
    senha: "Aluno@123",
    tipo: "aluno",
  },
  {
    nome: "Daniel Alvez",
    email: "adm@grapplingflow.com",
    senha: "Admin@123",
    tipo: "adm",
  },
];

const vNome = body("nome")
  .trim()
  .matches(/^[A-Za-zÀ-ÿ' ]{3,}$/)
  .withMessage("Informe nome e sobrenome (apenas letras).")
  .custom((v) => v.split(/\s+/).length >= 2)
  .withMessage("Informe nome e sobrenome.");
const vEmail = body("email")
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage("Digite um e-mail válido.");
const vSenha = body("senha")
  .isLength({ min: 8 })
  .withMessage("A senha precisa de ao menos 8 caracteres.")
  .matches(/[A-Z]/)
  .withMessage("Inclua ao menos uma letra maiúscula.")
  .matches(/\d/)
  .withMessage("Inclua ao menos um número.");
const vLogin = [
  vEmail,
  body("senha").notEmpty().withMessage("Digite sua senha."),
  body("tipo")
    .isIn(["aluno", "adm"])
    .withMessage("Escolha entrar como aluno ou administrador."),
];
const vCadastro = [
  vNome,
  vEmail,
  vSenha,
  body("confirmar")
    .custom((v, { req }) => v === req.body.senha)
    .withMessage("As senhas não coincidem."),
  body("tipo").isIn(["aluno", "adm"]).withMessage("Tipo de conta inválido."),
  body("codigo")
    .if(body("tipo").equals("adm"))
    .custom(
      (v) =>
        String(v || "")
          .trim()
          .toUpperCase() === CODIGO_ADM,
    )
    .withMessage("Código da academia inválido."),
  body("termos").equals("on").withMessage("Aceite os termos para continuar."),
];
const vAluno = [
  vNome,
  vEmail,
  body("telefone")
    .trim()
    .matches(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/)
    .withMessage("Telefone inválido. Ex.: (11) 90000-0000."),
  body("nascimento").isISO8601().withMessage("Informe a data de nascimento."),
  body("modalidade").notEmpty().withMessage("Selecione a modalidade."),
  body("plano").notEmpty().withMessage("Selecione o plano."),
  vSenha,
];
const mensagens = (req) =>
  validationResult(req)
    .array()
    .map((e) => e.msg);
const status = (extra) => (extra.erros && extra.erros.length ? 422 : 200);

const telaLogin = (res, tipo, extra = {}) =>
  res
    .status(status(extra))
    .render(
      "pages/login",
      Object.assign({ tipo, cadastrado: false, erros: [], dados: {} }, extra),
    );
const telaCadastro = (res, extra = {}) =>
  res
    .status(status(extra))
    .render("pages/cadastro", Object.assign({ erros: [], dados: {} }, extra));
const telaNovoAluno = (res, extra = {}) =>
  res
    .status(status(extra))
    .render(
      "pages/adm-novo-aluno",
      Object.assign({ cadastrado: false, erros: [], dados: {} }, extra),
    );

router.get("/", (req, res) => res.render("pages/index"));

router.get("/login", (req, res) =>
  telaLogin(res, req.query.tipo === "adm" ? "adm" : "aluno", {
    cadastrado: req.query.cadastrado === "1",
  }),
);
router.get("/cadastro", (req, res) => telaCadastro(res));

router.post("/login", vLogin, (req, res) => {
  const tipo = req.body.tipo === "adm" ? "adm" : "aluno";
  const erros = mensagens(req);
  if (erros.length) return telaLogin(res, tipo, { erros, dados: req.body });
  const u = usuarios.find(
    (x) =>
      x.email === req.body.email &&
      x.senha === req.body.senha &&
      x.tipo === tipo,
  );
  if (!u)
    return telaLogin(res, tipo, {
      erros: ["E-mail, senha ou tipo de acesso incorretos."],
      dados: req.body,
    });
  res.redirect(tipo === "adm" ? "/adm/dashboard" : "/aluno/dashboard");
});

router.post("/cadastro", vCadastro, (req, res) => {
  const erros = mensagens(req);
  if (erros.length) return telaCadastro(res, { erros, dados: req.body });
  const { nome, email, senha, tipo } = req.body;
  if (usuarios.some((u) => u.email === email))
    return telaCadastro(res, {
      erros: ["Este e-mail já está cadastrado."],
      dados: req.body,
    });
  usuarios.push({ nome, email, senha, tipo });
  res.redirect("/login?tipo=" + tipo + "&cadastrado=1");
});

router.get("/aluno/dashboard", (req, res) =>
  res.render("pages/aluno-dashboard"),
);
router.get("/aluno/checkin", (req, res) =>
  res.render("pages/aluno-checkin", { ok: req.query.ok === "1" }),
);
router.post("/aluno/checkin", (req, res) =>
  res.redirect("/aluno/checkin?ok=1"),
);
router.get("/aluno/perfil", (req, res) => res.render("pages/aluno-perfil"));
router.get("/aluno/avisos", (req, res) =>
  res.render("pages/avisos", { perfil: "aluno" }),
);

router.get("/adm/dashboard", (req, res) => res.render("pages/adm-dashboard"));
router.get("/adm/alunos/novo", (req, res) =>
  telaNovoAluno(res, { cadastrado: req.query.cadastrado === "1" }),
);
router.post("/adm/alunos/novo", vAluno, (req, res) => {
  const erros = mensagens(req);
  if (erros.length) return telaNovoAluno(res, { erros, dados: req.body });
  res.redirect("/adm/alunos/novo?cadastrado=1");
});
router.get("/adm/checkins", (req, res) => res.render("pages/adm-checkins"));
router.get("/adm/financeiro", (req, res) => res.render("pages/adm-financeiro"));
router.get("/adm/perfil", (req, res) => res.render("pages/adm-perfil"));
router.get("/adm/avisos", (req, res) =>
  res.render("pages/avisos", { perfil: "adm" }),
);

module.exports = router;
