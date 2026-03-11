class ProductSearch {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.resultsGrid = document.getElementById('resultsGrid');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.noResults = document.getElementById('noResults');
        this.feedback = document.getElementById('searchFeedback');
        
        this.searchTimeout = null;
        this.isSearching = false;
        
        this.init();
    }
    
    init() {
        this.searchInput.addEventListener('input', debounce(this.handleSearch.bind(this), 400));
    }
    
    async handleSearch() {
        const query = this.searchInput.value.trim().toLowerCase();
        
        // Clear previous results for new search
        this.clearResults();
        
        if (query.length === 0) {
            this.hideAllStates();
            return;
        }
        
        if (query.length < 2) {
            this.showFeedback('Type 2+ characters');
            return;
        }
        
        this.showLoading();
        this.isSearching = true;
        
        try {
            // Simulate server delay
            await new Promise(resolve => setTimeout(resolve, 600));
            
            const response = await fetch('ex2.json');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            const results = this.filterProducts(data.products, query);
            
            this.displayResults(results);
            
        } catch (error) {
            console.error('Search failed:', error);
            this.showError('Failed to fetch products. Please try again.');
        } finally {
            this.isSearching = false;
            this.hideFeedback();
        }
    }
    
    filterProducts(products, query) {
        return products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    }
    
    displayResults(products) {
        this.hideLoading();
        this.hideNoResults();
        
        if (products.length === 0) {
            this.showNoResults();
            return;
        }
        
        const fragment = document.createDocumentFragment();
        products.forEach(product => {
            const card = this.createProductCard(product);
            fragment.appendChild(card);
        });
        
        this.resultsGrid.appendChild(fragment);
    }
    
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-name">${product.name}</div>
            <div class="product-category">${product.category}</div>
            <div class="product-price">${product.price.toLocaleString()}</div>
        `;
        return card;
    }
    
    clearResults() {
        this.resultsGrid.innerHTML = '';
    }
    
    showLoading() {
        this.loadingSpinner.classList.remove('hidden');
        this.showFeedback('Searching...');
    }
    
    hideLoading() {
        this.loadingSpinner.classList.add('hidden');
    }
    
    showNoResults() {
        this.noResults.classList.remove('hidden');
    }
    
    hideNoResults() {
        this.noResults.classList.add('hidden');
    }
    
    showError(message) {
        this.resultsGrid.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #dc3545;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
    }
    
    showFeedback(message) {
        this.feedback.textContent = message;
        this.feedback.className = 'feedback loading';
    }
    
    hideFeedback() {
        this.feedback.className = 'feedback hidden';
    }
    
    hideAllStates() {
        this.hideLoading();
        this.hideNoResults();
        this.clearResults();
        this.hideFeedback();
    }
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ProductSearch();
});
