document.addEventListener('DOMContentLoaded', () => {
    // Função para carregar o header e footer dinamicamente
    const loadHTML = async (url, placeholderId) => {
        try {
            const response = await fetch(url);
            const data = await response.text();
            document.getElementById(placeholderId).innerHTML = data;
        } catch (error) {
            console.error(`Erro ao carregar ${placeholderId}:`, error);
        }
    };

    loadHTML('../Header/header.html', 'header-placeholder');
    loadHTML('../Footer/Footer.html', 'footer-placeholder');

    // Inicializa a lista de lanches selecionados do localStorage
    const lanchesSelecionados = JSON.parse(localStorage.getItem('lanchesSelecionados')) || [];
    const totalElement = document.getElementById('total-pedido');
    const lanchesList = document.getElementById('lanches-selecionados');

    // Função para atualizar o valor total e exibir os lanches selecionados
    function atualizarLanches() {
        let total = 0;
        lanchesList.innerHTML = ''; // Limpa a lista de lanches

        lanchesSelecionados.forEach((lanche, index) => {
            total += lanche.preco; // Adiciona o preço do lanche ao total

            // Cria um elemento 'li' para o lanche
            const li = document.createElement('li');
            const lancheDiv = document.createElement('div');
            lancheDiv.classList.add('lanche');

            // Cria um elemento de imagem
            const img = document.createElement('img');
            img.src = lanche.imagem; // Supondo que você tenha a imagem do lanche
            img.alt = lanche.titulo;
            img.classList.add('lanche-img');

            // Cria a div de informações do lanche
            const infoDiv = document.createElement('div');
            infoDiv.classList.add('lanche-info');
            infoDiv.innerHTML = `<div class="lanche-titulo">${lanche.titulo}</div>
                                <div>Preço: R$ ${lanche.preco.toFixed(2).replace('.', ',')}</div>`;

            // Botão para remover o lanche
            const removeButton = document.createElement('button');
            removeButton.innerText = 'X';
            removeButton.classList.add('remove-lanche');
            removeButton.addEventListener('click', () => {
                lanchesSelecionados.splice(index, 1); // Remove o lanche da lista
                localStorage.setItem('lanchesSelecionados', JSON.stringify(lanchesSelecionados)); // Atualiza o localStorage
                atualizarLanches(); // Atualiza a exibição
            });

            // Adiciona a imagem e as informações à div do lanche
            lancheDiv.appendChild(img);
            lancheDiv.appendChild(infoDiv);
            lancheDiv.appendChild(removeButton); // Adiciona o botão de remover

            // Adiciona a div do lanche à lista
            li.appendChild(lancheDiv);
            lanchesList.appendChild(li);
        });
        totalElement.textContent = `Total do Pedido: R$ ${total.toFixed(2).replace('.', ',')}`; // Atualiza o total formatado
    }

    // Atualiza a lista de lanches e o total
    atualizarLanches(); // Chama aqui para inicializar a lista na página de pagamento

    // Função para finalizar o pedido
    document.getElementById('finalizar-pedido').addEventListener('click', async () => {
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedPaymentMethod) {
            alert('Selecione um método de pagamento.');
            return;
        }

        const pedido = {
            cliente_id: 1, // Exemplo de ID do cliente, ajuste conforme necessário
            lanches: lanchesSelecionados.map(lanche => ({
                id: lanche.id, // Assumindo que você tem o id no objeto lanche
                titulo: lanche.titulo,
                preco: lanche.preco
            })),
            forma_pagamento: selectedPaymentMethod.value,
            total: lanchesSelecionados.reduce((acc, lanche) => acc + lanche.preco, 0) // Calcula o total
        };

        try {
            const response = await fetch('http://localhost:3000/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedido)
            });

            if (response.ok) {
                alert('Pedido finalizado com sucesso!');
                localStorage.removeItem('lanchesSelecionados'); // Limpa o localStorage após o pedido
                window.location.href = 'pagina-confirmacao.html'; // Redireciona para a página de confirmação
            } else {
                const errorData = await response.json();
                alert('Erro ao finalizar o pedido: ' + errorData.message);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao finalizar o pedido. Tente novamente.');
        }
    });

    // Exibir/esconder campos de pagamento de acordo com a forma de pagamento
    document.querySelectorAll('input[name="payment-method"]').forEach(input => {
        input.addEventListener('change', function () {
            document.getElementById('credit-card-info').style.display = this.value === 'cartao' ? 'block' : 'none';
            document.getElementById('qr-code').style.display = this.value === 'pix' ? 'block' : 'none';

            if (this.value === 'pix') {
                gerarQRCode(); // Chama a função para gerar o QR code ao selecionar PIX
            }
        });
    });

    // Função para gerar o QR Code
    async function gerarQRCode() {
        const totalPedido = parseFloat(totalElement.textContent.replace('Total do Pedido: R$ ', '').replace(',', '.'));
        const response = await fetch('http://localhost:3000/qrcode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valor: totalPedido })
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('qr-img').src = data.qrCodeUrl; // Atualiza o src do img com o QR Code gerado
        } else {
            console.error('Erro ao gerar QR Code:', response.statusText);
        }
    }

    // Função para adicionar outro lanche
    document.getElementById('adicionar-lanche').addEventListener('click', () => {
        // Aqui você pode implementar a lógica para abrir um modal ou redirecionar para a página de seleção de lanches.
        // Para este exemplo, vamos simular a adição de um lanche.
        const novoLanche = {
            id: lanchesSelecionados.length + 1,
            titulo: `Lanche ${lanchesSelecionados.length + 1}`, // Substitua pelo título do lanche selecionado
            preco: 10.00, // Substitua pelo preço do lanche selecionado
            imagem: 'url_da_imagem_do_lanche.jpg' // Substitua pela URL da imagem do lanche
        };

        lanchesSelecionados.push(novoLanche);
        localStorage.setItem('lanchesSelecionados', JSON.stringify(lanchesSelecionados));
        atualizarLanches();
    });
});

// Função para buscar lanches do banco de dados
function getLanches(connection) {
    return (req, res) => {
        connection.query('SELECT * FROM lanches', (err, rows) => {
            if (err) return res.status(500).json({ error: 'Erro interno do servidor' });
            res.status(200).json(rows);
        });
    };
}
