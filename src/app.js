class TodoItemModel {
    constructor(title, isComplete=false) {
        // this.id = new Date().getTime();
        this.id = Math.floor(Math.random() * 100); // Used temporarily until we don't need pre-generated dummy todos
        this.title = title;
        this.isComplete = isComplete;
    }
}

class ProjectModel {
    constructor() {
        this.todos = [
            new TodoItemModel("Tidy up library"),
            new TodoItemModel("Feed dragon", true)
            ];
    }

    addToDo(todo) {
        this.todos.push(todo);
    }

    deleteToDo(id) {
        this.todos = this.todos.filter((todo) => todo.id !== id)
    }
}

class AppView {
    constructor() {
        this.app = document.getElementById('todos');
        this.form = document.querySelector('form');
        this.addBtn = document.getElementById('add-btn');
        this.confirmAddTodoBtn = document.getElementById('add-todo');
    }

    get todoTitle() {
        return document.getElementById("todo-title").value;
    }

    get todoStatus() {
        return document.getElementById("todo-status").checked;
    }


    createElement(tag, className) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }
        return element
    }

    createTodoElement(todo) {
        const todoElement = this.createElement('li', 'todo-item');
        todoElement.innerHTML = `
         <div id=${todo.id}>
            <div class="todo__title">
                <h2>${todo.title}</h2>
            </div>
            <div class="todo__options">
                <div class="status-checkbox">
                    <input type="checkbox" name="todo-status" class="todo-status" ${
                        todo.isComplete ? "checked" : ""
                    }>
                </div>
                <button class="delete-todo"> Delete </button>
            </div>
        </div>
        `;
    return todoElement;
    }

    createTodoListElement(todos) {
        const todoList = this.createElement('ul', 'todo-list');

        todos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            todoList.appendChild(todoElement);
            console.log(todo);
        })
        return todoList;
      }

    enableAddToDo(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault()

            const todo = new TodoItemModel(this.todoTitle, this.todoStatus);
            handler(todo);
        })
    }

    enableDeleteTodo(handler) {
        const todoListElement = document.querySelector("ul");

        todoListElement.addEventListener("click", e => {
            if (e.target.className === 'delete-todo') {
                const id = parseInt(e.target.parentElement.parentElement.id);
                handler(id);
            }
        })
    }
  
    render(todos) {
        // Clear existing todos
        while (this.app.firstChild) {
            this.app.removeChild(this.app.lastChild);
        }

        // Create and render the list of todos
        const todoListElement = this.createTodoListElement(todos);
        this.app.appendChild(todoListElement);
    }
}

class AppController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.updateApp();

        // Bind handler functions
        this.view.enableAddToDo(this.addTodoHandler);
        this.view.enableDeleteTodo(this.deleteTodoHandler);
    }

    updateApp() {
        this.view.render(this.model.todos);
    }

    addTodoHandler = todo => {
        this.model.addToDo(todo);
        this.updateApp();
    }

    deleteTodoHandler = id => {
        this.model.deleteToDo(id);
        this.updateApp();
    }
}

const app = new AppController(new ProjectModel(), new AppView());
