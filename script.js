// Добавляем в начало вашего скрипта
document.addEventListener('DOMContentLoaded', function () {
  // Функция для обработки якорных ссылок
  function handleAnchorLinks() {
    const hash = window.location.hash;
    if (!hash) return;

    // Находим элемент по ID
    const targetElement = document.querySelector(hash);
    if (!targetElement) return;

    // Находим родительский блок с ответом (либо сам элемент, либо его родительский абзац)
    let answerBlock = targetElement;
    if (!answerBlock.classList.contains('answer-block')) {
      answerBlock =
        answerBlock.closest('p, .section1, .term-item') || answerBlock;
    }

    // Проверяем, находится ли элемент в скрытом блоке
    const adviceBlock = answerBlock.closest('.additional-block');
    if (adviceBlock) {
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

    // Подсвечиваем весь блок ответа
    answerBlock.classList.add('highlighted-answer');

    // Плавная прокрутка к элементу
    setTimeout(() => {
      answerBlock.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 300);

    // Убираем подсветку через 8 секунд
    setTimeout(() => {
      answerBlock.classList.remove('highlighted-answer');
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
      window.location.hash = targetId; // Это вызовет hashchange
    });
  });
});

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
      event.preventDefault();
      alert('Пожалуйста, заполните все поля!');
    } else {
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
    currentImages = [
      mainImage.src,
      ...Array.from(additionalImages).map((img) => img.src),
    ];
    currentTitles = [card.querySelector('.service-title h3').textContent];
    currentImageIndex = 0;

    updateFullscreenImage();
    overlay.style.display = 'flex';
    startAutoSlide();
  });
});

// Закрытие полноэкранного просмотра
function closeOverlay() {
  overlay.style.display = 'none';
  stopAutoSlide();
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
  imageTitle.textContent = currentTitles[0];
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
  }, 3000);
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
  const swipeThreshold = 50;
  const swipeDistance = touchEndX - touchStartX;

  if (swipeDistance > swipeThreshold) {
    prevImage();
  } else if (swipeDistance < -swipeThreshold) {
    nextImage();
  }
}

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
