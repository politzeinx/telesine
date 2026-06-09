// ============================================================
//  PROFILE — perfil do usuário (estatísticas, favoritos, avaliações)
// ============================================================

const perfilOverlay = document.getElementById('perfilOverlay');
const perfilClose = document.getElementById('perfilClose');
const perfilAvatar = document.getElementById('perfilAvatar');
const perfilAvatarInicial = document.getElementById('perfilAvatarInicial');
const perfilNome = document.getElementById('perfilNome');
const perfilBio = document.getElementById('perfilBio');
const perfilLocal = document.getElementById('perfilLocal');
const statFavs = document.getElementById('statFavs');
const statReviews = document.getElementById('statReviews');
const statMedia = document.getElementById('statMedia');
const perfilFavs = document.getElementById('perfilFavs');
const perfilFavsVazio = document.getElementById('perfilFavsVazio');
const perfilReviews = document.getElementById('perfilReviews');
const perfilReviewsVazio = document.getElementById('perfilReviewsVazio');
const perfilEditBtn = document.getElementById('perfilEditBtn');
const perfilEditForm = document.getElementById('perfilEditForm');
const editBio = document.getElementById('editBio');
const editLocal = document.getElementById('editLocal');
const editCancelar = document.getElementById('editCancelar');
const editFoto = document.getElementById('editFoto');
const fotoPreview = document.getElementById('fotoPreview');
const fotoPreviewInicial = document.getElementById('fotoPreviewInicial');
const fotoRemover = document.getElementById('fotoRemover');
const perfilTopFavs = document.getElementById('perfilTopFavs');
const perfilTopFavsVazio = document.getElementById('perfilTopFavsVazio');
const topFavSelects = [
  document.getElementById('topFav0'),
  document.getElementById('topFav1'),
  document.getElementById('topFav2'),
  document.getElementById('topFav3')
];

// Foto escolhida temporariamente no formulário (antes de salvar)
let fotoTemp = null;

// Monta as opções dos seletores de top favoritos (uma vez)
function montarOpcoesTopFav() {
  const opcoes = '<option value="">— escolher —</option>' +
    Object.keys(filmes).map(id => `<option value="${id}">${filmes[id].nome}</option>`).join('');
  topFavSelects.forEach(sel => { sel.innerHTML = opcoes; });
}
montarOpcoesTopFav();

// Desabilita, em cada seletor, os filmes já escolhidos nos outros
function atualizarOpcoesTopFav() {
  const escolhidos = topFavSelects.map(sel => sel.value).filter(v => v);
  topFavSelects.forEach(sel => {
    Array.from(sel.options).forEach(opt => {
      if (opt.value === '') return; // mantém "— escolher —" sempre ativo
      // Desabilita se já está escolhido em outro seletor (mas não no próprio)
      opt.disabled = escolhidos.includes(opt.value) && opt.value !== sel.value;
    });
  });
}

// Atualiza as opções sempre que um seletor muda
topFavSelects.forEach(sel => {
  sel.addEventListener('change', atualizarOpcoesTopFav);
});

// Dados extras do perfil (bio, localização e foto) por usuário
function chavePerfil() {
  const session = getSession();
  return session ? 'telesine_perfil_' + session.email : null;
}

function getDadosPerfil() {
  const chave = chavePerfil();
  if (!chave) return { bio: '', local: '', foto: '', topFavoritos: [] };
  const dados = JSON.parse(localStorage.getItem(chave) || '{}');
  return {
    bio: dados.bio || '',
    local: dados.local || '',
    foto: dados.foto || '',
    topFavoritos: dados.topFavoritos || []
  };
}

function salvarDadosPerfil(dados) {
  const chave = chavePerfil();
  if (chave) localStorage.setItem(chave, JSON.stringify(dados));
}

// Aplica a foto (ou a inicial) num avatar
function aplicarFoto(elemento, foto) {
  if (foto) {
    elemento.style.backgroundImage = `url(${foto})`;
    elemento.classList.add('com-foto');
  } else {
    elemento.style.backgroundImage = '';
    elemento.classList.remove('com-foto');
  }
}

// Reúne todas as avaliações feitas pelo usuário (em todos os filmes)
function getReviewsDoUsuario() {
  const session = getSession();
  if (!session) return [];
  const lista = [];
  Object.keys(filmes).forEach(id => {
    getReviews(id).forEach(r => {
      if (r.email === session.email) {
        lista.push({ ...r, filmeId: id, filmeNome: filmes[id].nome });
      }
    });
  });
  return lista;
}

// Abrir o perfil
function abrirPerfil() {
  const session = getSession();
  if (!session) return;

  const dados = getDadosPerfil();
  const favs = getFavoritos();
  const reviews = getReviewsDoUsuario();

  // Cabeçalho
  perfilAvatarInicial.textContent = session.nome.charAt(0);
  aplicarFoto(perfilAvatar, dados.foto);
  perfilNome.textContent = session.nome;
  perfilBio.textContent = dados.bio || '';
  perfilLocal.textContent = dados.local || '';

  // Estatísticas
  statFavs.textContent = favs.length;
  statReviews.textContent = reviews.length;
  if (reviews.length > 0) {
    const soma = reviews.reduce((acc, r) => acc + r.nota, 0);
    statMedia.textContent = (soma / reviews.length).toFixed(1);
  } else {
    statMedia.textContent = '—';
  }

  // Favoritos de todos os tempos (top 4 curados)
  const topFavoritos = (dados.topFavoritos || []).filter(id => filmes[id]);
  if (topFavoritos.length > 0) {
    perfilTopFavsVazio.classList.add('hidden');
    perfilTopFavs.innerHTML = topFavoritos.map(id => {
      const f = filmes[id];
      return `
        <li class="card" data-id="${id}">
          <a href="#" class="card-link">${posterMarkup(f)}<h3>${f.nome}</h3></a>
        </li>`;
    }).join('');
    perfilTopFavs.querySelectorAll('.card-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.closest('.card').dataset.id;
        fecharPerfil();
        abrirDetalhe(id);
      });
    });
  } else {
    perfilTopFavs.innerHTML = '';
    perfilTopFavsVazio.classList.remove('hidden');
  }

  // Últimos filmes assistidos (mais recentes primeiro, máximo de 10)
  if (favs.length > 0) {
    perfilFavsVazio.classList.add('hidden');
    perfilFavs.innerHTML = favs.slice().reverse().slice(0, 10).map(id => {
      const f = filmes[id];
      if (!f) return '';
      return `
        <li class="card" data-id="${id}">
          <a href="#" class="card-link">${posterMarkup(f)}<h3>${f.nome}</h3></a>
        </li>`;
    }).join('');
    // Clicar abre o detalhe do filme
    perfilFavs.querySelectorAll('.card-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.closest('.card').dataset.id;
        fecharPerfil();
        abrirDetalhe(id);
      });
    });
  } else {
    perfilFavs.innerHTML = '';
    perfilFavsVazio.classList.remove('hidden');
  }

  // Avaliações
  if (reviews.length > 0) {
    perfilReviewsVazio.classList.add('hidden');
    perfilReviews.innerHTML = reviews.slice().reverse().map(r => `
      <li class="comentario">
        <p class="perfil-review-filme">${escapeHtml(r.filmeNome)}</p>
        <div class="comentario-topo">
          <span class="comentario-estrelas">${estrelasTexto(r.nota)}</span>
          <span class="comentario-data">${r.data}</span>
        </div>
        ${r.texto ? `<p class="comentario-texto">${escapeHtml(r.texto)}</p>` : ''}
      </li>
    `).join('');
  } else {
    perfilReviews.innerHTML = '';
    perfilReviewsVazio.classList.remove('hidden');
  }

  // Reseta modo de edição
  perfilEditForm.classList.add('hidden');

  perfilOverlay.classList.add('active');
}

function fecharPerfil() {
  perfilOverlay.classList.remove('active');
}

perfilClose.addEventListener('click', fecharPerfil);
perfilOverlay.addEventListener('click', (e) => {
  if (e.target === perfilOverlay) fecharPerfil();
});

// Editar perfil
perfilEditBtn.addEventListener('click', () => {
  const dados = getDadosPerfil();
  const session = getSession();
  editBio.value = dados.bio || '';
  editLocal.value = dados.local || '';

  // Preenche os seletores de top favoritos
  const top = dados.topFavoritos || [];
  topFavSelects.forEach((sel, i) => { sel.value = top[i] || ''; });
  atualizarOpcoesTopFav();

  // Prepara o preview da foto
  fotoTemp = dados.foto || '';
  fotoPreviewInicial.textContent = session ? session.nome.charAt(0) : 'U';
  aplicarFoto(fotoPreview, fotoTemp);

  perfilEditForm.classList.toggle('hidden');
});

// Escolher foto — lê o arquivo como base64 (data URL)
editFoto.addEventListener('change', () => {
  const arquivo = editFoto.files[0];
  if (!arquivo) return;

  // Limita o tamanho para não estourar o localStorage (~2MB)
  if (arquivo.size > 2 * 1024 * 1024) {
    alert('A imagem é muito grande. Escolha uma foto de até 2 MB.');
    editFoto.value = '';
    return;
  }

  const leitor = new FileReader();
  leitor.onload = () => {
    fotoTemp = leitor.result;
    aplicarFoto(fotoPreview, fotoTemp);
  };
  leitor.readAsDataURL(arquivo);
});

// Remover foto
fotoRemover.addEventListener('click', () => {
  fotoTemp = '';
  editFoto.value = '';
  aplicarFoto(fotoPreview, '');
});

editCancelar.addEventListener('click', () => {
  perfilEditForm.classList.add('hidden');
});

perfilEditForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Coleta os 4 favoritos, removendo vazios e duplicados (mantém a ordem)
  const topFavoritos = [];
  topFavSelects.forEach(sel => {
    const val = sel.value;
    if (val && !topFavoritos.includes(val)) topFavoritos.push(val);
  });

  try {
    salvarDadosPerfil({
      bio: editBio.value.trim(),
      local: editLocal.value.trim(),
      foto: fotoTemp || '',
      topFavoritos
    });
  } catch (err) {
    // localStorage cheio (foto muito grande em base64)
    alert('Não foi possível salvar a foto (muito grande). Tente uma imagem menor.');
    return;
  }
  perfilEditForm.classList.add('hidden');
  abrirPerfil(); // recarrega com os novos dados
});
