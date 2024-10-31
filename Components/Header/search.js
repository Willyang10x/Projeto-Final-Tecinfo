document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value;
    if (searchTerm) {
        fetchLanches(searchTerm);
    }
});

function fetchLanches(searchTerm) {
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

            // Exibe o overlay com os resultados
            document.getElementById('overlay').style.display = 'flex';
        })
        .catch(error => {
            console.error('Erro ao buscar os lanches:', error);
        });
}

// Fecha o overlay ao clicar no botão de fechar
document.getElementById('closeOverlay').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'none';
});
