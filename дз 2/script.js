const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');

// Функция для проверки, пуст ли список
function checkEmpty() {
    if (taskList.children.length === 0) {
        emptyMessage.classList.remove('hidden');
    } else {
        emptyMessage.classList.add('hidden');
    }
}

// Функция добавления задачи
function addTask() {
    const taskText = taskInput.value.trim();
    
    // Если поле пустое, ничего не делаем
    if (taskText === '') return;

    const li = document.createElement('li');

    // Текст задачи
    const span = document.createElement('span');
    span.textContent = taskText;
    span.classList.add('task-text');
    
    // Клик по тексту зачеркивает задачу (выполнено / не выполнено)
    span.addEventListener('click', () => {
        li.classList.toggle('completed');
    });

    // Кнопка удаления задачи
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Удалить';
    deleteBtn.classList.add('delete-btn');
    
    deleteBtn.addEventListener('click', () => {
        li.remove();
        checkEmpty(); // Проверяем список после удаления
    });

    // Собираем элемент списка
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    // Очищаем поле ввода
    taskInput.value = '';
    
    // Проверяем список (текст "список пуст" пропадет)
    checkEmpty();
}

// Добавление по клику на кнопку
addTaskBtn.addEventListener('click', addTask);

// Добавление по нажатию клавиши Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Первоначальная проверка при загрузке страницы
checkEmpty();