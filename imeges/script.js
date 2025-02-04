// Мобильное меню
const menuIcon = document.querySelector('.menu-icon');
const nav = document.querySelector('header nav');

menuIcon.addEventListener('click', function() {
    if (nav.style.display === 'none' || nav.style.display === '') {
        nav.style.display = 'flex';
    } else {
        nav.style.display = 'none';
    }
});

// Плавная прокрутка
const links = document.querySelectorAll('a[href^="#"]');

links.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Валидация формы
const form = document.querySelector('form');

form.addEventListener('submit', function(event) {
    const nameInput = form.querySelector('input[type="text"]');
    const phoneInput = form.querySelector('input[type="tel"]');

    if (nameInput.value.trim() === '' || phoneInput.value.trim() === '') {
        event.preventDefault();
        alert('Пожалуйста, заполните все поля!');
    }
});