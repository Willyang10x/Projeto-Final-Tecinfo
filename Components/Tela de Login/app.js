document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();  // Impede o envio padrão do formulário
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })  // Envia os dados do login
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Login bem-sucedido
        alert('Login realizado com sucesso!');
        // Armazenar o token JWT no armazenamento local ou em um cookie
        localStorage.setItem('token', data.token);
        // Redirecionar para a página principal ou painel
        window.location.href = '../Home/index.html';
      } else {
        alert('Erro no login: ' + data.message);  // Exibe mensagem de erro
      }
    } catch (error) {
      console.error('Erro ao tentar fazer login:', error);
      alert('Erro ao tentar fazer login.');
    }
  });
  
  // Função para mostrar ou ocultar a senha e alternar a imagem
  function togglePassword(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleIcon = passwordInput.nextElementSibling;
  
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleIcon.src = '/assets/icons/Esconder-senha.png';  // Imagem para ocultar a senha
      toggleIcon.alt = 'Ocultar senha';
    } else {
      passwordInput.type = 'password';
      toggleIcon.src = '/assets/icons/Exibir-senha.png';  // Imagem para mostrar a senha
      toggleIcon.alt = 'Mostrar senha';
    }
  }
  