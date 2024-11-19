document.addEventListener('DOMContentLoaded', () => {
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    const registrarButton = document.getElementById('acessar');

    // Adiciona elemento para mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.style.color = 'red';
    errorDiv.style.marginBottom = '10px';
    confirmarSenhaInput.parentNode.insertBefore(errorDiv, confirmarSenhaInput.nextSibling);

    registrarButton.addEventListener('click', (event) => {
        event.preventDefault(); // Previne o comportamento padrão do botão
        
        // Limpa mensagem de erro anterior
        errorDiv.textContent = '';

        // Validações
        if (nomeInput.value.trim() === '') {
            errorDiv.textContent = 'Por favor, insira seu nome completo.';
            return;
        }

        if (emailInput.value.trim() === '') {
            errorDiv.textContent = 'Por favor, insira um email válido.';
            return;
        }

        if (senhaInput.value.trim() === '') {
            errorDiv.textContent = 'Por favor, insira uma senha.';
            return;
        }

        if (senhaInput.value !== confirmarSenhaInput.value) {
            errorDiv.textContent = 'As senhas não coincidem. Por favor, verifique.';
            return;
        }

        // Validação de força da senha (exemplo)
        if (senhaInput.value.length < 6) {
            errorDiv.textContent = 'A senha deve ter no mínimo 6 caracteres.';
            return;
        }

        // Aqui você normalmente faria um registro no backend
        // Por enquanto, vamos salvar no localStorage e redirecionar
        const usuario = {
            nome: nomeInput.value,
            email: emailInput.value,
            senha: senhaInput.value
        };

        localStorage.setItem('usuario', JSON.stringify(usuario));
        
        // Redirecionar para página de login
        window.location.href = 'login.html';
    });

    // Adicionar evento de tecla Enter para registro
    confirmarSenhaInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            registrarButton.click();
        }
    });
});