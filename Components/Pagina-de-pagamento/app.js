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

        // Gerar o número do pedido com data e hora atual no formato "dd/MM/yyyy HH:mm:ss"
        const dataAtual = new Date();
        const numeroPedido = dataAtual.toLocaleDateString('pt-BR') + ' ' + dataAtual.toLocaleTimeString('pt-BR');

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
                showSuccessPopup('Pedido finalizado com sucesso!', () => {
                    localStorage.setItem("pedidoConcluido", JSON.stringify(pedido));
                    localStorage.removeItem('lanchesSelecionados');
                    gerarPDFPedido(pedido);
                    window.location.href = '/Components/pagina-de-obrigado/pagina-de-obrigado.html';
                });
            } else {
                const errorData = await response.json();
                showErrorPopup('Erro ao finalizar o pedido: ' + errorData.message);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            showErrorPopup('Erro ao finalizar o pedido. Tente novamente.');
        } finally {
            pedidoEmAndamento = false;
        }
    });

    // Função para exibir o pop-up de sucesso
function showSuccessPopup(message, callback) {
    const popup = document.createElement('div');
    popup.classList.add('popup-message', 'popup-success');
    popup.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('popup-show');
    }, 100);

    setTimeout(() => {
        popup.classList.remove('popup-show');
        setTimeout(() => {
            popup.remove();
            if (typeof callback === 'function') {
                callback();
            }
        }, 400);
    }, 3000);
}


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
        
        const logoUrl = "/assets/icons/logo.png";
        doc.addImage(logoUrl, 'PNG', 80, 10, 50, 25);
    
        doc.setFontSize(20);
        doc.setTextColor("#4B0082");
        doc.text("Detalhes do Pedido", doc.internal.pageSize.width / 2, 50, null, null, 'center');
        doc.setLineWidth(0.5);
        doc.line(20, 55, 190, 55);
    
        doc.setFontSize(12);
        doc.setTextColor("#333333");
        doc.text(`Data e Hora: ${pedido.numeroPedido}`, 20, 65);
        doc.text(`Forma de Pagamento: ${pedido.forma_pagamento}`, 20, 75);
        doc.text(`Total: R$ ${pedido.total.toFixed(2).replace('.', ',')}`, 20, 85);
    
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
    
        yPosition += 10;
        doc.setFontSize(14);
        doc.setTextColor("#4B0082");
        doc.text("Itens do Pedido", 20, yPosition);
        yPosition += 10;
        doc.setFontSize(12);
        doc.setTextColor("#333333");
        pedido.lanches.forEach(lanche => {
            doc.text(`- ${lanche.titulo} (R$ ${lanche.preco.toFixed(2).replace('.', ',')})`, 20, yPosition);
            yPosition += 8;
        });
    
        doc.save(`pedido_${pedido.nome_titular.replace(/\s/g, '_')}.pdf`);
    }
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
function showErrorPopup(message, callback) {
    const popup = document.createElement('div');
    popup.classList.add('popup-message', 'popup-error');
    popup.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('popup-show');
    }, 100);

    setTimeout(() => {
        popup.classList.remove('popup-show');
        setTimeout(() => {
            popup.remove();
            if (typeof callback === 'function') {
                callback();
            }
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

