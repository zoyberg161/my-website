document.addEventListener('DOMContentLoaded', function () {
  // Функция для обработки якорных ссылок
  function handleAnchorLinks() {
    const hash = window.location.hash;
    if (!hash) return;

    // Находим элемент по ID
    const targetElement = document.querySelector(hash);
    if (!targetElement) return;

    // Находим ближайший блок для подсветки (расширенный список классов)
    let answerBlock =
      targetElement.closest(
        '.section, .section1, .term-item, p, .problem-title'
      ) || targetElement;

    // Проверяем, находится ли элемент в скрытом блоке
    const adviceBlock = answerBlock.closest('.additional-block');
    if (adviceBlock && !adviceBlock.classList.contains('active')) {
      // Раскрываем блок
      adviceBlock.classList.add('active');
      const content = adviceBlock.querySelector('.additional-content');
      if (content) {
        content.style.display = 'block';
      }
      const toggleIcon = adviceBlock.querySelector('.toggle-icon');
      if (toggleIcon) {
        toggleIcon.textContent = '-';
      }
    }

    // Удаляем старую подсветку
    document.querySelectorAll('.highlighted-answer').forEach((el) => {
      el.classList.remove('highlighted-answer');
    });

    // Подсвечиваем сам элемент и его заголовок (если есть)
    targetElement.classList.add('highlighted-answer');
    const problemTitle =
      targetElement.querySelector('.problem-title') ||
      targetElement.previousElementSibling;
    if (problemTitle && problemTitle.classList.contains('problem-title')) {
      problemTitle.classList.add('highlighted-answer');
    }

    // Плавная прокрутка к элементу
    setTimeout(() => {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 300);

    // Убираем подсветку через 8 секунд
    setTimeout(() => {
      targetElement.classList.remove('highlighted-answer');
      if (problemTitle) problemTitle.classList.remove('highlighted-answer');
    }, 8000);
  }

  // Обрабатываем якорные ссылки при загрузке страницы
  handleAnchorLinks();

  // Обрабатываем якорные ссылки при изменении hash
  window.addEventListener('hashchange', handleAnchorLinks);

  // Модифицируем smooth scroll для ссылок
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const targetId = this.getAttribute('href');
      window.location.hash = targetId;
    });
  });
});

// Валидация формы остается без изменений
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', function (event) {
    const nameInput = form.querySelector('input[type="text"]');
    const phoneInput = form.querySelector('input[type="tel"]');

    if (nameInput.value.trim() === '' || phoneInput.value.trim() === '') {
      event.preventDefault();
      alert('Пожалуйста, заполните все поля!');
    } else {
      console.log('Форма успешно отправлена!');
    }
  });
}

// Кнопка Позвонить
let isTimeoutPassed = false;
let callButton = document.getElementById('callButton');

// Инициализация кнопки (если она существует)
if (callButton) {
  // Функция для проверки скролла
  function checkScroll() {
    const scrollPercentage =
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
      100;

    if (isTimeoutPassed && scrollPercentage > 25) {
      callButton.classList.add('visible');
    } else {
      callButton.classList.remove('visible');
    }
  }

  // Обработчик клика по кнопке
  callButton.addEventListener('click', function () {
    // Добавляем класс clicked при нажатии
    this.classList.add('clicked');

    // Здесь может быть ваш код для звонка
    // Например: window.location.href = 'tel:+1234567890';

    // Возвращаем в исходное состояние через 3 секунды
    setTimeout(() => {
      this.classList.remove('clicked');
    }, 3000);
  });

  // Таймер для задержки появления кнопки
  setTimeout(() => {
    isTimeoutPassed = true;
    checkScroll();
  }, 5000);

  // Обработчик скролла
  window.addEventListener(
    'scroll',
    function () {
      if (isTimeoutPassed) {
        checkScroll();
      }
    },
    { passive: true }
  );
}

// Кнопка "Наверх"
const scrollToTopButton = document.querySelector('.scroll-to-top');

if (scrollToTopButton) {
  window.addEventListener('scroll', function () {
    const scrollPosition = window.scrollY;
    const pageHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = scrollPosition / pageHeight;

    // Показывать после 60% прокрутки с плавной анимацией
    if (scrollPercentage > 0.6) {
      scrollToTopButton.classList.add('visible');
    } else {
      scrollToTopButton.classList.remove('visible');
    }
  });

  // Клик по кнопке
  scrollToTopButton.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

// Управление навигацией на мобильных устройствах
const menuIcon = document.querySelector('.menu-icon');
const nav = document.querySelector('nav');

menuIcon.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// Закрываем навигацию при клике вне её области
document.addEventListener('click', (event) => {
  const nav = document.querySelector('nav'); // или ваш конкретный селектор
  const menuIcon = document.querySelector('.menu-icon'); // или ваш селектор

  // Проверяем существование элементов перед работой с ними
  if (nav && menuIcon) {
    if (!nav.contains(event.target) && !menuIcon.contains(event.target)) {
      nav.classList.remove('active');
    }
  }
});

// Чтобы кнопка "Вверх" работала при нажатии "Enter" или "Space"
document.querySelector('.scroll-to-top').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      tooltipText.classList.add('bottom-out');
    }

    if (rect.left < 0) {
      tooltipText.classList.add('left-out');
    }

    if (rect.right > viewportWidth) {
      tooltipText.classList.add('right-out');
    }

    // Если подсказка снизу тоже выходит за пределы экрана, возвращаем её наверх
    if (tooltipText.classList.contains('bottom-out')) {
      const bottomRect = tooltipText.getBoundingClientRect();
      if (bottomRect.bottom > viewportHeight) {
        tooltipText.classList.remove('bottom-out');
        tooltipText.classList.add('top-out');
      }
    }

    // Автоматически подстраиваем ширину подсказки под текст
    tooltipText.style.whiteSpace = 'nowrap';
    const textWidth = tooltipText.scrollWidth;

    if (textWidth > viewportWidth * 0.8) {
      tooltipText.style.whiteSpace = 'normal';
      tooltipText.style.maxWidth = '200px';
    } else {
      tooltipText.style.maxWidth = 'none';
    }
  });

  // Скрываем подсказку при уходе курсора
  tooltip.addEventListener('mouseleave', () => {
    tooltipText.style.whiteSpace = 'nowrap';
    tooltipText.style.maxWidth = 'none';
  });
});

// Функционал полноэкранного просмотра изображений
document.addEventListener('DOMContentLoaded', function () {
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
  let touchStartX = 0;
  let touchEndX = 0;

  // Проверка существования элементов
  if (
    !overlay ||
    !fullscreenImage ||
    !imageTitle ||
    !closeBtn ||
    !imageContainer
  ) {
    console.error(
      'Не найдены необходимые элементы для полноэкранного просмотра'
    );
    return;
  }

  // Открытие полноэкранного просмотра
  function initGallery() {
    serviceCards.forEach((card) => {
      const mainImage = card.querySelector('.service-image img.main-image');
      const additionalImages = card.querySelectorAll(
        '.service-image .additional-images img:not(.main-image)'
      );
      const titleElement = card.querySelector('.service-title h2');

      if (mainImage && titleElement) {
        mainImage.addEventListener('click', () => {
          currentImages = [
            mainImage.src,
            ...Array.from(additionalImages).map((img) => img.src),
          ];
          currentTitles = [titleElement.textContent];
          currentImageIndex = 0;

          updateFullscreenImage();
          overlay.style.display = 'flex';
          document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
          startAutoSlide();
        });
      }
    });
  }

  // Инициализация галереи
  initGallery();

  // Закрытие полноэкранного просмотра
  function closeOverlay() {
    overlay.style.display = 'none';
    document.body.style.overflow = ''; // Восстанавливаем прокрутку
    stopAutoSlide();
  }

  // Обработчики событий для закрытия
  function setupEventListeners() {
    // Клик по пустому месту или изображению
    imageContainer.addEventListener('click', (e) => {
      if (e.target === imageContainer || e.target === fullscreenImage) {
        closeOverlay();
      }
    });

    // Клик по крестику или оверлею
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === closeBtn) {
        closeOverlay();
      }
    });

    // Закрытие клавишами
    document.addEventListener('keydown', handleKeyDown);

    // Свайпы на мобильных
    imageContainer.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    imageContainer.addEventListener('touchend', handleTouchEnd, {
      passive: true,
    });
  }

  function handleKeyDown(e) {
    if (overlay.style.display !== 'flex') return;

    switch (e.key) {
      case 'Escape':
      case 'Enter':
      case ' ':
        closeOverlay();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
    }
  }

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > swipeThreshold) {
      prevImage();
    } else if (swipeDistance < -swipeThreshold) {
      nextImage();
    }
  }

  // Обновление изображения в полноэкранном режиме
  function updateFullscreenImage() {
    if (currentImages.length === 0) return;

    fullscreenImage.src = currentImages[currentImageIndex];
    imageTitle.textContent = currentTitles[0];
  }

  // Навигация по изображениям
  function nextImage() {
    if (currentImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateFullscreenImage();
    resetAutoSlide();
  }

  function prevImage() {
    if (currentImages.length === 0) return;
    currentImageIndex =
      (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    updateFullscreenImage();
    resetAutoSlide();
  }

  // Автопрокрутка
  function startAutoSlide() {
    stopAutoSlide();
    if (currentImages.length > 1) {
      autoSlideInterval = setInterval(nextImage, 3000);
    }
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Инициализация всех обработчиков
  setupEventListeners();
});

// Раскрывающиеся блоки
document.addEventListener('DOMContentLoaded', function () {
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
  img.addEventListener('click', function () {});
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

// Раскрытие блока и подсветка вопроса
function highlightQuestion() {
  const hash = window.location.hash;
  if (!hash) return;

  // Находим вопрос по ID
  const questionBlock = document.querySelector(hash);
  if (!questionBlock) return;

  // Раскрываем родительский блок советов
  const adviceBlock = questionBlock.closest('.additional-block');
  adviceBlock.querySelector('.additional-content').style.display = 'block';
  adviceBlock.querySelector('.toggle-icon').textContent = '-';

  // Подсветка на 5 секунд
  questionBlock.classList.add('highlight');
  setTimeout(() => {
    questionBlock.classList.remove('highlight');
  }, 5000);

  // Плавная прокрутка
  setTimeout(() => {
    questionBlock.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, 300);
}

// Для списка в кнопке меню
document.addEventListener('DOMContentLoaded', function () {
  const menuButton = document.getElementById('menuButton');
  const dropdownMenu = document.getElementById('dropdownMenu');

  menuButton.addEventListener('click', function (e) {
    e.preventDefault();
    if (dropdownMenu.style.display === 'block') {
      dropdownMenu.style.display = 'none';
    } else {
      dropdownMenu.style.display = 'block';
    }
  });

  // Закрываем меню при клике вне его области
  document.addEventListener('click', function (e) {
    if (!menuButton.contains(e.target)) {
      dropdownMenu.style.display = 'none';
    }
  });
});
