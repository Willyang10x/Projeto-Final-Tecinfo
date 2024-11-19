// Função para redirecionar à página de finalização
function goToCheckout() {
    window.location.href = "/Components/Pagina-de-pagamento/pagina-de-pagamento.html";
}

// Atualiza a contagem do carrinho
function updateCartCount() {
    const lanchesSelecionados = JSON.parse(localStorage.getItem('lanchesSelecionados')) || [];
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = lanchesSelecionados.length;
    }
}

// Função para buscar os detalhes do lanche e atualizá-los na página
async function fetchLancheDetails(id) {
    try {
        const response = await fetch(`http://localhost:3000/lanches/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar detalhes do lanche');

        const lanche = await response.json();

        document.getElementById('lanche-imagem').src = lanche.imagem;
        document.getElementById('lanche-imagem').alt = lanche.titulo;
        document.getElementById('lanche-titulo').textContent = lanche.titulo;
        document.getElementById('lanche-preco').textContent = `R$ ${lanche.preco.toFixed(2)}`;
        document.getElementById('lanche-descricao').textContent = lanche.descricao;

        // Adiciona o evento ao botão "Fazer Pedido" para adicionar o item ao carrinho
        document.getElementById('botao-de-compra').addEventListener('click', () => {
            const titulo = lanche.titulo;
            const preco = lanche.preco;
            const imagem = lanche.imagem;
            const lancheId = id;

            // Armazena o lanche selecionado no LocalStorage
            let lanchesSelecionados = JSON.parse(localStorage.getItem('lanchesSelecionados')) || [];
            lanchesSelecionados.push({ id: lancheId, titulo, preco, imagem });
            localStorage.setItem('lanchesSelecionados', JSON.stringify(lanchesSelecionados));

            mostrarPopup('Item adicionado ao carrinho com sucesso!', 'success');
            updateCartCount(); // Atualiza a contagem do carrinho
            
        });
    } catch (error) {
        console.error('Erro ao buscar detalhes do lanche:', error);
    }
}

// Obtém o ID do lanche da URL e busca os detalhes
const urlParams = new URLSearchParams(window.location.search);
const lancheId = urlParams.get('id');

if (lancheId) {
    fetchLancheDetails(lancheId); // Busca e exibe os detalhes do lanche
}

// Atualiza a contagem do carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', updateCartCount);
