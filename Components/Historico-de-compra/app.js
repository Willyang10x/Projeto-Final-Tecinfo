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
        
    fetch('../botão-flutuante/botao.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('Carrinho').innerHTML = data;
        });
});

const clienteId = 1; // Substitua pelo ID real do cliente
fetchPedidos(clienteId);
let allPedidos = []; // Armazenar todos os pedidos globalmente
let currentPage = 1; // Controlar a página atual

async function fetchPedidos(clienteId, status = 'todos') {
    try {
        const response = await fetch(`http://localhost:3000/historico/${clienteId}?status=${status}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar pedidos: ' + response.statusText);
        }
        const { pedidos } = await response.json();
        allPedidos = pedidos; // Armazenar os pedidos
        loadOrders(1, status); // Carregar os pedidos filtrados inicialmente
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
    const ordersToDisplay = filteredOrders.slice(0, page * 3); // Limitar a exibição com base na página

    // Exibir os pedidos filtrados
    ordersToDisplay.forEach((order, index) => {
        const orderElement = document.createElement('div');
        orderElement.classList.add('order');

        // Formatar a data e hora
        const formattedDate = new Date(order.data_pedido).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

        // Exibir informações do pedido
        orderElement.innerHTML = `
            <h2>Pedido ${index + 1}</h2>
            <p class="order-date">${formattedDate}</p> <!-- Data agora embaixo do título -->
            <p>Status: <span class="status-${order.status_pedido ? order.status_pedido.replace(' ', '-') : 'desconhecido'}">${order.status_pedido ? capitalizeFirstLetter(order.status_pedido) : 'Desconhecido'}</span></p>
        `;

        // Verificar se o pedido tem lanches
        if (order.lanches && order.lanches.length > 0) {
            const lancheContainer = document.createElement('div');
            lancheContainer.classList.add('lanches-container');

            // Adicionar o primeiro lanche
            const primeiroLanche = order.lanches[0];
            lancheContainer.innerHTML += `
                <div class="lanche">
                    <img class="lanche-img" src="${primeiroLanche.imagem}" alt="${primeiroLanche.titulo}">
                    <div class="lanche-info">
                        <div class="lanche-titulo">${primeiroLanche.titulo}</div>
                        <div>Preço: R$ ${primeiroLanche.preco} - Categoria: ${primeiroLanche.categoria}</div>
                        <p>Descrição: ${primeiroLanche.descricao}</p>
                    </div>
                </div>
            `;

            // Adicionar botão "Ver mais" se houver mais de um lanche
            if (order.lanches.length > 1) {
                const verMaisButton = document.createElement('button');
                verMaisButton.textContent = 'Ver mais';
                verMaisButton.classList.add('ver-mais-btn');
                verMaisButton.onclick = () => mostrarLanches(order.lanches, lancheContainer);
                lancheContainer.appendChild(verMaisButton);
            }

            orderElement.appendChild(lancheContainer);
        }

        orderListElement.appendChild(orderElement);
    });

    // Controlar a exibição do botão "Carregar Mais"
    loadMoreButton.style.display = filteredOrders.length <= page * 3 ? 'none' : 'block';
}

function mostrarLanches(lanches, lancheContainer) {
    // Limpar lanches existentes
    lancheContainer.innerHTML = '';

    // Adicionar todos os lanches
    lanches.forEach(lanche => {
        lancheContainer.innerHTML += `
            <div class="lanche">
                <img class="lanche-img" src="${lanche.imagem}" alt="${lanche.titulo}">
                <div class="lanche-info">
                    <div class="lanche-titulo">${lanche.titulo}</div>
                    <div>Preço: R$ ${lanche.preco} - Categoria: ${lanche.categoria}</div>
                    <p>Descrição: ${lanche.descricao}</p>
                </div>
            </div>
        `;
    });

    // Adicionar botão "Ver menos"
    const verMenosButton = document.createElement('button');
    verMenosButton.textContent = 'Ver menos';
    verMenosButton.classList.add('ver-menos-btn');
    verMenosButton.onclick = () => {
        // Limpar lanches existentes
        lancheContainer.innerHTML = '';
        // Adicionar o primeiro lanche novamente
        const primeiroLanche = lanches[0];
        lancheContainer.innerHTML += `
            <div class="lanche">
                <img class="lanche-img" src="${primeiroLanche.imagem}" alt="${primeiroLanche.titulo}">
                <div class="lanche-info">
                    <div class="lanche-titulo">${primeiroLanche.titulo}</div>
                    <div>Preço: R$ ${primeiroLanche.preco} - Categoria: ${primeiroLanche.categoria}</div>
                    <p>Descrição: ${primeiroLanche.descricao}</p>
                </div>
            </div>
        `;
        // Remover o botão "Ver menos"
        verMenosButton.remove();
        // Mostrar o botão "Ver mais" novamente
        const verMaisButton = document.createElement('button');
        verMaisButton.textContent = 'Ver mais';
        verMaisButton.classList.add('ver-mais-btn');
        verMaisButton.onclick = () => mostrarLanches(lanches, lancheContainer);
        lancheContainer.appendChild(verMaisButton);
    };

    lancheContainer.appendChild(verMenosButton);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Função para carregar mais pedidos
document.getElementById('load-more-btn').addEventListener('click', function() {
    currentPage++;
    loadOrders(currentPage);
});

// Evento para filtrar os pedidos com base no status
document.getElementById('filter-status').addEventListener('change', function() {
    currentPage = 1; // Reiniciar a página atual ao filtrar
    const selectedStatus = this.value;
    fetchPedidos(clienteId, selectedStatus); // Recarregar os pedidos filtrados
});
