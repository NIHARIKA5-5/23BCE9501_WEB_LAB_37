class EmployeeManager {
    constructor() {
        this.form = document.getElementById('employeeForm');
        this.tableBody = document.getElementById('empBody');
        this.messageEl = document.getElementById('message');
        this.countEl = document.getElementById('count');
        this.employees = [];
        this.editingId = null;
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('clearBtn').addEventListener('click', () => this.clearForm());
        document.getElementById('loadBtn').addEventListener('click', () => this.loadEmployees());
        
        // Load on start
        this.loadEmployees();
    }
    
    loadEmployees() {
        // Use Promise wrapper for XMLHttpRequest
        this.loadEmployeesXML().then(() => {
            this.renderTable();
            this.updateCount();
            this.showMessage('Employees loaded from XML!', 'success');
        }).catch(error => {
            console.error('Load error:', error);
            this.showMessage('Failed to load XML: ' + error.message, 'error');
            this.showEmptyState();
        });
    }
    
    loadEmployeesXML() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'ex1.xml', true);
            
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        this.parseXML(xhr.responseXML);
                        resolve();
                    } catch (error) {
                        reject(new Error('Invalid XML: ' + error.message));
                    }
                } else {
                    reject(new Error(`HTTP ${xhr.status}`));
                }
            };
            
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.send();
        });
    }
    
    parseXML(xmlDoc) {
        if (!xmlDoc || !xmlDoc.getElementsByTagName) {
            throw new Error('Invalid XML document');
        }
        
        const employees = xmlDoc.getElementsByTagName('employee');
        this.employees = [];
        
        for (let i = 0; i < employees.length; i++) {
            const emp = employees[i];
            this.employees.push({
                id: emp.getAttribute('id'),
                name: emp.getElementsByTagName('name')[0]?.textContent || '',
                department: emp.getElementsByTagName('department')[0]?.textContent || '',
                salary: emp.getElementsByTagName('salary')[0]?.textContent || '0'
            });
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const employee = {
            id: document.getElementById('empId').value,
            name: document.getElementById('empName').value.trim(),
            department: document.getElementById('department').value,
            salary: document.getElementById('salary').value
        };
        
        if (this.editingId) {
            this.updateEmployee(employee);
        } else {
            this.addEmployee(employee);  // 🔥 FIXED: Now works instantly
        }
    }
    
    addEmployee(emp) {
        // Check for duplicate ID
        if (this.employees.find(e => e.id == emp.id)) {  // == for string/number comparison
            this.showMessage('Employee ID already exists!', 'error');
            return;
        }
        
        // ✅ IMMEDIATE ADD - Works now!
        this.employees.push(emp);
        this.renderTable();
        this.updateCount();
        this.clearForm();
        this.showMessage(`Employee ${emp.name} added successfully!`, 'success');
    }
    
    updateEmployee(emp) {
        const index = this.employees.findIndex(e => e.id == this.editingId);
        if (index !== -1) {
            this.employees[index] = emp;
            this.renderTable();
            this.updateCount();
            this.clearForm();
            this.showMessage(`Employee ${emp.name} updated!`, 'success');
        }
    }
    
    deleteEmployee(id) {
        if (!confirm(`Delete employee ${id}?`)) return;
        
        const index = this.employees.findIndex(e => e.id == id);
        if (index !== -1) {
            this.employees.splice(index, 1);
            this.renderTable();
            this.updateCount();
            this.showMessage('Employee deleted successfully!', 'success');
        }
    }
    
    editEmployee(id) {
        const emp = this.employees.find(e => e.id == id);
        if (emp) {
            document.getElementById('editId').value = id;
            document.getElementById('empId').value = emp.id;
            document.getElementById('empName').value = emp.name;
            document.getElementById('department').value = emp.department;
            document.getElementById('salary').value = emp.salary;
            document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> Update Employee';
            this.editingId = id;
            document.getElementById('empId').disabled = true;
        }
    }
    
    renderTable() {
        this.tableBody.innerHTML = '';
        this.hideLoading();
        
        if (this.employees.length === 0) {
            this.showEmptyState();
            return;
        }
        
        this.employees.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.department}</td>
                <td class="salary">₹${parseInt(emp.salary).toLocaleString()}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="empManager.editEmployee('${emp.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="empManager.deleteEmployee('${emp.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            this.tableBody.appendChild(row);
        });
        
        document.getElementById('empTable').classList.remove('hidden');
    }
    
    clearForm() {
        this.form.reset();
        document.getElementById('empId').disabled = false;
        document.getElementById('submitBtn').innerHTML = '<i class="fas fa-plus"></i> Add Employee';
        this.editingId = null;
        document.getElementById('editId').value = '';
    }
    
    updateCount() {
        this.countEl.textContent = `(${this.employees.length})`;
    }
    
    showMessage(text, type) {
        this.messageEl.textContent = text;
        this.messageEl.className = `message ${type}`;
        this.messageEl.classList.remove('hidden');
        setTimeout(() => this.messageEl.classList.add('hidden'), 3000);
    }
    
    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('empTable').classList.add('hidden');
    }
    
    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }
    
    showEmptyState() {
        document.getElementById('emptyState').classList.remove('hidden');
        document.getElementById('empTable').classList.add('hidden');
    }
    
    hideEmptyState() {
        document.getElementById('emptyState').classList.add('hidden');
    }
}

// Global instance
const empManager = new EmployeeManager();
