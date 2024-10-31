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

    const lanchesSelecionados = JSON.parse(localStorage.getItem('lanchesSelecionados')) || [];
    const totalElement = document.getElementById('total-pedido');
    const lanchesList = document.getElementById('lanches-selecionados');
    let pedidoEmAndamento = false;

    document.getElementById('finalizar-pedido').addEventListener('click', async () => {
        if (pedidoEmAndamento) return;

        // Verificar se todos os campos obrigatórios estão preenchidos
        const camposObrigatorios = document.querySelectorAll('.coletar-dados[required]');
        for (const campo of camposObrigatorios) {
            if (!campo.value.trim()) {
                alert(`Por favor, preencha o campo: ${campo.previousElementSibling.innerText}`);
                campo.focus();
                return;
            }
        }

        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedPaymentMethod) {
            alert('Selecione um método de pagamento.');
            return;
        }

        pedidoEmAndamento = true;

        const pedido = {
            numeroPedido: Math.floor(Math.random() * 100), // Gera um número de pedido aleatório
            cliente_id: 1,
            lanches: lanchesSelecionados,
            forma_pagamento: selectedPaymentMethod.value,
            total: lanchesSelecionados.reduce((acc, lanche) => acc + lanche.preco, 0)
        };

        try {
            const response = await fetch('http://localhost:3000/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedido)
            });

            if (response.ok) {
                alert('Pedido finalizado com sucesso!');
                localStorage.setItem("pedidoConcluido", JSON.stringify(pedido)); // Armazena o pedido no localStorage
                localStorage.removeItem('lanchesSelecionados'); // Limpa o carrinho
                window.location.href = '/Components/pagina-de-obrigado/pagina-de-obrigado.html';
            } else {
                const errorData = await response.json();
                alert('Erro ao finalizar o pedido: ' + errorData.message);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao finalizar o pedido. Tente novamente.');
        } finally {
            pedidoEmAndamento = false;
        }
    });

    function atualizarLanches() {
        let total = 0;
        lanchesList.innerHTML = '';

        lanchesSelecionados.forEach((lanche, index) => {
            total += lanche.preco;

            const li = document.createElement('li');
            const lancheDiv = document.createElement('div');
            lancheDiv.classList.add('lanche');

            const img = document.createElement('img');
            img.src = lanche.imagem;
            img.alt = lanche.titulo;
            img.classList.add('lanche-img'); // Corrigido para 'lanche-img' em vez de 'lanche.img'

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('lanche-info');
            infoDiv.innerHTML = `<div class="lanche-titulo">${lanche.titulo}</div>
                                <div>Preço: R$ ${lanche.preco.toFixed(2).replace('.', ',')}</div>`;

            const removeButton = document.createElement('button');
            removeButton.innerText = 'X';
            removeButton.classList.add('remove-lanche');
            removeButton.addEventListener('click', () => {
                lanchesSelecionados.splice(index, 1);
                localStorage.setItem('lanchesSelecionados', JSON.stringify(lanchesSelecionados));
                atualizarLanches();
            });

            lancheDiv.appendChild(img);
            lancheDiv.appendChild(infoDiv);
            lancheDiv.appendChild(removeButton);

            li.appendChild(lancheDiv);
            lanchesList.appendChild(li);
        });

        totalElement.textContent = `Total do Pedido: R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    document.querySelectorAll('input[name="payment-method"]').forEach((input) => {
        input.addEventListener('change', function() {
            if (this.value === 'cartao') {
                document.getElementById('credit-card-info').style.display = 'block';
                document.getElementById('qr-code').style.display = 'none';
            } else if (this.value === 'pix') {
                document.getElementById('credit-card-info').style.display = 'none';
                generateQrCode();
            } else {
                document.getElementById('credit-card-info').style.display = 'none';
                document.getElementById('qr-code').style.display = 'none';
            }
        });
    });

    // Função para gerar o QR Code para o pagamento via PIX
    function generateQrCode() {
        
        document.getElementById('qr-img').src = '/assets/images/qr-code-pix.png';
        document.getElementById('qr-code').style.display = 'block';
    }

    atualizarLanches();
});
