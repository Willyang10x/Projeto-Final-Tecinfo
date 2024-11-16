document.addEventListener('DOMContentLoaded', () => {
    fetch('/Components/Header/header.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('header-placeholder').innerHTML = data;

                    // Adiciona a funcionalidade de busca ao carregar o header
                    const script = document.createElement('script');
                    script.src = '/Components/Header/search.js';
                    document.body.appendChild(script);
                });

    fetch('../Footer/Footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
      });

});

// Verificação do token ao carregar a página
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    
    // Se o token não estiver presente, exibe o pop-up de erro e redireciona para a página de login
    if (!token) {
        showErrorPopup("Token expirado. Por favor, faça login novamente.", () => {
            window.location.href = '/Components/Tela de Login/login.html';
        });
    }
});

// Função para exibir o pop-up de erro
function showErrorPopup(message, callback) {
    const popup = document.createElement('div');
    popup.classList.add('popup-message', 'popup-error');
    popup.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('popup-show');
    }, 100);

    setTimeout(() => {
        popup.classList.remove('popup-show');
        setTimeout(() => {
            popup.remove();
            if (typeof callback === 'function') {
                callback();
            }
        }, 400);
    }, 3000);
}


document.addEventListener('mousemove', (event) => {
    // Cria um novo ponto para cada movimento do mouse
    const dot = document.createElement('div');
    dot.classList.add('cursor-dot');
    
    // Define a posição do ponto com base nas coordenadas do mouse
    dot.style.left = `${event.pageX}px`;
    dot.style.top = `${event.pageY}px`;

    // Adiciona o ponto ao body
    document.body.appendChild(dot);
    
    // Remove o ponto após um tempo para criar o efeito de cauda
    setTimeout(() => {
        dot.remove();
    }, 500); // O tempo deve coincidir com o tempo da animação em CSS
});
