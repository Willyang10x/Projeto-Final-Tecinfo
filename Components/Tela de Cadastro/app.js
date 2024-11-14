document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

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
    const nameErrorElement = document.getElementById('nameError');
    if (!isValidName(name)) {
        nameErrorElement.textContent = 'O nome deve conter apenas letras e ter pelo menos duas palavras.';
        nameErrorElement.style.color = 'red';
        hasError = true;
    } else {
        nameErrorElement.textContent = ''; // Limpa a mensagem de erro se o nome for válido
    }

    // Validação do email
    if (!isValidEmail(email) && !hasError) { // Só exibe o pop-up de erro se ainda não houver outro erro
        showPopup('Por favor, insira um email válido.', false);
        hasError = true;
    }

    // Validação da senha
    if (!isValidPassword(password) && !hasError) { // Só exibe o pop-up de erro se ainda não houver outro erro
        showPopup('A senha deve ter ao menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.', false);
        hasError = true;
    }

    // Verificação de senhas coincidentes
    if (password !== confirmPassword && !hasError) {  // Só exibe o pop-up de erro se ainda não houver outro erro
        showPopup('As senhas não coincidem. Por favor, verifique e tente novamente.', false);
        hasError = true;
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
            showPopup('Cadastro realizado com sucesso!', true);
            window.location.href = `/Components/Tela de Login/login.html?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
        } else if (data.message === 'Email já cadastrado') {
            showPopup('O email já está em uso.', false);
        } else {
            showPopup('Erro no cadastro: ' + data.message, false);
        }
    } catch (error) {
        console.error('Erro ao tentar realizar o cadastro:', error);
        showPopup('Erro ao tentar realizar o cadastro.', false);
    }
});

// Função para mostrar pop-up de erro ou sucesso
function showPopup(message, isSuccess) {
    const popup = document.createElement('div');
    popup.classList.add('popup-message');
    if (isSuccess) {
        popup.classList.add('popup-success');
        popup.innerHTML = `<i class="fas fa-check-circle"></i>${message}`;
    } else {
        popup.classList.add('popup-error');
        popup.innerHTML = `<i class="fas fa-times-circle"></i>${message}`;
    }
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('popup-show');
    }, 100);

    setTimeout(() => {
        popup.classList.remove('popup-show');
        setTimeout(() => {
            popup.remove();
        }, 400);
    }, 3000);
}

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
