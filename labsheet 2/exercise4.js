class UserManagement {
    constructor() {
        this.form = document.getElementById('userForm');
        this.tableBody = document.getElementById('usersTableBody');
        this.userCount = document.getElementById('userCount');
        this.errorMsg = document.getElementById('errorMsg');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleRegister(e));
        this.clearAllBtn.addEventListener('click', () => this.clearAllUsers());
        this.loadUsers();
    }

    handleRegister(e) {
        e.preventDefault();
        
        const user = {
            id: Date.now(),
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            mobile: document.getElementById('mobile').value.trim(),
            password: document.getElementById('password').value,
            date: new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        };

        if (!this.validateUser(user)) {
            return;
        }

        if (this.isEmailExists(user.email)) {
            this.showError('User with this email already exists!');
            return;
        }

        this.saveUser(user);
        this.renderUsers();
        this.form.reset();
        this.hideError();
    }

    validateUser(user) {
        if (!user.name || !user.email || !user.mobile || !user.password) {
            this.showError('All fields are mandatory!');
            return false;
        }

        if (!/^\d{10}$/.test(user.mobile)) {
            this.showError('Mobile number must be exactly 10 digits!');
            return false;
        }

        if (user.password.length < 6) {
            this.showError('Password must be minimum 6 characters!');
            return false;
        }

        return true;
    }

    isEmailExists(email) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.some(user => user.email === email);
    }

    saveUser(user) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

    loadUsers() {
        this.renderUsers();
    }

    renderUsers() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        this.userCount.textContent = users.length;

        if (users.length === 0) {
            this.tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #666;">No users registered yet</td></tr>';
            return;
        }

        this.tableBody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.mobile}</td>
                <td>${user.date}</td>
                <td><button class="delete-btn" data-id="${user.id}">Delete</button></td>
            </tr>
        `).join('');

        // Add delete event listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteUser(e.target.dataset.id));
        });
    }

    deleteUser(id) {
        if (confirm('Are you sure you want to delete this user?')) {
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            users = users.filter(user => user.id != id);
            localStorage.setItem('users', JSON.stringify(users));
            this.renderUsers();
        }
    }

    clearAllUsers() {
        if (confirm('Are you sure you want to delete ALL users? This action cannot be undone!')) {
            localStorage.removeItem('users');
            this.renderUsers();
        }
    }

    showError(message) {
        this.errorMsg.textContent = message;
        this.errorMsg.style.display = 'block';
    }

    hideError() {
        this.errorMsg.style.display = 'none';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new UserManagement();
});
