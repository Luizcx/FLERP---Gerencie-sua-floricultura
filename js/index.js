document.addEventListener('DOMContentLoaded', () => {
    // Logout functionality
    const sairBtn = document.querySelector('.sair-btn');
    if (sairBtn) {
        sairBtn.addEventListener('click', () => {
            if (confirm('Deseja realmente sair?')) {
                // Implementar lógica de logout
                window.location.href = 'login.html';
            }
        });
    }

    async function updateDashboardMetrics() {
        try {
            const metrics = await fetchMetrics();
            updateSaleMetrics(metrics.sales);
            updateStockMetrics(metrics.stock);
            updateTaskMetrics(metrics.tasks);
            updateMonthlySales(metrics.monthlySales);
            updatePopularProducts(metrics.popularProducts);
        } catch (error) {
            console.error('Error updating dashboard metrics:', error);
        }
    }

    function fetchMetrics() {
        return {
            sales: {
                todaySales: 0,
                changePercentage: 0
            },
            stock: {
                inStock: 0,
                outOfStock: 0
            },
            tasks: {
                pendingTasks: 0,
                nextTask: '...'
            },
            monthlySales: 0,
            popularProducts: [
                { name: 0},
                { name: 0},
                { name: 0}
            ]
        };
    }

    function updateSaleMetrics(salesData) {
        const salesMetric = document.querySelector('.card-metric-green');
        const salesChange = document.querySelector('.text-green');
       
        if (salesMetric && salesChange) {
            salesMetric.textContent = `R$ ${salesData.todaySales.toFixed(2)}`;
            salesChange.textContent = `${salesData.changePercentage}%`;
        }
    }

    function updateStockMetrics(stockData) {
        const inStockMetric = document.querySelector('.card-metric-blue');
        const outOfStockMetric = document.querySelector('[style="color: #ef4444;"]');
       
        if (inStockMetric && outOfStockMetric) {
            inStockMetric.textContent = stockData.inStock;
            outOfStockMetric.textContent = stockData.outOfStock;
        }
    }

    function updateTaskMetrics(taskData) {
        // Change selector to target the task metric within the "Tarefas Pendentes" card
        const taskMetric = document.querySelector('.card-metric[style="color: #6b46c1;"]');
        const nextTaskElement = document.querySelector('.product-list-item');
       
        if (taskMetric && nextTaskElement) {
            taskMetric.textContent = taskData.pendingTasks;
            nextTaskElement.textContent = taskData.nextTask;
        }
    }

    function updateMonthlySales(monthlySales) {
        const monthlySalesMetric = document.querySelector('[style="color: #4f46e5; margin-bottom: 1rem;"]');
       
        if (monthlySalesMetric) {
            monthlySalesMetric.textContent = `R$ ${monthlySales.toFixed(2)}`;
        }
    }

    function updatePopularProducts(products) {
        const productItems = document.querySelectorAll('.product-list-item');
       
        products.forEach((product, index) => {
            if (productItems[index * 2]) {
                const indicator = productItems[index * 2].querySelector('.product-indicator');
                const nameSpan = productItems[index * 2].querySelector('span:not(.product-indicator)');
                const quantitySpan = productItems[index * 2 + 1].querySelector('.text-gray-500');
               
                if (indicator) indicator.style.backgroundColor = product.color;
                if (nameSpan) nameSpan.textContent = product.name;
                if (quantitySpan) quantitySpan.textContent = `${product.quantity} un.`;
            }
        });
    }

    updateDashboardMetrics();
});