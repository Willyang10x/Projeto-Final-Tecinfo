async function fetchLanches() {
    try {
        const response = await fetch('http://localhost:3000/lanches'); // Use a URL completa se necessário
        if (!response.ok) {
            throw new Error('Erro ao buscar lanches: ' + response.statusText);
        }
        const lanches = await response.json();
        
        const produtosContainer = document.getElementById('produtos'); // Certifique-se de que o ID do contêiner no HTML é 'produtos'

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
            
            produtosContainer.appendChild(productDiv); // Adiciona todos os produtos a um único contêiner
        });
    } catch (error) {
        console.error('Erro ao buscar lanches:', error);
    }
}

// Chama a função para carregar os lanches ao carregar a página
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

    // Carrega os lanches
    fetchLanches();

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
});
