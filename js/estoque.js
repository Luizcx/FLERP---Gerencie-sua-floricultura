const conexao = require("./db");

// Dados mockados para simular um banco de dados
let produtos = [
    // Adicione mais produtos conforme necessário
];

// Configurações de paginação
let paginaAtual = 1;
const itensPorPagina = 10;

// Elementos do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Elementos da página
    const searchInput = document.querySelector('.search-input');
    const addBtn = document.querySelector('.add-btn');
    const voltarBtn = document.querySelector('.voltar-btn');
    const tableBody = document.getElementById('productsTableBody');
    const paginationButtons = document.querySelector('.pagination-buttons');

    // Event Listeners
    searchInput.addEventListener('input', handleSearch);
    addBtn.addEventListener('click', showAddProductModal);
    voltarBtn.addEventListener('click', handleLogout);
    
    // Inicialização
    atualizarEstatisticas();
    renderizarProdutos();
    configurarPaginacao();
});

// Função para renderizar produtos na tabela
function renderizarProdutos(produtosFiltrados = null) {
    const tableBody = document.getElementById('productsTableBody');
    const produtosParaMostrar = produtosFiltrados || produtos;
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const produtosPaginados = produtosParaMostrar.slice(inicio, fim);

    tableBody.innerHTML = '';

    produtosPaginados.forEach(produto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.codigo}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${produto.precoUnit.toFixed(2)}</td>
            <td><span class="status-badge ${getStatusClass(produto.status)}">${produto.status}</span></td>
            <td>
                <button class="action-btn edit" onclick="editarProduto(${produto.id})">✏️</button>
                <button class="action-btn delete" onclick="deletarProduto(${produto.id})">🗑️</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    atualizarInfoPaginacao(produtosParaMostrar.length);
}

// Função para atualizar estatísticas
function atualizarEstatisticas() {
    const totalProdutos = produtos.length;
    const produtosEmFalta = produtos.filter(p => p.quantidade === 0).length;
    const valorTotal = produtos.reduce((total, p) => total + (p.quantidade * p.precoUnit), 0);

    document.querySelector('.total-products .stat-value').textContent = totalProdutos;
    document.querySelector('.missing-products .stat-value').textContent = produtosEmFalta;
    document.querySelector('.total-value .stat-value').textContent = 
        `R$ ${valorTotal.toFixed(2)}`;
}

// Função para pesquisar produtos
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const produtosFiltrados = produtos.filter(produto => 
        produto.nome.toLowerCase().includes(searchTerm) ||
        produto.codigo.toLowerCase().includes(searchTerm)
    );
    renderizarProdutos(produtosFiltrados);
}

// Função para configurar paginação
function configurarPaginacao() {
    const paginationButtons = document.querySelector('.pagination-buttons');
    paginationButtons.addEventListener('click', (e) => {
        if (e.target.classList.contains('page-btn')) {
            const action = e.target.textContent;
            
            if (action === '<') {
                if (paginaAtual > 1) paginaAtual--;
            } else if (action === '>') {
                const totalPaginas = Math.ceil(produtos.length / itensPorPagina);
                if (paginaAtual < totalPaginas) paginaAtual++;
            } else {
                paginaAtual = parseInt(action);
            }
            
            renderizarProdutos();
        }
    });
}

// Função para atualizar informações de paginação
function atualizarInfoPaginacao(totalItems) {
    const totalPaginas = Math.ceil(totalItems / itensPorPagina);
    const inicio = ((paginaAtual - 1) * itensPorPagina) + 1;
    const fim = Math.min(paginaAtual * itensPorPagina, totalItems);
    
    document.querySelector('.pagination-info').textContent = 
        `Mostrando ${inicio} até ${fim} de ${totalItems} resultados`;
}

// Função auxiliar para definir classe de status
function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'em estoque': return 'status-ok';
        case 'baixo estoque': return 'status-warning';
        case 'em falta': return 'status-danger';
        default: return '';
    }
}

// Funções de CRUD
function showAddProductModal() {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = 'Adicionar Produto';
    form.reset();
    document.getElementById('produtoId').value = '';
    
    modal.style.display = 'block';
}

function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = 'Editar Produto';
    
    // Preenche o formulário com os dados do produto
    document.getElementById('produtoId').value = produto.id;
    document.getElementById('produtoNome').value = produto.nome;
    document.getElementById('produtoCodigo').value = produto.codigo;
    document.getElementById('produtoQuantidade').value = produto.quantidade;
    document.getElementById('produtoPreco').value = produto.precoUnit;
    document.getElementById('produtoStatus').value = produto.status;
    
    modal.style.display = 'block';
}

function deletarProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        produtos = produtos.filter(p => p.id !== id);
        renderizarProdutos();
        atualizarEstatisticas();
    }
}

function handleLogout() {
        // Implementar lógica de logout
        window.location.href = 'index.html';
}

function fecharModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
}

function salvarProduto() {
    const form = document.getElementById('productForm');
    const formData = new FormData(form);
    const produtoData = Object.fromEntries(formData);
    
    // Converte valores numéricos
    produtoData.quantidade = parseInt(produtoData.quantidade);
    produtoData.precoUnit = parseFloat(produtoData.precoUnit);
    
    if (produtoData.id) {
        // Atualiza produto existente
        const index = produtos.findIndex(p => p.id === parseInt(produtoData.id));
        if (index !== -1) {
            produtos[index] = { ...produtos[index], ...produtoData };
        }
    } else {
        // Adiciona novo produto
        produtoData.id = produtos.length + 1;
        produtos.push(produtoData);
    }
    
    renderizarProdutos();
    atualizarEstatisticas();
    fecharModal();
}

// Adicionar event listeners para o modal
document.addEventListener('DOMContentLoaded', () => {
    // Fechar modal quando clicar no X
    const closeBtn = document.querySelector('.close-modal');
    closeBtn.addEventListener('click', fecharModal);
    
    // Fechar modal quando clicar fora dele
    const modal = document.getElementById('productModal');
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            fecharModal();
        }
    });
});

function obterProdutos() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM estoque';
      conexao.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
}
  
function adicionarProduto(produto) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO estoque (id, nome, qtde, preco, status) VALUES (?, ?, ?, ?, ?)';
      conexao.query(query, [estoque.nome, estoque.qtde, estoque.preco, estoque.status], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
}


function renderizarProdutos() {
    obterProdutos().then(produtos => {
      const tableBody = document.getElementById('estoqueTableBody');
      const inicio = (paginaAtual - 1) * itensPorPagina;
      const fim = inicio + itensPorPagina;
      const produtosPaginados = produtos.slice(inicio, fim);
  
      tableBody.innerHTML = '';
  
      produtosPaginados.forEach(produto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${estoque.nome}</td>
            <td>${estoque.id}</td>
            <td>${estoque.qtde}</td>
            <td>R$ ${estoque.preco.toFixed(2)}</td>
            <td><span class="status-badge ${getStatusClass(estoque.status)}">${estoque.status}</span></td>
            <td>
                <button class="action-btn edit" onclick="editarProduto(${estoque.id})">✏️</button>
                <button class="action-btn delete" onclick="deletarProduto(${estoque.id})">🗑️</button>
            </td>
        `;
        tableBody.appendChild(row);
      });
  
      atualizarInfoPaginacao(estoque.length);
    }).catch(err => {
      console.error('Erro ao carregar os produtos:', err);
    });
  }
  
  function salvarProduto() {
    const form = document.getElementById('estoqueForm');
    const formData = new FormData(form);
    const produtoData = Object.fromEntries(formData);
    
    // Converte valores numéricos
    produtoData.quantidade = parseInt(produtoData.qtde);
    produtoData.precoUnit = parseFloat(produtoData.preco);
    
    if (produtoData.id) {
      // Atualiza produto existente
      editarProduto(produtoData.id, produtoData).then(() => {
        renderizarProdutos();
        atualizarEstatisticas();
        fecharModal();
      }).catch(err => console.error('Erro ao atualizar produto:', err));
    } else {
      // Adiciona novo produto
      adicionarProduto(produtoData).then(() => {
        renderizarProdutos();
        atualizarEstatisticas();
        fecharModal();
      }).catch(err => console.error('Erro ao adicionar produto:', err));
    }
  }
  