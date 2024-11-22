document.addEventListener('DOMContentLoaded', () => {
    const transactionModal = document.getElementById('transactionModal');
    const addTransactionBtn = document.querySelector('.add-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelModalBtn = document.querySelector('.cancel-btn');
    const saveTransactionBtn = document.querySelector('.save-btn');
    const transactionForm = document.getElementById('transactionForm');
    const financialTableBody = document.getElementById('financialTableBody');
    const searchInput = document.querySelector('.search-input');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let editingTransactionId = null;

    function renderTransactions(filteredTransactions = null) {
        const displayTransactions = filteredTransactions || transactions;
        financialTableBody.innerHTML = '';

        displayTransactions.forEach((transaction, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.descricao}</td>
                <td>R$ ${transaction.valor.toFixed(2)}</td>
                <td>${transaction.tipo}</td>
                <td>${new Date().toLocaleDateString()}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${index}">✏️</button>
                    <button class="action-btn delete-btn" data-id="${index}">🗑️</button>
                </td>
            `;
            financialTableBody.appendChild(row);
        });

        updateStats();
        attachActionListeners();
    }

    function updateStats() {
        const entradas = transactions
            .filter(t => t.tipo === 'Entrada')
            .reduce((sum, t) => sum + t.valor, 0);
        const saidas = transactions
            .filter(t => t.tipo === 'Saída')
            .reduce((sum, t) => sum + t.valor, 0);
        const lucro = entradas - saidas;

        document.querySelector('.total-products .stat-value').textContent = `R$ ${entradas.toFixed(2)}`;
        document.querySelector('.missing-products .stat-value').textContent = `R$ ${saidas.toFixed(2)}`;
        document.querySelector('.total-value .stat-value').textContent = `R$ ${lucro.toFixed(2)}`;
    }

    function saveTransaction(e) {
        e.preventDefault();
        const descricao = document.getElementById('descricao').value;
        const valor = parseFloat(document.getElementById('valor').value);
        const tipo = document.getElementById('tipo').value;

        const transaction = { descricao, valor, tipo };

        if (editingTransactionId !== null) {
            transactions[editingTransactionId] = transaction;
            editingTransactionId = null;
        } else {
            transactions.push(transaction);
        }

        localStorage.setItem('transactions', JSON.stringify(transactions));
        renderTransactions();
        closeModal();
    }

    function openModal(transaction = null) {
        if (transaction) {
            document.getElementById('descricao').value = transaction.descricao;
            document.getElementById('valor').value = transaction.valor;
            document.getElementById('tipo').value = transaction.tipo;
            document.getElementById('modalTitle').textContent = 'Editar Transação';
        } else {
            transactionForm.reset();
            document.getElementById('modalTitle').textContent = 'Nova Transação';
        }
        transactionModal.style.display = 'block';
    }

    function closeModal() {
        transactionModal.style.display = 'none';
    }

    function attachActionListeners() {
        const editBtns = document.querySelectorAll('.edit-btn');
        const deleteBtns = document.querySelectorAll('.delete-btn');

        editBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.getAttribute('data-id');
                editingTransactionId = index;
                openModal(transactions[index]);
            });
        });

        deleteBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.getAttribute('data-id');
                transactions.splice(index, 1);
                localStorage.setItem('transactions', JSON.stringify(transactions));
                renderTransactions();
            });
        });
    }

    function searchTransactions() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTransactions = transactions.filter(transaction =>
            transaction.descricao.toLowerCase().includes(searchTerm)
        );
        renderTransactions(filteredTransactions);
    }

    addTransactionBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);
    saveTransactionBtn.addEventListener('click', saveTransaction);
    searchInput.addEventListener('input', searchTransactions);

    // Initial render
    renderTransactions();

    // Logout functionality
    document.querySelector('.voltar-btn').addEventListener('click', () => {
       
            // Implementar lógica de logout
            window.location.href = 'index.html';
    
    });
});

