# CONTEXTO-PROGRAMADOR.md — Guía para desarrolladores

> Para una persona que abre este repositorio por primera vez y tiene que tocarlo sin romperlo.
> Versión corta: [`RESUMEN-GENERAL.md`](./RESUMEN-GENERAL.md) · Versión para agentes de IA: [`CONTEXTO-IA.md`](./CONTEXTO-IA.md)
> Última actualización: **2026-08-19**

---

## 1. Qué es esto

La web comercial de JPDevSlayer. Un sitio de una sola página donde un cliente potencial:

1. Ve los tres servicios que se ofrecen (web, videojuegos, aplicaciones).
2. Revisa los proyectos ya entregados, con capturas reales y ficha técnica.
3. Pide su proyecto por formulario o por WhatsApp.

La estética es de taller de ingeniería: fondo azul pizarra muy oscuro, azul hielo sacado del propio logo, tipografía ancha y pesada, y movimiento movido por el scroll. **No es cyberpunk**: el cian neón sobre negro con resplandor se retiró a propósito el 2026-08-20 porque es el aspecto que produce toda IA cuando le piden "futurista", y el cliente lo rechazó por genérico.

Lo que **no** es: un currículum, ni un blog, ni un experimento visual. Si un cambio se ve espectacular pero enfría el contacto con el cliente, no entra.

---

## 2. Pila tecnológica

HTML, CSS y JavaScript puro. Sin framework, sin bundler, sin transpilación.

| | |
|---|---|
| Estructura | `index.html`, un solo documento con todas las secciones |
| Estilos | `styles.css`, sistema de diseño propio con variables en `:root` |
| Lógica | `script.js`, JavaScript ES6 sin dependencias |
| Fondo | HTML5 Canvas, partículas dibujadas en tiempo real |
| Sonido | Web Audio API, sintetizado, sin archivos mp3 |
| Formulario | Formspree (servicio externo) |
| Tipografías | Archivo, IBM Plex Sans e IBM Plex Mono desde Google Fonts |
| Despliegue | Vercel, estático |

**No hay `package.json`.** Si escribes `npm install` en esta carpeta, no va a pasar nada útil.

### ¿Qué base de datos usa?

**Ninguna.** Es la pregunta que más se repite y la respuesta es que este sitio no tiene backend ni base de datos.

Te vas a topar con la palabra *Supabase* por todo el código. Es texto descriptivo de **los proyectos de clientes** que el portafolio muestra: SIGMA usa Supabase, BODEGA-3 usa Supabase. El portafolio en sí no guarda nada de nadie.

Lo único que persiste:

- La preferencia de sonido on/off, en el `localStorage` del navegador del visitante.
- Los mensajes del formulario, que van directo a los servidores de Formspree y de ahí al correo. No pasan por ningún servidor propio.

Los proyectos que se muestran están escritos a mano en el objeto `projectData` de `script.js`. Para agregar uno se edita código, no se inserta una fila.

---

## 3. Cómo levantar el proyecto

No hay nada que compilar. Sírvelo por HTTP desde la raíz:

```bash
python -m http.server 8080
```

Y entra a `http://localhost:8080`.

Abrir `index.html` con doble clic también carga la página, **pero el formulario falla** con error de CORS porque `file://` no es un origen válido. Para probar el formulario, sírvelo por HTTP.

Ya existe `.claude/launch.json` con este servidor registrado como `portfolio`.

---

## 4. Organización del repositorio

```
portfolio-jpdevslayer/
├── index.html      543 líneas — todas las secciones
├── script.js       848 líneas — toda la lógica
├── styles.css     2373 líneas — todos los estilos
├── assets/         52 imágenes, 9.4 MB
├── contexto/       esta documentación, 3 archivos
└── .claude/
    └── launch.json servidor local de desarrollo
```

**Nada suelto en la raíz.** Si agregas un archivo, va documentado acá y en `CONTEXTO-IA.md`.

Las secciones de `index.html`, en orden: hero → servicios → proyectos → habilidades → contacto → footer → modal.

---

## 5. Configuración: `SITE_CONFIG`

Al inicio de `script.js`. Es lo primero que hay que revisar en una instalación nueva:

```javascript
const SITE_CONFIG = {
    FORMSPREE_ID: 'PEGA-AQUI-TU-ID',
    WHATSAPP: '584241237997',
    EMAIL_CONTACTO: ''
};
```

| Campo | Qué hace | Estado al 2026-08-19 |
|---|---|---|
| `FORMSPREE_ID` | Id del formulario en formspree.io. Sin esto los mensajes no llegan al correo | **Pendiente** |
| `WHATSAPP` | Número internacional, solo dígitos. Activa el botón flotante y el canal alterno | Configurado |
| `EMAIL_CONTACTO` | Opcional. Canal alterno por correo si falla el envío | Vacío a propósito, para no exponerlo a scrapers |

`FORMSPREE_ID` **no es un secreto**: Formspree espera ese identificador en el cliente. Que esté en un repositorio público es normal y está previsto.

El número de WhatsApp se limpia solo con `.replace(/\D/g, '')`, así que da igual si lo escribes como `+58 424-1237997` o `584241237997`.

---

## 6. Cómo agregar un proyecto al portafolio

Un proyecto vive en **dos archivos a la vez**, unidos por la misma clave. Si haces solo la mitad, no hay error en consola: simplemente la tarjeta no abre o el modal sale vacío.

**Paso 1 — la tarjeta visible, en `index.html`,** dentro de `<div class="projects-grid">`:

```html
<div class="project-card animate-scroll" data-category="web" data-project-id="miproyecto">
```

`data-category` solo acepta `web`, `games` o `apps`.

**Paso 2 — el contenido del modal, en `script.js`,** dentro de `projectData`, con la **misma clave**:

```javascript
miproyecto: {
    title: "NOMBRE DEL PROYECTO",
    subtitle: "Una línea que lo describa",
    meta: "TECNOLOGÍA // TECNOLOGÍA // TECNOLOGÍA",
    stats: { "Cliente": "Nombre", "Estado": "Completado" },
    description: "Párrafo de contexto.",
    features: ["<strong>Título:</strong> descripción."],
    tech: ["React", "Supabase"],
    images: [{ src: "assets/mi_1.png", caption: "Qué se ve acá." }]
}
```

**Paso 3 —** copia las capturas a `assets/` y comprueba que cada `src` exista de verdad.

---

## 7. El formulario de contacto — léelo antes de tocarlo

Hasta el 2026-08-19 este formulario **era una simulación**. Reproducía una animación de terminal que terminaba en "TRANSFERENCIA DE DATOS COMPLETADA CON ÉXITO" y no enviaba absolutamente nada. Un cliente podía escribir pidiendo un proyecto, ver el mensaje de éxito, y perderse sin dejar rastro.

Hoy hace un POST real. Reglas para no volver atrás:

1. **La animación no puede mentir.** Los mensajes de la terminal reflejan el estado verdadero de la petición. Si agregas pasos decorativos, que no afirmen nada que no haya ocurrido.
2. **El honeypot no se toca.** El campo `#company_website` (name `_gotcha`) es invisible para humanos. Si viene relleno, el envío se descarta y al bot se le muestra un éxito falso. Está oculto con `position:absolute; left:-9999px`, **no con `display:none`**, porque algunos bots detectan lo segundo. No lo borres al reordenar el formulario.
3. **Siempre debe haber salida.** Si el envío falla por lo que sea, el visitante recibe un enlace de WhatsApp con su nombre, el servicio elegido y su mensaje ya prellenados. Nunca dejar al cliente sin forma de contactar.
4. **`printTerminalLine()` usa `innerHTML`.** Es seguro porque solo recibe cadenas del propio código. Si algún día le pasas texto escrito por el visitante, escápalo o usa `textContent`.

### Por qué Formspree y no Web3Forms

Se probó Web3Forms primero. **Devuelve error de CORS desde el navegador**, tanto con JSON como con `FormData`. Formspree responde con las cabeceras correctas. Verificado el 2026-08-19 contra los dos servicios.

Formspree gratis da 50 mensajes al mes. Si se pasa de ahí, hay que evaluar el plan pago o mover el formulario a una función serverless de Vercel.

---

## 8. Flujo de trabajo con Git

```
carpeta local  →  git commit  →  git push a main  →  Vercel despliega solo
```

Vercel está conectado al repositorio de GitHub. **Cada push a `main` publica en producción** en menos de un minuto, en los dos dominios. No se sube nada a Vercel a mano.

Esto significa que **mientras no hagas push, la web no cambia**, por más que funcione perfecto en `localhost`. Para verificarlo antes de afirmar nada:

```bash
git rev-list --left-right --count origin/main...main
```

Si eso no da `0	0`, o si `git status` muestra archivos modificados, lo que ves en local no es lo que ven los clientes.

Reglas del usuario sobre GitHub: **solo se sube lo aprobado y verificado**, y **nunca** se agrega a nadie como colaborador ni se tocan repositorios ajenos.

---

## 9. Trampas conocidas de este proyecto

**Los filtros pueden quedar vacíos.** Los 3 proyectos actuales son de categoría `web`. Al filtrar por VIDEOJUEGOS o APPS no hay resultados, y aparece el bloque `#projectsEmptyState` que invita a contactar. Si algún día todos los filtros tienen contenido, ese bloque queda inerte pero no molesta.

**Hay 31 capturas reales sin usar en `assets/`.** `sigma_1` a `sigma_14`, `math_5` a `math_17`, y `media_*`. SIGMA muestra 4 imágenes de las ~18 disponibles. Es material entregado que no se está aprovechando.

**`assets/` pesa 9.4 MB sin optimizar.** Los tres GIF de NEXUS pesan 1.6 MB entre ellos. Ninguna imagen está en WebP.

**El hero se desbordaba en móvil.** `.hero-text-content` es un flex item; en columna tomaba su ancho `max-content` (480 px) dentro de un contenedor de 375 px, se recortaba, y arrastraba toda la página a scroll horizontal. Corregido con `width/max-width/min-width` en la media query de 1024 px. **Si tocas el hero, verifica que `document.documentElement.scrollWidth` siga igual a `clientWidth` a 375 px.**

**Los finales de línea son CRLF.** Git avisa `LF will be replaced by CRLF` al editar desde herramientas POSIX. Es ruido de Windows, no un problema.

---

## 10. Pendientes identificados (2026-08-19)

Ordenados por impacto comercial:

| Prioridad | Pendiente |
|---|---|
| Alta | Cargar `FORMSPREE_ID` para que los mensajes lleguen al correo |
| Alta | **Los tres precios dicen "A convenir".** Falta la cifra de arranque de cada paquete. En `index.html`, buscar `PRECIO PENDIENTE`: el comentario indica exactamente qué poner. |
| Alta | Testimonios de clientes reales (hacen falta citas de verdad, no inventadas) |
| Media | Aprovechar las 31 capturas sin usar, sobre todo en SIGMA |
| Media | Favicon (no existe) y `og:image` con URL absoluta — hoy la vista previa al compartir por WhatsApp o LinkedIn sale rota |
| Media | `canonical` y `og:url`: hay dos dominios sirviendo el mismo sitio |
| Baja | Links de LinkedIn y Discord del footer apuntan a las webs genéricas, no a perfiles |
| Baja | Optimizar los 9.4 MB de `assets/` (WebP, compresión de los GIF) |

---

## 11. Bitácora

| Fecha | Cambio |
|---|---|
| 2026-08-25 | **Escenas de marca generadas con IA.** Se añadieron dos ilustraciones al hero y a la sección de contacto, generadas con Higgsfield (Nano Banana Pro) usando `assets/logo.png` **como imagen de referencia**, de modo que el dragón, el monograma JP, la lanza y los circuitos son los de la marca y no un dibujo genérico. Comprimidas de 5.4 MB a 82 KB y de 6.6 MB a 61 KB en WebP (-99%). Van siempre bajo un degradado: una imagen a pelo debajo de texto lo vuelve ilegible. El sello del hero ahora arranca invisible y **aparece mientras viaja a la barra**, porque a tamaño completo se superponía con el dragón del fondo y se veían dos dragones. |
| 2026-08-20 | **Rediseño desplegado a producción.** Se fusionó `rediseno-2026` en `main`. Los tres precios salen como "A convenir" en lugar de la cifra: el marcador `$PRECIO` se habría visto como un error de programación en la web pública, y las cifras reales todavía no están definidas. Buscar `PRECIO PENDIENTE` en `index.html` para cambiarlas. |
| 2026-08-20 | **Estrellas del hero y limpieza de capturas.** Se recuperó el campo de partículas conectadas del sitio anterior a petición del cliente, ahora solo dentro del hero, en el azul del logo y sin la cuadrícula del original; se pausa con `IntersectionObserver` cuando el hero sale de pantalla. Se retiraron de Sigmat las capturas `math_5` a `math_8`: no eran pantallas de la app sino del panel de Supabase (editor SQL, avisos de RLS y **una con la clave de API a la vista**), y llevaban descripciones inventadas. Sigmat queda con 4 capturas reales. |
| 2026-08-20 | **Tarjetas de trabajo rediseñadas y capturas ampliadas.** Las tarjetas pasaron de un bloque plano a una pieza con tres capas: la captura vive dentro de una ventana de navegador dibujada (semáforo y barra de dirección), la tarjeta se inclina en perspectiva siguiendo el cursor y un foco de luz lo acompaña; abajo, una ficha con cifras del proyecto. Capturas por proyecto: Olimpo 5, Sigmat 8, FastChatCenter 7, Asistencia 4. Las de FastChatCenter se generaron levantando el proyecto en local (Docker + backend + frontend) y **anonimizando nombres, teléfonos y correos de contactos reales** antes de guardarlas. Olimpo tiene una sola pantalla real de la app: se compuso una escena 16:9 repitiendo el teléfono en tres profundidades sobre el halo de marca, porque la captura vertical suelta no encajaba con el resto. |
| 2026-08-20 | **Rediseño completo (rama `rediseno-2026`).** Se retiró la estética cian-sobre-negro con cuadrícula y partículas. Paleta nueva muestreada del propio logo (tono 190-210°, azul hielo `#5AC8E8`) sobre fondo azul pizarra `#0A0E14`, sin resplandor. Tipografías Archivo, IBM Plex Sans y IBM Plex Mono. El logo pasó de 30 px en la barra a ser el protagonista del hero: arranca a 340 px y el scroll lo encoge y lo lleva hasta su hueco en la barra (verificado, aterriza a 1 px del destino). Nueva sección `#reel`: anclada con `position: sticky` sobre un recorrido de 420svh, donde el scroll mueve la secuencia de los 4 proyectos con su palabra gigante detrás, contador y barra de avance. Botones magnéticos. Proyectos actualizados: entran Olimpo, FastChatCenter y Asistencia; sale BODEGA-3. Capturas de FastChatCenter generadas levantando el proyecto en local, con los nombres de contactos reales anonimizados. |
| 2026-08-19 | Creada la carpeta `contexto/` con los 3 archivos, siguiendo la estructura de `sigmamath`. Absorbido y retirado el antiguo `docs/CONTEXTO_DEL_PROYECTO.md`. Formulario de contacto migrado de simulación a envío real por Formspree, con honeypot y canal alterno de WhatsApp. Botón flotante de WhatsApp configurado con `+58 424-1237997`. Eliminados los 4 proyectos sin capturas reales; quedan SIGMA, BODEGA-3 y NEXUS. Añadido estado vacío para filtros sin resultados. Corregido el desbordamiento horizontal en móvil que ya venía de producción, y añadido `flex-wrap` a los filtros. Verificado en navegador a 375 px y 1274 px, y otra vez ya desplegado en `https://jpdevslayer.com`. Commit `c85eba1`. |

---

## 12. Movimiento: la regla que se aplica aquí

El sistema operativo puede pedir menos movimiento (`prefers-reduced-motion`). En este proyecto esa señal **no apaga todo**, se aplica con criterio:

- **Se apaga el movimiento automático:** la marquesina de tecnologías, los anillos que giran, la luz que respira y el indicador de "baja". Es movimiento que ocurre sin que el visitante haga nada.
- **Se conserva el movimiento que mueve el visitante:** el sello que viaja al hacer scroll y toda la secuencia del reel. Ahí el scroll no dispara una animación, el scroll **es** la animación: es manipulación directa, no movimiento impuesto.

Esto se decidió el 2026-08-20 porque un apagado total dejaba la página sin nada que mostrar en máquinas con los efectos de Windows desactivados, que es el caso de la PC del propio dueño.

### El motor de scroll

Hay **un solo** bucle (`scrollFx` en `script.js`). Cada pieza movida por scroll registra su función ahí y todas se ejecutan en el mismo `requestAnimationFrame`. No agregues un `addEventListener('scroll')` por efecto: eso es lo que hace que una página se sienta pesada.

### El reel no funciona en pantallas pequeñas

Vive del anclaje y de un recorrido de 420svh. En un teléfono no hay recorrido suficiente y las cuatro capturas terminaban una encima de otra. Por eso **se oculta por debajo de 760 px de ancho**: la sección de Trabajos muestra los mismos proyectos con más detalle.

---

## 13. Capturas de los proyectos: de dónde salen y qué cuidar

| Proyecto | Origen de las capturas | Cuidado |
|---|---|---|
| **FastChatCenter** | Proyecto levantado en local (`docker compose up -d` + `npm run dev` en `backend/` y `frontend/`), con Chrome controlado por el protocolo DevTools | **Trae datos de clientes reales.** Nombres, teléfonos y correos se reemplazan en el DOM *antes* de capturar. Nunca publicar una captura sin verificar que no queda ningún dato personal. |
| **Sigmat** | Ya estaban en `assets/` desde antes | La captura del panel muestra el nombre de la clienta (Prof. Diana Matson). Está en producción desde antes, pero conviene confirmarlo con ella. |
| **Olimpo** | Página de presentación pública (`olimpo-gray.vercel.app/presentacion`) | Solo existe **una** pantalla real de la app. `olimpo_1.png` es una escena compuesta con esa única pantalla repetida. Si algún día se levanta Olimpo completo (necesita Docker, migraciones y el puerto 3000), conviene reemplazarla por capturas reales. |
| **Asistencia** | GIFs previos + la app levantada en local con Vite | La app arranca vacía: sin un Excel del reloj cargado solo se ve la pantalla de subida. |

### La herramienta de captura

`shot.mjs` (en el scratchpad de la sesión) controla Chrome por el protocolo DevTools a partir de un guion JSON: navega, ejecuta JavaScript en la página y captura. Sirve para apps con login y para fotografiar el propio portafolio a distintas alturas de scroll, que es la única forma de revisar el reel anclado.

**Ojo con los puertos:** FastChatCenter usa el 3000 (frontend) y el 8080 (backend). Por eso el servidor local del portafolio se movió al **8123** en `.claude/launch.json`.

---

## 14. Las estrellas del hero

`initEstrellas()` en `script.js`. Es el sistema de partículas del sitio anterior, recuperado por decisión del cliente, con tres cambios:

- **Vive solo dentro del hero**, no en toda la página. El canvas se mide contra `#top`.
- **Color del logo** (`rgba(90, 200, 232, …)`) en vez del cian neón original.
- **Sin la cuadrícula de fondo** que traía el código viejo.

Se pausa con `IntersectionObserver` cuando el hero sale de pantalla: dejarlo corriendo toda la página gasta batería sin motivo.

**Es la única animación automática que NO respeta `prefers-reduced-motion`.** Fue una petición explícita del cliente, que quiere verla en su propia máquina (donde los efectos de Windows están desactivados). Si algún día se prioriza la accesibilidad sobre esa preferencia, el arreglo es dibujar un solo fotograma estático en vez de arrancar el bucle.

### Capturas: verificar antes de publicar

El 2026-08-20 se retiraron cuatro capturas de Sigmat que parecían pantallas de la app y en realidad eran del panel de Supabase, incluida una con la clave de API a la vista. **Antes de añadir una captura, ábrela y míralo**: que sea de la aplicación, no de un panel de administración, y que no tenga claves, correos ni teléfonos.

---

## 15. Las escenas de marca (imágenes generadas con IA)

`assets/hero_dragon.webp` y `assets/contacto_dragon.webp` son ilustraciones generadas con **Higgsfield** (modelo Nano Banana Pro), pasando `assets/logo.png` como imagen de referencia. Por eso conservan el dragón, el monograma JP, la lanza y los circuitos reales de la marca.

**Reglas para no romperlas:**

1. **Nunca van a pelo bajo texto.** Cada una lleva dos degradados encima que oscurecen la zona donde vive el contenido. Si mueves el texto, revisa el contraste antes de dar por bueno el cambio.
2. **Siempre en WebP y comprimidas.** Las originales pesaban 5.4 MB y 6.6 MB; en la página van a 82 KB y 61 KB. Una imagen de 5 MB en el hero destruye el tiempo de carga, que es de lo que presume esta página.
3. **A menos de 1000 px de ancho la imagen se atenúa mucho más** y se corre de posición, porque en pantalla angosta queda justo detrás del titular.

**Por qué el sello arranca invisible:** al poner el dragón de fondo, el sello del logo quedaba encima del mismo dragón y se veían dos, con dos monogramas superpuestos. La solución fue que el sello nazca en `opacity: 0` y aparezca mientras el scroll lo lleva a la barra (`initSigil`, la variable `o`). Arriba manda la escena; al bajar aparece el emblema.

### Límite que no se cruza

Estas imágenes son **decoración de marca**. Las capturas de los proyectos tienen que seguir siendo reales: generar pantallas de software con IA y presentarlas como trabajo entregado es el mismo problema de credibilidad que llevó a borrar VORTEX y AEGIS.
