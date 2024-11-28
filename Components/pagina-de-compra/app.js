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
        
    // Função para buscar os detalhes do lanche
    async function fetchLancheDetails(id) {
        try {
            const response = await fetch(`http://localhost:3000/lanches/${id}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar detalhes do lanche: ' + response.statusText);
            }
            const lanche = await response.json();

            // Atualiza os detalhes da página com os dados do lanche
            document.getElementById('lanche-imagem').src = lanche.imagem;
            document.getElementById('lanche-imagem').alt = lanche.titulo;
            document.getElementById('lanche-titulo').textContent = lanche.titulo;
            document.getElementById('lanche-preco').textContent = `R$ ${lanche.preco.toFixed(2)}`;
            document.getElementById('lanche-descricao').textContent = lanche.descricao;

            // Adiciona evento ao botão "Fazer Pedido"
            const botaoFazerPedido = document.getElementById('fazer-pedido');
            botaoFazerPedido.addEventListener('click', async () => {
                // Envia o pedido para o backend
                try {
                    const pedido = {
                        cliente_id: 1, // Ajuste conforme necessário
                        lanches: [{ id: lanche.id, titulo: lanche.titulo, preco: lanche.preco }],
                        forma_pagamento: 'cartao',
                        total: lanche.preco
                    };

                    const response = await fetch('http://localhost:3000/pedidos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(pedido)
                    });

                    if (!response.ok) {
                        throw new Error('Erro ao salvar o pedido: ' + response.statusText);
                    }

                    const data = await response.json();
                    console.log(data.message);

                    // Armazena os lanches no Local Storage, mas sem a imagem
                    let lanches = JSON.parse(localStorage.getItem('lanches')) || [];
                    lanches.push({
                        id: lanche.id,
                        titulo: lanche.titulo,
                        preco: lanche.preco
                        // Não armazena a URL da imagem
                    });
                    localStorage.setItem('lanches', JSON.stringify(lanches));

                    window.location.href = 'pagina-de-pagamento.html';
                } catch (error) {
                    console.error('Erro ao fazer pedido:', error);
                    alert('Ocorreu um erro ao fazer o pedido. Tente novamente.');
                }
            });
        } catch (error) {
            console.error('Erro ao buscar detalhes do lanche:', error);
        }
    }

    // Obtém o ID do lanche da URL
    const urlParams = new URLSearchParams(window.location.search);
    const lancheId = urlParams.get('id');

    if (lancheId) {
        fetchLancheDetails(lancheId);
    }

    // Função para expandir/recolher detalhes do lanche
    let elementosDetalhes = document.querySelectorAll('.sobre');
    elementosDetalhes.forEach(function (sobre) {
        sobre.addEventListener('click', function () {
            sobre.classList.toggle('active');
        });
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
 function mostrarPopup(mensagem, tipo) {
        const popup = document.createElement('div');
        popup.className = `popup-message popup-${tipo}`;
        popup.textContent = mensagem;

        document.body.appendChild(popup);

        setTimeout(() => {
            popup.classList.add('popup-show');
        }, 100);

        setTimeout(() => {
            popup.classList.remove('popup-show');
            setTimeout(() => {
                popup.remove();
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

