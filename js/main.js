// Основной JavaScript файл для сайта ChipFix

document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация всех компонентов
    initScrollToTop();
    initMobileMenu();
    initSmoothScrolling();
    initHeaderScroll();
    initPopupForms();
    
    console.log('ChipFix website initialized');
});

/**
 * Компонент кнопки прокрутки наверх
 */
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (!scrollToTopBtn) return;
    
    // Показать/скрыть кнопку при прокрутке
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Обработчик клика по кнопке
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Мобильное меню
 */
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (!mobileMenuToggle || !mainNav) return;
    
    mobileMenuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        
        // Анимация иконки гамбургера
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (mainNav.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(6px, 6px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                span.style.transform = '';
                span.style.opacity = '';
            }
        });
    });
    
    // Закрыть меню при клике на ссылку
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mainNav.classList.remove('active');
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        });
    });
}

/**
 * Плавная прокрутка к якорям
 */
function initSmoothScrolling() {
    // Все ссылки с якорями
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Проверяем, что это якорь на текущей странице
            if (href === '#' || href.length === 1) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Эффекты заголовка при прокрутке
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Автоматический скролл в верх при переходах между страницами
 */
function initPageScrollReset() {
    // При загрузке страницы прокручиваем наверх
    window.addEventListener('beforeunload', function() {
        window.scrollTo(0, 0);
    });
    
    // При переходе по ссылкам на другие страницы
    const pageLinks = document.querySelectorAll('a[href$=".html"]');
    pageLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Небольшая задержка для корректной работы
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 50);
        });
    });
}

/**
 * Анимация появления элементов при прокрутке
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Элементы для анимации
    const animateElements = document.querySelectorAll('.service-category, .rating-item, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Инициализация popup-форм
 */
function initPopupForms() {
    const popup = document.getElementById('popupOverlay');
    const popupClose = document.getElementById('popupClose');
    const popupForm = document.getElementById('popupForm');
    const popupTitle = document.getElementById('popupTitle');
    const popupSubtitle = document.getElementById('popupSubtitle');
    
    if (!popup) return;
    
    // Кнопки, которые открывают popup
    const popupTriggers = document.querySelectorAll('[data-popup], .btn-popup');
    
    // Автоматически находим кнопки по тексту
    const autoTriggers = document.querySelectorAll('a, button');
    autoTriggers.forEach(trigger => {
        const text = trigger.textContent.toLowerCase().trim();
        if (text.includes('записаться') || 
            text.includes('воспользоваться') || 
            text === 'позвонить сейчас' ||
            text.includes('получить консультацию') ||
            text.includes('заказать') ||
            text.includes('оставить заявку')) {
            
            // Исключаем телефонные ссылки и внешние ссылки
            const href = trigger.getAttribute('href');
            if (!href || (!href.startsWith('tel:') && !href.startsWith('http') && !href.startsWith('mailto:'))) {
                trigger.classList.add('popup-trigger');
            }
        }
    });
    
    // Обработчики для открытия popup
    document.addEventListener('click', function(e) {
        const trigger = e.target.closest('.popup-trigger, [data-popup]');
        if (trigger) {
            e.preventDefault();
            
            // Определяем тип формы по тексту кнопки или data-атрибуту
            const triggerText = trigger.textContent.toLowerCase().trim();
            const popupType = trigger.dataset.popup || getPopupType(triggerText);
            
            openPopup(popupType);
        }
    });
    
    // Закрытие popup
    if (popupClose) {
        popupClose.addEventListener('click', closePopup);
    }
    
    // Закрытие по клику на overlay
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            closePopup();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            closePopup();
        }
    });
    
    // Маска для телефона
    const phoneInput = document.getElementById('userPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Автоматически добавляем код страны для Беларуси
            if (value.length > 0 && !value.startsWith('375')) {
                if (value.startsWith('80')) {
                    value = '375' + value.substring(2);
                } else if (value.length <= 9) {
                    value = '375' + value;
                }
            }
            
            // Форматируем номер
            let formatted = '+';
            if (value.length > 0) formatted += value.substring(0, 3);
            if (value.length > 3) formatted += ' (' + value.substring(3, 5);
            if (value.length > 5) formatted += value.substring(5, 7);
            if (value.length > 7) formatted += ') ' + value.substring(7, 10);
            if (value.length > 10) formatted += '-' + value.substring(10, 12);
            if (value.length > 12) formatted += '-' + value.substring(12, 14);
            
            e.target.value = formatted;
        });
    }
    
    // Обработка отправки формы
    if (popupForm) {
        popupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(popupForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            
            // Валидация
            if (!name.trim()) {
                showNotification('Пожалуйста, введите ваше имя', 'error');
                return;
            }
            
            if (!phone.trim()) {
                showNotification('Пожалуйста, введите номер телефона', 'error');
                return;
            }
            
            // Симуляция отправки
            const submitBtn = popupForm.querySelector('.popup-submit');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Отправляем...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showSuccessMessage();
                
                // Автоматически закрыть popup через 3 секунды
                setTimeout(() => {
                    closePopup();
                    resetForm();
                }, 3000);
            }, 1500);
        });
    }
    
    function getPopupType(triggerText) {
        if (triggerText.includes('записаться') || triggerText.includes('диагност')) {
            return 'diagnostic';
        } else if (triggerText.includes('воспользоваться') || triggerText.includes('акци')) {
            return 'offer';
        } else if (triggerText.includes('консультац') || triggerText.includes('вопрос')) {
            return 'consultation';
        } else {
            return 'contact';
        }
    }
    
    function openPopup(type = 'contact') {
        // Устанавливаем заголовок и подзаголовок в зависимости от типа
        const titles = {
            diagnostic: {
                title: 'Записаться на диагностику',
                subtitle: 'Бесплатная диагностика вашего устройства. Оставьте контакты и мы свяжемся с вами в течение 15 минут'
            },
            offer: {
                title: 'Воспользоваться акцией',
                subtitle: 'Оставьте ваши контакты и мы свяжемся с вами для уточнения деталей акции'
            },
            consultation: {
                title: 'Получить консультацию',
                subtitle: 'Наш специалист ответит на все ваши вопросы. Звонок в течение 15 минут'
            },
            contact: {
                title: 'Связаться с нами',
                subtitle: 'Оставьте ваши контакты и мы свяжемся с вами в течение 15 минут'
            }
        };
        
        const config = titles[type] || titles.contact;
        
        if (popupTitle) popupTitle.textContent = config.title;
        if (popupSubtitle) popupSubtitle.textContent = config.subtitle;
        
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Фокус на первое поле
        setTimeout(() => {
            const firstInput = popup.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 300);
    }
    
    function closePopup() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
        
        // Сброс формы через небольшую задержку
        setTimeout(resetForm, 300);
    }
    
    function resetForm() {
        if (popupForm) {
            popupForm.reset();
            const submitBtn = popupForm.querySelector('.popup-submit');
            if (submitBtn) {
                submitBtn.textContent = 'Отправить заявку';
                submitBtn.disabled = false;
            }
            
            // Скрыть сообщение об успехе, если оно показано
            const successMessage = popup.querySelector('.success-message');
            if (successMessage) {
                successMessage.remove();
                popup.querySelector('.popup-form').style.display = 'flex';
            }
        }
    }
    
    function showSuccessMessage() {
        const form = popup.querySelector('.popup-form');
        
        // Скрываем форму
        form.style.display = 'none';
        
        // Создаем сообщение об успехе
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <span class="success-icon">✅</span>
            <h3>Заявка отправлена!</h3>
            <p>Мы свяжемся с вами в течение 15 минут.<br>Спасибо за обращение!</p>
        `;
        
        // Вставляем после заголовка
        const title = popup.querySelector('h3');
        title.insertAdjacentElement('afterend', successDiv);
        
        showNotification('Заявка успешно отправлена!', 'success');
    }
}

/**
 * Система уведомлений
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Определяем цвет в зависимости от типа
    let backgroundColor = '#667eea';
    if (type === 'success') backgroundColor = '#48bb78';
    if (type === 'error') backgroundColor = '#f56565';
    if (type === 'warning') backgroundColor = '#ed8936';
    
    // Стили уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10001;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        max-width: 350px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Показать уведомление
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Скрыть уведомление через 3 секунды (или 4 для ошибок)
    const hideDelay = type === 'error' ? 4000 : 3000;
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, hideDelay);
}

// Запуск дополнительных функций при полной загрузке страницы
window.addEventListener('load', function() {
    initScrollAnimations();
    initPageScrollReset();
});

// Обработка ошибок JavaScript
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Экспорт функций для использования в других модулях (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initScrollToTop,
        initMobileMenu,
        initSmoothScrolling,
        showNotification
    };
}
