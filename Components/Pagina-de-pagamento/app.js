
// Exibir/esconder os campos do cartão de crédito conforme a escolha da forma de pagamento
document.querySelectorAll('input[name="payment-method"]').forEach((input) => {
    input.addEventListener('change', function() {
        if (this.value === 'cartao') {
            document.getElementById('credit-card-info').style.display = 'block';
        } else {
            document.getElementById('credit-card-info').style.display = 'none';
        }
    });
});