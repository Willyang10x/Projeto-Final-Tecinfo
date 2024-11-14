document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value;
    if (searchTerm) {
        // Redireciona para a página de categorias com o termo de pesquisa
        window.location.href = `/Components/pagina-de-categoria/pagina-de-categoria.html?search=${encodeURIComponent(searchTerm)}`;
    }
});


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

document.getElementById('logout').addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('token');

    // Redireciona para a página de login com um parâmetro para mensagem de logout bem-sucedido
    if (!localStorage.getItem('token')) {
        window.location.href = '/Components/Tela de Login/login.html?status=logout_sucesso';
    } else {
        alert("Erro ao desconectar.");
    }
});

