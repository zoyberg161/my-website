// Smooth scroll для ссылок
const links = document.querySelectorAll('a[href^="#"]');
links.forEach((link) => {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});

// Валидация формы
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', function (event) {
    const nameInput = form.querySelector('input[type="text"]');
    const phoneInput = form.querySelector('input[type="tel"]');

    if (nameInput.value.trim() === '' || phoneInput.value.trim() === '') {
      event.preventDefault(); // Предотвращаем отправку формы
      alert('Пожалуйста, заполните все поля!');
    } else {
      // Если форма валидна, можно добавить дополнительные действия (например, AJAX)
      console.log('Форма успешно отправлена!');
    }
  });
}

// Функция для проверки, прошло ли 5 секунд
let isTimeoutPassed = false;
setTimeout(() => {
  isTimeoutPassed = true;
}, 5000); // 5 секунд

// Обработка прокрутки для кнопки "Позвонить" (35%)
window.addEventListener('scroll', function () {
  const callButton = document.getElementById('callButton');
  const scrollPercentage =
    (window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)) *
    100;

  // Показывать кнопку только после 4 секунд и при прокрутке на 35%
  if (isTimeoutPassed && scrollPercentage > 35) {
    callButton.classList.add('visible');
  } else {
    callButton.classList.remove('visible');
  }
});

// Функция для скрытия кнопки
function hideCallButton() {
  const callButton = document.getElementById('callButton');
  callButton.classList.remove('visible');
}

// Кнопка "Наверх"
const scrollToTopButton = document.querySelector('.scroll-to-top');

// Показать/скрыть кнопку при прокрутке
window.addEventListener('scroll', function () {
  const scrollPosition = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (scrollPosition > pageHeight * 0.7) {
    scrollToTopButton.style.display = 'block';
  } else {
    scrollToTopButton.style.display = 'none';
  }
});

// Обработка клика на кнопку "Наверх"
scrollToTopButton.addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

// Управление навигацией на мобильных устройствах
const menuIcon = document.querySelector('.menu-icon');
const nav = document.querySelector('nav');

menuIcon.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// Закрываем навигацию при клике вне её области
document.addEventListener('click', (event) => {
  if (!nav.contains(event.target) && !menuIcon.contains(event.target)) {
    nav.classList.remove('active');
  }
});

// Чтобы кнопка "Вверх" работала при нажатии "Enter" или "Space"
document.querySelector('.scroll-to-top').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault(); // Предотвращаем стандартное поведение
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Прокрутка наверх
  }
});

// Динамическое позиционирование подсказок
document.querySelectorAll('.tooltip').forEach((tooltip) => {
  const tooltipText = tooltip.querySelector('.tooltiptext');

  tooltip.addEventListener('mouseenter', () => {
    const rect = tooltipText.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Сброс классов позиционирования
    tooltipText.classList.remove(
      'top-out',
      'left-out',
      'right-out',
      'bottom-out'
    );

    // Проверка, выходит ли подсказка за пределы экрана
    if (rect.top < 0) {
      tooltipText.classList.add('bottom-out'); // Показываем подсказку снизу
    }

    if (rect.left < 0) {
      tooltipText.classList.add('left-out'); // Смещаем подсказку вправо
    }

    if (rect.right > viewportWidth) {
      tooltipText.classList.add('right-out'); // Смещаем подсказку влево
    }

    // Если подсказка снизу тоже выходит за пределы экрана, возвращаем её наверх
    if (tooltipText.classList.contains('bottom-out')) {
      const bottomRect = tooltipText.getBoundingClientRect();
      if (bottomRect.bottom > viewportHeight) {
        tooltipText.classList.remove('bottom-out');
        tooltipText.classList.add('top-out'); // Возвращаем подсказку наверх
      }
    }

    // Автоматически подстраиваем ширину подсказки под текст
    tooltipText.style.whiteSpace = 'nowrap'; // Сначала проверяем без переноса
    const textWidth = tooltipText.scrollWidth;

    if (textWidth > viewportWidth * 0.8) {
      tooltipText.style.whiteSpace = 'normal'; // Переносим текст на новую строку
      tooltipText.style.maxWidth = '200px'; // Уменьшаем ширину
    } else {
      tooltipText.style.maxWidth = 'none'; // Восстанавливаем стандартную ширину
    }
  });

  // Скрываем подсказку при уходе курсора
  tooltip.addEventListener('mouseleave', () => {
    tooltipText.style.whiteSpace = 'nowrap'; // Восстанавливаем стандартное поведение
    tooltipText.style.maxWidth = 'none'; // Восстанавливаем стандартную ширину
  });
});

// Функционал полноэкранного просмотра изображений
const overlay = document.getElementById('fullscreen-overlay');
const fullscreenImage = document.querySelector('.fullscreen-image');
const imageTitle = document.querySelector('.image-title');
const closeBtn = document.querySelector('.close-btn');
const serviceCards = document.querySelectorAll('.service-card');
const imageContainer = document.querySelector('.image-container');

let currentImageIndex = 0;
let currentImages = [];
let currentTitles = [];

let autoSlideInterval;

// Открытие полноэкранного просмотра
serviceCards.forEach((card) => {
  const mainImage = card.querySelector('.service-image img.main-image');
  const additionalImages = card.querySelectorAll(
    '.service-image .additional-images img'
  );

  mainImage.addEventListener('click', () => {
    // Собираем все изображения из текущей карточки
    currentImages = [
      mainImage.src,
      ...Array.from(additionalImages).map((img) => img.src),
    ];
    currentTitles = [card.querySelector('.service-title h3').textContent];
    currentImageIndex = 0;

    updateFullscreenImage();
    overlay.style.display = 'flex';
    startAutoSlide(); // Запускаем автоматическое переключение
  });
});

// Закрытие полноэкранного просмотра
function closeOverlay() {
  overlay.style.display = 'none';
  stopAutoSlide(); // Останавливаем автоматическое переключение
}

// Закрытие при клике на пустое место (рамку) вокруг изображения
imageContainer.addEventListener('click', (e) => {
  if (e.target === imageContainer || e.target === fullscreenImage) {
    closeOverlay();
  }
});

// Закрытие при клике на крестик или вне окна
overlay.addEventListener('click', (e) => {
  if (e.target === overlay || e.target === closeBtn) {
    closeOverlay();
  }
});

// Закрытие при нажатии на Esc, Enter или пробел
document.addEventListener('keydown', (e) => {
  if (
    overlay.style.display === 'flex' &&
    (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')
  ) {
    closeOverlay();
  }
});

// Переключение изображений
function updateFullscreenImage() {
  fullscreenImage.src = currentImages[currentImageIndex];
  imageTitle.textContent = currentTitles[0]; // Используем заголовок карточки
}

// Навигация по изображениям с помощью стрелок клавиатуры
document.addEventListener('keydown', (e) => {
  if (overlay.style.display === 'flex') {
    if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  }
});

// Переключение на следующее изображение
function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  updateFullscreenImage();
}

// Переключение на предыдущее изображение
function prevImage() {
  currentImageIndex =
    (currentImageIndex - 1 + currentImages.length) % currentImages.length;
  updateFullscreenImage();
}

// Автоматическое переключение изображений
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    nextImage();
  }, 3000); // Переключение каждые 3 секунды
}

// Остановка автоматического переключения
function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Обработка жестов на мобильных устройствах
let touchStartX = 0;
let touchEndX = 0;

imageContainer.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});

imageContainer.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50; // Минимальная дистанция для срабатывания жеста
  const swipeDistance = touchEndX - touchStartX;

  if (swipeDistance > swipeThreshold) {
    prevImage(); // Свайп вправо
  } else if (swipeDistance < -swipeThreshold) {
    nextImage(); // Свайп влево
  }
}

// Раскрывающиеся блоки
document.addEventListener('DOMContentLoaded', function () {
  // Обработка кликов на заголовки дополнительных блоков
  document.querySelectorAll('.additional-header').forEach((header) => {
    header.addEventListener('click', function () {
      const block = this.closest('.additional-block');
      block.classList.toggle('active');

      // Плавная прокрутка к открытому блоку
      if (block.classList.contains('active')) {
        block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // Закрытие блоков при клике вне области
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.additional-block')) {
      document.querySelectorAll('.additional-block').forEach((block) => {
        block.classList.remove('active');
      });
    }
  });
});

// Добавьте этот код в ваш существующий обработчик событий
document.querySelectorAll('.service-image img.main-image').forEach((img) => {
  img.addEventListener('click', function () {
    // Ваш существующий код для полноэкранного просмотра
  });
});

// Добавляем интерактивность для мобильных устройств
document.addEventListener('DOMContentLoaded', function () {
  const stickers = document.querySelectorAll('.sticker');

  // Для мобильных - открытие по клику
  if (window.innerWidth <= 768) {
    stickers.forEach((sticker) => {
      sticker.addEventListener('click', function () {
        this.classList.toggle('active');
      });
    });
  }

  // Параллакс-эффект для десктопа
  if (window.innerWidth > 768) {
    document.querySelectorAll('.sticker').forEach((sticker) => {
      sticker.addEventListener('mousemove', (e) => {
        const x = e.offsetX / sticker.offsetWidth - 0.5;
        const y = e.offsetY / sticker.offsetHeight - 0.5;

        sticker.style.transform = `
                  rotate3d(${y}, ${-x}, 0, 5deg) 
                  translateY(-5px) 
                  scale(1.03)
              `;
      });

      sticker.addEventListener('mouseleave', () => {
        sticker.style.transform = '';
      });
    });
  }
});

// Карты
function initMap() {
  const mapContainer = document.getElementById('yandex-map');

  // Проверка на случай ошибки загрузки API
  const showError = () => {
    mapContainer.innerHTML = `
          <div style="padding:20px;text-align:center;color:red;">
              Карта временно недоступна
          </div>`;
  };

  // Загрузка API Яндекс.Карт
  const script = document.createElement('script');
  script.src =
    'https://api-maps.yandex.ru/2.1/?apikey=194a19a1-9c78-4451-8ade-c3158d18998b&lang=ru_RU';

  script.onerror = showError;

  script.onload = () => {
    ymaps.ready(() => {
      try {
        const coords = [47.211537, 39.612305];
        const map = new ymaps.Map('yandex-map', {
          center: coords,
          zoom: 16,
          controls: ['zoomControl'],
        });

        new ymaps.Placemark(
          coords,
          {
            hintContent: 'Ростов-сервис',
            balloonContent: `
                          <div style="padding:10px;max-width:250px;">
                              <div style="font-weight:bold;margin-bottom:8px;">
                                  <a href="https://yandex.ru/maps/-/CHVtZQ6t" 
                                     style="color:#333;text-decoration:none;" 
                                     target="_blank">
                                      Ростов-сервис
                                  </a>
                              </div>
                              <div style="margin-bottom:5px;">Пн-Пт: 9:00-18:00</div>
                              <div style="margin-bottom:5px;font-weight:bold;">8 (951) 826-44-29</div>
                              <div>г. Ростов-на-Дону, проспект Стачки, 243</div>
                          </div>
                      `,
          },
          {
            preset: 'islands#greenDotIcon',
          }
        ).addTo(map);
      } catch (e) {
        console.error('Ошибка инициализации карты:', e);
        showError();
      }
    });
  };

  document.head.appendChild(script);
}

// Запуск инициализации
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}

// Пробные отзывы
document.addEventListener('DOMContentLoaded', () => {
  const reviewsContainer = document.getElementById('reviews-container');
  const API_URL = 'parse_reviews.php'; // Лучше использовать относительный путь

  const showError = (message) => {
    reviewsContainer.innerHTML = `
      <div class="error">
        <p>${message}</p>
        <button onclick="location.reload()">Попробовать снова</button>
      </div>
    `;
  };

  const renderReviews = (reviews) => {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      showError('Нет отзывов для отображения');
      return;
    }

    const reviewsGrid = document.createElement('div');
    reviewsGrid.className = 'reviews-grid';

    reviews.forEach((review) => {
      const reviewCard = document.createElement('div');
      reviewCard.className = 'review-card';

      reviewCard.innerHTML = `
        <div class="review-header">
          <span class="review-author">${review.author || 'Аноним'}</span>
          <span class="review-date">${review.date || ''}</span>
        </div>
        <div class="review-text">${review.text || 'Без текста'}</div>
      `;

      reviewsGrid.appendChild(reviewCard);
    });

    reviewsContainer.innerHTML = '';
    reviewsContainer.appendChild(reviewsGrid);
  };

  const loadReviews = async () => {
    try {
      reviewsContainer.innerHTML =
        '<div class="loading">Загрузка отзывов...</div>';

      const response = await fetch(API_URL, {
        cache: 'no-cache',
      });

      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

      const data = await response.json();

      if (data.status === 'error' || !data.data) {
        throw new Error('Неверный формат данных');
      }

      renderReviews(data.data);
    } catch (error) {
      showError(`Ошибка загрузки: ${error.message}`);
      console.error('Ошибка:', error);
    }
  };

  // Первая загрузка
  loadReviews();

  // Обновление каждые 10 минут
  setInterval(loadReviews, 600000);
});
