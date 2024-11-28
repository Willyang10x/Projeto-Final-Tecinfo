function carregarDadosUsuario() {
    // Recupera os dados do localStorage
    const nomeUsuario = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');

    // Verifica se os dados existem no localStorage
    if (nomeUsuario && email) {
        // Atualiza os elementos com os dados
        document.getElementById('userName').innerText = nomeUsuario;
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

    // Carregar o botão flutuante
    fetch('../botão-flutuante/botao.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('Carrinho').innerHTML = data;
        });

    // Função para buscar lanches por termo de busca ou categoria
    async function fetchLanches(searchTerm = '', categoria = '') {
        try {
            let url;
            if (searchTerm) {
                url = `http://localhost:3000/lanches/search/${searchTerm}`;
            } else {
                url = `http://localhost:3000/lanchesCategoria?categoria=${categoria}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro ao buscar lanches: ' + response.statusText);

            const lanches = await response.json();
            const produtosContainer = document.getElementById('produtos');
            produtosContainer.innerHTML = '';

            if (lanches.length === 0) {
                produtosContainer.innerHTML = '<p>Nenhum resultado encontrado</p>';
                return;
            }

            lanches.forEach(lanche => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <img src="${lanche.imagem}" alt="${lanche.titulo}">
                    <p>${lanche.titulo}</p>
                    <p>R$ ${lanche.preco.toFixed(2)}</p>
                    <a href="/Components/pagina-de-compra/pagina-de-compra.html?id=${lanche.id}">
                        <button>Conferir</button>
                    </a>
                `;
                produtosContainer.appendChild(productDiv);
            });
        } catch (error) {
            console.error('Erro ao buscar lanches:', error);
        }
    }

    // Captura parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search') || ''; // Captura o termo de busca inicial
    const categoria = urlParams.get('categoria') || 'Mais Quentes'; // Captura a categoria, se existir

    // Carrega lanches com base no termo de busca ou na categoria
    fetchLanches(searchTerm, categoria);

    // Lida com a pesquisa dinamicamente
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = searchTerm; // Define o valor do campo de busca com o termo de busca da URL
        searchInput.addEventListener('input', (event) => {
            const searchQuery = event.target.value.trim();
            // Atualiza a URL com o novo termo de busca
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('search', searchQuery);
            window.history.pushState({}, '', newUrl);
            fetchLanches(searchQuery); // Recarrega os lanches conforme o termo de busca
        });
    }
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
