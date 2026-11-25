(function () {
  const botao = document.querySelector("[data-menu-toggle]");
  const menu = document.getElementById("menu");
  if (!botao || !menu) return;
  const fundo = document.createElement("div");
  fundo.className = "fundo";
  document.body.appendChild(fundo);

  function alternar(abrir) {
    menu.classList.toggle("aberto", abrir);
    fundo.classList.toggle("aberto", abrir);
    botao.setAttribute("aria-expanded", String(abrir));
    botao.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
    if (abrir) { const l = menu.querySelector("a,button"); if (l) l.focus(); } else botao.focus();
  }
  botao.addEventListener("click", () => alternar(!menu.classList.contains("aberto")));
  fundo.addEventListener("click", () => alternar(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("aberto")) alternar(false); });
})();
