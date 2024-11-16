// Função para adicionar o evento de blur para cada campo
function addBlurEventToField(fieldId, validationFunction, errorMessageId, popUpMessage, checkEmail = false) {
    const field = document.getElementById(fieldId);
    field.addEventListener('blur', async () => {
        const errorElement = document.getElementById(errorMessageId);
        const isValid = validationFunction(field.value);

        if (checkEmail) { // Verifica se o campo é o de email
            const email = field.value;
            const emailExists = await checkIfEmailExists(email); // Verifica se o email já existe no banco
            if (emailExists) {
                showPopup('O email já está em uso.', false);
                return;
            }
        }

        if (!isValid) {
            if (errorMessageId !== 'nameError') { // Para os outros campos, exibe apenas o pop-up
                showPopup(popUpMessage, false);
            }
            if (errorMessageId === 'nameError') { // Para o nome, mostra o erro abaixo do campo
                errorElement.textContent = popUpMessage;
                errorElement.style.color = 'red';
            }
        } else {
            if (errorMessageId === 'nameError') { // Limpa o erro para o nome
                errorElement.textContent = '';
            }
        }
    });
}

// Função para verificar se o email já está registrado
async function checkIfEmailExists(email) {
    try {
        const response = await fetch('http://localhost:3000/api/check-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        return data.exists; // Supondo que a resposta tenha um campo 'exists' indicando se o email já existe
    } catch (error) {
        console.error('Erro ao verificar o email:', error);
        showPopup('Erro ao verificar o email.', false);
        return false;
    }
}

// Definir as mensagens de erro para cada campo
const errorMessages = {
    'name': 'O nome deve conter apenas letras e ter pelo menos duas palavras.',
    'email': 'Por favor, insira um email válido.',
    'password': 'A senha deve ter ao menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.',
    'confirmPassword': 'As senhas não coincidem. Por favor, verifique e tente novamente.'
};

// Função para validar o nome
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
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return passwordPattern.test(password);
}

// Função para validar as senhas coincidentes
function arePasswordsMatching(password, confirmPassword) {
    return password === confirmPassword;
}

// Adicionando os eventos de blur para cada campo
addBlurEventToField('name', isValidName, 'nameError', 'O nome deve conter apenas letras e ter pelo menos duas palavras.');
addBlurEventToField('email', isValidEmail, 'emailError', 'Por favor, insira um email válido.', true); // Verifica se o email já existe
addBlurEventToField('password', isValidPassword, 'passwordError', 'A senha deve ter ao menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.');
addBlurEventToField('confirmPassword', (value) => arePasswordsMatching(document.getElementById('password').value, value), 'confirmPasswordError', 'As senhas não coincidem. Por favor, verifique e tente novamente.');

// Evento de submit para validar todos os campos
document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let hasError = false;

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
    if (!isValidEmail(email) && !hasError) {
        showPopup('Por favor, insira um email válido.', false);
        hasError = true;
    }

    // Validação da senha
    if (!isValidPassword(password) && !hasError) {
        showPopup('A senha deve ter ao menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.', false);
        hasError = true;
    }

    // Verificação de senhas coincidentes
    if (password !== confirmPassword && !hasError) {
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
            setTimeout(() => {
                window.location.href = `/Components/Tela de Login/login.html?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
            }, 3000); // Aguarda o tempo do pop-up antes de redirecionar
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
