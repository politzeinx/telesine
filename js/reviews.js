// ============================================================
//  REVIEWS — avaliações (notas em estrelas) e comentários
// ============================================================

const avalForm = document.getElementById('avalForm');
const avalTexto = document.getElementById('avalTexto');
const avalError = document.getElementById('avalError');
const avalLoginAviso = document.getElementById('avalLoginAviso');
const avalLoginLink = document.getElementById('avalLoginLink');
const estrelas = document.getElementById('estrelas');
const mediaNota = document.getElementById('mediaNota');
const comentariosEl = document.getElementById('comentarios');
let notaSelecionada = 0;

// Chave de armazenamento das avaliações por filme
function chaveReviews(id) {
  return 'telesine_reviews_' + id;
}

function getReviews(id) {
  return JSON.parse(localStorage.getItem(chaveReviews(id)) || '[]');
}

function salvarReviews(id, reviews) {
  localStorage.setItem(chaveReviews(id), JSON.stringify(reviews));
}

// Monta estrelas em texto (★ cheias, ☆ vazias)
function estrelasTexto(nota) {
  let s = '';
  for (let i = 1; i <= 5; i++) {
    s += i <= nota ? '★' : '☆';
  }
  return s;
}

// Pinta as estrelas do formulário conforme a nota
function pintarEstrelas(nota) {
  estrelas.querySelectorAll('i').forEach(estrela => {
    const valor = Number(estrela.dataset.valor);
    estrela.className = valor <= nota ? 'fa-solid fa-star' : 'fa-regular fa-star';
  });
}

// Clique nas estrelas
estrelas.querySelectorAll('i').forEach(estrela => {
  estrela.addEventListener('click', () => {
    notaSelecionada = Number(estrela.dataset.valor);
    pintarEstrelas(notaSelecionada);
  });
});

// Link de login dentro do aviso
avalLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  fecharDetalhe();
  openModal();
});

// Renderiza a área de avaliações para o filme atual
function renderAvaliacoes(id) {
  const session = getSession();
  const reviews = getReviews(id);

  // Mostra form ou aviso de login
  if (session) {
    avalForm.classList.remove('hidden');
    avalLoginAviso.classList.add('hidden');
  } else {
    avalForm.classList.add('hidden');
    avalLoginAviso.classList.remove('hidden');
  }

  // Reseta o form
  notaSelecionada = 0;
  pintarEstrelas(0);
  avalTexto.value = '';
  avalError.textContent = '';

  // Média das notas
  if (reviews.length > 0) {
    const soma = reviews.reduce((acc, r) => acc + r.nota, 0);
    const media = (soma / reviews.length).toFixed(1);
    mediaNota.innerHTML = `<span class="estrela-cheia">★</span> ${media} · ${reviews.length} avaliaç${reviews.length > 1 ? 'ões' : 'ão'}`;
  } else {
    mediaNota.textContent = 'Ainda sem avaliações';
  }

  // Lista de comentários
  if (reviews.length === 0) {
    comentariosEl.innerHTML = '<li class="comentarios-vazio">Seja o primeiro a avaliar este filme!</li>';
    return;
  }

  // Mais recentes primeiro
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

  // Eventos de apagar
  comentariosEl.querySelectorAll('.comentario-apagar').forEach(btn => {
    btn.addEventListener('click', () => apagarReview(id, Number(btn.dataset.idx)));
  });
}

// Evita injeção de HTML nos comentários
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Publicar avaliação
avalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const session = getSession();
  if (!session || !filmeAtual) return;

  if (notaSelecionada === 0) {
    avalError.textContent = 'Escolha uma nota de 1 a 5 estrelas.';
    return;
  }

  const reviews = getReviews(filmeAtual);

  // Um usuário só avalia uma vez por filme — atualiza se já existir
  const existente = reviews.findIndex(r => r.email === session.email);
  const novaReview = {
    email: session.email,
    nome: session.nome,
    nota: notaSelecionada,
    texto: avalTexto.value.trim(),
    data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  if (existente >= 0) {
    reviews[existente] = novaReview;
  } else {
    reviews.push(novaReview);
  }

  salvarReviews(filmeAtual, reviews);
  renderAvaliacoes(filmeAtual);
});

// Apagar avaliação
function apagarReview(id, idx) {
  const reviews = getReviews(id);
  reviews.splice(idx, 1);
  salvarReviews(id, reviews);
  renderAvaliacoes(id);
}

// Faz o modal de detalhes renderizar as avaliações ao abrir
const _abrirDetalhe = abrirDetalhe;
abrirDetalhe = function (id) {
  _abrirDetalhe(id);
  renderAvaliacoes(id);
};
