// ============================================================
//  AUTH — menu mobile, login, cadastro e estado da sessão
// ============================================================

// ===== MENU HAMBURGER =====
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});

// ===== SISTEMA DE LOGIN =====
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const goToRegister = document.getElementById('goToRegister');
const goToLogin = document.getElementById('goToLogin');
const formLogin = document.getElementById('formLogin');
const formRegister = document.getElementById('formRegister');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const buttonLog = document.querySelector('.buttonlog');

// Abrir modal
function openModal() {
  modalOverlay.classList.add('active');
  tabLogin.classList.remove('hidden');
  tabRegister.classList.add('hidden');
  loginError.textContent = '';
  registerError.textContent = '';
}

// Fechar modal
function closeModal() {
  modalOverlay.classList.remove('active');
  formLogin.reset();
  formRegister.reset();
  loginError.textContent = '';
  registerError.textContent = '';
}

// Alternar entre abas
goToRegister.addEventListener('click', (e) => {
  e.preventDefault();
  tabLogin.classList.add('hidden');
  tabRegister.classList.remove('hidden');
  loginError.textContent = '';
});

goToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  tabRegister.classList.add('hidden');
  tabLogin.classList.remove('hidden');
  registerError.textContent = '';
});

// Fechar modal
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ===== CADASTRO =====
formRegister.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('regNome').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const senha = document.getElementById('regSenha').value;
  const confirm = document.getElementById('regConfirm').value;

  // Validações
  if (!nome || !email || !senha || !confirm) {
    registerError.textContent = 'Preencha todos os campos.';
    return;
  }
  if (!email.includes('@') || !email.includes('.')) {
    registerError.textContent = 'Email inválido.';
    return;
  }
  if (senha.length < 6) {
    registerError.textContent = 'A senha deve ter no mínimo 6 caracteres.';
    return;
  }
  if (senha !== confirm) {
    registerError.textContent = 'As senhas não coincidem.';
    return;
  }

  // Verificar se já existe
  const users = JSON.parse(localStorage.getItem('telesine_users') || '[]');
  if (users.find(u => u.email === email)) {
    registerError.textContent = 'Este email já está cadastrado.';
    return;
  }

  // Salvar usuário
  users.push({ nome, email, senha });
  localStorage.setItem('telesine_users', JSON.stringify(users));

  // Login automático
  loginUser({ nome, email });
  closeModal();
});

// ===== LOGIN =====
formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value;

  if (!email || !senha) {
    loginError.textContent = 'Preencha todos os campos.';
    return;
  }

  const users = JSON.parse(localStorage.getItem('telesine_users') || '[]');
  const user = users.find(u => u.email === email && u.senha === senha);

  if (!user) {
    loginError.textContent = 'Email ou senha incorretos.';
    return;
  }

  loginUser(user);
  closeModal();
});

// ===== GERENCIAR ESTADO LOGADO =====
function loginUser(user) {
  localStorage.setItem('telesine_session', JSON.stringify({ nome: user.nome, email: user.email }));
  updateUI();
}

function logoutUser() {
  localStorage.removeItem('telesine_session');
  updateUI();
}

function updateUI() {
  const session = JSON.parse(localStorage.getItem('telesine_session'));

  if (session) {
    // Usuário logado — mostra nome e botão de logout
    buttonLog.innerHTML = `
      <button class="user-name" type="button" aria-label="Abrir perfil">${session.nome}</button>
      <button class="buttonarrow btn-logout" type="button" aria-label="Sair">⏻</button>
    `;
    // Abrir perfil ao clicar no nome
    buttonLog.querySelector('.user-name').addEventListener('click', abrirPerfil);
    // Evento de logout
    buttonLog.querySelector('.btn-logout').addEventListener('click', logoutUser);
  } else {
    // Não logado — mostra botão de login
    buttonLog.innerHTML = `
      <button class="buttonmain" type="button">+ LOG</button>
      <button class="buttonarrow" type="button" aria-label="Mais opções">▾</button>
    `;
    // Evento de abrir modal
    buttonLog.querySelector('.buttonmain').addEventListener('click', openModal);
    buttonLog.querySelector('.buttonarrow').addEventListener('click', openModal);
  }
}
