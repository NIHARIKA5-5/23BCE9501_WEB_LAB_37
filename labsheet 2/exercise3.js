class TaskBoard {
    constructor() {
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.todoList = document.getElementById('todo-list');
        this.progressList = document.getElementById('progress-list');
        this.completedList = document.getElementById('completed-list');
        this.completionMessage = document.getElementById('completionMessage');
        
        this.init();
    }

    init() {
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Make all columns droppable
        ['todo', 'progress', 'completed'].forEach(colId => {
            const column = document.getElementById(colId);
            column.addEventListener('dragover', this.handleDragOver.bind(this));
            column.addEventListener('drop', this.handleDrop.bind(this));
        });
    }

    addTask() {
        const taskName = this.taskInput.value.trim();
        if (!taskName) return;

        const taskId = Date.now();
        const taskDate = new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const taskElement = this.createTaskElement(taskId, taskName, taskDate);
        this.todoList.appendChild(taskElement);

        this.taskInput.value = '';
    }

    createTaskElement(id, name, date) {
        const task = document.createElement('div');
        task.className = 'task';
        task.draggable = true;
        task.dataset.id = id;
        
        task.innerHTML = `
            <h3>${name}</h3>
            <div class="date">${date}</div>
        `;

        task.addEventListener('dragstart', this.handleDragStart.bind(this));
        task.addEventListener('dragend', this.handleDragEnd.bind(this));

        return task;
    }

    handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDrop(e) {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        const task = document.querySelector(`[data-id="${taskId}"]`);
        
        if (!task) return;

        const targetColumn = e.currentTarget.id;
        const taskList = e.currentTarget.querySelector('.task-list');
        
        // Remove completed class if moving from completed
        if (task.classList.contains('completed')) {
            task.classList.remove('completed');
        }

        // Add completed styling and show message if dropped in completed
        if (targetColumn === 'completed') {
            task.classList.add('completed');
            this.showCompletionMessage();
        }

        taskList.appendChild(task);
    }

    showCompletionMessage() {
        this.completionMessage.classList.add('show');
        setTimeout(() => {
            this.completionMessage.classList.remove('show');
        }, 2000);
    }
}

// Initialize the task board when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TaskBoard();
});
