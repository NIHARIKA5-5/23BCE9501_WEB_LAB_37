class StudentManager {
    constructor() {
        this.form = document.getElementById('studentForm');
        this.tableBody = document.getElementById('studentsBody');
        this.messageEl = document.getElementById('message');
        this.studentsCount = document.getElementById('studentsCount');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.studentsTable = document.getElementById('studentsTable');
        
        this.editingId = null;
        this.students = [];
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
        document.getElementById('clearBtn').addEventListener('click', this.clearForm.bind(this));
        document.getElementById('refreshBtn').addEventListener('click', () => this.loadStudents());
        
        // Load students on page load
        this.loadStudents();
    }
    
    async loadStudents() {
        this.showLoading();
        try {
            const response = await fetch('ex3.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.students = [...data.students || []];  // Copy array
            this.renderTable();
            this.updateCount();
            this.showMessage('Students loaded successfully', 'success');
        } catch (error) {
            console.error('Load failed:', error);
            this.showMessage('Failed to load students', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const studentData = {
            id: parseInt(document.getElementById('studentIdInput').value),
            name: document.getElementById('studentName').value.trim(),
            department: document.getElementById('department').value,
            marks: parseInt(document.getElementById('marks').value)
        };
        
        try {
            if (this.editingId) {
                await this.updateStudent(studentData);
                this.showMessage('Student updated successfully!', 'success');
            } else {
                // ADD NEW STUDENT - Optimistically update local array FIRST
                this.students.push(studentData);
                await this.simulateApiDelay();
                await this.createStudent(studentData);
                this.showMessage('Student added successfully!', 'success');
            }
            
            // IMMEDIATELY UPDATE TABLE - This was missing!
            this.renderTable();
            this.updateCount();
            this.clearForm();
            
        } catch (error) {
            // Revert optimistic update on error
            if (!this.editingId) {
                this.students.pop();
                this.renderTable();
                this.updateCount();
            }
            console.error('Operation failed:', error);
            this.showMessage(error.message || 'Operation failed', 'error');
        }
    }
    
    async createStudent(student) {
        // Simulate POST to real server
        console.log('✅ POST /api/students:', student);
        // Real: await fetch('/api/students', { method: 'POST', body: JSON.stringify(student), headers: {'Content-Type': 'application/json'} })
    }
    
    async updateStudent(student) {
        // Simulate PUT to real server
        console.log('✅ PUT /api/students/', student);
        // Real: await fetch(`/api/students/${student.id}`, { method: 'PUT', body: JSON.stringify(student), headers: {'Content-Type': 'application/json'} })
    }
    
    async deleteStudent(id) {
        if (!confirm(`Delete student ID ${id}?`)) return;
        
        try {
            // Optimistically remove from local array FIRST
            const index = this.students.findIndex(s => s.id === id);
            if (index > -1) {
                this.students.splice(index, 1);
            }
            
            await this.simulateApiDelay();
            console.log('✅ DELETE /api/students/', id);
            
            // Update UI immediately
            this.renderTable();
            this.updateCount();
            this.showMessage('Student deleted successfully!', 'success');
            
        } catch (error) {
            // Revert on error
            await this.loadStudents();
            this.showMessage('Failed to delete student', 'error');
        }
    }
    
    editStudent(id) {
        const student = this.students.find(s => s.id === id);
        if (student) {
            document.getElementById('studentIdInput').value = student.id;
            document.getElementById('studentName').value = student.name;
            document.getElementById('department').value = student.department;
            document.getElementById('marks').value = student.marks;
            document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> Update Student';
            this.editingId = id;
            document.getElementById('studentIdInput').disabled = true;
            document.getElementById('studentIdInput').parentElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    renderTable() {
        this.tableBody.innerHTML = '';
        this.students.forEach(student => {
            const row = this.createStudentRow(student);
            this.tableBody.appendChild(row);
        });
        this.studentsTable.classList.remove('hidden');
    }
    
    createStudentRow(student) {
        const row = document.createElement('tr');
        const marksClass = student.marks >= 90 ? 'marks excellent' : 
                          student.marks >= 70 ? 'marks good' : 
                          student.marks >= 50 ? 'marks average' : 'marks poor';
        
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.department}</td>
            <td class="${marksClass}">${student.marks}/100</td>
            <td>
                <button class="action-btn btn-edit" onclick="studentManager.editStudent(${student.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-delete" onclick="studentManager.deleteStudent(${student.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        return row;
    }
    
    clearForm() {
        this.form.reset();
        document.getElementById('studentIdInput').disabled = false;
        document.getElementById('submitBtn').innerHTML = '<i class="fas fa-plus"></i> Add Student';
        this.editingId = null;
    }
    
    updateCount() {
        this.studentsCount.textContent = `(${this.students.length})`;
    }
    
    showMessage(text, type) {
        this.messageEl.textContent = text;
        this.messageEl.className = `message ${type}`;
        this.messageEl.classList.remove('hidden');
        setTimeout(() => this.messageEl.classList.add('hidden'), 3000);
    }
    
    showLoading() {
        this.loadingSpinner.classList.remove('hidden');
        this.studentsTable.classList.add('hidden');
    }
    
    hideLoading() {
        this.loadingSpinner.classList.add('hidden');
    }
    
    async simulateApiDelay() {
        await new Promise(resolve => setTimeout(resolve, 800));
    }
}

// Global reference
const studentManager = new StudentManager();
