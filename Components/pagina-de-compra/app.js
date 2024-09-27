document.addEventListener('DOMContentLoaded', () => {
    // Carrega o header e o footer dinamicamente
    fetch('../Header/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o header:', error));

    fetch('../Footer/Footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o footer:', error));

    // Função para buscar os detalhes do lanche
    async function fetchLancheDetails(id) {
        try {
            const response = await fetch(`http://localhost:3000/lanches/${id}`); // Faz a requisição para o backend usando o ID
            if (!response.ok) {
                throw new Error('Erro ao buscar detalhes do lanche: ' + response.statusText);
            }
            const lanche = await response.json();

            // Atualiza os detalhes da página com os dados do lanche
            document.getElementById('lanche-imagem').src = lanche.imagem;
            document.getElementById('lanche-imagem').alt = lanche.titulo;
            document.getElementById('lanche-titulo').textContent = lanche.titulo;
            document.getElementById('lanche-preco').textContent = `R$ ${lanche.preco.toFixed(2)}`;
            document.getElementById('lanche-descricao').textContent = lanche.descricao;

            // Adiciona evento ao botão "Fazer Pedido"
            const botaoFazerPedido = document.getElementById('fazer-pedido');
            botaoFazerPedido.addEventListener('click', () => {
                // Armazena o lanche no localStorage
                const lanchesSelecionados = JSON.parse(localStorage.getItem('lanchesSelecionados')) || [];
                lanchesSelecionados.push({
                    id: lanche.id,
                    titulo: lanche.titulo,
                    preco: lanche.preco,
                    descricao: lanche.descricao, // Adiciona a descrição se necessário
                    imagem: lanche.imagem        // Adiciona a imagem se necessário
                });
                localStorage.setItem('lanchesSelecionados', JSON.stringify(lanchesSelecionados));
                
                // Redireciona para a página de pagamento
                window.location.href = 'pagina-pagamento.html'; // Altere para o URL correto da sua página de pagamento
            });
        } catch (error) {
            console.error('Erro ao buscar detalhes do lanche:', error);
        }
    }

    // Obtém o ID do lanche da URL
    const urlParams = new URLSearchParams(window.location.search);
    const lancheId = urlParams.get('id');

    if (lancheId) {
        fetchLancheDetails(lancheId); // Busca e exibe os detalhes do lanche
    }

    // Função para expandir/recolher detalhes do lanche
    let elementosDetalhes = document.querySelectorAll('.sobre');
    elementosDetalhes.forEach(function (sobre) {
        sobre.addEventListener('click', function () {
            sobre.classList.toggle('active');
        });
    });
});
