/* ==========================================================================
   PARTICLE CANVAS SYSTEM (CIRCUIT BOARD PARTICLES)
   ========================================================================== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const maxParticles = 60;
const connectionDistance = 110;

// Mouse coordinates
let mouse = {
    x: null,
    y: null,
    radius: 120
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Setup canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color = 'rgba(0, 240, 255, 0.4)';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce on boundaries
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

        // Interaction with mouse
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                // Attract slightly
                this.x += dx * 0.01;
                this.y += dy * 0.01;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Initialize Particle Array
function initParticles() {
    particlesArray = [];
    for (let i = 0; i < maxParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Draw connection lines
function drawConnections() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                let opacity = (1 - (distance / connectionDistance)) * 0.15;
                ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation Loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid background subtly
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.01)';
    ctx.lineWidth = 0.5;
    const gridSpacing = 80;
    for (let x = 0; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    drawConnections();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();


/* ==========================================================================
   WEB AUDIO API - SYNTH AUDIO SYSTEM (NO FILES NEEDED)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

const soundToggle = document.getElementById('soundToggle');
const soundOnIcon = soundToggle.querySelector('.sound-on-icon');
const soundOffIcon = soundToggle.querySelector('.sound-off-icon');

// Try load sound preference from local storage
if (localStorage.getItem('jpdevslayer_sound') === 'enabled') {
    soundEnabled = true;
    soundOnIcon.classList.remove('d-none');
    soundOffIcon.classList.add('d-none');
}

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    
    if (soundEnabled) {
        soundOnIcon.classList.remove('d-none');
        soundOffIcon.classList.add('d-none');
        localStorage.setItem('jpdevslayer_sound', 'enabled');
        playSynthBeep(600, 0.05, 'triangle'); // Confirm beep
    } else {
        soundOnIcon.classList.add('d-none');
        soundOffIcon.classList.remove('d-none');
        localStorage.setItem('jpdevslayer_sound', 'disabled');
    }
});

// Synthesizer Function to generate high-tech sound effects
function playSynthBeep(frequency = 800, duration = 0.03, type = 'sine') {
    if (!soundEnabled) return;

    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime); // Low volume
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.error('AudioContext error:', e);
    }
}

// Add sound effects to interactive items
function attachSoundEffects() {
    const clickables = document.querySelectorAll('a, button, input, select, textarea, .project-card, .filter-btn');
    
    clickables.forEach(element => {
        // Hover sound (very short tick)
        element.addEventListener('mouseenter', () => {
            playSynthBeep(1200, 0.015, 'sine');
        });

        // Click sound (higher pitch beep)
        element.addEventListener('click', () => {
            playSynthBeep(850, 0.06, 'triangle');
        });
    });
}


/* ==========================================================================
   INTERACTIVE CARDS SPOTLIGHT GLOW EFFECT (BENTO CARDS)
   ========================================================================== */
const cards = document.querySelectorAll('.service-card');

cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});


/* ==========================================================================
   SCROLL REVEAL INTERSECTION OBSERVER
   ========================================================================== */
const scrollElements = document.querySelectorAll('.animate-scroll');

const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // If the revealed element is the skills section, animate skill bars
            if (entry.target.id === 'skills' || entry.target.contains(document.querySelector('.skill-bar-fill'))) {
                animateSkillBars();
            }
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

scrollElements.forEach(el => scrollObserver.observe(el));

// Function to slide-in skill bars
function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    bars.forEach(bar => {
        // Force rendering width which is defined in style attributes
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}


/* ==========================================================================
   PORTFOLIO FILTER LOGIC
   ========================================================================== */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        // Update active class on buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter projects
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                // Trigger smooth fade-in
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                // Delay hiding element to let fade transition finish
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});


/* ==========================================================================
   NAVIGATION RESPONSIVE MENU AND ACTIVE LINK SCROLL HIGHLIGHT
   ========================================================================== */
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky Navbar scroll trigger
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    highlightActiveLink();
});

// Mobile menu toggle
mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Highlight menu links on scroll
const sections = document.querySelectorAll('section');
function highlightActiveLink() {
    let scrollPosition = window.scrollY + 200; // Offset

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPosition >= top && scrollPosition < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}


/* ==========================================================================
   CONTACT FORM - SECURE CONSOLE SIMULATION
   ========================================================================== */
const contactForm = document.getElementById('contactForm');
const statusLog = document.getElementById('statusLog');
const cardButtons = document.querySelectorAll('.btn-service-pill');
const projectSelect = document.getElementById('projectType');

// If user clicks a "CONSTRUIR LA WEB" or "CREAR MUNDOS" button, auto-select it in form
cardButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const service = btn.getAttribute('data-service');
        if (service === 'Páginas Web') projectSelect.value = 'web';
        if (service === 'Videojuegos') projectSelect.value = 'games';
        if (service === 'Programas y Aplicaciones') projectSelect.value = 'apps';
    });
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    const submitBtn = contactForm.querySelector('.btn-submit');
    submitBtn.disabled = true;

    // Terminal simulated console logs
    const logs = [
        `>> INICIANDO PROTOCOLO DE TRANSMISIÓN DE DATOS...`,
        `>> CONECTANDO CON EL SERVIDOR JPDevSlayer SECURE SHELL...`,
        `>> ENCRIPTANDO MENSAJE MEDIANTE AES-256 PARA [${name.toUpperCase()}]...`,
        `>> ENVIANDO SEÑALES DE COMUNICACIÓN A: ${email.toLowerCase()}...`,
        `>> TRANSFERENCIA DE DATOS COMPLETADA CON ÉXITO. MISIÓN REGISTRADA.`,
        `>> CONEXIÓN CERRADA. ¡GRACIAS! NOS COMUNICAREMOS PRONTO.`
    ];

    statusLog.innerHTML = '';
    let logIndex = 0;

    function printNextLog() {
        if (logIndex < logs.length) {
            const line = document.createElement('span');
            line.className = 'status-line';
            line.style.display = 'block';
            line.style.color = logIndex === logs.length - 1 || logIndex === logs.length - 2 ? '#22c55e' : 'var(--color-cyan)';
            line.textContent = logs[logIndex];
            statusLog.appendChild(line);
            
            // Audio sound effect for terminal logging
            playSynthBeep(400 + (logIndex * 100), 0.04, 'square');

            logIndex++;
            setTimeout(printNextLog, 800);
        } else {
            // Re-enable and reset form
            submitBtn.disabled = false;
            contactForm.reset();
            setTimeout(() => {
                statusLog.innerHTML = '<span class="status-line">>> Canal listo para nueva transmisión. Esperando operador...</span>';
            }, 6000);
        }
    }

    printNextLog();
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    attachSoundEffects();
    highlightActiveLink();
});
