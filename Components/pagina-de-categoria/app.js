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

    // Função para buscar lanches
    async function fetchLanches(categoria) {
        try {
            const response = await fetch(`http://localhost:3000/lanchesCategoria?categoria=${categoria}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos: ' + response.statusText);
            }
            const lanches = await response.json();

            const produtosContainer = document.getElementById('produtos');
            produtosContainer.innerHTML = '';

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

            // Adiciona a rolagem horizontal
            const scrollContainer = document.getElementById('produtos');
            scrollContainer.addEventListener('wheel', (event) => {
                if (event.deltaY !== 0) {
                    scrollContainer.scrollLeft += event.deltaY; // Rola para a direita ou esquerda
                    event.preventDefault(); // Previne o comportamento padrão de rolagem vertical
                }
            });
        } catch (error) {
            console.error('Erro ao buscar lanches:', error);
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria') || 'Mais Quentes';
    fetchLanches(categoria);
});
