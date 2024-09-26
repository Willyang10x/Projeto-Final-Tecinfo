document.addEventListener('DOMContentLoaded', () => {
    fetch('../Header/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });

    fetch('../Footer/Footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });

    const clienteId = 3; // Substitua pelo ID real do cliente
    fetchPedidos(clienteId);
});

let allPedidos = []; // Armazenar todos os pedidos globalmente
let currentPage = 1; // Controlar a página atual

async function fetchPedidos(clienteId) {
    try {
        const response = await fetch(`http://localhost:3000/historico/${clienteId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar pedidos: ' + response.statusText);
        }
        const { pedidos } = await response.json();
        allPedidos = pedidos; // Armazenar os pedidos
        loadOrders(1, 'todos'); // Carregar todos os pedidos inicialmente
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
    }
}

function loadOrders(page = 1, filterStatus = 'todos') {
    const orderListElement = document.getElementById('order-list');
    const loadMoreButton = document.getElementById('load-more-btn');
    orderListElement.innerHTML = '';

    // Filtrar os pedidos com base no status
    const filteredOrders = allPedidos.filter(order => filterStatus === 'todos' || order.status_pedido === filterStatus);
    const ordersToDisplay = filteredOrders.slice(0, page * 2); // Limitar a exibição com base na página

    // Exibir os pedidos filtrados
    ordersToDisplay.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.classList.add('order');
        orderElement.innerHTML = `
            <h2>Pedido #${order.pedido_id}</h2>
            <p>Data: ${order.data_pedido}</p>
            <p>Status: <span class="status-${order.status_pedido ? order.status_pedido.replace(' ', '-') : 'desconhecido'}">${order.status_pedido ? capitalizeFirstLetter(order.status_pedido) : 'Desconhecido'}</span></p>
            <div class="lanche">
                <div class="lanche-titulo">${order.lanche_titulo}</div>
                <div class="lanche-info">Preço: R$ ${order.lanche_preco} - Categoria: ${order.lanche_categoria}</div>
                <p>Descrição: ${order.lanche_descricao}</p>
            </div>
            <a href="#">Ver detalhes</a>
        `;
        orderListElement.appendChild(orderElement);
    });

    // Controlar a exibição do botão "Carregar Mais"
    loadMoreButton.style.display = filteredOrders.length <= page * 2 ? 'none' : 'block';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Evento para filtrar os pedidos com base no status
document.getElementById('filter-status').addEventListener('change', function() {
    currentPage = 1; // Reiniciar a página atual ao filtrar
    loadOrders(currentPage, this.value); // Recarregar os pedidos filtrados
});

// Evento para carregar mais pedidos
document.getElementById('load-more-btn').addEventListener('click', function() {
    currentPage++;
    loadOrders(currentPage, document.getElementById('filter-status').value); // Carregar mais pedidos com base no status filtrado
});
