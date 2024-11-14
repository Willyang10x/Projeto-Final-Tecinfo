window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');

    if (status === 'logout_sucesso') {
        const popup = document.getElementById('popup-logout');
        popup.style.display = 'block';  // Torna o pop-up visível

        // Oculta o pop-up após 3 segundos
        setTimeout(() => {
            popup.style.display = 'none';  // Oculta o pop-up
        }, 3000);
    }
});


document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formError = document.getElementById('form-error');
    formError.textContent = '';
    formError.style.display = 'none';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login realizado com sucesso!');
            localStorage.setItem('token', data.token);
            window.location.href = '../Home/index.html';
        } else {
            formError.textContent = 'Erro no login: ' + data.message;
            formError.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        formError.textContent = 'Erro ao tentar fazer login.';
        formError.style.display = 'block';
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
