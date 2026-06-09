// ============================================================
//  DATA — banco de filmes compartilhado entre as páginas
//  (catálogo de 30 filmes)
// ============================================================

// Catálogo principal — 30 filmes (1 a 10 com pôster real, 11 a 30 com placeholder)
const filmes = {
  1:  { nome: 'Devoradores De Estrelas', img: 'img/filme1.jpg', genero: 'Ficção Científica', duracao: '2h 18min', ano: 2025, nota: '8.4', sinopse: 'Um épico de ficção científica que acompanha uma civilização capaz de consumir a energia das estrelas para sobreviver. Visualmente deslumbrante e cheio de reviravoltas.' },
  2:  { nome: 'Pecadores', img: 'img/filme2.jpg', genero: 'Terror', duracao: '2h 17min', ano: 2025, nota: '7.9', sinopse: 'Dois irmãos voltam à cidade natal para recomeçar a vida, mas descobrem que um mal ancestral os aguarda. Tensão e sustos do início ao fim.' },
  3:  { nome: 'Marty Supreme', img: 'img/filme3.jpg', genero: 'Drama', duracao: '2h 10min', ano: 2025, nota: '7.6', sinopse: 'A jornada de um jovem talentoso que sonha em alcançar a grandeza, enfrentando os altos e baixos de uma carreira marcada por ambição e sacrifício.' },
  4:  { nome: 'Hamnet', img: 'img/filme4.jpg', genero: 'Drama Histórico', duracao: '2h 05min', ano: 2025, nota: '8.1', sinopse: 'Inspirado em fatos reais, narra a história por trás de uma das maiores obras já escritas, mergulhando na vida familiar e nas perdas que moldaram um gênio.' },
  5:  { nome: 'Uma Batalha Após A Outra', img: 'img/filme5.jpg', genero: 'Ação', duracao: '2h 41min', ano: 2025, nota: '8.7', sinopse: 'Um grupo de revolucionários se reúne anos depois para uma última missão. Ação intensa misturada com drama humano e crítica social afiada.' },
  6:  { nome: '12 Homens E Uma Sentença', img: 'img/filme6.png', genero: 'Drama Jurídico', duracao: '1h 36min', ano: 1957, nota: '9.0', sinopse: 'Doze jurados precisam decidir o destino de um jovem acusado de assassinato. Um clássico sobre justiça, preconceito e a força do diálogo.' },
  7:  { nome: 'Cidade De Deus', img: 'img/filme7.jpg', genero: 'Crime', duracao: '2h 10min', ano: 2002, nota: '8.6', sinopse: 'Retrato cru e vibrante da vida nas favelas do Rio de Janeiro, acompanhando a ascensão do crime organizado pelos olhos de um jovem fotógrafo.' },
  8:  { nome: 'A Lista De Schindler', img: 'img/filme8.jpg', genero: 'Drama Histórico', duracao: '3h 15min', ano: 1993, nota: '9.0', sinopse: 'A história real de um empresário que salvou a vida de mais de mil judeus durante o Holocausto. Uma obra-prima sobre coragem e humanidade.' },
  9:  { nome: 'Batman: O Cavaleiro Das Trevas', img: 'img/filme9.jpg', genero: 'Ação', duracao: '2h 32min', ano: 2008, nota: '9.0', sinopse: 'Batman enfrenta o Coringa, um criminoso caótico decidido a mergulhar Gotham no caos. Um dos maiores filmes de super-herói já feitos.' },
  10: { nome: 'Túmulo Dos Vagalumes', img: 'img/filme10.jpg', genero: 'Animação', duracao: '1h 29min', ano: 1988, nota: '8.5', sinopse: 'Dois irmãos lutam para sobreviver no Japão durante os últimos meses da Segunda Guerra Mundial. Uma das animações mais emocionantes do cinema.' },
  11: { nome: 'Forrest Gump', genero: 'Drama', duracao: '2h 22min', ano: 1994, nota: '8.8', sinopse: 'A vida extraordinária de um homem simples que, sem perceber, atravessa alguns dos maiores momentos da história americana movido pelo amor e pela bondade.' },
  12: { nome: 'O Senhor Dos Anéis: A Sociedade Do Anel', genero: 'Fantasia', duracao: '2h 58min', ano: 2001, nota: '8.9', sinopse: 'Um jovem hobbit herda um anel poderoso e parte numa jornada épica para destruí-lo, acompanhado de uma sociedade improvável de aliados.' },
  13: { nome: 'Pulp Fiction', genero: 'Crime', duracao: '2h 34min', ano: 1994, nota: '8.9', sinopse: 'Histórias entrelaçadas de gângsteres, um boxeador e um casal de assaltantes se cruzam em uma narrativa não-linear cheia de diálogos memoráveis.' },
  14: { nome: 'Clube Da Luta', genero: 'Drama', duracao: '2h 19min', ano: 1999, nota: '8.8', sinopse: 'Um homem insatisfeito com a vida funda um clube de luta clandestino que rapidamente se transforma em algo muito maior e mais perigoso.' },
  15: { nome: 'Interestelar', genero: 'Ficção Científica', duracao: '2h 49min', ano: 2014, nota: '8.7', sinopse: 'Com a Terra à beira do colapso, um grupo de exploradores cruza um buraco de minhoca em busca de um novo lar para a humanidade.' },
  16: { nome: 'Matrix', genero: 'Ficção Científica', duracao: '2h 16min', ano: 1999, nota: '8.7', sinopse: 'Um hacker descobre que a realidade é uma simulação e se junta a uma rebelião contra as máquinas que controlam a humanidade.' },
  17: { nome: 'Gladiador', genero: 'Ação', duracao: '2h 35min', ano: 2000, nota: '8.5', sinopse: 'Traído e reduzido à escravidão, um general romano luta como gladiador para vingar a morte da família e do imperador.' },
  18: { nome: 'O Poderoso Chefão', genero: 'Crime', duracao: '2h 55min', ano: 1972, nota: '9.2', sinopse: 'A saga de uma família da máfia ítalo-americana e a transformação do filho relutante no novo chefe do império criminoso.' },
  19: { nome: 'Whiplash: Em Busca Da Perfeição', genero: 'Drama', duracao: '1h 46min', ano: 2014, nota: '8.5', sinopse: 'Um jovem baterista ambicioso enfrenta um instrutor implacável que fará de tudo para levá-lo ao limite em nome da grandeza.' },
  20: { nome: 'Parasita', genero: 'Suspense', duracao: '2h 12min', ano: 2019, nota: '8.5', sinopse: 'Uma família pobre se infiltra na casa de uma família rica, e o plano se desenrola em camadas surpreendentes sobre desigualdade social.' },
  21: { nome: 'O Rei Leão', genero: 'Animação', duracao: '1h 28min', ano: 1994, nota: '8.5', sinopse: 'Um jovem leão precisa enfrentar o tio traiçoeiro e reivindicar seu lugar como rei após a morte do pai.' },
  22: { nome: 'De Volta Para O Futuro', genero: 'Aventura', duracao: '1h 56min', ano: 1985, nota: '8.5', sinopse: 'Um adolescente viaja acidentalmente para o passado em um carro do tempo e precisa garantir que seus pais se apaixonem.' },
  23: { nome: 'O Silêncio Dos Inocentes', genero: 'Suspense', duracao: '1h 58min', ano: 1991, nota: '8.6', sinopse: 'Uma agente do FBI recorre a um brilhante psiquiatra canibal para capturar outro assassino em série à solta.' },
  24: { nome: 'Coringa', genero: 'Drama', duracao: '2h 02min', ano: 2019, nota: '8.4', sinopse: 'Um comediante fracassado e marginalizado mergulha na loucura e se transforma em um ícone do caos em Gotham.' },
  25: { nome: 'Vingadores: Ultimato', genero: 'Ação', duracao: '3h 01min', ano: 2019, nota: '8.4', sinopse: 'Os heróis remanescentes se unem em uma última tentativa de reverter a devastação causada por Thanos.' },
  26: { nome: 'Bastardos Inglórios', genero: 'Guerra', duracao: '2h 33min', ano: 2009, nota: '8.3', sinopse: 'Durante a Segunda Guerra, um grupo de soldados judeus espalha o terror entre os nazistas enquanto um plano de vingança se desenha.' },
  27: { nome: 'A Origem', genero: 'Ficção Científica', duracao: '2h 28min', ano: 2010, nota: '8.8', sinopse: 'Um ladrão que invade sonhos recebe a missão impossível de plantar uma ideia na mente de um alvo em vez de roubá-la.' },
  28: { nome: 'O Lobo De Wall Street', genero: 'Comédia Dramática', duracao: '3h 00min', ano: 2013, nota: '8.2', sinopse: 'A ascensão e queda de um corretor da bolsa que construiu uma fortuna através de fraudes e excessos sem limites.' },
  29: { nome: 'Toy Story', genero: 'Animação', duracao: '1h 21min', ano: 1995, nota: '8.3', sinopse: 'Os brinquedos de um menino ganham vida quando ninguém está olhando, e a chegada de um novo brinquedo abala velhas amizades.' },
  30: { nome: 'La La Land: Cantando Estações', genero: 'Musical', duracao: '2h 08min', ano: 2016, nota: '8.0', sinopse: 'Uma atriz e um pianista de jazz se apaixonam em Los Angeles enquanto perseguem seus sonhos, testando o equilíbrio entre amor e ambição.' }
};

// Retorna um filme do catálogo pelo id
function getFilme(id) {
  return filmes[id] || null;
}

// Define o caminho de imagem esperado para os filmes que ainda não têm pôster.
// Basta colocar o arquivo na pasta img/ com esse nome que ele passa a aparecer.
Object.keys(filmes).forEach(id => {
  if (!filmes[id].img) filmes[id].img = `img/filme${id}.jpg`;
});

// Gera uma cor de placeholder consistente a partir do nome do filme
function corPlaceholder(nome) {
  let h = 0;
  for (const c of nome) h = (h + c.charCodeAt(0) * 7) % 360;
  return h;
}

// Markup do pôster-placeholder (gradiente + nome do filme)
function posterPlaceholder(nome) {
  const h = corPlaceholder(nome);
  const grad = `linear-gradient(150deg, hsl(${h} 48% 32%), hsl(${(h + 45) % 360} 50% 16%))`;
  return `<div class="poster-ph" style="background:${grad}"><span>${nome}</span></div>`;
}

// Troca uma imagem que falhou ao carregar pelo placeholder
function trocarPorPlaceholder(img) {
  img.insertAdjacentHTML('afterend', posterPlaceholder(img.dataset.nome || ''));
  img.remove();
}

// Retorna o markup do pôster: usa a imagem se carregar, senão o placeholder
function posterMarkup(f) {
  const nomeAttr = f.nome.replace(/"/g, '&quot;');
  if (f.img) {
    return `<img src="${f.img}" alt="Pôster de ${f.nome}" data-nome="${nomeAttr}" onerror="trocarPorPlaceholder(this)">`;
  }
  return posterPlaceholder(f.nome);
}
