(function () {
  const regras = {
    nome: (v) => (/^[A-Za-zÀ-ÿ' ]{3,}$/.test(v.trim()) && v.trim().split(/\s+/).length >= 2) ? "" : "Informe nome e sobrenome (apenas letras).",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Digite um e-mail válido, como nome@email.com.",
    senha: (v) => v.length < 8 ? "A senha precisa de ao menos 8 caracteres."
      : !/[A-Z]/.test(v) ? "Inclua ao menos uma letra maiúscula."
      : !/\d/.test(v) ? "Inclua ao menos um número." : "",
    senhaLogin: (v) => v ? "" : "Digite sua senha.",
    confirmar: (v, f) => v === f.querySelector('[data-regra="senha"]').value ? "" : "As senhas não coincidem.",
    codigo: (v) => v.trim().length >= 4 ? "" : "Informe o código da academia.",
    telefone: (v) => /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/.test(v.trim()) ? "" : "Telefone inválido. Ex.: (11) 90000-0000.",
    obrigatorio: (v) => v.trim() ? "" : "Preencha este campo.",
    termos: (v, f, el) => el.checked ? "" : "Aceite os termos para continuar."
  };

  function validarCampo(el, form) {
    const regra = regras[el.dataset.regra];
    if (!regra || el.closest("[hidden]")) return true;
    const msg = regra(el.value, form, el);
    const alvo = document.getElementById(el.id + "-erro");
    if (alvo) alvo.textContent = msg;
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    el.classList.toggle("valido", !msg && el.type !== "checkbox");
    return !msg;
  }

  document.querySelectorAll("[data-mostrar-senha]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const campo = document.getElementById(botao.dataset.mostrarSenha);
      campo.type = campo.type === "password" ? "text" : "password";
    });
  });

  const senhaForca = document.querySelector("[data-forca]");
  const textoForca = document.getElementById("forca-texto");
  if (senhaForca && textoForca) {
    const barras = document.querySelectorAll("#forca i");
    const nomes = ["fraca", "fraca", "média", "boa", "forte"];
    senhaForca.addEventListener("input", () => {
      const v = senhaForca.value;
      const pontos = (v.length >= 8) + /[A-Z]/.test(v) + /[0-9]/.test(v) + /[^A-Za-z0-9]/.test(v);
      barras.forEach((b, i) => b.classList.toggle("ativa", i < pontos));
      textoForca.textContent = "Força: " + (v ? nomes[pontos] : "—");
    });
  }

  document.querySelectorAll("form[data-validar]").forEach((form) => {
    form.setAttribute("novalidate", "");
    const campos = form.querySelectorAll("[data-regra]");
    campos.forEach((el) => {
      el.addEventListener("blur", () => validarCampo(el, form));
      el.addEventListener("input", () => { if (el.getAttribute("aria-invalid") === "true") validarCampo(el, form); });
    });
    const grupoCodigo = form.querySelector("#grupo-codigo");
    if (grupoCodigo) form.querySelectorAll('[name="tipo"]').forEach((r) => r.addEventListener("change", () => {
      grupoCodigo.hidden = form.elements.tipo.value !== "adm";
    }));
    form.addEventListener("submit", (e) => {
      let primeiro = null;
      campos.forEach((el) => { if (!validarCampo(el, form) && !primeiro) primeiro = el; });
      if (primeiro) { e.preventDefault(); primeiro.focus(); }
    });
  });
})();
