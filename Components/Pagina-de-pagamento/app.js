document.addEventListener('DOMContentLoaded', () => {
    // Carrega o header e footer dinamicamente
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

    // Inicializa a lista de lanches selecionados do localStorage
    const lanchesSelecionados = JSON.parse(localStorage.getItem('lanchesSelecionados')) || [];
    const totalElement = document.getElementById('total-pedido');
    const lanchesList = document.getElementById('lanches-selecionados');

    // Função para atualizar o valor total e exibir os lanches selecionados
    function atualizarLanches() {
        let total = 0;
        lanchesList.innerHTML = ''; // Limpa a lista de lanches
        lanchesSelecionados.forEach(lanche => {
            total += lanche.preco;
            const li = document.createElement('li');
            li.textContent = `${lanche.titulo} - R$ ${lanche.preco.toFixed(2)}`;
            lanchesList.appendChild(li);
        });
        totalElement.textContent = `R$ ${total.toFixed(2)}`; // Atualiza o total formatado
        localStorage.setItem('totalPedido', total.toFixed(2)); // Armazena o total no localStorage
    }

    // Exibir mini página para seleção de lanches
    document.getElementById('adicionar-lanche').addEventListener('click', mostrarMiniPaginaLanches);

    // Função para mostrar a mini página de lanches
    function mostrarMiniPaginaLanches() {
        const miniPagina = document.getElementById('mini-pagina-lanches');
        const listaLanches = document.getElementById('lista-lanches');
        listaLanches.innerHTML = ''; // Limpa a lista anterior

        // Buscar lanches do banco de dados
        fetch('/api/lanches') // Endpoint para obter lanches
            .then(response => response.json())
            .then(lanches => {
                lanches.forEach(lanche => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <img src="${lanche.imagem}" alt="${lanche.titulo}" style="width:100px;height:auto;">
                        <h4>${lanche.titulo} - R$ ${lanche.preco.toFixed(2)}</h4>
                        <button class="adicionar-lanche" data-id="${lanche.id}" data-preco="${lanche.preco}" data-titulo="${lanche.titulo}">Adicionar</button>
                    `;
                    listaLanches.appendChild(div);
                });
            })
            .catch(error => console.error('Erro ao buscar lanches:', error));

        miniPagina.style.display = 'block'; // Mostra a mini página
    }

    // Adiciona lanches selecionados
    document.addEventListener('DOMContentLoaded', () => {
        const pedido = JSON.parse(localStorage.getItem('pedido')) || {};
    
        if (pedido.lanches) {
            const lanchesList = document.getElementById('lanches-confirmados');
            lanchesList.innerHTML = ''; // Limpa a lista anterior
    
            pedido.lanches.forEach(lanche => {
                const li = document.createElement('li');
                li.textContent = `${lanche.titulo} - R$ ${lanche.preco.toFixed(2)}`;
                lanchesList.appendChild(li);
            });
    
            const totalElement = document.getElementById('total-pedido-confirmacao');
            totalElement.textContent = `Total: R$ ${pedido.total.toFixed(2)}`; // Atualiza o total
        }
    });

    // Atualizar a lista de lanches e o total
    atualizarLanches(); // Chama aqui para inicializar a lista na página de pagamento

    // Função para finalizar o pedido
    document.getElementById('finalizar-pedido').addEventListener('click', async () => {
        const pedido = {
            cliente_id: 1, // Exemplo de ID do cliente, ajuste conforme necessário
            lanches: lanchesSelecionados.map(lanche => ({
                id: lanche.id,
                titulo: lanche.titulo,
                preco: lanche.preco
            })),
            forma_pagamento: document.querySelector('input[name="payment-method"]:checked').value,
            total: lanchesSelecionados.reduce((acc, lanche) => acc + lanche.preco, 0) // Calcula o total
        };
    
        const response = await fetch('/inserir-pedido', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });
    
        if (response.ok) {
            alert('Pedido finalizado com sucesso!');
            localStorage.removeItem('lanchesSelecionados'); // Limpa os lanches após finalizar
            window.location.href = 'pagina-confirmacao.html'; // Redireciona para a página de confirmação
        } else {
            alert('Erro ao finalizar o pedido');
        }
    });

    // Exibir/esconder campos de pagamento de acordo com a forma de pagamento
    document.querySelectorAll('input[name="payment-method"]').forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'cartao') {
                document.getElementById('credit-card-info').style.display = 'block';
                document.getElementById('qr-code').style.display = 'none';
            } else if (this.value === 'pix') {
                document.getElementById('credit-card-info').style.display = 'none';
                generateQrCode(); // Gerar QR Code para o pagamento via PIX
            } else {
                document.getElementById('credit-card-info').style.display = 'none';
                document.getElementById('qr-code').style.display = 'none';
            }
        });
    });

    // Função para gerar o QR Code do PIX
    function generateQrCode() {
        const totalValue = lanchesSelecionados.reduce((acc, lanche) => acc + lanche.preco, 0); // Valor do pedido
        const pixData = `00020101021226940014BR.GOV.BCB.PIX0136chavepixexemplo@dominio.com5204000053039865404${totalValue.toFixed(2)}5802BR5909NomeCliente6009Cidade62070503***6304ABC12345`;
        document.getElementById('qr-img').src = `assets/images/qr-code-pix/${encodeURIComponent(pixData)}.png`; // Ajuste para a pasta assets
        document.getElementById('qr-code').style.display = 'block';
    }

    // Atualiza os detalhes da página de pagamento
    if (lanchesSelecionados.length > 0) {
        atualizarLanches(); // Atualiza a lista e total na página de pagamento
    }
});
