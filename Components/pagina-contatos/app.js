document.addEventListener('DOMContentLoaded', () => {
  // Carregar o Header
  fetch('/Components/Header/header.html')
      .then(response => response.text())
      .then(data => {
          document.getElementById('header-placeholder').innerHTML = data;

          // Adiciona a funcionalidade de busca ao carregar o header
          const script = document.createElement('script');
          script.src = '/Components/Header/search.js';
          document.body.appendChild(script);
      });

  // Carregar o Footer
  fetch('../Footer/Footer.html')
      .then(response => response.text())
      .then(data => {
          document.getElementById('footer-placeholder').innerHTML = data;
      });

  // Função para exibir a mensagem de sucesso
  function showSuccessMessage() {
      // Cria a mensagem de sucesso se ela ainda não existe
      let successMessage = document.getElementById('success-message');
      if (!successMessage) {
          successMessage = document.createElement('div');
          successMessage.id = 'success-message';
          successMessage.textContent = 'Sua mensagem foi enviada com sucesso, agradecemos sua colaboração!';
          document.body.appendChild(successMessage);
      }

      // Exibe e anima a mensagem
      successMessage.classList.add('show');

      // Remove a mensagem após 3 segundos
      setTimeout(() => {
          successMessage.classList.remove('show');
      }, 3000);
  }

  // Adicionar funcionalidade de envio do formulário com animação de sucesso
  const form = document.getElementById('form-contato');
  form.addEventListener('submit', function(event) {
      event.preventDefault();  // Impede o envio padrão do formulário

      showSuccessMessage(); // Exibe a mensagem de sucesso

      form.reset(); // Limpa os campos do formulário
  });
});
