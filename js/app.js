// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href"))
            .scrollIntoView({ behavior: "smooth" });
    });
});

// Fade-in scroll animation
const cards = document.querySelectorAll(".card, .download-card");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.2 });

cards.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(20px)";
    el.style.transition = "0.6s ease";
    observer.observe(el);
});

// Floating particles (simple)
function createParticle() {
    const p = document.createElement("div");
    p.style.position = "fixed";
    p.style.width = "6px";
    p.style.height = "6px";
    p.style.background = "#6fd3a0";
    p.style.borderRadius = "50%";
    p.style.left = Math.random() * window.innerWidth + "px";
    p.style.top = window.innerHeight + "px";
    p.style.opacity = "0.5";
    p.style.pointerEvents = "none";
    document.body.appendChild(p);

    let speed = Math.random() * 2 + 1;

    let move = setInterval(() => {
        p.style.top = p.offsetTop - speed + "px";

        if (p.offsetTop < -20) {
            p.remove();
            clearInterval(move);
        }
    }, 16);
}

setInterval(createParticle, 400);
