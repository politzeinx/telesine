// ============================================================
//  SITE — miolo reutilizável das páginas internas (catálogo)
//  Fornece: sessão, assistidos, avaliações e o modal de detalhes.
//  Depende de: data.js (filmes, getFilme, posterMarkup)
//  Usado junto de: auth.js (login/navbar) e profile.js (perfil)
// ============================================================

// ===== SESSÃO E ASSISTIDOS =====
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

// ===== AVALIAÇÕES =====
function chaveReviews(id) {
  return 'telesine_reviews_' + id;
}

function getReviews(id) {
  return JSON.parse(localStorage.getItem(chaveReviews(id)) || '[]');
}

function salvarReviews(id, reviews) {
  localStorage.setItem(chaveReviews(id), JSON.stringify(reviews));
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function estrelasTexto(nota) {
  let s = '';
  for (let i = 1; i <= 5; i++) s += i <= nota ? '★' : '☆';
  return s;
}

// ===== MODAL DE DETALHES =====
const detailOverlay = document.getElementById('detailOverlay');
const detailClose = document.getElementById('detailClose');
const detailPoster = document.getElementById('detailPoster');
const detailTitle = document.getElementById('detailTitle');
const detailMeta = document.getElementById('detailMeta');
const detailSinopse = document.getElementById('detailSinopse');
const detailFav = document.getElementById('detailFav');
let filmeAtual = null;

function abrirDetalhe(id) {
  const f = getFilme(id);
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
  renderAvaliacoes(id);

  detailOverlay.classList.add('active');
}

function fecharDetalhe() {
  detailOverlay.classList.remove('active');
  filmeAtual = null;
}

if (detailClose) detailClose.addEventListener('click', fecharDetalhe);
if (detailOverlay) {
  detailOverlay.addEventListener('click', (e) => {
    if (e.target === detailOverlay) fecharDetalhe();
  });
}

// ===== MARCAR COMO ASSISTIDO =====
if (detailFav) {
  detailFav.addEventListener('click', () => {
    if (filmeAtual) toggleFavorito(filmeAtual);
  });
}

function atualizarBotaoFavDetalhe() {
  if (!filmeAtual || !detailFav) return;
  const favs = getFavoritos();
  const isFav = favs.includes(String(filmeAtual));
  detailFav.classList.toggle('favorited', isFav);
  detailFav.querySelector('i').className = isFav ? 'fa-solid fa-eye' : 'fa-regular fa-eye';
  detailFav.querySelector('span').textContent = isFav ? 'Assistido' : 'Marcar como assistido';
}

function toggleFavorito(id) {
  const session = getSession();
  if (!session) {
    fecharDetalhe();
    openModal(); // abre o login (auth.js)
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

  atualizarBotaoFavDetalhe();
  // Hook opcional: a página atualiza sua grade de cards
  if (typeof window.onFavoritosChange === 'function') window.onFavoritosChange();
}

// ===== AVALIAÇÕES (formulário + lista) =====
const avalForm = document.getElementById('avalForm');
const avalTexto = document.getElementById('avalTexto');
const avalError = document.getElementById('avalError');
const avalLoginAviso = document.getElementById('avalLoginAviso');
const avalLoginLink = document.getElementById('avalLoginLink');
const estrelas = document.getElementById('estrelas');
const mediaNota = document.getElementById('mediaNota');
const comentariosEl = document.getElementById('comentarios');
let notaSelecionada = 0;

function pintarEstrelas(nota) {
  if (!estrelas) return;
  estrelas.querySelectorAll('i').forEach(estrela => {
    const valor = Number(estrela.dataset.valor);
    estrela.className = valor <= nota ? 'fa-solid fa-star' : 'fa-regular fa-star';
  });
}

if (estrelas) {
  estrelas.querySelectorAll('i').forEach(estrela => {
    estrela.addEventListener('click', () => {
      notaSelecionada = Number(estrela.dataset.valor);
      pintarEstrelas(notaSelecionada);
    });
  });
}

if (avalLoginLink) {
  avalLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    fecharDetalhe();
    openModal();
  });
}

function renderAvaliacoes(id) {
  if (!comentariosEl) return;
  const session = getSession();
  const reviews = getReviews(id);

  if (session) {
    avalForm.classList.remove('hidden');
    avalLoginAviso.classList.add('hidden');
  } else {
    avalForm.classList.add('hidden');
    avalLoginAviso.classList.remove('hidden');
  }

  notaSelecionada = 0;
  pintarEstrelas(0);
  avalTexto.value = '';
  avalError.textContent = '';

  if (reviews.length > 0) {
    const soma = reviews.reduce((acc, r) => acc + r.nota, 0);
    const media = (soma / reviews.length).toFixed(1);
    mediaNota.innerHTML = `<span class="estrela-cheia">★</span> ${media} · ${reviews.length} avaliaç${reviews.length > 1 ? 'ões' : 'ão'}`;
  } else {
    mediaNota.textContent = 'Ainda sem avaliações';
  }

  if (reviews.length === 0) {
    comentariosEl.innerHTML = '<li class="comentarios-vazio">Seja o primeiro a avaliar este filme!</li>';
    return;
  }

  comentariosEl.innerHTML = reviews.slice().reverse().map((r, idxReverso) => {
    const idxReal = reviews.length - 1 - idxReverso;
    const podeApagar = session && session.email === r.email;
    return `
      <li class="comentario">
        <div class="comentario-topo">
          <span class="comentario-autor">${escapeHtml(r.nome)}</span>
          <span class="comentario-estrelas">${estrelasTexto(r.nota)}</span>
        </div>
        ${r.texto ? `<p class="comentario-texto">${escapeHtml(r.texto)}</p>` : ''}
        <div class="comentario-topo">
          <span class="comentario-data">${r.data}</span>
          ${podeApagar ? `<button class="comentario-apagar" data-idx="${idxReal}" type="button"><i class="fa-regular fa-trash-can"></i> Apagar</button>` : ''}
        </div>
      </li>`;
  }).join('');

  comentariosEl.querySelectorAll('.comentario-apagar').forEach(btn => {
    btn.addEventListener('click', () => {
      const reviews2 = getReviews(id);
      reviews2.splice(Number(btn.dataset.idx), 1);
      salvarReviews(id, reviews2);
      renderAvaliacoes(id);
    });
  });
}

if (avalForm) {
  avalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const session = getSession();
    if (!session || !filmeAtual) return;

    if (notaSelecionada === 0) {
      avalError.textContent = 'Escolha uma nota de 1 a 5 estrelas.';
      return;
    }

    const reviews = getReviews(filmeAtual);
    const existente = reviews.findIndex(r => r.email === session.email);
    const novaReview = {
      email: session.email,
      nome: session.nome,
      nota: notaSelecionada,
      texto: avalTexto.value.trim(),
      data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    if (existente >= 0) reviews[existente] = novaReview;
    else reviews.push(novaReview);

    salvarReviews(filmeAtual, reviews);
    renderAvaliacoes(filmeAtual);
  });
}

// ===== FECHAR MODAIS COM ESC =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (typeof closeModal === 'function') closeModal();
    fecharDetalhe();
    if (typeof fecharPerfil === 'function') fecharPerfil();
  }
});
