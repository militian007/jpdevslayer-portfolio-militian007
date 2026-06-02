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

/* ==========================================================================
   PROJECT DETAILS MODAL & INTERACTIVE CAROUSEL SYSTEM
   ========================================================================== */

const projectData = {
    sigma: {
        title: "SIGMA MATH PORTAL",
        subtitle: "Sistema Web de Gestión y Finanzas",
        meta: "DESARROLLO WEB // BASE DE DATOS // ENCRIPTACIÓN",
        stats: {
            "Cliente": "Prof. Diana Matson",
            "Estado": "<span class='status-pill'><span class='dot'></span> COMPLETADO & PAGADO</span>",
            "Base de Datos": "Supabase (PostgreSQL)",
            "Autenticación": "Supabase Auth"
        },
        description: "Un portal académico y administrativo diseñado a medida para simplificar y automatizar el control de alumnos, asistencia, calificaciones y registro de pagos mensuales de clases particulares. La aplicación cuenta con un doble acceso de roles (profesora y alumnos) y está conectada en tiempo real a una base de datos segura.",
        features: [
            "<strong>Doble Interfaz Adaptativa:</strong> Panel privado para la profesora (gestión académica/financiera) y portal para estudiantes (notas, asistencia y pagos).",
            "<strong>Control de Asistencia Diario:</strong> Grid interactivo que calcula automáticamente el porcentaje global de asistencia de cada estudiante.",
            "<strong>Carga de Recibos Drag-and-Drop:</strong> Módulo interactivo de carga de archivos multimedia para comprobar pagos.",
            "<strong>Dashboard Financiero Avanzado:</strong> Panel administrativo con métricas, gráficos de líneas SVG para ingresos a lo largo del tiempo y gráfico de dona de distribución.",
            "<strong>Seguridad con Row Level Security (RLS):</strong> Políticas en PostgreSQL que aseguran que los estudiantes solo accedan a sus propios datos."
        ],
        tech: ["HTML5", "CSS3 Moderno", "JavaScript ES6", "Supabase Auth", "PostgreSQL DB", "RLS Security", "Vercel Deploy"],
        images: [
            { src: "assets/math_1.png", caption: "Portal de acceso seguro (Login) con credenciales y accesos demo rápidos." },
            { src: "assets/math_2.png", caption: "Módulo de gestión académica: registro de nuevos alumnos y asignación de calificaciones." },
            { src: "assets/math_3.png", caption: "Dashboard financiero: métricas en tiempo real, gráfico de ingresos y distribución de cobros." },
            { src: "assets/math_4.png", caption: "Panel de auditoría: tabla de control de pagos y verificación manual de recibos." }
        ]
    },
    nexus: {
        title: "NEXUS MOTOR ANALÍTICO",
        subtitle: "Sistema Inteligente de Asistencia",
        meta: "REACT // TAILWIND // VITE",
        stats: {
            "Cliente": "Saman y Orinokia",
            "Estado": "<span class='status-pill'><span class='dot green'></span> PRODUCCIÓN</span>",
            "Procesamiento": "XLSX Parsing Avanzado",
            "Base de Datos": "Browser LocalStorage"
        },
        description: "Una aplicación web de alto rendimiento diseñada para procesar reportes biométricos generados por Hik-Connect. Transforma datos crudos de Excel en un panel analítico futurista que calcula retardo, puntualidad y detecta de forma inteligente omisiones de marcaje (entradas y salidas).",
        features: [
            "<strong>Algoritmo de Agrupación (Punch-Pairing):</strong> El sistema detecta inteligentemente si los empleados marcaron una o varias veces al día y agrupa los tiempos de entrada/salida automáticamente.",
            "<strong>Dashboard Global:</strong> Panel superior interactivo que muestra las métricas de toda la compañía o de grupos específicos en tiempo real.",
            "<strong>Diseño Futurista (Glassmorphism):</strong> Interfaz moderna con paneles semitransparentes, desenfoques de cristal y acentos de neón.",
            "<strong>Omitir Empleados:</strong> Capacidad de filtrar directivos o personal que no requiere marcaje desde la pantalla de configuración."
        ],
        tech: ["React.js", "Vite", "Tailwind CSS", "SheetJS (XLSX)", "Lucide Icons", "Vercel Deploy"],
        images: [
            { src: "assets/nexus_1.gif", caption: "Pantalla inicial de NEXUS: Carga de reportes biométricos." },
            { src: "assets/nexus_2.gif", caption: "Dashboard Global: Métricas en tiempo real y tarjetas de asistencia con alertas." },
            { src: "assets/nexus_3.gif", caption: "Configuración Avanzada: Mapeo de columnas, tolerancia de horarios y omisión de empleados." },
            { src: "assets/web_sphere.jpg", caption: "Diseño futurista basado en Glassmorphism." }
        ]
    },
    vortex: {
        title: "PROJECT VORTEX",
        subtitle: "Videojuego de Naves Espaciales en 3D",
        meta: "UNITY // DESARROLLO 3D // SHADERS",
        stats: {
            "Motor": "Unity 2025",
            "Lenguaje": "C#",
            "Render": "WebGL / Mobile URP",
            "Estado": "Completado"
        },
        description: "Un videojuego arcade de naves espaciales en 3D de ritmo frenético. Cuenta con mecánicas de disparo dinámicas, generación procedimental de oleadas de enemigos y shaders de escudos cibernéticos optimizados para ejecutarse a 60fps constantes.",
        features: [
            "<strong>Shader Graph Personalizados:</strong> Escudos cibernéticos que reaccionan visualmente a los impactos de asteroides.",
            "<strong>Control Optimizado:</strong> Soporte de mandos inalámbricos y controles táctiles giroscópicos móviles.",
            "<strong>WebGL Output:</strong> Optimización de peso de build web para tiempos de carga inferiores a 5 segundos."
        ],
        tech: ["Unity Engine", "C# scripting", "Shader Graph", "URP Renderer", "WebGL", "Audio Mixers"],
        images: [
            { src: "assets/game_sphere.png", caption: "Render conceptual de la esfera cibernética de energía del juego." }
        ]
    },
    dashboard: {
        title: "NEON NEST DASHBOARD",
        subtitle: "Visualizador WebGL de Métricas en Tiempo Real",
        meta: "VANILLA JS // RENDIMIENTO // WEBGL",
        stats: {
            "Framework": "HTML5 / CSS3 Puro",
            "Lenguaje": "JavaScript Vanilla",
            "Rendimiento": "100/100 Lighthouse",
            "Estado": "Producción"
        },
        description: "Un panel de control web inmersivo y responsivo para monitorización de datos. Implementa efectos avanzados de refracción de luz (glassmorphism) e interactividad con partículas en tiempo real sin librerías externas pesadas.",
        features: [
            "<strong>Spotlight Effects:</strong> Efecto de iluminación interactiva Bento Grid que sigue el movimiento del puntero.",
            "<strong>Sound Synthesis:</strong> Generación de sonidos de interfaz mediante Web Audio API (sintetizador de frecuencias).",
            "<strong>Lighthouse Optimization:</strong> Cero dependencias externas para lograr tiempos de carga instantáneos."
        ],
        tech: ["HTML5", "CSS Custom Variables", "Vanilla JavaScript", "Web Audio API", "HTML5 Canvas"],
        images: [
            { src: "assets/web_sphere.png", caption: "Ilustración de la esfera cibernética representando la interconexión web." }
        ]
    },
    aegis: {
        title: "AEGIS SHIELD UTILITY",
        subtitle: "Software de Encriptación y Seguridad Local",
        meta: "RUST // TAURI // MULTIPLATAFORMA",
        stats: {
            "Núcleo": "Rust (Seguridad de Memoria)",
            "Frontend": "HTML/JS con Tauri",
            "Peso Bundle": "&lt; 4 MB",
            "Estado": "En Desarrollo"
        },
        description: "Una aplicación de escritorio ultraligera y segura para encriptar archivos y bases de datos locales mediante algoritmos criptográficos robustos, asegurando total privacidad de la información.",
        features: [
            "<strong>Multiplataforma:</strong> Compilado nativo para Windows y Linux usando Tauri.",
            "<strong>Criptografía AES-GCM:</strong> Encriptación simétrica segura implementada directamente en Rust.",
            "<strong>Consumo de RAM Mínimo:</strong> Consumo inferior a 15MB de memoria RAM en segundo plano."
        ],
        tech: ["Rust", "Tauri Framework", "PostgreSQL", "Criptografía AES", "Desktop Native API"],
        images: [
            { src: "assets/app_sphere.png", caption: "Render conceptual que ilustra la encriptación local y blindaje Aegis." }
        ]
    },
    chrono: {
        title: "CHRONO SLAYER",
        subtitle: "Mecánicas de Manipulación de Tiempo",
        meta: "UNREAL ENGINE 5 // C++ // NIAGARA FX",
        stats: {
            "Motor": "Unreal Engine 5",
            "Lenguaje": "C++ Nativo",
            "FX System": "Niagara Particles",
            "Estado": "Etapa Alpha"
        },
        description: "Una demo técnica jugable en Unreal Engine 5 inspirada en mecánicas de manipulación del tiempo. Escrita principalmente en C++ para garantizar la máxima velocidad de procesamiento físico.",
        features: [
            "<strong>Time Dilated Physics:</strong> Control de tiempo individual para objetos del mundo y enemigos.",
            "<strong>Niagara Visual FX:</strong> Efectos de distorsión espacio-temporal de alta fidelidad.",
            "<strong>Optimización C++:</strong> Estructura de código nativa con mínima dependencia en Blueprints."
        ],
        tech: ["Unreal Engine 5", "C++", "Niagara FX", "Chaos Physics", "Materials & HLSL"],
        images: [
            { src: "assets/game_sphere.png", caption: "Esfera de energía temporal usada en el render de Chrono Slayer." }
        ]
    }
};

function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const backdrop = document.getElementById('modalBackdrop');
    const closeBtn = document.getElementById('modalCloseBtn');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');
    const cards = document.querySelectorAll('.project-card');

    if (!modal || !cards.length) return;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project-id');
            const data = projectData[projectId];
            
            if (data) {
                // Populate Modal Data
                modalTitle.textContent = data.title;
                
                // Build Modal content
                let imagesHTML = '';
                let indicatorsHTML = '';
                
                data.images.forEach((img, index) => {
                    imagesHTML += `
                        <div class="carousel-slide">
                            <img src="${img.src}" alt="${img.caption || data.title}">
                            <div class="carousel-caption">
                                <span>${img.caption || ''}</span>
                                <span class="carousel-counter">${index + 1} / ${data.images.length}</span>
                            </div>
                        </div>
                    `;
                    indicatorsHTML += `
                        <button class="carousel-dot ${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="Ir a diapositiva ${index + 1}"></button>
                    `;
                });

                let statsHTML = '';
                for (const [key, value] of Object.entries(data.stats)) {
                    statsHTML += `
                        <div class="meta-item">
                            <span class="meta-label">${key}</span>
                            <span class="meta-value">${value}</span>
                        </div>
                    `;
                }

                let featuresHTML = '';
                data.features.forEach(f => {
                    featuresHTML += `
                        <li class="feature-list-item">
                            <span class="feature-bullet">»</span>
                            <span class="feature-text">${f}</span>
                        </li>
                    `;
                });

                let techHTML = '';
                data.tech.forEach(t => {
                    techHTML += `<span class="tech-badge">${t}</span>`;
                });

                modalBody.innerHTML = `
                    <div class="modal-layout-grid">
                        <div class="modal-visual-area">
                            <div class="modal-carousel" id="modalCarousel">
                                <div class="carousel-view">
                                    <div class="carousel-track" id="carouselTrack" style="transform: translateX(0%);">
                                        ${imagesHTML}
                                    </div>
                                    ${data.images.length > 1 ? `
                                        <button class="carousel-btn prev" id="carouselPrevBtn" aria-label="Anterior">&lsaquo;</button>
                                        <button class="carousel-btn next" id="carouselNextBtn" aria-label="Siguiente">&rsaquo;</button>
                                    ` : ''}
                                </div>
                            </div>
                            ${data.images.length > 1 ? `
                                <div class="carousel-indicators" id="carouselIndicators">
                                    ${indicatorsHTML}
                                </div>
                            ` : ''}
                        </div>
                        <div class="modal-details-area">
                            <div>
                                <span class="modal-subtitle">${data.meta}</span>
                                <h4 style="font-family: var(--font-display); font-size: 1.1rem; color: white; margin-bottom: 1rem;">${data.subtitle}</h4>
                                <p class="modal-description">${data.description}</p>
                            </div>
                            
                            <div>
                                <h5 class="modal-section-title">Detalles del Sistema</h5>
                                <div class="modal-meta-grid">
                                    ${statsHTML}
                                </div>
                            </div>

                            <div>
                                <h5 class="modal-section-title">Características Clave</h5>
                                <ul class="features-list">
                                    ${featuresHTML}
                                </ul>
                            </div>

                            <div>
                                <h5 class="modal-section-title">Pila Tecnológica</h5>
                                <div class="tech-badges-container">
                                    ${techHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Open Modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock background scrolling
                
                // Add sound effects to new buttons in modal
                if (typeof attachSoundEffects === 'function') {
                    attachSoundEffects();
                }

                // Initialize Carousel functionality
                if (data.images.length > 1) {
                    setupCarousel();
                }
            }
        });
    });

    function setupCarousel() {
        const track = document.getElementById('carouselTrack');
        const prevBtn = document.getElementById('carouselPrevBtn');
        const nextBtn = document.getElementById('carouselNextBtn');
        const dots = document.querySelectorAll('.carousel-dot');
        let currentIndex = 0;
        const totalSlides = dots.length;

        function updateCarousel(index) {
            currentIndex = index;
            // Move track
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            // Update dots
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                let index = currentIndex - 1;
                if (index < 0) index = totalSlides - 1; // loop to end
                updateCarousel(index);
            });

            nextBtn.addEventListener('click', () => {
                let index = currentIndex + 1;
                if (index >= totalSlides) index = 0; // loop to start
                updateCarousel(index);
            });
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-slide'));
                updateCarousel(index);
            });
        });
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scrolling
    }

    // Close events
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    attachSoundEffects();
    highlightActiveLink();
    initProjectModal();
});
