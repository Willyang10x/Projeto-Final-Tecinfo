
// Função para adicionar o evento de blur para cada campo
function addBlurEventToField(fieldId, validationFunction, errorMessageId, errorMessage) {
    const field = document.getElementById(fieldId);
    field.addEventListener('blur', () => {
        const errorElement = document.getElementById(errorMessageId);
        const isValid = validationFunction(field.value);

        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.style.color = 'red'; // Estilo de erro
        } else {
            errorElement.textContent = ''; // Limpa o erro se o campo for válido
        }
    });
}

// Função para verificar se o email já está registrado
async function checkIfEmailExists(email) {
    try {
        const response = await fetch('http://localhost:3000/api/check-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        return data.exists; // Supondo que a resposta tenha um campo 'exists' indicando se o email já existe
    } catch (error) {
        console.error('Erro ao verificar o email:', error);
        return false;
    }
}

// Funções de validação
function isValidName(name) {
    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
    return namePattern.test(name);
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidPassword(password) {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return passwordPattern.test(password);
}

function arePasswordsMatching(password, confirmPassword) {
    return password === confirmPassword;
}

// Adicionando os eventos de blur para cada campo
addBlurEventToField('name', isValidName, 'nameError', 'O nome deve conter apenas letras e ter pelo menos duas palavras.');
addBlurEventToField('email', isValidEmail, 'emailError', 'Por favor, insira um email válido.');
addBlurEventToField('password', isValidPassword, 'passwordError', 'A senha deve ter ao menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.');
addBlurEventToField(
    'confirmPassword',
    (value) => arePasswordsMatching(document.getElementById('password').value, value),
    'confirmPasswordError',
    'As senhas não coincidem. Por favor, verifique e tente novamente.'
);

// Função para exibir pop-up
function showPopup(message, isSuccess) {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.top = '10px';
    popup.style.right = '10px';
    popup.style.padding = '10px';
    popup.style.backgroundColor = isSuccess ? 'green' : 'red';
    popup.style.color = 'white';
    popup.style.borderRadius = '5px';
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 3000);
}

// Evento de submit para validar todos os campos

document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;


    let hasError = false;

    // Validação do nome
    if (!isValidName(name)) {
        document.getElementById('nameError').textContent = 'O nome deve conter apenas letras e ter pelo menos duas palavras.';
        hasError = true;
    }

    // Validação do email
    if (!isValidEmail(email)) {
        document.getElementById('emailError').textContent = 'Por favor, insira um email válido.';
        hasError = true;
    }

    // Validação da senha
    if (!isValidPassword(password)) {
        document.getElementById('passwordError').textContent =
            'A senha deve ter ao menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.';
        hasError = true;
    }

    // Verificação de senhas coincidentes
    if (!arePasswordsMatching(password, confirmPassword)) {
        document.getElementById('confirmPasswordError').textContent = 'As senhas não coincidem. Por favor, verifique e tente novamente.';
        hasError = true;
    }

    // Se houver algum erro, não prosseguir com o cadastro
    if (hasError) return;

    // Verificar se o email já está em uso
    const emailExists = await checkIfEmailExists(email);
    if (emailExists) {
        showPopup('O email já está em uso.', false);
        return;
    }

    // Enviar dados ao servidor
    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            showPopup('Cadastro realizado com sucesso!', true);
            setTimeout(() => {
                window.location.href = `/Components/Tela de Login/login.html?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
            }, 3000); // Aguarda o tempo do pop-up antes de redirecionar
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
            window.location.href = 'login.html';
        } else {
            alert('Erro no cadastro: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao tentar fazer o cadastro:', error);
        alert('Erro ao tentar fazer o cadastro.');
    }
});

