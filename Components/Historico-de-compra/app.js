function carregarDadosUsuario() {
    // Recupera os dados do localStorage
    const nomeUsuario = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');

    // Verifica se os dados existem no localStorage
    if (nomeUsuario && email) {
        // Atualiza os elementos com os dados
        document.getElementById('userName').innerText = nomeUsuario;
        document.getElementById('userEmail').innerText = email;
    } else {
        // Se não houver dados no localStorage, exibe uma mensagem de erro
        console.log('Usuário não encontrado no localStorage.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Carregar o header
    fetch('/Components/Header/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;

            // Adiciona a funcionalidade de busca ao carregar o header
            const script = document.createElement('script');
            script.src = '/Components/Header/search.js';
            document.body.appendChild(script);

            // Chama a função carregarDadosUsuario() após carregar o header
            carregarDadosUsuario();
        });

    // Carregar o footer
    fetch('../Footer/Footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });

    // Carregar o botão flutuante
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

// Função para atualizar os pedidos no frontend a cada 10 segundos
function updatePedidosStatus() {
    // Faz uma requisição para o backend para atualizar o status dos pedidos
    fetch('http://localhost:3000/atualizar-status', { // Ajuste a URL para o seu servidor backend
      method: 'POST',
      body: JSON.stringify({ status_pedido: 'entregue' }), // Status que você deseja atualizar
      headers: { 'Content-Type': 'application/json' } // Cabeçalho informando que o corpo é JSON
    })
      .then(response => {
        if (!response.ok) { // Verifica se a resposta foi bem-sucedida
          throw new Error('Erro na requisição');
        }
        return response.json(); // Converte a resposta para JSON
      })
      .then(data => {
        console.log(data.message); // Exibe a mensagem de sucesso
        // Recarregar os pedidos após a atualização
        fetchPedidos(clienteId); 
      })
      .catch(error => {
        console.error('Erro ao atualizar status dos pedidos:', error);
      });
  }
  
  // Definir um intervalo para atualizar os pedidos a cada 10 segundos
  setInterval(() => {
    updatePedidosStatus();
  }, 10000); // 10 segundos
  
  