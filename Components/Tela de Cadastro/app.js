document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    let hasError = false;

    // Função para validar o nome: permite apenas letras e exige pelo menos duas palavras
    function isValidName(name) {
        const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
        return namePattern.test(name);
    }

    // Função para validar o email
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Função para validar a senha
    function isValidPassword(password) {
        // Exige ao menos 8 caracteres, uma letra maiúscula, um número e um caractere especial
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        return passwordPattern.test(password);
    }

    // Validação do nome
    if (!isValidName(name)) {
        nameError.textContent = 'O nome deve conter apenas letras e ter pelo menos duas palavras.';
        hasError = true;
    } else {
        nameError.textContent = '';
    }

    // Validação do email
    if (!isValidEmail(email)) {
        emailError.textContent = 'Por favor, insira um email válido.';
        hasError = true;
    } else {
        emailError.textContent = '';
    }

    // Validação da senha
    if (!isValidPassword(password)) {
        passwordError.textContent = 'A senha deve ter ao menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.';
        hasError = true;
    } else {
        passwordError.textContent = '';
    }

    // Verificação de senhas coincidentes
    if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'As senhas não coincidem.';
        hasError = true;
    } else {
        confirmPasswordError.textContent = '';
    }

    // Se houver algum erro, não prosseguir com o cadastro
    if (hasError) {
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
            window.location.href = `/Components/Tela de Login/login.html?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
        } else if (data.message === 'Email já cadastrado') {
            // Exibir mensagem de erro abaixo do campo de email
            emailError.textContent = 'Email já cadastrado.';
        } else {
            alert('Erro no cadastro: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao tentar realizar o cadastro:', error);
        alert('Erro ao tentar realizar o cadastro.');
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
