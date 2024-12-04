window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');

    if (status === 'logout_sucesso') {
        showPopup('Logout realizado com sucesso!', 'success');
    } else if (status === 'logout_erro') {
        showPopup('Ocorreu um erro ao tentar fazer logout. Tente novamente.', 'error');
    }
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    let hasError = false;

    // Validação do email
    if (!email) {
        document.getElementById('email-error').textContent = 'Por favor, preencha o campo de e-mail.';
        hasError = true;
    } else {
        document.getElementById('email-error').textContent = ''; // Limpa a mensagem de erro se o campo estiver preenchido
    }

    // Validação da senha
    if (!password) {
        document.getElementById('password-error').textContent = 'Por favor, preencha o campo de senha.';
        hasError = true;
    } else {
        document.getElementById('password-error').textContent = ''; // Limpa a mensagem de erro se o campo estiver preenchido
    }

    // Se houver erro, não prossegue com o login
    if (hasError) return;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
    
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            throw new Error('Resposta do servidor não é um JSON válido.');
        }
    
        if (response.ok) {
            showPopup('Login realizado com sucesso!', 'success');
            
            // Salva informações no localStorage
            localStorage.setItem('token', data.token);
            if (data.user) { // Verifica se o backend retornou o usuário
                localStorage.setItem('userName', data.user.name || '');
                localStorage.setItem('userEmail', data.user.email || '');
            }
    
            // Redireciona para a página inicial após um breve atraso
            setTimeout(() => {
                window.location.href = '../Home/index.html';  // Certifique-se de que o caminho está correto
            }, 1000);
        } else {
            // Exibe mensagem de erro do backend ou mensagem genérica
            const errorMessage = data.message || 'Erro desconhecido.';
            showPopup(`Erro no login: ${errorMessage}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        showPopup('Erro ao tentar fazer login. Verifique sua conexão.', 'error');
    }
    
});

// Função para mostrar ou ocultar a senha e alternar a imagem
function togglePassword(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleIcon = passwordInput.nextElementSibling;

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.src = '/assets/icons/Esconder-senha.png';
        toggleIcon.alt = 'Ocultar senha';
    } else {
        passwordInput.type = 'password';
        toggleIcon.src = '/assets/icons/Exibir-senha.png';
        toggleIcon.alt = 'Mostrar senha';
    }
}

function showPopup(message, type) {
    const popup = document.getElementById(`popup-login-${type}`);
    const popupText = popup.querySelector('span');
    popupText.textContent = message;
    
    popup.classList.add('popup-show');
    setTimeout(() => {
        popup.classList.remove('popup-show');
    }, 3000); // Exibe por 3 segundos
}

// Adicionando o evento blur para mostrar erro no pop-up
document.getElementById('email').addEventListener('blur', () => {
    const emailField = document.getElementById('email');
    if (!emailField.value) {
        document.getElementById('email-error').textContent = 'Por favor, preencha o campo de email.';
    }
});

document.getElementById('password').addEventListener('blur', () => {
    const passwordField = document.getElementById('password');
    if (!passwordField.value) {
        document.getElementById('password-error').textContent = 'Por favor, preencha o campo de senha.';
    }
});

document.addEventListener('mousemove', (event) => {
    // Cria um novo ponto para cada movimento do mouse
    const dot = document.createElement('div');
    dot.classList.add('cursor-dot');
    
    // Define a posição do ponto com base nas coordenadas do mouse
    dot.style.left = `${event.pageX}px`;
    dot.style.top = `${event.pageY}px`;

    // Adiciona o ponto ao body
    document.body.appendChild(dot);
    
    // Remove o ponto após um tempo para criar o efeito de cauda
    setTimeout(() => {
        dot.remove();
    }, 500); // O tempo deve coincidir com o tempo da animação em CSS
});