const BASE_URL = 'https://inai-col1.fishrungames.com';
const API_URL = `${BASE_URL}/ads`;

const adsList = document.getElementById('ads-list');
const refreshBtn = document.getElementById('refresh-btn');
const searchInput = document.getElementById('search-input');
const statusContainer = document.getElementById('status-container');

let allAds = [];

async function loadAds() {
  statusContainer.innerHTML = '<p class="info-text">Загрузка актуальных объявлений...</p>';
  adsList.innerHTML = '';
  refreshBtn.disabled = true;

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Код ошибки сервера: ${res.status}`);

    const data = await res.json();
    allAds = data.items || [];
    statusContainer.innerHTML = '';
    applyFilterAndRender();
  } catch (err) {
    console.error(err);
    statusContainer.innerHTML = `<p class="error-msg">Не удалось загрузить данные: ${err.message}</p>`;
  } finally {
    refreshBtn.disabled = false;
  }
}

function applyFilterAndRender() {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = allAds.filter(ad => 
    (ad.title && ad.title.toLowerCase().includes(query)) ||
    (ad.description && ad.description.toLowerCase().includes(query))
  );

  if (filtered.length === 0) {
    adsList.innerHTML = '<p class="empty-text">Ничего не найдено.</p>';
    return;
  }

  adsList.innerHTML = filtered.map(ad => {
    const fullImageUrl = ad.image_url 
      ? `${BASE_URL}${ad.image_url}` 
      : 'https://placehold.co/600x400/f1f5f9/64748b?text=Нет+изображения';

    return `
      <article class="ad-card">
        <div class="ad-card-media">
          <img src="${fullImageUrl}" alt="${escapeHtml(ad.title)}" loading="lazy">
        </div>
        <div class="ad-card-body">
          <div class="ad-price">${Number(ad.price).toLocaleString()} сом</div>
          <h3 class="ad-title">${escapeHtml(ad.title)}</h3>
          <p class="ad-desc">${escapeHtml(ad.description)}</p>
          <div class="ad-footer">
            <span class="ad-id">ID: #${ad.id}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

searchInput.addEventListener('input', applyFilterAndRender);
refreshBtn.addEventListener('click', loadAds);

// Загрузка при открытии страницы
loadAds();