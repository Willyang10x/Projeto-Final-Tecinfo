document.addEventListener('DOMContentLoaded', () => {
    // Carrega o cabeçalho
    fetch('../Header/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
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

    // Função para buscar lanches
    async function fetchLanches(searchTerm = '') {
        try {
            let url = 'http://localhost:3000/lanches';
            if (searchTerm) {
                url += `/search/${searchTerm}`;
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

            if (searchTerm) {
                // Exibe resultados da busca
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
                    produtosContainer.appendChild(productDiv);
                });
            } else {
                // Agrupa por categoria se não houver termo de busca
                const categorias = {};
                lanches.forEach(lanche => {
                    if (!categorias[lanche.categoria]) categorias[lanche.categoria] = [];
                    categorias[lanche.categoria].push(lanche);
                });

                for (const [categoria, itens] of Object.entries(categorias)) {
                    const categoriaDiv = document.createElement('div');
                    categoriaDiv.classList.add('categoria-container');
                    const tituloCategoria = document.createElement('h2');
                    tituloCategoria.textContent = categoria;
                    categoriaDiv.appendChild(tituloCategoria);

                    const produtosDiv = document.createElement('div');
                    produtosDiv.classList.add('produtos');
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
                    produtosContainer.appendChild(categoriaDiv);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar lanches:', error);
        }
    }

    // Captura parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search') || ''; // Captura o termo de busca inicial
    const categoria = urlParams.get('categoria') || 'Mais Quentes'; // Captura a categoria, se existir

    // Carrega lanches com base no termo de busca e na categoria
    fetchLanches(searchTerm);

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
