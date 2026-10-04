const API_URL = 'https://inai-col1.fishrungames.com/ads';

const form = document.getElementById('ad-form');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const imageInput = document.getElementById('image');
const previewWrapper = document.getElementById('image-preview-wrapper');
const previewImg = document.getElementById('image-preview');
const removeImageBtn = document.getElementById('remove-image-btn');
const submitBtn = document.getElementById('submit-btn');
const statusMsg = document.getElementById('form-status');

// 1. Предпросмотр изображения перед загрузкой
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    // Проверка размера (например, до 5 МБ)
    if (file.size > 5 * 1024 * 1024) {
      showStatus('Размер фото не должен превышать 5 МБ', 'error');
      imageInput.value = '';
      previewWrapper.classList.add('hidden');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewWrapper.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  } else {
    previewWrapper.classList.add('hidden');
  }
});

// Сброс выбранного изображения
removeImageBtn.addEventListener('click', () => {
  imageInput.value = '';
  previewImg.src = '';
  previewWrapper.classList.add('hidden');
});

// 2. Обработка отправки формы
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const rawPrice = priceInput.value.trim();

  // Клиентская валидация
  if (!title || !description || !rawPrice) {
    showStatus('Пожалуйста, заполните все обязательные поля (*)', 'error');
    return;
  }

  const price = parseFloat(rawPrice);
  if (isNaN(price) || price < 0) {
    showStatus('Введите корректную цену (положительное число)', 'error');
    return;
  }

  // Формируем FormData
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('price', price); // передаём число

  // КРИТИЧЕСКИЙ МОМЕНТ: добавляем 'image' только если файл действительно выбран
  if (imageInput.files && imageInput.files[0] && imageInput.files[0].size > 0) {
    formData.append('image', imageInput.files[0]);
  }

  // Блокируем кнопку на время сетевого запроса
  submitBtn.disabled = true;
  showStatus('Публикация объявления...', 'info');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData // Заголовок Content-Type браузер выставит сам с boundary
    });

    if (!response.ok) {
      let errorDetail = `Ошибка HTTP ${response.status}`;
      try {
        const errJson = await response.json();
        if (errJson.detail) {
          errorDetail = Array.isArray(errJson.detail) 
            ? errJson.detail.map(d => `${d.loc.slice(-1)}: ${d.msg}`).join('; ')
            : errJson.detail;
        }
      } catch (_) {
        // если в ответе не JSON
      }
      throw new Error(errorDetail);
    }

    const createdAd = await response.json();
    showStatus(`Объявление «${createdAd.title}» успешно создано! Переходим к списку...`, 'success');
    form.reset();
    previewWrapper.classList.add('hidden');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);

  } catch (err) {
    console.error('Ошибка при создании:', err);
    showStatus(`Не удалось подать объявление: ${err.message}`, 'error');
    submitBtn.disabled = false;
  }
});

function showStatus(text, type) {
  statusMsg.textContent = text;
  statusMsg.className = `status-msg status-${type}`;
}