document.addEventListener('DOMContentLoaded', () => {
    // Carrega o cabeçalho
    fetch('/Components/Header/header.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('header-placeholder').innerHTML = data;

                    // Adiciona a funcionalidade de busca ao carregar o header
                    const script = document.createElement('script');
                    script.src = '/Components/Header/search.js';
                    document.body.appendChild(script);
                });

    // Carrega o rodapé
    fetch('../Footer/Footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
        
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


