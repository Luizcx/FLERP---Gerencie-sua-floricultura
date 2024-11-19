document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const lembrarCheckbox = document.getElementById('lembrar');
    const acessarButton = document.getElementById('acessar');

    // Carregar credenciais salvas se existirem
    if (localStorage.getItem('emailSalvo')) {
        emailInput.value = localStorage.getItem('emailSalvo');
        lembrarCheckbox.checked = true;
    }

    acessarButton.addEventListener('click', (event) => {
        event.preventDefault(); // Previne o comportamento padrão do botão

        // Validação básica de email e senha
        if (emailInput.value.trim() === '') {
            alert('Por favor, insira um email.');
            return;
        }

        if (senhaInput.value.trim() === '') {
            alert('Por favor, insira a senha.');
            return;
        }

        // Lógica de "Lembrar-me"
        if (lembrarCheckbox.checked) {
            localStorage.setItem('emailSalvo', emailInput.value);
        } else {
            localStorage.removeItem('emailSalvo');
        }

        // Aqui você normalmente faria uma validação no backend
        // Por enquanto, vamos apenas redirecionar para index.html
        window.location.href = 'index.html';
    });

    // Adicionar evento de tecla Enter para login
    senhaInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            acessarButton.click();
        }
    });
});