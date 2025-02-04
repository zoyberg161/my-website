// Smooth scroll для ссылок
const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => {
    link.addEventListener('click', function (event) {
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
        behavior: 'smooth'
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