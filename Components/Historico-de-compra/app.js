
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

});

// Funções da pagina 

document.addEventListener('DOMContentLoaded', function() {
    // Lista de pedidos (simulação)
    const pedidos = [
        { numero: '12345', data: '01/09/2024', total: '150,00', status: 'pendente' },
        { numero: '12344', data: '28/08/2024', total: '200,00', status: 'entregue' },
        { numero: '12343', data: '20/08/2024', total: '300,00', status: 'pendente' },
        { numero: '12342', data: '15/08/2024', total: '400,00', status: 'pendente' },
        { numero: '12341', data: '10/08/2024', total: '500,00', status: 'entregue' }
    ];

    let currentPage = 1;
    const ordersPerPage = 2;
    
    const orderListElement = document.getElementById('order-list');
    const filterStatusElement = document.getElementById('filter-status');
    const loadMoreButton = document.getElementById('load-more-btn');

    // Função para carregar os pedidos com base no status filtrado
    function loadOrders(page = 1, filterStatus = 'todos') {
        orderListElement.innerHTML = '';

        const filteredOrders = pedidos.filter(order => filterStatus === 'todos' || order.status === filterStatus);
        const ordersToDisplay = filteredOrders.slice(0, page * ordersPerPage);

        ordersToDisplay.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.classList.add('order');
            orderElement.innerHTML = `
                <h2>Pedido #${order.numero}</h2>
                <p>Data: ${order.data}</p>
                <p>Total: R$ ${order.total}</p>
                <p>Status: <span class="status-${order.status.replace(' ', '-')}">${capitalizeFirstLetter(order.status)}</span></p>
                <a href="#">Ver detalhes</a>
            `;
            orderListElement.appendChild(orderElement);
        });

        if (filteredOrders.length <= page * ordersPerPage) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'block';
        }
    }

    // Função para capitalizar a primeira letra do status
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Evento para filtrar os pedidos com base no status
    filterStatusElement.addEventListener('change', function() {
        currentPage = 1;
        loadOrders(currentPage, this.value);
    });

    // Evento para carregar mais pedidos
    loadMoreButton.addEventListener('click', function() {
        currentPage++;
        loadOrders(currentPage, filterStatusElement.value);
    });

    // Carrega os pedidos iniciais
    loadOrders(currentPage);
});