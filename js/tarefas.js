document.addEventListener('DOMContentLoaded', () => {
    const tarefasContainer = document.getElementById('tarefasContainer');
    const novaTarefaBtn = document.getElementById('novaTarefaBtn');
    const novaTarefaModal = document.getElementById('novaTarefaModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const novaTarefaForm = document.getElementById('novaTarefaForm');

    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    function renderTarefas() {
        tarefasContainer.innerHTML = '';
        tarefas.forEach((tarefa, index) => {
            const tarefaElement = document.createElement('div');
            tarefaElement.classList.add('tarefa');
            tarefaElement.innerHTML = `
                <div class="tarefa-info">
                    <span class="tarefa-nome">${tarefa.nome}</span>
                    <span class="tarefa-data">${tarefa.dataConclusao} ${tarefa.diaria ? '(Diária)' : ''}</span>
                </div>
                <div class="tarefa-acoes">
                    <button class="btn-acao btn-concluir" data-index="${index}">✓</button>
                    <button class="btn-acao btn-editar" data-index="${index}">✏️</button>
                    <button class="btn-acao btn-excluir" data-index="${index}">🗑️</button>
                </div>
            `;
            tarefasContainer.appendChild(tarefaElement);
        });
        attachTarefaListeners();
    }

    function attachTarefaListeners() {
        document.querySelectorAll('.btn-concluir').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.getAttribute('data-index');
                // Implement task completion logic
                alert('Tarefa concluída!');
            });
        });

        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.getAttribute('data-index');
                tarefas.splice(index, 1);
                localStorage.setItem('tarefas', JSON.stringify(tarefas));
                renderTarefas();
            });
        });
    }

    novaTarefaBtn.addEventListener('click', () => {
        novaTarefaModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        novaTarefaModal.style.display = 'none';
    });

    novaTarefaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('nomeTarefa').value;
        const dataConclusao = document.getElementById('dataConclusao').value;
        const diaria = document.getElementById('tarefaDiaria').checked;

        tarefas.push({ nome, dataConclusao, diaria });
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
        
        novaTarefaModal.style.display = 'none';
        novaTarefaForm.reset();
        renderTarefas();
    });

    // Initial render
    renderTarefas();
});