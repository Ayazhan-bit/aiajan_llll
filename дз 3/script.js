const roomInput = document.getElementById('roomInput');
const checkBtn = document.getElementById('checkBtn');
const resultDiv = document.getElementById('result');

// Временная асинхронная функция с имитацией запроса на бэкенд
async function checkRoomStatus() {
    const roomId = roomInput.value.trim();

    if (!roomId) {
        resultDiv.textContent = 'Пожалуйста, введите номер комнаты!';
        resultDiv.style.color = '#e74c3c';
        return;
    }

    // Показываем статус загрузки
    resultDiv.textContent = 'Проверяем статус...';
    resultDiv.style.color = '#555';

    try {
        // Имитируем задержку сервера с помощью setTimeout и Promise (как будто ждем ответ 1 секунду)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Имитация ответа от бэкенда: 
        // Пусть четные комнаты будут заняты, а нечетные — свободны
        const isFree = roomId % 2 !== 0; 

        if (isFree) {
            resultDiv.textContent = `Комната №${roomId} свободна ✅`;
            resultDiv.style.color = '#27ae60';
        } else {
            resultDiv.textContent = `Комната №${roomId} занята ❌`;
            resultDiv.style.color = '#e74c3c';
        }

    } catch (error) {
        console.error('Ошибка:', error);
        resultDiv.textContent = 'Ошибка соединения с сервером.';
        resultDiv.style.color = '#e74c3c';
    }
}

checkBtn.addEventListener('click', checkRoomStatus);
roomInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkRoomStatus();
    }
});