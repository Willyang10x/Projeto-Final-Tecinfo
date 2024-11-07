document.addEventListener("DOMContentLoaded", () => {
    const pedidoDetalhesContainer = document.querySelector(".pedido-detalhes");

    function carregarDetalhesPedido() {
        const pedido = JSON.parse(localStorage.getItem("pedidoConcluido"));

        if (pedido) {
            pedidoDetalhesContainer.innerHTML = `
                <h2>Detalhes do Pedido</h2>
                <p>Número do Pedido: #${pedido.numeroPedido}</p>
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
