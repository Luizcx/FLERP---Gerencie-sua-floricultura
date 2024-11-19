// Classe para representar uma transação financeira
class Transacao {
    constructor(id, descricao, valor, tipo, data) {
        this.id = id;
        this.descricao = descricao;
        this.valor = valor;
        this.tipo = tipo;
        this.data = data;
    }
}

// Array para armazenar as transações
let transacoes = [
    new Transacao(1, 'Semente de Flor', 20.00, 'Entrada', '2024-03-19'),
    new Transacao(2, 'Flor crescida', 60.00, 'Entrada', '2024-03-19'),
    new Transacao(3, 'Salario', 1500.00, 'Saída', '2024-03-20'),
    new Transacao(4, 'Tulipa', 200.00, 'Entrada', '2024-03-20')
];

// Contador para gerar IDs únicos
let ultimoId = 4;

// Função para formatar data
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

// Função para atualizar os cards financeiros
function atualizarCards() {
    const entradas = transacoes
        .filter(t => t.tipo === 'Entrada')
        .reduce((acc, t) => acc + t.valor, 0);
    
    const saidas = transacoes
        .filter(t => t.tipo === 'Saída')
        .reduce((acc, t) => acc + t.valor, 0);
    
    const lucro = entradas - saidas;

    document.querySelector('.cards-financeiros .card:nth-child(1) p')
        .textContent = `R$ ${entradas.toFixed(2)}`;
    document.querySelector('.cards-financeiros .card:nth-child(2) p')
        .textContent = `R$ ${saidas.toFixed(2)}`;
    document.querySelector('.cards-financeiros .card:nth-child(3) p')
        .textContent = `R$ ${lucro.toFixed(2)}`;
}

// Função para atualizar a tabela
function atualizarTabela(transacoesExibidas = transacoes) {
    const tbody = document.querySelector('.tabela-financeira tbody');
    tbody.innerHTML = '';

    transacoesExibidas.forEach(transacao => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${transacao.id}</td>
            <td>${transacao.descricao}</td>
            <td>R$ ${transacao.valor.toFixed(2)}</td>
            <td>${transacao.tipo}</td>
            <td>${formatarData(transacao.data)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para adicionar nova transação
function adicionarTransacao(descricao, valor, tipo) {
    ultimoId++;
    const novaTransacao = new Transacao(
        ultimoId,
        descricao, 
        valor, 
        tipo,
        new Date().toISOString().split('T')[0]
    );
    transacoes.push(novaTransacao);
    atualizarCards();
    atualizarTabela();
}

// Funções do Modal
function abrirModal() {
    document.getElementById('modal').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('transacaoForm').reset();
}

// Event Listeners para os botões de filtro
document.addEventListener('DOMContentLoaded', () => {
    // Atualizar o cabeçalho da tabela para incluir as novas colunas
    const thead = document.querySelector('.tabela-financeira thead tr');
    thead.innerHTML = `
        <th>ID</th>
        <th>Descrição</th>
        <th>Valor</th>
        <th>Tipo</th>
        <th>Data</th>
    `;

    // Modal Event Listeners
    document.getElementById('novo').addEventListener('click', abrirModal);
    
    document.querySelector('.close').addEventListener('click', fecharModal);
    
    document.querySelector('.btn-cancel').addEventListener('click', fecharModal);
    
    window.addEventListener('click', (event) => {
        if (event.target == document.getElementById('modal')) {
            fecharModal();
        }
    });

    // Form Submit Handler
    document.getElementById('transacaoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const descricao = document.getElementById('descricao').value;
        const valor = parseFloat(document.getElementById('valor').value);
        const tipo = document.querySelector('input[name="tipo"]:checked').value;
        
        adicionarTransacao(descricao, valor, tipo);
        fecharModal();
    });

    // Botão Entradas
    document.querySelector('.button-container button:nth-child(1)')
        .addEventListener('click', () => {
            const entradasFiltradas = transacoes.filter(t => t.tipo === 'Entrada');
            atualizarTabela(entradasFiltradas);
        });

    // Botão Saídas
    document.querySelector('.button-container button:nth-child(2)')
        .addEventListener('click', () => {
            const saidasFiltradas = transacoes.filter(t => t.tipo === 'Saída');
            atualizarTabela(saidasFiltradas);
        });

    // Botão Total
    document.querySelector('.button-container button:nth-child(3)')
        .addEventListener('click', () => {
            atualizarTabela();
        });

    // Botão Gerar Relatório
    document.getElementById('relatorio').addEventListener('click', () => {
        const relatorio = {
            entradas: transacoes.filter(t => t.tipo === 'Entrada')
                .reduce((acc, t) => acc + t.valor, 0),
            saidas: transacoes.filter(t => t.tipo === 'Saída')
                .reduce((acc, t) => acc + t.valor, 0),
            totalTransacoes: transacoes.length,
            dataInicio: formatarData(transacoes[0].data),
            dataFim: formatarData(transacoes[transacoes.length - 1].data)
        };

        alert(`Relatório Financeiro:
        Período: ${relatorio.dataInicio} a ${relatorio.dataFim}
        Total de Entradas: R$ ${relatorio.entradas.toFixed(2)}
        Total de Saídas: R$ ${relatorio.saidas.toFixed(2)}
        Lucro: R$ ${(relatorio.entradas - relatorio.saidas).toFixed(2)}
        Número de Transações: ${relatorio.totalTransacoes}`);
    });

    // Inicialização
    atualizarCards();
    atualizarTabela();
});