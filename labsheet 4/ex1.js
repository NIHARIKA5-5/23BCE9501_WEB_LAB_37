class UsernameChecker {
    constructor() {
        this.form = document.getElementById('registerForm');
        this.usernameInput = document.getElementById('username');
        this.feedback = document.getElementById('usernameFeedback');
        this.submitBtn = document.getElementById('submitBtn');
        
        this.isChecking = false;
        this.isAvailable = false;
        
        this.init();
    }
    
    init() {
        this.usernameInput.addEventListener('input', debounce(this.checkUsername.bind(this), 500));
        this.usernameInput.addEventListener('blur', this.checkUsername.bind(this));
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    
    async checkUsername() {
        const username = this.usernameInput.value.trim();
        
        // Clear previous feedback and reset states
        this.clearFeedback();
        this.isAvailable = false;
        
        // Validate basic requirements
        if (username.length === 0) return;
        if (username.length < 3) {
            this.showFeedback('Username must be at least 3 characters', 'error');
            return;
        }
        
        // Show loading
        this.showLoading();
        this.isChecking = true;
        this.submitBtn.disabled = true;
        
        try {
            const response = await fetch('ex1.json');
            const data = await response.json();
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const isTaken = data.users.includes(username.toLowerCase());
            
            if (isTaken) {
                this.showFeedback('Username already taken', 'error');
            } else {
                this.showFeedback('Username available!', 'success');
                this.isAvailable = true;
            }
        } catch (error) {
            console.error('Check failed:', error);
            this.showFeedback('Unable to check availability. Please try again.', 'error');
        } finally {
            this.isChecking = false;
            this.updateSubmitButton();
        }
    }
    
    showLoading() {
        this.feedback.innerHTML = `
            <span class="spinner"></span>
            Checking availability...
        `;
        this.feedback.className = 'feedback loading';
    }
    
    showFeedback(message, type) {
        this.feedback.textContent = message;
        this.feedback.className = `feedback ${type}`;
    }
    
    clearFeedback() {
        this.feedback.textContent = '';
        this.feedback.className = 'feedback';
    }
    
    updateSubmitButton() {
        this.submitBtn.disabled = this.isChecking || !this.isAvailable || !this.usernameInput.value;
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.isAvailable) {
            alert('Registration successful! (This is a demo)');
            this.form.reset();
            this.clearFeedback();
        }
    }
}

// Utility: debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UsernameChecker();
});
