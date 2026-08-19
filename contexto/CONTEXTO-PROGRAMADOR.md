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

La estética es cyberpunk: fondo oscuro, neón cian, partículas de circuito, efectos de terminal y sonidos sintetizados. Es deliberado y es parte del producto — no lo "simplifiques" sin hablarlo.

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
| Tipografías | Inter y Orbitron desde Google Fonts |
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
| Alta | Capa comercial: precios o paquetes, proceso de trabajo, testimonios de clientes reales |
| Media | Aprovechar las 31 capturas sin usar, sobre todo en SIGMA |
| Media | Favicon (no existe) y `og:image` con URL absoluta — hoy la vista previa al compartir por WhatsApp o LinkedIn sale rota |
| Media | `canonical` y `og:url`: hay dos dominios sirviendo el mismo sitio |
| Baja | Links de LinkedIn y Discord del footer apuntan a las webs genéricas, no a perfiles |
| Baja | Optimizar los 9.4 MB de `assets/` (WebP, compresión de los GIF) |

---

## 11. Bitácora

| Fecha | Cambio |
|---|---|
| 2026-08-19 | Creada la carpeta `contexto/` con los 3 archivos, siguiendo la estructura de `sigmamath`. Absorbido y retirado el antiguo `docs/CONTEXTO_DEL_PROYECTO.md`. Formulario de contacto migrado de simulación a envío real por Formspree, con honeypot y canal alterno de WhatsApp. Botón flotante de WhatsApp configurado con `+58 424-1237997`. Eliminados los 4 proyectos sin capturas reales; quedan SIGMA, BODEGA-3 y NEXUS. Añadido estado vacío para filtros sin resultados. Corregido el desbordamiento horizontal en móvil que ya venía de producción, y añadido `flex-wrap` a los filtros. Verificado en navegador a 375 px y 1274 px. Cambios sin subir al repositorio al cierre del día. |
