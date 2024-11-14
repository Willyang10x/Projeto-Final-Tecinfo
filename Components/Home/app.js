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

        fetch('../botão-flutuante/botao.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('Carrinho').innerHTML = data;
        });
    // Carrega os lanches
    fetchLanches();
});

    // Controle do banner
    let indiceAtual = 0;
    const banners = document.querySelectorAll('.banner');
    const totalBanners = banners.length;
    const wrapperBanner = document.querySelector('.wrapper-banner');

    function mostrarBanner(indice) {
        const deslocamento = -indice * 100;
        wrapperBanner.style.transform = `translateX(${deslocamento}%)`;
    }

    function proximoBanner() {
        indiceAtual = (indiceAtual + 1) % totalBanners;
        mostrarBanner(indiceAtual);
    }

    mostrarBanner(indiceAtual);
    setInterval(proximoBanner, 3000);

  
    async function fetchLanches() {
        try {
            const response = await fetch('http://localhost:3000/lanches'); // URL correta para seu backend
            if (!response.ok) {
                throw new Error('Erro ao buscar lanches: ' + response.statusText);
            }
            const lanches = await response.json();
    
            // Agrupa os lanches por categoria
            const categorias = {};
            lanches.forEach(lanche => {
                if (!categorias[lanche.categoria]) {
                    categorias[lanche.categoria] = [];
                }
                categorias[lanche.categoria].push(lanche);
            });
    
            const produtosContainer = document.getElementById('produtos'); // Certifique-se de que o ID do contêiner no HTML é 'produtos'
            produtosContainer.innerHTML = ''; // Limpa produtos anteriores
    
            // Cria um contêiner para cada categoria
            for (const [categoria, itens] of Object.entries(categorias)) {
                const categoriaDiv = document.createElement('div');
                categoriaDiv.classList.add('categoria-container');
                const tituloCategoria = document.createElement('h2');
                tituloCategoria.textContent = categoria;
                categoriaDiv.appendChild(tituloCategoria);
    
                const produtosDiv = document.createElement('div');
                produtosDiv.classList.add('produtos');
    
                // Adiciona produtos a cada categoria
                itens.forEach(lanche => {
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
                    produtosDiv.appendChild(productDiv);
                });
    
                categoriaDiv.appendChild(produtosDiv);
                produtosContainer.appendChild(categoriaDiv); // Adiciona a categoria ao contêiner principal
            }
        } catch (error) {
            console.error('Erro ao buscar lanches:', error);
        }
    }

    // Verificação do token ao carregar a página
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    
    // Se o token não estiver presente, redireciona para a página de login
    if (!token) {
        alert("Token expirado. Por favor, faça login novamente.");
        window.location.href = '/Components/Tela de Login/login.html';
    }
});
