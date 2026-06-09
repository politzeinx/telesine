// ============================================================
//  ARTICLES — conteúdo dos artigos e navegação do menu
// ============================================================

// ===== CONTEÚDO COMPLETO DOS ARTIGOS =====
const artigos = {
  1: {
    tag: 'Análise',
    img: 'img/filme1.1.jpg',
    titulo: 'Por que Devoradores de Estrelas é o filme mais aguardado de 2025',
    meta: '10 abr. 2025 · 5 min de leitura',
    corpo: [
      'A ficção científica volta com força total neste épico que promete redefinir o gênero nas telas. Desde o primeiro teaser, o público não fala de outra coisa, e os números de expectativa batem recordes nas plataformas de pré-venda.',
      'O diretor aposta numa narrativa ambiciosa: uma civilização capaz de consumir a energia das estrelas para sobreviver, enquanto enfrenta dilemas morais sobre o preço dessa sobrevivência. A direção de fotografia já é apontada como uma das mais impressionantes da década.',
      'Mais do que efeitos visuais, o filme promete profundidade. Os roteiristas trabalharam por três anos para equilibrar espetáculo e emoção, e os primeiros testes de plateia indicam que o resultado agradou tanto fãs do gênero quanto o público casual.',
      'Resta saber se a estreia vai corresponder ao hype. Mas uma coisa é certa: Devoradores de Estrelas já garantiu seu lugar entre os lançamentos mais comentados do ano.'
    ]
  },
  2: {
    tag: 'Clássico',
    img: 'img/filme7.2.jpg',
    titulo: 'Cidade de Deus, 20 anos depois: o legado que não some',
    meta: '28 mar. 2025 · 4 min de leitura',
    corpo: [
      'Duas décadas após sua estreia, Cidade de Deus continua sendo um marco do cinema brasileiro e mundial. O retrato cru e vibrante da vida nas favelas do Rio de Janeiro ainda impacta novas gerações de espectadores.',
      'A montagem frenética, a fotografia ensolarada e as atuações naturais de um elenco majoritariamente amador criaram uma linguagem própria, copiada e estudada em escolas de cinema do mundo inteiro.',
      'O filme abriu portas para que histórias periféricas ganhassem espaço nas grandes produções, influenciando uma onda de obras que colocaram o Brasil no mapa do cinema internacional.',
      'Hoje, revê-lo é entender não só uma época, mas o poder do cinema de transformar realidades em arte universal. Um legado que, claramente, não some com o tempo.'
    ]
  },
  3: {
    tag: 'Lista',
    img: 'img/filme9.1.jpg',
    titulo: 'Os 10 filmes de super-herói mais bem avaliados de todos os tempos',
    meta: '15 mar. 2025 · 6 min de leitura',
    corpo: [
      'O gênero de super-heróis dominou as bilheterias nas últimas duas décadas, mas alguns títulos se destacam não só pelo sucesso comercial, como também pela crítica e pelo público.',
      'No topo da lista, Batman: O Cavaleiro das Trevas segue imbatível. A atuação inesquecível como o Coringa e a abordagem realista elevaram o filme muito além das expectativas para o gênero.',
      'Logo atrás vêm produções que ousaram quebrar fórmulas: histórias de origem emocionantes, vilões complexos e roteiros que tratam o público com inteligência. A presença de personagens com profundidade psicológica virou regra entre os melhores.',
      'A lista prova que, quando bem feito, o filme de super-herói pode ir muito além da ação: pode comentar a sociedade, explorar o luto, a identidade e o que significa ser humano diante do extraordinário.'
    ]
  }
};

const artigoOverlay = document.getElementById('artigoOverlay');
const artigoClose = document.getElementById('artigoClose');
const artigoModalImg = document.getElementById('artigoModalImg');
const artigoModalTag = document.getElementById('artigoModalTag');
const artigoModalTitulo = document.getElementById('artigoModalTitulo');
const artigoModalMeta = document.getElementById('artigoModalMeta');
const artigoModalTexto = document.getElementById('artigoModalTexto');

function abrirArtigo(id) {
  const a = artigos[id];
  if (!a) return;
  artigoModalImg.src = a.img;
  artigoModalImg.alt = a.titulo;
  artigoModalTag.textContent = a.tag;
  artigoModalTitulo.textContent = a.titulo;
  artigoModalMeta.textContent = a.meta;
  artigoModalTexto.innerHTML = a.corpo.map(p => `<p>${escapeHtml(p)}</p>`).join('');
  artigoOverlay.classList.add('active');
}

function fecharArtigo() {
  artigoOverlay.classList.remove('active');
}

artigoClose.addEventListener('click', fecharArtigo);
artigoOverlay.addEventListener('click', (e) => {
  if (e.target === artigoOverlay) fecharArtigo();
});

// Liga clique e teclado nos artigos
document.querySelectorAll('.artigo[data-article]').forEach(art => {
  art.addEventListener('click', () => abrirArtigo(art.dataset.article));
  art.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      abrirArtigo(art.dataset.article);
    }
  });
});

// ===== NAVEGAÇÃO DO MENU =====
const menuLinks = document.querySelectorAll('.menu a[data-target]');

menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const alvo = document.getElementById(link.dataset.target);
    if (alvo) {
      alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Atualiza item ativo
    menuLinks.forEach(l => {
      l.classList.remove('active');
      l.removeAttribute('aria-current');
    });
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');

    // Fecha o menu no mobile
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});
