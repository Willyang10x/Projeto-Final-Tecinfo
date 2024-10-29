document.addEventListener('DOMContentLoaded', () => {
    // Carrega o header e o footer dinamicamente
    fetch('../Header/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o header:', error));

    fetch('../Footer/Footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o footer:', error));

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
