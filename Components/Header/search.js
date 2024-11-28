// Função para carregar os dados do usuário logado
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

// Função para fazer logout
document.getElementById('logout').addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');

    // Redireciona para a tela de login após logout
    window.location.href = '/Components/Tela de Login/login.html?status=logout_sucesso';
});

// Chama a função para carregar os dados ao carregar a página
document.addEventListener('DOMContentLoaded', carregarDadosUsuario);

// Pesquisa de Lanches
document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value;
    if (searchTerm) {
        // Redireciona para a página de categorias com o termo de pesquisa
        window.location.href = `/Components/pagina-de-categoria/pagina-de-categoria.html?search=${encodeURIComponent(searchTerm)}`;
    }
});

// Verifica o token ao carregar a página
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        showErrorPopup("Token expirado. Por favor, faça login novamente.", () => {
            window.location.href = '/Components/Tela de Login/login.html';
        });
    } else {
        carregarDadosUsuario(); // Carrega os dados do usuário se o token estiver presente
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


// Função que faz a busca dos lanches no servidor
function fetchLanches(searchTerm) {
    // Faz a requisição para o backend com o termo de pesquisa
    fetch(`http://localhost:3000/lanches/search/${searchTerm}`)
        .then(response => response.json())
        .then(lanches => {
            const resultadosContainer = document.getElementById('resultados');
            resultadosContainer.innerHTML = ''; // Limpa os resultados anteriores

            if (lanches.length === 0) {
                resultadosContainer.innerHTML = '<p>Nenhum resultado encontrado</p>';
            } else {
                lanches.forEach(lanche => {
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product');

                    productDiv.innerHTML = `
                        <img src="${lanche.imagem}" alt="${lanche.titulo}">
                        <h3>${lanche.titulo}</h3>
                        <p>R$ ${lanche.preco.toFixed(2)}</p>
                        <a href="/Components/pagina-de-compra/pagina-de-compra.html?id=${lanche.id}">
                            <button>Conferir</button>
                        </a>
                    `;
                    resultadosContainer.appendChild(productDiv);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar os lanches:', error);
        });
}