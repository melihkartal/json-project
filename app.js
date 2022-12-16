/**
 * @class Model
 *
 * Manages the data of the application.
 */
 class Model {
    constructor() {
        this.courses = this.getData();
        this.counter = 0;
    }

    bindTodoListChanged(callback) {
        this.onTodoListChanged = callback
    }

    getData() {
        const response = fetch('http://localhost:4232/courseList').then(response => {
            return response.json();
        });
        return response.then(data => {
            return data
        }) || []
    }

    countSelected(no) {
        this.counter += no;
    }
}

/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
    constructor() {
        this.app = this.getElement('#root')
        this.title = this.createElement('h1')
        this.title.textContent = 'Class Selection Page'
        this.todoList = this.createElement('ul', 'todo-list')
        this.app.append(this.title, this.todoList)
    }

    createElement(tag, className) {
        const element = document.createElement(tag)

        if (className) element.classList.add(className)

        return element
    }

    getElement(selector) {
        const element = document.querySelector(selector)

        return element
    }

    displayCourses(courses) {
        // Delete all nodes

        while (this.todoList.firstChild) {
            this.todoList.removeChild(this.todoList.firstChild)
        }
        const li = this.createElement('li');
        li.textContent = 'Available Course'
        this.todoList.append(li)
        // Show default message
        if (courses.length === 0) {
            const p = this.createElement('p')
            p.textContent = 'Nothing to view'
            this.todoList.append(p)
        } else {
            // Create nodes
            courses.forEach(course => {
                const li = this.createElement('li');
                li.setAttribute('id', course.id)
                const courseType = course.required ? "Compulsory" : "Elective";
                const div1 = this.createElement('span');
                if (course.required) {
                    li.style.backgroundColor = '#96b88b'
                }

                div1.innerHTML = course.courseName
                    + "<br/>" +
                    "Course Type: " + courseType
                    + "<br/>" +
                    "Course Credit: " + course.credit

                // const br = this.createElement('br')
                // const div2 = this.createElement('span')
                // div2.textContent = course.credit

                li.append(div1)
                // Append nodes
                this.todoList.append(li)
            })
        }

        // Debugging
        console.log(courses)
    }

    createCounter(counter) {
        const counterDiv = this.createElement('div')
        const p = this.createElement('p');
        p.textContent = 'Total Credit: ' + counter
        counterDiv.append(p);
    }

    bindSelectedSubject(handler) {
        this.todoList.addEventListener('click', event => {
            if (!event.ctrlKey) {
                event.target.parentElement.className = ""
            } else {
                event.target.parentElement.className = "clicked"
            }
            // const id = parseInt(event.target.parentElement.id)

        })
    }
}

/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        // Explicit this binding
        this.model.bindTodoListChanged(this.onTodoListChanged)
        this.view.bindSelectedSubject(this.handleCount)
        // Display initial course
        console.log(this.model.courses.then(d => {
            this.listChanged(d)
        }))
        //console.log(this.model.courses);

    }

    listChanged = courses => {
        this.view.displayCourses(courses)
    }

}

const app = new Controller(new Model(), new View());
