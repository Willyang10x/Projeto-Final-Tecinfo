document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validação de senha
    if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = '../Tela de Login/login.html';
        } else {
            alert('Erro no cadastro: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao tentar fazer o cadastro:', error);
        alert('Erro ao tentar fazer o cadastro.');
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
