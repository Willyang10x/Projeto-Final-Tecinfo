
// Exibir/esconder os campos do cartão de crédito e pix conforme a escolha da forma de pagamento
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

// Função para gerar o QR Code para o pagamento via PIX
function generateQrCode() {
    const totalValue = 23.00; // Valor do pedido
    const pixData = `00020101021226940014BR.GOV.BCB.PIX0136chavepixexemplo@dominio.com5204000053039865404${totalValue.toFixed(2)}5802BR5909NomeCliente6009Cidade62070503***6304`;
    const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${encodeURIComponent(pixData)}`;

    document.getElementById('qr-img').src = '/assets/images/qr-code-pix.png';
    document.getElementById('qr-code').style.display = 'block';
}