document.addEventListener("DOMContentLoaded", () => {
    const pedidoDetalhesContainer = document.querySelector(".pedido-detalhes");

    function carregarDetalhesPedido() {
        const pedido = JSON.parse(localStorage.getItem("pedidoConcluido"));

        if (pedido) {
            pedidoDetalhesContainer.innerHTML = `
                <h2>Detalhes do Pedido</h2>
                <p>Data e Hora: ${pedido.numeroPedido}</p>
                <p>Total: R$ ${pedido.total.toFixed(2).replace('.', ',')}</p>
                <p>Método de Pagamento: ${pedido.forma_pagamento}</p>
            `;
        } else {
            pedidoDetalhesContainer.innerHTML = `
                <p>Não foram encontrados detalhes do pedido.</p>
            `;
        }
    }

    carregarDetalhesPedido();
});

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
