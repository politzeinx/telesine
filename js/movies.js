// ============================================================
//  MOVIES — busca, detalhes e marcação de assistidos (página inicial)
//  O banco de filmes fica em data.js (carregado antes deste arquivo)
// ============================================================

// ===== BUSCA (procura em TODOS os filmes do catálogo) =====
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const buscaVazia = document.getElementById('buscaVazia');
const secaoBusca = document.getElementById('secaoBusca');
const gridBusca = document.getElementById('gridBusca');
const mainEl = document.querySelector('main');
const allCards = document.querySelectorAll('.grid .card[data-id]');

// Abrir/fechar campo de busca
searchBtn.addEventListener('click', () => {
  searchInput.classList.toggle('open');
  if (searchInput.classList.contains('open')) {
    searchInput.focus();
  } else {
    searchInput.value = '';
    filtrarFilmes('');
  }
});

// Filtrar em tempo real
searchInput.addEventListener('input', () => filtrarFilmes(searchInput.value));

function filtrarFilmes(termo) {
  termo = termo.trim().toLowerCase();

  // Sem texto: volta ao conteúdo normal da página
  if (!termo) {
    mainEl.classList.remove('buscando');
    secaoBusca.classList.add('hidden');
    return;
  }

  // Modo busca: mostra a seção de resultados e esconde o resto da página
  mainEl.classList.add('buscando');
  secaoBusca.classList.remove('hidden');

  // Procura em todos os 30 filmes pelo nome
  const resultados = Object.keys(filmes).filter(id =>
    filmes[id].nome.toLowerCase().includes(termo)
  );

  gridBusca.innerHTML = resultados.map(id => {
    const f = filmes[id];
    return `
      <li class="card" data-id="${id}">
        <button class="fav-btn" aria-label="Marcar como assistido"><i class="fa-regular fa-eye"></i></button>
        <a href="#" class="card-link">${posterMarkup(f)}<h3>${f.nome}</h3></a>
      </li>`;
  }).join('');

  // Liga os eventos de cada resultado
  gridBusca.querySelectorAll('.card').forEach(card => {
    card.querySelector('.card-link').addEventListener('click', (e) => {
      e.preventDefault();
      abrirDetalhe(card.dataset.id);
    });
    card.querySelector('.fav-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorito(card.dataset.id);
    });
  });

  buscaVazia.classList.toggle('hidden', resultados.length > 0);
  atualizarFavoritos(); // marca o "assistido" (olho) nos resultados
}

// ===== DETALHES DO FILME =====
const detailOverlay = document.getElementById('detailOverlay');
const detailClose = document.getElementById('detailClose');
const detailPoster = document.getElementById('detailPoster');
const detailTitle = document.getElementById('detailTitle');
const detailMeta = document.getElementById('detailMeta');
const detailSinopse = document.getElementById('detailSinopse');
const detailFav = document.getElementById('detailFav');
let filmeAtual = null;

function abrirDetalhe(id) {
  const f = filmes[id];
  if (!f) return;
  filmeAtual = id;

  detailPoster.innerHTML = posterMarkup(f);
  detailTitle.textContent = f.nome;
  detailMeta.innerHTML = `
    <span class="nota"><i class="fa-solid fa-star"></i> ${f.nota}</span>
    <span>${f.genero}</span>
    <span>${f.duracao}</span>
    <span>${f.ano}</span>
  `;
  detailSinopse.textContent = f.sinopse;
  atualizarBotaoFavDetalhe();

  detailOverlay.classList.add('active');
}

function fecharDetalhe() {
  detailOverlay.classList.remove('active');
  filmeAtual = null;
}

detailClose.addEventListener('click', fecharDetalhe);
detailOverlay.addEventListener('click', (e) => {
  if (e.target === detailOverlay) fecharDetalhe();
});

// Clicar no card abre os detalhes
allCards.forEach(card => {
  const link = card.querySelector('.card-link');
  if (link) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      abrirDetalhe(card.dataset.id);
    });
  }
});

// Favoritar pelo modal de detalhes
detailFav.addEventListener('click', () => {
  if (filmeAtual) toggleFavorito(filmeAtual);
});

function atualizarBotaoFavDetalhe() {
  if (!filmeAtual) return;
  const favs = getFavoritos();
  const isFav = favs.includes(String(filmeAtual));
  detailFav.classList.toggle('favorited', isFav);
  detailFav.querySelector('i').className = isFav ? 'fa-solid fa-eye' : 'fa-regular fa-eye';
  detailFav.querySelector('span').textContent = isFav ? 'Assistido' : 'Marcar como assistido';
}

// ===== FAVORITOS (vinculados ao usuário logado) =====
function getSession() {
  return JSON.parse(localStorage.getItem('telesine_session'));
}

function chaveFavoritos() {
  const session = getSession();
  return session ? 'telesine_favs_' + session.email : null;
}

function getFavoritos() {
  const chave = chaveFavoritos();
  if (!chave) return [];
  return JSON.parse(localStorage.getItem(chave) || '[]');
}

function toggleFavorito(id) {
  const session = getSession();
  if (!session) {
    // Precisa estar logado — abre o modal de login
    fecharDetalhe();
    openModal();
    return;
  }

  id = String(id);
  const chave = chaveFavoritos();
  let favs = getFavoritos();

  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }

  localStorage.setItem(chave, JSON.stringify(favs));
  atualizarFavoritos();
  atualizarBotaoFavDetalhe();
}

// Atualiza os corações dos cards e a seção de favoritos
function atualizarFavoritos() {
  const favs = getFavoritos();

  // Atualiza os ícones (olho) em todos os cards
  document.querySelectorAll('.grid .card[data-id] .fav-btn').forEach(btn => {
    const card = btn.closest('.card');
    if (card.closest('#secaoFavoritos')) return;
    const isFav = favs.includes(card.dataset.id);
    btn.classList.toggle('favorited', isFav);
    btn.querySelector('i').className = isFav ? 'fa-solid fa-eye' : 'fa-regular fa-eye';
    btn.setAttribute('aria-label', isFav ? 'Marcar como não assistido' : 'Marcar como assistido');
  });

  // Renderiza a seção de favoritos
  renderizarSecaoFavoritos(favs);
}

function renderizarSecaoFavoritos(favs) {
  const secao = document.getElementById('secaoFavoritos');
  const grid = document.getElementById('gridFavoritos');
  const session = getSession();

  if (!session || favs.length === 0) {
    secao.classList.add('hidden');
    grid.innerHTML = '';
    return;
  }

  grid.innerHTML = favs.slice().reverse().map(id => {
    const f = filmes[id];
    if (!f) return '';
    return `
      <li class="card" data-id="${id}">
        <button class="fav-btn favorited" aria-label="Marcar como não assistido"><i class="fa-solid fa-eye"></i></button>
        <a href="#" class="card-link">${posterMarkup(f)}<h3>${f.nome}</h3></a>
      </li>`;
  }).join('');

  // Liga os eventos dos cards de favoritos
  grid.querySelectorAll('.card').forEach(card => {
    card.querySelector('.card-link').addEventListener('click', (e) => {
      e.preventDefault();
      abrirDetalhe(card.dataset.id);
    });
    card.querySelector('.fav-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorito(card.dataset.id);
    });
  });

  secao.classList.remove('hidden');
}

// Liga os botões de favoritar dos cards fixos
allCards.forEach(card => {
  const btn = card.querySelector('.fav-btn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorito(card.dataset.id);
    });
  }
});

// Atualiza favoritos sempre que o login/logout acontecer
const _updateUI = updateUI;
updateUI = function () {
  _updateUI();
  atualizarFavoritos();
};
