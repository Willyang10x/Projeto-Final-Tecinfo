// Função para carregar os dados do usuário logado
function carregarDadosUsuario() {
    // Recupera os dados do localStorage
    const nomeUsuario = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');

    // Verifica se os dados existem no localStorage
    if (nomeUsuario && email) {
        // Pega o primeiro e o segundo nome do usuário (considera que o nome é separado por espaços)
        const nomes = nomeUsuario.split(' ');
        const primeiroESegundoNome = nomes.length > 1 ? nomes[0] + ' ' + nomes[1] : nomes[0];

        // Atualiza os elementos com os dados
        document.getElementById('userName').innerText = primeiroESegundoNome;
        document.getElementById('userEmail').innerText = email;
    } else {
        // Se não houver dados no localStorage, exibe uma mensagem de erro
        console.log('Usuário não encontrado no localStorage.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Carregar o header
    fetch('/Components/Header/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;

            // Adiciona a funcionalidade de busca ao carregar o header
            const script = document.createElement('script');
            script.src = '/Components/Header/search.js';
            document.body.appendChild(script);

            // Chama a função carregarDadosUsuario() após carregar o header
            carregarDadosUsuario();
        });

    // Carregar o footer
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
