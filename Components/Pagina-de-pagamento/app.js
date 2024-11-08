document.addEventListener('DOMContentLoaded', () => {
    fetch('/Components/Header/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;

            // Adiciona a funcionalidade de busca ao carregar o header
            const script = document.createElement('script');
            script.src = '/Components/Header/search.js';
            document.body.appendChild(script);
        })
        .catch(error => console.error('Erro ao carregar o header:', error));

    fetch('../Footer/Footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o footer:', error));

    const lanchesSelecionados = JSON.parse(localStorage.getItem('lanchesSelecionados')) || [];
    const totalElement = document.getElementById('total-pedido');
    const lanchesList = document.getElementById('lanches-selecionados');
    let pedidoEmAndamento = false;

    document.getElementById('finalizar-pedido').addEventListener('click', async () => {
        if (pedidoEmAndamento) return;

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

        if (selectedPaymentMethod.value === 'cartao') {
            const cardName = document.getElementById('card-name').value;
            const cardNumber = document.getElementById('card-number').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;

            if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
                alert('Por favor, preencha todos os campos do cartão.');
                return;
            }
        }

        pedidoEmAndamento = true;

        const nomeCliente = document.getElementById('name').value;

        // Gerar o número do pedido (por exemplo, com a data atual)
        const numeroPedido = Date.now(); // Você pode mudar essa lógica para algo mais específico, se desejar

        const pedido = {
            numeroPedido,
            cliente_id: 1,
            total: lanchesSelecionados.reduce((acc, lanche) => acc + lanche.preco, 0),
            forma_pagamento: selectedPaymentMethod.value,
            nome_titular: nomeCliente,
            numero_cartao: selectedPaymentMethod.value === 'cartao' ? document.getElementById('card-number').value : null,
            validade_cartao: selectedPaymentMethod.value === 'cartao' ? document.getElementById('card-expiry').value : null,
            cvv: selectedPaymentMethod.value === 'cartao' ? document.getElementById('card-cvv').value : null,
            lanches: lanchesSelecionados
        };

        try {
            const response = await fetch('http://localhost:3000/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedido)
            });

            if (response.ok) {
                alert('Pedido finalizado com sucesso!');
                localStorage.setItem("pedidoConcluido", JSON.stringify(pedido)); // Salva o pedido com número gerado
                localStorage.removeItem('lanchesSelecionados');
                
                gerarPDFPedido(pedido);
                
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
            img.classList.add('lanche-img');

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

    function generateQrCode() {
        document.getElementById('qr-img').src = '/assets/images/qr-code-pix.png';
        document.getElementById('qr-code').style.display = 'block';
    }

    atualizarLanches();
    
     function gerarPDFPedido(pedido) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Logo da lanchonete no topo
        const logoUrl = "/assets/icons/logo.png";
        doc.addImage(logoUrl, 'PNG', 80, 10, 50, 25);
    
        // Título do pedido
        doc.setFontSize(20);
        doc.setTextColor("#4B0082"); // Cor roxa para o título
        doc.text("Detalhes do Pedido", doc.internal.pageSize.width / 2, 50, null, null, 'center');
        doc.setLineWidth(0.5);
        doc.line(20, 55, 190, 55);
    
        // Dados do Pedido
        doc.setFontSize(12);
        doc.setTextColor("#333333");
        doc.text(`Número do Pedido: ${pedido.numeroPedido}`, 20, 65);
        doc.text(`Forma de Pagamento: ${pedido.forma_pagamento}`, 20, 75);
        doc.text(`Total: R$ ${pedido.total.toFixed(2).replace('.', ',')}`, 20, 85);
    
        // Dados do Cliente
        doc.setFontSize(14);
        doc.setTextColor("#4B0082");
        doc.text("Dados do Cliente", 20, 95);
        doc.setFontSize(12);
        doc.setTextColor("#333333");
        const clienteInfo = [
            `Nome: ${pedido.nome_titular}`,
            `E-mail: ${document.getElementById('email').value}`,
            `CPF: ${document.getElementById('cpf').value}`,
        ];
        
        // Endereço de entrega
        const enderecoInfo = [
            `Endereço: ${document.getElementById('street').value}, Nº ${document.getElementById('number').value}`,
            `Bairro: ${document.getElementById('neighborhood').value}, Cidade: ${document.getElementById('city').value}`,
            `CEP: ${document.getElementById('cep').value}`,
            `Complemento: ${document.getElementById('complement').value || 'Não informado'}`,
        ];
    
        let yPosition = 105;
        clienteInfo.forEach(line => {
            doc.text(line, 20, yPosition);
            yPosition += 10;
        });
    
        yPosition += 10;
        doc.setFontSize(14);
        doc.setTextColor("#4B0082");
        doc.text("Endereço de Entrega", 20, yPosition);
        yPosition += 10;
        doc.setFontSize(12);
        doc.setTextColor("#333333");
        enderecoInfo.forEach(line => {
            doc.text(line, 20, yPosition);
            yPosition += 10;
        });
    
        // Itens do Pedido
        yPosition += 10;
        doc.setFontSize(14);
        doc.setTextColor("#4B0082");
        doc.text("Lanches Selecionados:", 20, yPosition);
        yPosition += 10;
        doc.setFontSize(12);
        doc.setTextColor("#333333");
        pedido.lanches.forEach((lanche, index) => {
            doc.text(
                `${index + 1}. ${lanche.titulo} - R$ ${lanche.preco.toFixed(2).replace('.', ',')}`,
                20,
                yPosition
            );
            yPosition += 10;
        });
    
        // Mensagem de agradecimento
        yPosition += 20;
        doc.setFontSize(14);
        doc.setTextColor("#4B0082");
        doc.text("Obrigado pela sua compra!", doc.internal.pageSize.width / 2, yPosition, null, null, 'center');
        yPosition += 10;
        doc.setFontSize(12);
        doc.setTextColor("#333333");
        doc.text("Aguardamos você para o próximo pedido!", doc.internal.pageSize.width / 2, yPosition, null, null, 'center');
    
        // Baixar o PDF com o nome do cliente
        doc.save(`pedido_${pedido.nome_titular}.pdf`);
    }
    
});
