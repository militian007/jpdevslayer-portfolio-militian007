/* ==========================================================================
   >>> CONFIGURACIÓN DEL SITIO — LO ÚNICO QUE TIENES QUE EDITAR <<<
   ==========================================================================

   1) FORMSPREE_ID  (para recibir los mensajes del formulario en tu correo)
      - Entra a https://formspree.io y crea una cuenta gratis.
      - Crea un formulario nuevo ("+ New Form") y pon tu correo.
      - Te dará una URL tipo:  https://formspree.io/f/xayzwqbk
      - Copia SOLO la última parte (ej: xayzwqbk) y pégala abajo.
      - El plan gratis permite 50 mensajes al mes.
      Mientras diga "PEGA-AQUI", el formulario le avisará al visitante y le
      ofrecerá WhatsApp como canal alterno.

   2) WHATSAPP  (botón flotante + canal alterno del formulario)
      - Tu número en formato internacional, SOLO DÍGITOS, sin +, sin espacios.
      - Si lo dejas vacío, el botón flotante no aparece.

   3) EMAIL_CONTACTO  (opcional, canal alterno si falla el envío)
      - Déjalo vacío si prefieres no publicar tu correo en el sitio.
   ========================================================================== */
const SITE_CONFIG = {
    FORMSPREE_ID: 'PEGA-AQUI-TU-ID',
    WHATSAPP: '584241237997',
    EMAIL_CONTACTO: ''
};


/* ==========================================================================
   UTILIDADES
   ========================================================================== */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Escapa texto del visitante antes de meterlo en innerHTML. */
function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}


/* ==========================================================================
   NAVEGACIÓN
   ========================================================================== */

function initNav() {
    const nav = $('#nav');
    const burger = $('#burger');
    const drawer = $('#drawer');

    // Fondo de la barra al bajar
    const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Menú móvil
    const closeDrawer = () => {
        nav.classList.remove('is-open');
        drawer.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
    };

    burger.addEventListener('click', () => {
        const open = drawer.classList.toggle('is-open');
        nav.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
    });

    $$('a', drawer).forEach(a => a.addEventListener('click', closeDrawer));

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeDrawer();
    });

    // Resaltar el enlace de la sección visible
    const links = $$('#navLinks a');
    const sections = links
        .map(a => $(a.getAttribute('href')))
        .filter(Boolean);

    if (!sections.length) return;

    const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(a => {
                a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(s => spy.observe(s));
}


/* ==========================================================================
   REVELADO AL HACER SCROLL
   ========================================================================== */

function initReveal() {
    const items = $$('.rise');

    if (reduceMotion) {
        items.forEach(el => el.classList.add('is-in'));
        $('#heroTitle')?.classList.add('is-lit');
        return;
    }

    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(el => io.observe(el));

    // El titular del hero se revela al cargar, no al hacer scroll
    requestAnimationFrame(() => {
        setTimeout(() => $('#heroTitle')?.classList.add('is-lit'), 120);
    });
}


/* ==========================================================================
   CONTADORES DEL HERO
   ========================================================================== */

function initCounters() {
    const targets = $$('[data-count]');
    if (!targets.length || reduceMotion) return;

    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const end = Number(el.dataset.count);
            const duration = 900;
            const start = performance.now();

            const tick = now => {
                const p = Math.min((now - start) / duration, 1);
                // Desaceleración suave
                el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
                if (p < 1) requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
            obs.unobserve(el);
        });
    }, { threshold: 0.6 });

    targets.forEach(el => io.observe(el));
}


/* ==========================================================================
   MARQUESINA — se duplica para que el bucle no tenga costura
   ========================================================================== */

function initStrip() {
    const track = $('#stripTrack');
    if (!track) return;
    track.innerHTML += track.innerHTML;
}


/* ==========================================================================
   FILTROS DE TRABAJOS
   ========================================================================== */

function initFilters() {
    const chips = $$('.chip');
    const cards = $$('.work-card');
    const empty = $('#empty');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.dataset.filter;

            chips.forEach(c => c.classList.remove('is-on'));
            chip.classList.add('is-on');

            let shown = 0;

            cards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.hidden = !match;
                if (match) shown++;
            });

            // Un hueco en blanco parece un error; esto invita a escribir
            if (empty) empty.hidden = shown > 0;
        });
    });
}


/* ==========================================================================
   DATOS DE LOS PROYECTOS
   Cada clave debe coincidir con un data-project="..." de index.html
   ========================================================================== */

const PROYECTOS = {
    olimpo: {
        title: 'Olimpo',
        subtitle: 'Plataforma para entrenadores personales',
        estado: 'construccion',
        resumen: 'El gimnasio entero de un entrenador dentro del teléfono de sus clientes. El entrenador arma rutinas y dietas y se las asigna; el cliente entra desde su celular, ve lo que le toca hoy, marca lo que hizo, sube sus fotos de progreso y paga su plan. Funciona como página web y como aplicación de Android y iPhone.',
        specs: {
            'Sector': 'Fitness y entrenamiento',
            'Estado': 'En construcción',
            'Plataformas': 'Web · Android · iPhone',
            'Roles': 'Administrador · Entrenador · Cliente'
        },
        features: [
            '<strong>Rutinas por día:</strong> catálogo de más de 1.300 ejercicios con series, repeticiones, peso y descanso. Todo editable por el entrenador.',
            '<strong>Dietas con calorías:</strong> plan de comidas por día, cada alimento con sus macros, y barras de cuánto lleva cumplido el cliente.',
            '<strong>Progreso con fotos:</strong> peso, siete medidas corporales y fotos de frente, perfil y espalda, con gráfico de evolución. Las fotos solo las ve el entrenador si el cliente lo autoriza.',
            '<strong>Cobro de cuotas:</strong> el cliente sube el comprobante, queda en revisión y el entrenador lo aprueba o lo rechaza.',
            '<strong>Chat en vivo:</strong> canal de comunidad para todos y conversación privada con el entrenador según el rango del cliente.',
            '<strong>Rangos de cliente:</strong> Bronce, Plata, Oro y Elite, cada uno con permisos distintos.'
        ],
        tech: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Aplicación instalable', 'Notificaciones push', 'Android', 'iOS'],
        images: [
            { src: 'assets/olimpo_1.png', caption: 'La rutina del día, tal como la ve el cliente en su teléfono.' },
            { src: 'assets/olimpo_2.png', caption: 'Los módulos: rutinas, dietas con calorías, progreso con fotos, cobro de cuotas, chat y tablón de avisos.' },
            { src: 'assets/olimpo_3.png', caption: 'El mismo sistema visto desde los dos lados: el entrenador desde el ordenador, el cliente desde el móvil.' },
            { src: 'assets/olimpo_4.png', caption: 'Qué viene funcionando desde el primer día y qué se adapta a la forma de trabajar de cada gimnasio.' },
            { src: 'assets/olimpo_5.png', caption: 'Las decisiones pequeñas: fotos privadas, precio congelado, retiro sin borrar el pasado.' }
        ]
    },

    sigma: {
        title: 'Sigmat',
        subtitle: 'Portal académico y de cobros',
        resumen: 'Portal a medida para clases particulares de matemática. La profesora registra alumnos, toma asistencia, carga calificaciones y verifica los pagos mensuales. Cada estudiante entra con su propio usuario y ve únicamente su información.',
        specs: {
            'Sector': 'Educación',
            'Estado': 'Entregado',
            'Base de datos': 'Supabase (PostgreSQL)',
            'Seguridad': 'Supabase Auth + RLS'
        },
        features: [
            '<strong>Dos portales en uno:</strong> panel privado para la profesora con la gestión académica y financiera, y portal para estudiantes con sus notas, asistencia y pagos.',
            '<strong>Asistencia diaria:</strong> cuadrícula interactiva que calcula sola el porcentaje de asistencia de cada estudiante a lo largo del período.',
            '<strong>Comprobantes de pago:</strong> el alumno sube la foto del pago arrastrándola, y la profesora la verifica desde su panel.',
            '<strong>Panel financiero:</strong> ingresos en el tiempo, distribución de cobros y control de quién está al día.',
            '<strong>Seguridad en la base de datos:</strong> políticas Row Level Security que impiden que un estudiante vea los datos de otro, aunque manipule el navegador.'
        ],
        tech: ['JavaScript ES6', 'CSS moderno', 'Supabase Auth', 'PostgreSQL', 'Row Level Security', 'Vercel'],
        images: [
            { src: 'assets/math_3.png', caption: 'Panel financiero: ingresos, distribución de cobros y métricas.' },
            { src: 'assets/math_1.png', caption: 'Acceso seguro con usuario y contraseña.' },
            { src: 'assets/math_2.png', caption: 'Gestión académica: alumnos y calificaciones.' },
            { src: 'assets/math_4.png', caption: 'Control de pagos y verificación de comprobantes.' }
        ]
    },

    fastchat: {
        title: 'FastChatCenter',
        subtitle: 'Central de atención multicanal',
        resumen: 'Todas las conversaciones de un negocio en una sola bandeja: WhatsApp, Messenger e Instagram juntos, atendidos por varios agentes a la vez sin pisarse. Cada mensaje se convierte en un ticket que se asigna, se responde y se cierra, con historial completo por contacto.',
        specs: {
            'Sector': 'Atención al cliente',
            'Estado': 'En producción',
            'Canales': 'WhatsApp · Messenger · Instagram',
            'Base de datos': 'MySQL / MariaDB'
        },
        features: [
            '<strong>Bandeja compartida:</strong> los chats se organizan en pendientes, abiertos y resueltos. Un agente acepta un ticket y queda asignado a él, para que dos personas no respondan lo mismo.',
            '<strong>Varias empresas en un sistema:</strong> cada negocio tiene su espacio aislado, con su marca, sus usuarios y sus datos separados.',
            '<strong>Chatbots por departamento:</strong> flujos automáticos que atienden y derivan al área correcta antes de que intervenga una persona.',
            '<strong>Respuestas rápidas y campañas:</strong> plantillas para lo que se pregunta siempre, y envíos programados a listas de contactos.',
            '<strong>Informes de atención:</strong> tiempo promedio de primera respuesta, de resolución y rendimiento por agente.',
            '<strong>Alarmas:</strong> avisos cuando un chat lleva demasiado tiempo sin respuesta.'
        ],
        tech: ['React', 'TypeScript', 'Vite', 'Node.js', 'Sequelize', 'MySQL', 'WebSockets', 'API de Meta', 'Docker'],
        images: [
            { src: 'assets/fastchat_1.png', caption: 'Bandeja compartida: pendientes, abiertos y resueltos. Un agente acepta el ticket y queda asignado a él.' },
            { src: 'assets/fastchat_2.png', caption: 'Conexiones: WhatsApp e Instagram enlazados al mismo panel, cada uno con su estado.' },
            { src: 'assets/fastchat_3.png', caption: 'Departamentos y chatbots que atienden y derivan al área correcta antes de que entre una persona.' },
            { src: 'assets/fastchat_4.png', caption: 'Respuestas rápidas: plantillas con atajo para lo que se pregunta siempre.' },
            { src: 'assets/fastchat_5.png', caption: 'Campañas: envíos programados a listas de contactos, con su progreso y estado.' },
            { src: 'assets/fastchat_6.png', caption: 'Etiquetas con color para clasificar contactos y conversaciones.' },
            { src: 'assets/fastchat_7.png', caption: 'Equipo: usuarios, perfiles y control de quién está en línea.' }
        ]
    },

    asistencia: {
        title: 'Asistencia',
        subtitle: 'Motor de análisis de personal',
        resumen: 'Toma los reportes en bruto del reloj biométrico y los convierte en información útil. Agrupa las marcaciones de cada persona por día, deduce la entrada y la salida, las compara contra el horario asignado con su tolerancia, y saca las alertas de tardanza e inasistencia sin revisión manual.',
        specs: {
            'Sector': 'Recursos humanos',
            'Estado': 'En producción',
            'Entrada': 'Excel de Hik-Connect',
            'Procesamiento': 'En el navegador'
        },
        features: [
            '<strong>Lee el Excel del reloj tal como sale:</strong> salta los títulos gigantes del reporte y encuentra solo las columnas que importan.',
            '<strong>Agrupa las marcaciones:</strong> el reloj exporta una fila por cada huella. El sistema junta todas las de una persona en un día y define la hora menor como entrada y la mayor como salida.',
            '<strong>Cálculo de retardos:</strong> compara la entrada contra la hora oficial más la tolerancia que configures.',
            '<strong>Separación por grupos:</strong> maneja varias sedes o equipos por separado dentro del mismo reporte.',
            '<strong>Exporta el resultado:</strong> genera un Excel nuevo, ya procesado y listo para usar.'
        ],
        tech: ['React', 'Vite', 'SheetJS (xlsx)', 'Tailwind CSS', 'Lucide'],
        images: [
            { src: 'assets/nexus_2.gif', caption: 'Panel global con métricas y alertas de asistencia.' },
            { src: 'assets/nexus_1.gif', caption: 'Carga de los reportes del reloj biométrico.' },
            { src: 'assets/nexus_3.gif', caption: 'Configuración: mapeo de columnas y tolerancia de horarios.' },
            { src: 'assets/asistencia_1.png', caption: 'Punto de entrada: se arrastra el reporte de Hik-Connect y el motor hace el resto.' }
        ]
    }
};


/* ==========================================================================
   MODAL DE PROYECTO
   ========================================================================== */

function initModal() {
    const modal = $('#modal');
    const veil = $('#modalVeil');
    const closeBtn = $('#modalX');
    const titleEl = $('#modalTitle');
    const bodyEl = $('#modalBody');
    let lastFocused = null;

    function render(key) {
        const p = PROYECTOS[key];
        if (!p) {
            console.error(`[Modal] No hay datos para "${key}". Revisa PROYECTOS en script.js.`);
            return false;
        }

        titleEl.textContent = p.title;

        const specs = Object.entries(p.specs)
            .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
            .join('');

        const thumbs = p.images
            .map((img, i) => `
                <button type="button" data-i="${i}" class="${i === 0 ? 'is-on' : ''}" aria-label="Captura ${i + 1}">
                    <img src="${img.src}" alt="" loading="lazy">
                </button>`)
            .join('');

        bodyEl.innerHTML = `
            <div class="shots">
                <figure class="shot-main" style="margin:0">
                    <img id="shotImg" src="${p.images[0].src}" alt="${p.title}">
                    <figcaption class="shot-cap" id="shotCap">${p.images[0].caption}</figcaption>
                </figure>
                ${p.images.length > 1 ? `<div class="shot-strip" id="shotStrip">${thumbs}</div>` : ''}
            </div>

            <div class="modal-cols">
                <div>
                    <h4>${p.subtitle}</h4>
                    <p>${p.resumen}</p>
                    <h4>Qué resuelve</h4>
                    <ul class="feat">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
                </div>
                <div>
                    <h4>Ficha</h4>
                    <dl class="spec">${specs}</dl>
                    <h4>Construido con</h4>
                    <div class="work-tech">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
                </div>
            </div>`;

        // Carrusel
        const strip = $('#shotStrip', bodyEl);
        if (strip) {
            strip.addEventListener('click', e => {
                const btn = e.target.closest('button[data-i]');
                if (!btn) return;
                const img = p.images[Number(btn.dataset.i)];
                $('#shotImg', bodyEl).src = img.src;
                $('#shotCap', bodyEl).textContent = img.caption;
                $$('button', strip).forEach(b => b.classList.toggle('is-on', b === btn));
            });
        }

        return true;
    }

    function open(key, trigger) {
        if (!render(key)) return;
        lastFocused = trigger || document.activeElement;
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    function close() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
        lastFocused?.focus();
    }

    $$('.work-card').forEach(card => {
        const fire = () => open(card.dataset.project, card);
        card.addEventListener('click', fire);
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fire();
            }
        });
    });

    closeBtn.addEventListener('click', close);
    veil.addEventListener('click', close);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
}


/* ==========================================================================
   WHATSAPP
   ========================================================================== */

function waNumber() {
    return (SITE_CONFIG.WHATSAPP || '').replace(/\D/g, '');
}

function waLink(texto) {
    const n = waNumber();
    return n ? `https://wa.me/${n}?text=${encodeURIComponent(texto)}` : '';
}

function initWhatsapp() {
    const n = waNumber();
    if (!n) return;

    const saludo = 'Hola JPDevSlayer, vi tu página y me interesa que desarrolles un proyecto.';

    const fab = $('#wa');
    if (fab) {
        fab.href = waLink(saludo);
        fab.hidden = false;
    }

    const direct = $('#waDirect');
    if (direct) {
        direct.href = waLink(saludo);
        direct.hidden = false;
        // +58 424 1237997
        const pretty = `+${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5)}`;
        $('#waNumber').textContent = pretty;
    }
}


/* ==========================================================================
   FORMULARIO DE CONTACTO — envío real
   ========================================================================== */

function initForm() {
    const form = $('#form');
    const status = $('#status');
    const select = $('#servicio');

    // Los botones "Cotizar" preseleccionan el servicio
    $$('[data-servicio]').forEach(btn => {
        btn.addEventListener('click', () => {
            select.value = btn.dataset.servicio;
        });
    });

    const say = (html, tone = '') => {
        const line = document.createElement('span');
        if (tone) line.className = tone;
        line.innerHTML = html;
        status.appendChild(line);
    };

    function fallback(nombre, servicio, detalle) {
        const salidas = [];
        const n = waNumber();

        if (n) {
            const texto = `Hola JPDevSlayer, soy ${nombre}. Me interesa: ${servicio}.\n\n${detalle}`;
            salidas.push(`<a href="${waLink(texto)}" target="_blank" rel="noopener">Escríbeme por WhatsApp</a>`);
        }

        if (SITE_CONFIG.EMAIL_CONTACTO) {
            const asunto = encodeURIComponent(`${servicio} — ${nombre}`);
            const cuerpo = encodeURIComponent(detalle);
            salidas.push(`<a href="mailto:${SITE_CONFIG.EMAIL_CONTACTO}?subject=${asunto}&body=${cuerpo}">Envíamelo por correo</a>`);
        }

        return salidas.join(' · ');
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const nombre = $('#nombre').value.trim();
        const correo = $('#correo').value.trim();
        const detalle = $('#detalle').value.trim();
        const trampa = $('#empresa_web');

        const servicio = select.selectedIndex > 0
            ? select.options[select.selectedIndex].text
            : 'Sin especificar';

        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        status.innerHTML = '';

        // Trampa anti-spam: solo los bots rellenan este campo
        if (trampa && trampa.value) {
            say('Mensaje enviado.', 'ok');
            form.reset();
            btn.disabled = false;
            return;
        }

        say('Enviando…');

        try {
            if (!SITE_CONFIG.FORMSPREE_ID || SITE_CONFIG.FORMSPREE_ID.includes('PEGA-AQUI')) {
                throw new Error('SIN_CONFIGURAR');
            }

            const res = await fetch(`https://formspree.io/f/${SITE_CONFIG.FORMSPREE_ID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    _subject: `${servicio} — ${nombre}`,
                    nombre,
                    email: correo,
                    servicio,
                    mensaje: detalle,
                    origen: 'jpdevslayer.com'
                })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const detalleError = (data.errors || []).map(x => x.message).join(', ');
                throw new Error(detalleError || `ERROR_${res.status}`);
            }

            status.innerHTML = '';
            say(`Mensaje recibido, ${esc(nombre)}.`, 'ok');
            say(`Te respondo a ${esc(correo)} en menos de 24 horas.`, 'ok');
            form.reset();

        } catch (err) {
            status.innerHTML = '';

            const salidas = fallback(nombre, servicio, detalle);

            if (err.message === 'SIN_CONFIGURAR') {
                say('El envío por correo todavía no está activo.', 'bad');
            } else {
                say('No se pudo enviar el mensaje.', 'bad');
            }

            say(salidas || 'Vuelve a intentarlo en unos minutos.', salidas ? '' : 'bad');
            console.error('[Formulario]', err);

        } finally {
            btn.disabled = false;
        }
    });
}


/* ==========================================================================
   MOTOR DE SCROLL
   Un solo bucle de animación alimenta todas las piezas movidas por scroll.
   Nada de un listener por efecto: eso es lo que hace que una página se
   sienta pesada.
   ========================================================================== */

const scrollFx = [];
let ticking = false;

function onScrollFrame() {
    for (const fn of scrollFx) fn();
    ticking = false;
}

function pedirCuadro() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScrollFrame);
}

window.addEventListener('scroll', pedirCuadro, { passive: true });
window.addEventListener('resize', pedirCuadro, { passive: true });

/** Interpola suavemente hacia el destino. */
const lerp = (a, b, t) => a + (b - a) * t;

/** Recorta un valor al rango 0-1. */
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;

/** Curva suave de entrada y salida. */
const suave = t => t * t * (3 - 2 * t);


/* ==========================================================================
   EL SELLO — el logo viaja del hero a la barra
   Es la pieza firma: resuelve que el logo sea protagonista y que haya
   movimiento real, con una sola animación.
   ========================================================================== */

function initSigil() {
    const sigil = document.getElementById('sigil');
    const slot = document.getElementById('brandSlot');
    const hero = document.getElementById('top');
    if (!sigil || !slot || !hero) return;

    // Posición actual suavizada, para que no vaya pegado al scroll
    let ax = 0, ay = 0, as = 1, listo = false;

    function medir() {
        const vw = window.innerWidth;
        const grande = vw < 760 ? 190 : vw < 1080 ? 250 : 340;
        sigil.style.setProperty('--sigil-size', grande + 'px');
        return grande;
    }

    let tam = medir();
    window.addEventListener('resize', () => { tam = medir(); }, { passive: true });

    function calcular() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const alto = hero.offsetHeight;

        // 0 = arriba del todo, 1 = hero ya recorrido
        const t = clamp01(window.scrollY / (alto * 0.72));
        const e = suave(t);

        // Origen: en escritorio a la derecha del texto; en móvil, centrado arriba
        const anchoSlot = slot.getBoundingClientRect();
        const destinoX = anchoSlot.left + anchoSlot.width / 2;
        const destinoY = anchoSlot.top + anchoSlot.height / 2;

        const origenX = vw >= 1080 ? vw * 0.76 : vw * 0.5;
        const origenY = vw >= 1080 ? vh * 0.5 : vh * 0.28;

        const escalaFinal = anchoSlot.width / tam;

        const x = lerp(origenX, destinoX, e) - tam / 2;
        const y = lerp(origenY, destinoY, e) - tam / 2;
        const s = lerp(1, escalaFinal, e);

        // Arriba del todo el sello no se ve: ahí manda la escena del fondo,
        // que ya es el mismo dragón. Aparece mientras viaja a la barra.
        const o = clamp01((t - 0.18) / 0.4);

        return { x, y, s, o };
    }

    function marco() {
        const { x, y, s, o } = calcular();
        const k = listo ? 0.18 : 1;   // el primer cuadro entra sin arrastre
        ax = lerp(ax, x, k);
        ay = lerp(ay, y, k);
        as = lerp(as, s, k);
        listo = true;

        sigil.style.setProperty('--sx', ax.toFixed(2) + 'px');
        sigil.style.setProperty('--sy', ay.toFixed(2) + 'px');
        sigil.style.setProperty('--ss', as.toFixed(4));
        sigil.style.opacity = o.toFixed(3);

        // Mientras se acerca al destino sigue pidiendo cuadros
        const { x: dx, y: dy, s: ds } = calcular();
        if (Math.abs(dx - ax) > 0.4 || Math.abs(dy - ay) > 0.4 || Math.abs(ds - as) > 0.002) {
            requestAnimationFrame(marco);
        }
    }

    scrollFx.push(() => requestAnimationFrame(marco));
    marco();
}


/* ==========================================================================
   REEL — la sección anclada
   El scroll no dispara la animación: el scroll ES la animación. Cada
   proyecto ocupa un tramo del recorrido y entra y sale con él.
   ========================================================================== */

function initReel() {
    const reel = document.getElementById('reel');
    const track = document.getElementById('reelTrack');
    if (!reel || !track) return;

    const pantallas = [...reel.querySelectorAll('.reel-screen')];
    const palabras = [...reel.querySelectorAll('.reel-word-item')];
    const lineas = [...reel.querySelectorAll('.reel-line')];
    const num = document.getElementById('reelNum');
    const barra = document.getElementById('reelBar');
    const fondo = reel.querySelector('.reel-bg');
    const total = pantallas.length;

    // Las capturas verticales se muestran completas
    pantallas.forEach(fig => {
        const img = fig.querySelector('img');
        const marcar = () => {
            if (img.naturalHeight > img.naturalWidth) fig.classList.add('is-portrait');
        };
        img.complete ? marcar() : img.addEventListener('load', marcar, { once: true });
    });

    let ultimo = -1;

    function marco() {
        const caja = track.getBoundingClientRect();
        const recorrido = caja.height - window.innerHeight;

        // Progreso dentro del tramo anclado
        const p = clamp01(-caja.top / recorrido);

        // Fuera de vista: no gastar cuadros
        if (caja.bottom < 0 || caja.top > window.innerHeight) return;

        if (fondo) fondo.style.setProperty('--reel-glow', p > 0.01 && p < 0.99 ? 1 : 0);
        if (barra) barra.style.setProperty('--p', (p * 100).toFixed(1) + '%');

        // Posición continua sobre el conjunto de proyectos
        const pos = p * total;
        const activo = Math.min(total - 1, Math.floor(pos));

        pantallas.forEach((fig, i) => {
            // d = distancia al centro del tramo de este proyecto
            const d = pos - i;
            const dentro = d > -0.35 && d < 1.15;

            if (!dentro) {
                fig.style.opacity = 0;
                return;
            }

            // Entra creciendo, se mantiene, sale encogiendo
            const entrada = clamp01((d + 0.35) / 0.5);
            const salida = 1 - clamp01((d - 0.7) / 0.45);
            const vis = Math.min(entrada, salida);

            fig.style.opacity = vis.toFixed(3);
            fig.style.setProperty('--sc', (0.9 + vis * 0.1 + d * 0.03).toFixed(4));
        });

        palabras.forEach((w, i) => {
            const d = pos - i;
            const dentro = d > -0.4 && d < 1.2;
            if (!dentro) { w.style.opacity = 0; return; }

            const entrada = clamp01((d + 0.4) / 0.55);
            const salida = 1 - clamp01((d - 0.75) / 0.45);
            const vis = Math.min(entrada, salida);

            w.style.opacity = (vis * 0.9).toFixed(3);
            // La palabra se mueve al contrario que la pantalla: da profundidad
            w.style.setProperty('--wy', ((0.5 - d) * 90).toFixed(1) + 'px');
        });

        if (activo !== ultimo) {
            ultimo = activo;
            if (num) num.textContent = String(activo + 1).padStart(2, '0');
            lineas.forEach((l, i) => l.classList.toggle('is-on', i === activo));
        }
    }

    scrollFx.push(marco);
    marco();
}


/* ==========================================================================
   BOTONES MAGNÉTICOS
   ========================================================================== */

function initMagnet() {
    if (window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('.magnet').forEach(el => {
        el.addEventListener('pointermove', e => {
            const r = el.getBoundingClientRect();
            const mx = (e.clientX - r.left - r.width / 2) * 0.25;
            const my = (e.clientY - r.top - r.height / 2) * 0.35;
            el.classList.add('is-pulled');
            el.style.setProperty('--mx', mx.toFixed(1) + 'px');
            el.style.setProperty('--my', my.toFixed(1) + 'px');
        });

        el.addEventListener('pointerleave', () => {
            el.classList.remove('is-pulled');
            el.style.setProperty('--mx', '0px');
            el.style.setProperty('--my', '0px');
        });
    });
}


/* ==========================================================================
   TARJETAS VIVAS
   La tarjeta se inclina siguiendo el cursor y un foco de luz lo acompaña.
   Es lo que separa una tarjeta plana de una que se siente construida.
   ========================================================================== */

function initTarjetasVivas() {
    // En pantallas táctiles no hay cursor que seguir
    if (window.matchMedia('(hover: none)').matches) return;

    const MAX = 5;   // grados de inclinación

    document.querySelectorAll('.work-card').forEach(card => {
        let raf = null;

        const mover = e => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = null;
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;

                // Foco de luz
                card.style.setProperty('--px', (px * 100).toFixed(1) + '%');
                card.style.setProperty('--py', (py * 100).toFixed(1) + '%');

                // Inclinación: el eje se invierte para que siga al cursor
                const rx = (0.5 - py) * MAX * 2;
                const ry = (px - 0.5) * MAX * 2;
                card.style.transform =
                    `perspective(1400px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
            });
        };

        card.addEventListener('pointerenter', () => card.classList.add('is-tilting'));
        card.addEventListener('pointermove', mover);

        card.addEventListener('pointerleave', () => {
            card.classList.remove('is-tilting');
            card.style.transform = '';
            card.style.removeProperty('--px');
            card.style.removeProperty('--py');
        });
    });
}


/* ==========================================================================
   ESTRELLAS DEL HERO
   El campo de partículas conectadas del sitio anterior. Se conserva la
   mecánica (deriva lenta, líneas entre vecinas, atracción al cursor) y se
   cambia el color al azul del logo. Va solo dentro del hero.
   ========================================================================== */

function initEstrellas() {
    const canvas = document.getElementById('stars');
    const hero = document.getElementById('top');
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const TINTE = '90, 200, 232';       // el azul hielo del logo
    const DISTANCIA = 118;              // hasta dónde se unen dos estrellas
    const RADIO_RATON = 130;

    let estrellas = [];
    let ancho = 0, alto = 0, dpr = 1;
    let raton = { x: null, y: null };
    let corriendo = false;
    let bucle = null;

    function medir() {
        const r = hero.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        ancho = Math.round(r.width);
        alto = Math.round(r.height);
        canvas.width = Math.round(ancho * dpr);
        canvas.height = Math.round(alto * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function sembrar() {
        // La cantidad se ajusta al área: en un móvil no hacen falta 60
        const cuantas = Math.round(Math.min(70, Math.max(24, (ancho * alto) / 22000)));
        estrellas = Array.from({ length: cuantas }, () => ({
            x: Math.random() * ancho,
            y: Math.random() * alto,
            r: Math.random() * 1.6 + 0.7,
            vx: (Math.random() - 0.5) * 0.32,
            vy: (Math.random() - 0.5) * 0.32,
            brillo: Math.random() * 0.35 + 0.25
        }));
    }

    function marco() {
        ctx.clearRect(0, 0, ancho, alto);

        for (const e of estrellas) {
            e.x += e.vx;
            e.y += e.vy;

            // Rebote en los bordes del hero
            if (e.x < 0 || e.x > ancho) e.vx = -e.vx;
            if (e.y < 0 || e.y > alto) e.vy = -e.vy;

            // El cursor las atrae un poco
            if (raton.x !== null) {
                const dx = raton.x - e.x;
                const dy = raton.y - e.y;
                if (dx * dx + dy * dy < RADIO_RATON * RADIO_RATON) {
                    e.x += dx * 0.012;
                    e.y += dy * 0.012;
                }
            }

            ctx.beginPath();
            ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${TINTE}, ${e.brillo})`;
            ctx.fill();
        }

        // Líneas entre las que están cerca: la constelación
        ctx.lineWidth = 1;
        for (let a = 0; a < estrellas.length; a++) {
            for (let b = a + 1; b < estrellas.length; b++) {
                const dx = estrellas[a].x - estrellas[b].x;
                const dy = estrellas[a].y - estrellas[b].y;
                const d2 = dx * dx + dy * dy;
                if (d2 > DISTANCIA * DISTANCIA) continue;

                const opacidad = (1 - Math.sqrt(d2) / DISTANCIA) * 0.16;
                ctx.strokeStyle = `rgba(${TINTE}, ${opacidad})`;
                ctx.beginPath();
                ctx.moveTo(estrellas[a].x, estrellas[a].y);
                ctx.lineTo(estrellas[b].x, estrellas[b].y);
                ctx.stroke();
            }
        }

        bucle = requestAnimationFrame(marco);
    }

    function arrancar() {
        if (corriendo) return;
        corriendo = true;
        marco();
    }

    function parar() {
        corriendo = false;
        if (bucle) cancelAnimationFrame(bucle);
        bucle = null;
    }

    // El cursor solo cuenta cuando está sobre el hero
    hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        raton.x = e.clientX - r.left;
        raton.y = e.clientY - r.top;
    });
    hero.addEventListener('pointerleave', () => { raton.x = raton.y = null; });

    let remedir;
    window.addEventListener('resize', () => {
        clearTimeout(remedir);
        remedir = setTimeout(() => { medir(); sembrar(); }, 180);
    }, { passive: true });

    // Fuera de pantalla no se dibuja nada: el hero es la única sección que
    // lo usa y dejarlo corriendo toda la página gasta batería sin motivo.
    new IntersectionObserver(([entrada]) => {
        entrada.isIntersecting ? arrancar() : parar();
    }, { threshold: 0 }).observe(hero);

    medir();
    sembrar();
    arrancar();
}


/* ==========================================================================
   ARRANQUE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initReveal();
    initCounters();
    initStrip();
    initFilters();
    initModal();
    initWhatsapp();
    initForm();

    // Movidas por scroll: las controla el visitante, así que se mantienen
    // aunque el sistema pida menos movimiento.
    initSigil();
    initReel();
    initMagnet();
    initTarjetasVivas();
    initEstrellas();
});
