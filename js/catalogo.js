// ============================================================
//  CATALOGO — renderiza os 30 filmes, busca e marcação de assistidos
//  Depende de: data.js, auth.js, site.js, profile.js
// ============================================================

const catalogoGrid = document.getElementById('catalogoGrid');
const catBusca = document.getElementById('catBusca');
const catVazia = document.getElementById('catVazia');
const catGenero = document.getElementById('catGenero');

// Preenche o seletor de gêneros (lista única, em ordem alfabética)
function montarGeneros() {
  const generos = [...new Set(Object.values(filmes).map(f => f.genero))].sort();
  catGenero.innerHTML = '<option value="">Todos os gêneros</option>' +
    generos.map(g => `<option value="${g}">${g}</option>`).join('');
}

// Monta um card de filme
function cardFilme(id) {
  const f = filmes[id];
  return `
    <li class="card" data-id="${id}">
      <button class="fav-btn" aria-label="Marcar como assistido"><i class="fa-regular fa-eye"></i></button>
      <a href="#" class="card-link">${posterMarkup(f)}<h3>${f.nome}</h3></a>
    </li>`;
}

// Renderiza todos os filmes do catálogo
function renderCatalogo() {
  catalogoGrid.innerHTML = Object.keys(filmes).map(cardFilme).join('');

  // Liga os eventos de cada card
  catalogoGrid.querySelectorAll('.card').forEach(card => {
    const id = card.dataset.id;
    card.querySelector('.card-link').addEventListener('click', (e) => {
      e.preventDefault();
      abrirDetalhe(id);
    });
    card.querySelector('.fav-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorito(id);
    });
  });

  atualizarAssistidos();
}

// Atualiza o ícone de "assistido" (olho) em cada card
function atualizarAssistidos() {
  const favs = getFavoritos();
  catalogoGrid.querySelectorAll('.card[data-id] .fav-btn').forEach(btn => {
    const id = btn.closest('.card').dataset.id;
    const isFav = favs.includes(id);
    btn.classList.toggle('favorited', isFav);
    btn.querySelector('i').className = isFav ? 'fa-solid fa-eye' : 'fa-regular fa-eye';
    btn.setAttribute('aria-label', isFav ? 'Marcar como não assistido' : 'Marcar como assistido');
  });
}

// Aplica busca por nome + filtro de gênero juntos
function aplicarFiltros() {
  const termo = catBusca.value.trim().toLowerCase();
  const genero = catGenero.value;
  let encontrados = 0;

  catalogoGrid.querySelectorAll('.card[data-id]').forEach(card => {
    const f = filmes[card.dataset.id];
    const matchNome = f.nome.toLowerCase().includes(termo);
    const matchGenero = !genero || f.genero === genero;
    const visivel = matchNome && matchGenero;
    card.classList.toggle('hidden', !visivel);
    if (visivel) encontrados++;
  });

  catVazia.classList.toggle('hidden', encontrados > 0);
}

catBusca.addEventListener('input', aplicarFiltros);
catGenero.addEventListener('change', aplicarFiltros);

// Quando algo é marcado/desmarcado no modal, atualiza a grade
window.onFavoritosChange = atualizarAssistidos;

// Atualiza a grade também após login/logout
const _updateUI = updateUI;
updateUI = function () {
  _updateUI();
  atualizarAssistidos();
};

// Inicializa
montarGeneros();
renderCatalogo();
updateUI();
