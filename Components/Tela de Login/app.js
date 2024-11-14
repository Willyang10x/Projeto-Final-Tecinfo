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
            showPopup('Login realizado com sucesso!', 'success');
            localStorage.setItem('token', data.token);
            setTimeout(() => {
                window.location.href = '../Home/index.html';
            }, 1000); // Redireciona após um breve atraso
        } else {
            showPopup(`Erro no login: ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        showPopup('Erro ao tentar fazer login.', 'error');
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
    }, 3000); // Exibe por 5 segundos
}
