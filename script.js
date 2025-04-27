document.addEventListener('DOMContentLoaded', function () {
  function handleAnchorLinks() {
    const hash = window.location.hash;
    if (!hash) return;

    const targetElement = document.querySelector(hash);
    if (!targetElement) return;

    let answerBlock =
      targetElement.closest(
        '.section, .section1, .term-item, p, .problem-title'
      ) || targetElement;

    const adviceBlock = answerBlock.closest('.additional-block');
    if (adviceBlock && !adviceBlock.classList.contains('active')) {
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

    document.querySelectorAll('.highlighted-answer').forEach((el) => {
      el.classList.remove('highlighted-answer');
    });

    targetElement.classList.add('highlighted-answer');
    const problemTitle =
      targetElement.querySelector('.problem-title') ||
      targetElement.previousElementSibling;
    if (problemTitle && problemTitle.classList.contains('problem-title')) {
      problemTitle.classList.add('highlighted-answer');
    }

    setTimeout(() => {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 300);

    setTimeout(() => {
      targetElement.classList.remove('highlighted-answer');
      if (problemTitle) problemTitle.classList.remove('highlighted-answer');
    }, 8000);
  }

  handleAnchorLinks();

  window.addEventListener('hashchange', handleAnchorLinks);

  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const targetId = this.getAttribute('href');
      window.location.hash = targetId;
    });
  });
});

let isTimeoutPassed = false;
setTimeout(() => {
  isTimeoutPassed = true;
}, 5000);

window.addEventListener('scroll', function () {
  const callButton = document.getElementById('callButton');
  const scrollPercentage =
    (window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)) *
    100;

  if (isTimeoutPassed && scrollPercentage > 35) {
    callButton.classList.add('visible');
  } else {
    callButton.classList.remove('visible');
  }
});

function hideCallButton() {
  const callButton = document.getElementById('callButton');
  callButton.classList.remove('visible');
}

const scrollToTopButton = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', function () {
  const scrollPosition = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (scrollPosition > pageHeight * 0.7) {
    scrollToTopButton.style.display = 'block';
  } else {
    scrollToTopButton.style.display = 'none';
  }
});

scrollToTopButton.addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

const menuIcon = document.querySelector('.menu-icon');
const nav = document.querySelector('nav');

menuIcon.addEventListener('click', () => {
  nav.classList.toggle('active');
});

document.addEventListener('click', (event) => {
  const nav = document.querySelector('nav');
  const menuIcon = document.querySelector('.menu-icon');

  if (nav && menuIcon) {
    if (!nav.contains(event.target) && !menuIcon.contains(event.target)) {
      nav.classList.remove('active');
    }
  }
});

document.querySelector('.scroll-to-top').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

document.querySelectorAll('.tooltip').forEach((tooltip) => {
  const tooltipText = tooltip.querySelector('.tooltiptext');

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

    if (rect.top < 0) {
      tooltipText.classList.add('bottom-out');
    }

    if (rect.left < 0) {
      tooltipText.classList.add('left-out');
    }

    if (rect.right > viewportWidth) {
      tooltipText.classList.add('right-out');
    }

    if (tooltipText.classList.contains('bottom-out')) {
      const bottomRect = tooltipText.getBoundingClientRect();
      if (bottomRect.bottom > viewportHeight) {
        tooltipText.classList.remove('bottom-out');
        tooltipText.classList.add('top-out');
      }
    }

    tooltipText.style.whiteSpace = 'nowrap';
    const textWidth = tooltipText.scrollWidth;

    if (textWidth > viewportWidth * 0.8) {
      tooltipText.style.whiteSpace = 'normal';
      tooltipText.style.maxWidth = '200px';
    } else {
      tooltipText.style.maxWidth = 'none';
    }
  });

  tooltip.addEventListener('mouseleave', () => {
    tooltipText.style.whiteSpace = 'nowrap';
    tooltipText.style.maxWidth = 'none';
  });
});

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

function closeOverlay() {
  overlay.style.display = 'none';
  stopAutoSlide();
}

imageContainer.addEventListener('click', (e) => {
  if (e.target === imageContainer || e.target === fullscreenImage) {
    closeOverlay();
  }
});

overlay.addEventListener('click', (e) => {
  if (e.target === overlay || e.target === closeBtn) {
    closeOverlay();
  }
});

document.addEventListener('keydown', (e) => {
  if (
    overlay.style.display === 'flex' &&
    (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')
  ) {
    closeOverlay();
  }
});

function updateFullscreenImage() {
  fullscreenImage.src = currentImages[currentImageIndex];
  imageTitle.textContent = currentTitles[0];
}

document.addEventListener('keydown', (e) => {
  if (overlay.style.display === 'flex') {
    if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  }
});

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  updateFullscreenImage();
}

function prevImage() {
  currentImageIndex =
    (currentImageIndex - 1 + currentImages.length) % currentImages.length;
  updateFullscreenImage();
}

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    nextImage();
  }, 3000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

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

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.additional-header').forEach((header) => {
    header.addEventListener('click', function () {
      const block = this.closest('.additional-block');
      block.classList.toggle('active');

      if (block.classList.contains('active')) {
        block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.additional-block')) {
      document.querySelectorAll('.additional-block').forEach((block) => {
        block.classList.remove('active');
      });
    }
  });
});

document.querySelectorAll('.service-image img.main-image').forEach((img) => {
  img.addEventListener('click', function () {});
});

document.addEventListener('DOMContentLoaded', function () {
  const stickers = document.querySelectorAll('.sticker');

  if (window.innerWidth <= 768) {
    stickers.forEach((sticker) => {
      sticker.addEventListener('click', function () {
        this.classList.toggle('active');
      });
    });
  }

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

function highlightQuestion() {
  const hash = window.location.hash;
  if (!hash) return;

  const questionBlock = document.querySelector(hash);
  if (!questionBlock) return;

  const adviceBlock = questionBlock.closest('.additional-block');
  adviceBlock.querySelector('.additional-content').style.display = 'block';
  adviceBlock.querySelector('.toggle-icon').textContent = '-';

  questionBlock.classList.add('highlight');
  setTimeout(() => {
    questionBlock.classList.remove('highlight');
  }, 5000);

  setTimeout(() => {
    questionBlock.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, 300);
}

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

  document.addEventListener('click', function (e) {
    if (!menuButton.contains(e.target)) {
      dropdownMenu.style.display = 'none';
    }
  });
});
