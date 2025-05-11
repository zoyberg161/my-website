document.addEventListener('DOMContentLoaded', function () {
  // Функция для обработки якорных ссылок и обновления meta description
  function handleHashChange() {
    // 1. Обновление meta description
    const desc = {
      '#Remont-rolvorot-v-Rostove':
        'Ремонт рольворот в Ростове-на-Дону — замена приводов, ремонт полотна. Гарантия до 12 месяцев!',
      '#Remont-rolstavnej-v-Rostove':
        'Ремонт рольставней в Ростове — оконных и дверных моделей. Выезд мастера в течение часа.',
      '#about':
        'Ремонт рольворот и рольставней в Ростове-на-Дону. Опыт работы более 10 лет. Гарантия качества!',
    };

    const newDesc =
      desc[window.location.hash] ||
      'Ремонт рольставней и рольворот в Ростове-на-Дону. Гарантия до 12 месяцев!';
    document
      .querySelector('meta[name="description"]')
      .setAttribute('content', newDesc);

    // 2. Обработка якорных ссылок
    const hash = window.location.hash;
    if (!hash) return;

    const targetElement = document.querySelector(hash);
    if (!targetElement) return;

    // 3. Отправка в IndexNow для Bing
    const indexNowUrls = [
      '#Remont-rolvorot-v-Rostove',
      '#Remont-rolstavnej-v-Rostove',
      '#about',
    ];
    if (indexNowUrls.includes(hash)) {
      const urlToSubmit = `https://uslugi161.ru/${encodeURIComponent(hash)}`;
      const indexNowUrl = `https://www.bing.com/indexnow?url=${encodeURIComponent(
        urlToSubmit
      )}&key=a5bbdd78a47d4475a14e0607da722d9d`;

      fetch(indexNowUrl)
        .then(
          (response) =>
            response.ok && console.log('URL отправлен в IndexNow:', urlToSubmit)
        )
        .catch((error) => console.error('Ошибка отправки в IndexNow:', error));
    }

    // 4. Подсветка элемента
    highlightElement(targetElement);
  }

  // Функция подсветки элементов
  function highlightElement(targetElement) {
    const answerBlock =
      targetElement.closest(
        '.section, .section1, .term-item, p, .problem-title'
      ) || targetElement;

    // Активация скрытых блоков
    const adviceBlock = answerBlock.closest('.additional-block');
    if (adviceBlock && !adviceBlock.classList.contains('active')) {
      adviceBlock.classList.add('active');
      const content = adviceBlock.querySelector('.additional-content');
      if (content) content.style.display = 'block';
      const toggleIcon = adviceBlock.querySelector('.toggle-icon');
      if (toggleIcon) toggleIcon.textContent = '-';
    }

    // Удаление старой подсветки
    document
      .querySelectorAll('.highlighted-answer')
      .forEach((el) => el.classList.remove('highlighted-answer'));

    // Новая подсветка
    targetElement.classList.add('highlighted-answer');
    const problemTitle =
      targetElement.querySelector('.problem-title') ||
      targetElement.previousElementSibling;
    if (problemTitle && problemTitle.classList.contains('problem-title')) {
      problemTitle.classList.add('highlighted-answer');
    }

    // Плавная прокрутка
    setTimeout(
      () =>
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      300
    );

    // Снятие подсветки
    setTimeout(() => {
      targetElement.classList.remove('highlighted-answer');
      if (problemTitle) problemTitle.classList.remove('highlighted-answer');
    }, 1000);
  }

  // Инициализация обработчиков событий
  window.addEventListener('load', handleHashChange);
  window.addEventListener('hashchange', handleHashChange);

  // Smooth scroll для якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      window.location.hash = this.getAttribute('href');
    });
  });

  // Кнопка "Позвонить"
  const callButton = document.getElementById('callButton');
  if (callButton) {
    let isTimeoutPassed = false;
    const checkScroll = () => {
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      callButton.classList.toggle(
        'visible',
        isTimeoutPassed && scrollPercentage > 25
      );
    };

    callButton.addEventListener('click', function () {
      this.classList.add('clicked');
      setTimeout(() => this.classList.remove('clicked'), 3000);
    });

    setTimeout(() => {
      isTimeoutPassed = true;
      checkScroll();
    }, 5000);

    window.addEventListener('scroll', checkScroll, { passive: true });
  }

  // Кнопка "Наверх"
  const scrollToTopButton = document.querySelector('.scroll-to-top');
  if (scrollToTopButton) {
    window.addEventListener('scroll', function () {
      const scrollPercentage =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      scrollToTopButton.classList.toggle('visible', scrollPercentage > 0.6);
    });

    scrollToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollToTopButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Мобильное меню
  const menuIcon = document.querySelector('.menu-icon');
  const nav = document.querySelector('nav');
  if (menuIcon && nav) {
    menuIcon.addEventListener('click', () => nav.classList.toggle('active'));

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !menuIcon.contains(event.target)) {
        nav.classList.remove('active');
      }
    });
  }

  // Подсказки
  document.querySelectorAll('.tooltip').forEach((tooltip) => {
    const tooltipText = tooltip.querySelector('.tooltiptext');
    if (!tooltipText) return;

    tooltip.addEventListener('mouseenter', () => {
      const rect = tooltipText.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      tooltipText.classList.remove(
        'top-out',
        'left-out',
        'right-out',
        'bottom-out'
      );

      if (rect.top < 0) tooltipText.classList.add('bottom-out');
      if (rect.left < 0) tooltipText.classList.add('left-out');
      if (rect.right > viewportWidth) tooltipText.classList.add('right-out');

      if (
        tooltipText.classList.contains('bottom-out') &&
        rect.bottom > viewportHeight
      ) {
        tooltipText.classList.remove('bottom-out');
        tooltipText.classList.add('top-out');
      }

      tooltipText.style.whiteSpace =
        tooltipText.scrollWidth > viewportWidth * 0.8 ? 'normal' : 'nowrap';
      tooltipText.style.maxWidth =
        tooltipText.scrollWidth > viewportWidth * 0.8 ? '200px' : 'none';
    });

    tooltip.addEventListener('mouseleave', () => {
      tooltipText.style.whiteSpace = 'nowrap';
      tooltipText.style.maxWidth = 'none';
    });
  });

  // Галерея изображений
  const overlay = document.getElementById('fullscreen-overlay');
  if (overlay) {
    const fullscreenImage = document.querySelector('.fullscreen-image');
    const imageTitle = document.querySelector('.image-title');
    const closeBtn = document.querySelector('.close-btn');
    const imageContainer = document.querySelector('.image-container');

    if (fullscreenImage && imageTitle && closeBtn && imageContainer) {
      let currentImageIndex = 0;
      let currentImages = [];
      let currentTitles = [];
      let autoSlideInterval;
      let touchStartX = 0;

      function updateFullscreenImage() {
        if (currentImages.length === 0) return;
        fullscreenImage.src = currentImages[currentImageIndex];
        imageTitle.textContent = currentTitles[0];
      }

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

      function startAutoSlide() {
        stopAutoSlide();
        if (currentImages.length > 1)
          autoSlideInterval = setInterval(nextImage, 3000);
      }

      function stopAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
      }

      function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
      }

      function closeOverlay() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        stopAutoSlide();
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
        const swipeDistance = e.changedTouches[0].clientX - touchStartX;
        if (swipeDistance > 50) prevImage();
        else if (swipeDistance < -50) nextImage();
      }

      document.querySelectorAll('.service-card').forEach((card) => {
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
            document.body.style.overflow = 'hidden';
            startAutoSlide();
          });
        }
      });

      imageContainer.addEventListener('click', (e) => {
        if (e.target === imageContainer || e.target === fullscreenImage)
          closeOverlay();
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target === closeBtn) closeOverlay();
      });

      document.addEventListener('keydown', handleKeyDown);
      imageContainer.addEventListener('touchstart', handleTouchStart, {
        passive: true,
      });
      imageContainer.addEventListener('touchend', handleTouchEnd, {
        passive: true,
      });
    }
  }

  // Раскрывающиеся блоки
  document.querySelectorAll('.additional-header').forEach((header) => {
    header.addEventListener('click', function () {
      const block = this.closest('.additional-block');
      block.classList.toggle('active');
      if (block.classList.contains('active')) {
        block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.additional-block')) {
      document.querySelectorAll('.additional-block').forEach((block) => {
        block.classList.remove('active');
      });
    }
  });

  // Стикеры
  document.querySelectorAll('.sticker').forEach((sticker) => {
    if (window.innerWidth <= 768) {
      sticker.addEventListener('click', function () {
        this.classList.toggle('active');
      });
    } else {
      sticker.addEventListener('mousemove', (e) => {
        const x = e.offsetX / sticker.offsetWidth - 0.5;
        const y = e.offsetY / sticker.offsetHeight - 0.5;
        sticker.style.transform = `rotate3d(${y}, ${-x}, 0, 5deg) translateY(-5px) scale(1.03)`;
      });

      sticker.addEventListener('mouseleave', () => {
        sticker.style.transform = '';
      });
    }
  });

  // Меню с выпадающим списком
  const menuButton = document.getElementById('menuButton');
  const dropdownMenu = document.getElementById('dropdownMenu');
  if (menuButton && dropdownMenu) {
    menuButton.addEventListener('click', function (e) {
      e.preventDefault();
      dropdownMenu.style.display =
        dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', function (e) {
      if (!menuButton.contains(e.target)) {
        dropdownMenu.style.display = 'none';
      }
    });
  }
});
