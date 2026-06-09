// ============================================================
//  APP — inicialização e atalhos globais
//  (carregado por último, depois de todos os outros módulos)
// ============================================================

// Fechar todos os modais com a tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    fecharDetalhe();
    fecharArtigo();
    fecharPerfil();
  }
});

// Inicializa a interface ao carregar a página
// (updateUI já foi estendido em movies.js para atualizar os favoritos)
updateUI();
