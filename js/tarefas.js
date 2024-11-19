document.addEventListener('DOMContentLoaded', () => {
    const tarefasContainer = document.getElementById('tarefasContainer');
    const novaTarefaBtn = document.getElementById('novaTarefaBtn');
    const novaTarefaModal = document.getElementById('novaTarefaModal');
    const fecharModal = document.querySelector('.close-modal');
    const novaTarefaForm = document.getElementById('novaTarefaForm');

    // Carregar tarefas do localStorage
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    // Função para salvar tarefas no localStorage
    function salvarTarefas() {
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    // Função para renderizar tarefas
    function renderizarTarefas() {
        tarefasContainer.innerHTML = '';
        
        tarefas.forEach((tarefa, index) => {
            const tarefaDiv = document.createElement('div');
            tarefaDiv.classList.add('tarefa');
            
            if (tarefa.concluida) {
                tarefaDiv.classList.add('concluida');
            }
            
            const tarefaP = document.createElement('p');
            tarefaP.textContent = `${tarefa.nome} (Conclusão: ${tarefa.dataConclusao})`;
            
            const checkboxInput = document.createElement('input');
            checkboxInput.type = 'checkbox';
            checkboxInput.checked = tarefa.concluida;
            
            checkboxInput.addEventListener('change', () => {
                tarefa.concluida = checkboxInput.checked;
                
                if (tarefa.diaria && tarefa.concluida) {
                    // Mantém tarefa diária marcada como concluída
                    tarefaDiv.classList.add('concluida');
                } else if (!tarefa.diaria && tarefa.concluida) {
                    // Remove tarefas não-diárias quando concluídas
                    tarefas.splice(index, 1);
                }
                
                salvarTarefas();
                renderizarTarefas();
            });
            
            tarefaDiv.appendChild(tarefaP);
            tarefaDiv.appendChild(checkboxInput);
            
            tarefasContainer.appendChild(tarefaDiv);
        });
    }

    // Abrir modal de nova tarefa
    novaTarefaBtn.addEventListener('click', () => {
        novaTarefaModal.style.display = 'block';
    });

    // Fechar modal
    fecharModal.addEventListener('click', () => {
        novaTarefaModal.style.display = 'none';
    });

    // Adicionar nova tarefa
    novaTarefaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nomeTarefa').value;
        const dataConclusao = document.getElementById('dataConclusao').value;
        const diaria = document.getElementById('tarefaDiaria').checked;
        
        tarefas.push({
            nome,
            dataConclusao,
            diaria,
            concluida: false
        });
        
        salvarTarefas();
        renderizarTarefas();
        
        // Fechar modal e resetar form
        novaTarefaModal.style.display = 'none';
        novaTarefaForm.reset();
    });

    // Inicializar renderização de tarefas
    renderizarTarefas();
});