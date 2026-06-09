# 🎬 Telesine

Catálogo de filmes em formato de site, com sistema de login, perfil de usuário, avaliações e marcação de filmes assistidos. Projeto front-end feito com **HTML, CSS e JavaScript puro** (sem frameworks), usando o `localStorage` do navegador para guardar os dados.

## ✨ Funcionalidades

- **Login e cadastro** — criar conta, entrar e manter a sessão (continua logado ao recarregar).
- **Catálogo de 30 filmes** — página dedicada com busca e filtro por gênero.
- **Busca global** — a busca da home procura em todos os filmes do catálogo.
- **Detalhes do filme** — modal com pôster, sinopse, gênero, duração, ano e nota.
- **Marcar como assistido** — botão de "olho" nos cards; gera o histórico de assistidos.
- **Avaliações e comentários** — nota em estrelas (1 a 5) e comentário por filme.
- **Perfil do usuário** (estilo Letterboxd):
  - Foto de perfil, bio e localização editáveis.
  - **4 favoritos de todos os tempos** escolhidos a dedo.
  - Últimos filmes assistidos e estatísticas (assistidos, avaliações, nota média).
- **Artigos** — notícias/análises com leitura em modal.
- **Design responsivo** — adaptado para celular e tablet.

## 📁 Estrutura do projeto

```
luis site/
├── pages/
│   ├── index.html        # Página inicial (home)
│   └── catalogo.html     # Catálogo completo de filmes
├── css/
│   ├── base.css          # Variáveis, reset e estilos globais
│   ├── layout.css        # Navbar, header, seções, footer, menu mobile
│   ├── components.css    # Botões, busca, cards, grid, artigos, parceiros
│   ├── responsive.css    # Media queries (tablet e celular)
│   └── modals.css        # Login, detalhes, avaliações e perfil
├── js/
│   ├── data.js           # Banco de filmes + funções de pôster
│   ├── auth.js           # Menu mobile, login, cadastro e sessão
│   ├── movies.js         # Busca, detalhes e assistidos (home)
│   ├── reviews.js        # Avaliações e comentários (home)
│   ├── articles.js       # Artigos e navegação do menu (home)
│   ├── profile.js        # Perfil do usuário
│   ├── app.js            # Inicialização da home
│   ├── site.js           # Miolo reutilizável (catálogo): sessão, detalhes, avaliações
│   └── catalogo.js       # Renderização e filtros da página de catálogo
├── img/                  # Imagens (pôsteres, banners, artigos)
└── favicon/              # Ícone do site e documentos
```

## 🚀 Como executar

Por ser um site estático, basta abrir o arquivo no navegador:

```
pages/index.html
```

Não precisa de servidor nem instalação. Recomendado abrir no Google Chrome ou Firefox.

## 🖼️ Sobre os pôsteres

Os filmes 1 a 10 têm pôsteres reais na pasta `img/`. Os demais (11 a 30) procuram os arquivos `img/filme11.jpg` a `img/filme30.jpg` — se o arquivo não existir, o card exibe automaticamente um **pôster-placeholder** com gradiente e o nome do filme. Para usar um pôster real, basta colocar a imagem na pasta `img/` com o nome correspondente.

## 💾 Armazenamento dos dados

Todos os dados (usuários, sessão, assistidos, avaliações e perfil) são salvos no **`localStorage`** do navegador. Isso significa que:

- Os dados ficam apenas no navegador/máquina onde foram criados.
- Limpar os dados do navegador apaga as contas e o histórico.

## 🛠️ Tecnologias

- HTML5 (semântico)
- CSS3 (Flexbox, Grid, variáveis CSS, media queries)
- JavaScript (ES6+, sem frameworks)
- [Font Awesome](https://fontawesome.com/) — ícones
- [Google Fonts](https://fonts.google.com/) — fontes Poppins, Coiny e Inter

---

Feito com ❤ no Brasil.
