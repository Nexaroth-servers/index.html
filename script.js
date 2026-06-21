// Scroll fluide vers les sections
function scrollToSection(selectorId) {
    const element = document.querySelector(selectorId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Smooth scroll pour les liens de navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            scrollToSection(href);
        }
    });
});

// Animation des éléments lors du scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer toutes les cartes
document.querySelectorAll('.realm-card, .class-card, .reward-item, .download-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// Active nav link on scroll
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 200;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.color = '#d4af37';
            } else {
                navLink.style.color = '#e8e8e8';
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Effet parallax sur la bannière hero
const heroContent = document.querySelector('.hero-content');
const heroOverlay = document.querySelector('.hero-overlay');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
});

// Boutons interactifs
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Effet ripple
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Compteurs animés pour les statistiques
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Observer pour les statistiques
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.stat-number');
            stats.forEach(stat => {
                if (!stat.dataset.animated) {
                    const target = parseInt(stat.textContent.replace(/\D/g, ''));
                    animateCounter(stat, target);
                    stat.dataset.animated = 'true';
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Dark mode toggle (optionnel)
let isDarkMode = true;

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.style.filter = isDarkMode ? 'none' : 'invert(1)';
    localStorage.setItem('darkMode', isDarkMode);
}

// Charger la préférence de dark mode
if (localStorage.getItem('darkMode') === 'false') {
    isDarkMode = false;
    document.body.style.filter = 'invert(1)';
}

// Gestion des clics sur les boutons principaux
const btnSignup = document.querySelector('.btn-primary');
if (btnSignup) {
    btnSignup.addEventListener('click', function() {
        console.log('Redirection vers la page d\'inscription');
        // window.location.href = '/signup';
    });
}

// Tooltip sur hover
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', function() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);

        const rect = this.getBoundingClientRect();
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';

        setTimeout(() => tooltip.remove(), 2000);
    });
});

// Service Worker pour PWA (optionnel)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}

// Logger les événements de page
window.addEventListener('load', () => {
    console.log('✨ Bienvenue sur Mist of Pandaria Server! ✨');
    console.log('Profitez de votre expérience de jeu épique!');
});

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('Erreur:', e.error);
});

// Performance monitoring
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Temps de chargement: ' + pageLoadTime + 'ms');
    });
}
