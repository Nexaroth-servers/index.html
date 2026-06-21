// Script pour le site Nexaroth Servers

// Gestion du formulaire d'inscription
document.querySelector('.formulaire-inscription').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    
    // Validation basique
    if (password !== passwordConfirm) {
        alert('Les mots de passe ne correspondent pas !');
        return;
    }
    
    if (password.length < 6) {
        alert('Le mot de passe doit contenir au moins 6 caractères !');
        return;
    }
    
    // Simulation d'enregistrement
    alert(`Bienvenue ${username} ! Votre compte a été créé avec succès.\nUn email de confirmation a été envoyé à : ${email}`);
    this.reset();
});

// Animation des statistiques du serveur
function animateStats() {
    const stats = [
        { id: 'joueurs-online', target: 234, current: 0 },
        { id: 'uptime', target: 99.8, current: 0, suffix: '%' },
        { id: 'ping', target: 45, current: 0, suffix: 'ms' }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        const increment = stat.target / 50;
        
        let current = 0;
        const interval = setInterval(() => {
            current += increment;
            if (current >= stat.target) {
                current = stat.target;
                clearInterval(interval);
            }
            if (stat.suffix) {
                element.textContent = current.toFixed(1) + stat.suffix;
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    });
}

// Lancer l'animation des stats au chargement
window.addEventListener('load', () => {
    animateStats();
});

// Gestion des boutons d'achat
document.querySelectorAll('.btn-acheter').forEach(button => {
    button.addEventListener('click', function() {
        const item = this.closest('.item-card').querySelector('h3').textContent;
        alert(`Merci pour votre intérêt !\n\n${item}\n\nVous allez être redirigé vers le système de paiement.`);
    });
});

// Gestion des boutons de téléchargement
document.querySelectorAll('.btn-download').forEach(button => {
    button.addEventListener('click', function() {
        const downloadType = this.closest('.download-card').querySelector('h3').textContent;
        console.log(`Téléchargement de : ${downloadType}`);
        // Remplacer par votre lien de téléchargement réel
        // window.location.href = 'https://votre-lien-de-telechargement.com';
    });
});

// Smooth scroll pour les liens de navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gestion de la musique de fond (optionnel)
function initializeAudio() {
    const audio = document.querySelector('.musique-fond');
    if (audio) {
        audio.volume = 0.3; // Volume à 30%
        // La musique se joue automatiquement avec autoplay
    }
}

// Appeler les fonctions au chargement
window.addEventListener('DOMContentLoaded', () => {
    initializeAudio();
});

// Mise à jour en temps réel des statistiques du serveur
function updateServerStats() {
    // Simulation de mise à jour des stats
    const jueursOnline = Math.floor(Math.random() * (350 - 150 + 1) + 150);
    const uptime = (99.5 + Math.random() * 0.3).toFixed(1);
    const ping = Math.floor(Math.random() * (80 - 20 + 1) + 20);
    
    document.getElementById('joueurs-online').textContent = jueursOnline;
    document.getElementById('uptime').textContent = uptime + '%';
    document.getElementById('ping').textContent = ping + 'ms';
}

// Mettre à jour les stats toutes les 30 secondes
setInterval(updateServerStats, 30000);

// Effet de parallaxe
window.addEventListener('scroll', () => {
    const bannerHero = document.querySelector('.banniere-hero');
    if (bannerHero) {
        const scrolled = window.pageYOffset;
        bannerHero.style.backgroundPosition = `center ${scrolled * 0.5}px`;
    }
});

// Détection du support des animations
function supportsAnimation() {
    return window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
}

// Gestion des erreurs de chargement des ressources
window.addEventListener('error', (event) => {
    if (event.filename && event.filename.includes('.mp3')) {
        console.warn('Impossible de charger la musique de fond');
    }
}, true);

// Fonction pour activer/désactiver le son
function toggleAudio() {
    const audio = document.querySelector('.musique-fond');
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

// Log pour déboguer
console.log('✅ Nexaroth Servers - Script chargé avec succès');
console.log('🎵 Musique de fond prête');
console.log('🎮 Prêt pour l\'aventure !');
