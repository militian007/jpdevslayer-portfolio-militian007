# CONTEXTO-IA.md — Contexto de máquina para agentes de IA

> Documento destinado a **cualquier modelo/agente de IA** que retome este proyecto sin historial previo.
> Formato: hechos verificables, sin narrativa. Si un dato no está aquí, **verifícalo en el repositorio**, no lo asumas.
> Última actualización: `2026-08-19`

---

## 1. IDENTIDAD DEL PROYECTO

| Campo | Valor |
|---|---|
| Nombre | `portfolio-jpdevslayer` |
| Repositorio | `https://github.com/militian007/jpdevslayer-portfolio-militian007` |
| Rama de producción | `main` |
| Dominio principal | `https://www.jpdevslayer.com` |
| URL de Vercel | `https://jpdevslayer-portfolio-militian007.vercel.app` |
| Usuario GitHub | `militian007` |
| Ruta local | `C:\Users\JONAT\OneDrive\Desktop\mili\dev\portfolio-jpdevslayer` |

### Dominio

Web comercial de un desarrollador independiente. **No es un portafolio de exhibición.** El objetivo declarado por el usuario es que funcione como la página de su empresa: que los clientes vean los trabajos hechos, elijan un servicio y puedan encargarle un proyecto.

Criterio de evaluación de cualquier cambio: **¿acerca o aleja a un cliente que contacta?** Un efecto visual que no mueve esa aguja es secundario.

Tres servicios ofrecidos: páginas web, videojuegos, aplicaciones y programas de escritorio/móvil.

---

## 2. PILA TECNOLÓGICA

| Capa | Tecnología | Notas |
|---|---|---|
| Estructura | HTML5 | Documento único, `index.html` |
| Estilos | CSS3 puro | Variables nativas en `:root`, Grid, Flexbox, glassmorphism |
| Lógica | JavaScript ES6 vanilla | Sin framework, sin transpilación |
| Fondo animado | HTML5 Canvas | Sistema de partículas tipo circuito |
| Sonido | Web Audio API | Sintetizador de pitidos, sin archivos de audio |
| Formulario | Formspree | `https://formspree.io/f/{ID}`, POST con JSON |
| Contacto directo | Enlaces `wa.me` | Sin API de WhatsApp, solo URL |
| Tipografías | Google Fonts | Archivo (display), IBM Plex Sans (texto), IBM Plex Mono (datos) |
| Despliegue | Vercel | Estático, sin build |

### BASE DE DATOS: NINGUNA

**Este proyecto no tiene base de datos ni backend propio.** Es un punto de confusión recurrente y hay que responderlo sin ambigüedad.

La palabra *Supabase* aparece unas 15 veces entre `index.html` y `script.js`. **Todas son texto descriptivo de los proyectos de clientes** que el portafolio exhibe (SIGMA y BODEGA-3 sí usan Supabase). Ninguna es una conexión real de este sitio.

Persistencia real del sitio:

| Dato | Mecanismo | Ubicación en el código |
|---|---|---|
| Preferencia de sonido on/off | `localStorage` del visitante, clave `jpdevslayer_sound` | `script.js` (sección de sonido) |
| Mensajes del formulario | POST a Formspree, de ahí al correo del usuario | `script.js` (sección de formulario) |

**El contenido de los proyectos está escrito a mano** en el objeto `projectData` de `script.js`. No hay CMS. Agregar un proyecto es editar código y hacer push.

### Consecuencia de no tener build

No existen `package.json`, `node_modules`, ni comandos de npm. **No inventes `npm install` ni `npm run dev` para este proyecto.** Se sirve con:

```bash
python -m http.server 8080
```

Está declarado en `.claude/launch.json` con el nombre `portfolio`.

---

## 3. ESTRUCTURA DE DIRECTORIOS

```
portfolio-jpdevslayer/
├── index.html            543 líneas
├── script.js             848 líneas
├── styles.css           2373 líneas
├── assets/               52 archivos, 9.4 MB
├── contexto/
│   ├── RESUMEN-GENERAL.md
│   ├── CONTEXTO-IA.md          (este archivo)
│   └── CONTEXTO-PROGRAMADOR.md
└── .claude/
    └── launch.json
```

### Desglose de `script.js`

| Bloque | Contenido |
|---|---|
| Cabecera | `SITE_CONFIG` — **lo único que edita el usuario** |
| Canvas | Sistema de partículas del fondo |
| Audio | Sonido sintetizado (Web Audio API) y su interruptor |
| Scroll | Intersection Observer para animaciones de entrada |
| Filtros | Filtrado del portafolio y estado vacío |
| Navegación | Menú responsive y resaltado del enlace activo |
| Formulario | **Envío real, honeypot y canal alterno** |
| `projectData` | Contenido de los 3 proyectos |
| Modal | Ventana holográfica y carrusel |
| Cierre | WhatsApp flotante e inicialización en `DOMContentLoaded` |

Los números de línea cambian con cada edición. Localizar con `grep -n` antes de citarlos.

---

## 4. REGLAS DE TRABAJO IMPUESTAS POR EL USUARIO (no negociables)

El usuario se llama **Jonathan** (su usuario de GitHub es `militian007`). Estas reglas son parte del contrato del proyecto:

1. **Saludo obligatorio:** toda respuesta al usuario empieza diciendo su nombre, *Jonathan*, antes de cualquier otro contenido. Para él es la señal de que la conversación todavía tiene memoria fresca.
2. **Verificar antes de afirmar.** Prohibido decir "ya está listo", "debería funcionar", "creo que", "asumo que". Cada afirmación debe respaldarse ejecutando el comando, leyendo el archivo o consultando la fuente actual. La documentación desactualizada no cuenta.
3. **Cero adulación.** No darle la razón por complacer. Si una decisión suya perjudica el proyecto, hay que decírselo con el motivo técnico.
4. **Este directorio `contexto/` se actualiza** con cada cambio relevante del proyecto. Son exactamente 3 archivos, cada uno con su propia bitácora al final.
5. **Seguridad como requisito de primer nivel**, no como añadido posterior.
6. **GitHub:** una vez que una funcionalidad esté aprobada por el usuario y verificada como funcional, se sube al repositorio. **Nunca** agregar a nadie como colaborador ni tocar repos ajenos. El usuario ya sufrió eso una vez y lo prohibió explícitamente.
7. **Nada genérico** en el diseño de la interfaz.

---

## 5. POSTURA DE SEGURIDAD

### Estado actual: CUMPLE, con superficie de ataque mínima.

Este sitio no autentica a nadie, no guarda datos de nadie y no expone ninguna clave. La superficie de riesgo es casi nula por diseño.

| Vector | Estado | Detalle |
|---|---|---|
| Claves en el repositorio | **Limpio** | `SITE_CONFIG.FORMSPREE_ID` es un identificador público por diseño; Formspree lo espera en el cliente. No es un secreto. |
| Spam en el formulario | **Mitigado** | Honeypot `_gotcha` en `index.html`, verificado en `script.js` antes de enviar. Formspree además lo filtra del lado servidor por convención de nombre. |
| XSS por contenido de terceros | **No aplica** | No hay contenido generado por usuarios. Todo el HTML es estático o proviene de `projectData`, escrito a mano. |
| Datos personales almacenados | **Ninguno** | El sitio no guarda nada del visitante salvo su preferencia de sonido, en su propio navegador. |
| Correo expuesto a scrapers | **Evitado** | `EMAIL_CONTACTO` se dejó vacío deliberadamente. Solo se publica si el usuario lo decide. |

### Punto de atención

`printTerminalLine()` usa `innerHTML`. Hoy es seguro porque **solo recibe cadenas construidas en el propio código**. Si alguna vez se le pasa texto escrito por el visitante, hay que escaparlo antes o cambiarlo a `textContent`.

---

## 6. CONTRATO DE DATOS

No hay base de datos, pero sí hay un contrato interno que se rompe con facilidad.

### La trampa principal: los proyectos viven en dos archivos

Cada proyecto necesita **las dos mitades**, unidas por la misma clave:

```html
<!-- index.html: la tarjeta visible -->
<div class="project-card" data-category="web" data-project-id="sigma">
```

```javascript
// script.js: el contenido del modal
const projectData = {
    sigma: { title, subtitle, meta, stats, description, features, tech, images }
};
```

Si falta la mitad de `script.js`, la tarjeta no abre el modal. Si falta la de `index.html`, el contenido existe pero es inalcanzable. **Ninguno de los dos casos lanza error en consola.**

### Esquema de una entrada de `projectData`

| Campo | Tipo | Notas |
|---|---|---|
| `title` | string | Título en mayúsculas |
| `subtitle` | string | Una línea descriptiva |
| `meta` | string | Etiquetas separadas por `//` |
| `stats` | objeto clave-valor | Admite HTML (se usa para el pill de estado) |
| `description` | string | Párrafo de contexto |
| `features` | array de strings | Admiten `<strong>` |
| `tech` | array de strings | Se renderizan como etiquetas |
| `images` | array de `{src, caption}` | Rutas relativas a `assets/` |

### Invariantes

- Toda ruta de `images` debe existir en `assets/`. Al 2026-08-19 no hay rutas rotas (verificado cruzando referencias contra el directorio).
- `data-category` solo acepta `web`, `games` o `apps`; deben coincidir con los `data-filter` de los botones.
- Al 2026-08-19 los 3 proyectos son `web`. Los filtros `games` y `apps` devuelven 0 y activan `#projectsEmptyState`.

---

## 7. ESTADO ACTUAL

### Verificado el 2026-08-19 en el navegador, no en teoría

| Comprobación | Resultado |
|---|---|
| Sintaxis de `script.js` | `node --check` pasa |
| Proyectos renderizados | 3 (`sigma`, `bodega3`, `nexus`), coinciden con `projectData` |
| Imágenes rotas en el modal | 0 |
| Formulario, camino de éxito | Muestra "MENSAJE ENTREGADO", resetea el formulario, reactiva el botón |
| Formulario, camino de fallo | Muestra el error y el enlace de WhatsApp con nombre, servicio y mensaje prellenados |
| Formulario, honeypot | Éxito falso, no se envía nada |
| Petición real a Formspree | Llega y responde (`Form not found` con un ID falso), o sea CORS correcto |
| Botón de WhatsApp | Visible, `wa.me/584241237997`, no se solapa con el botón de sonido |
| Desbordamiento horizontal a 375 px | `scrollWidth === clientWidth === 375` |
| Escritorio a 1274 px | Hero en fila, filtros en una línea, sin desbordamiento |

### Pendiente de configuración

`SITE_CONFIG.FORMSPREE_ID` sigue en `PEGA-AQUI-TU-ID`. **La cuenta de Formspree la crea el usuario**; un agente no debe crear cuentas en su nombre. Mientras tanto el formulario degrada al canal de WhatsApp, que sí está configurado.

### Desplegado

Commit `c85eba1`, subido a `main` el 2026-08-19. `git rev-list --left-right --count origin/main...main` devuelve `0	0` y el árbol de trabajo está limpio.

Verificado **en el dominio real**, no en local: 3 proyectos, `SITE_CONFIG.WHATSAPP` cargado, botón flotante activo, estado vacío funcionando al filtrar por `games`, `scrollWidth === clientWidth === 375`, y el formulario degradando correctamente a WhatsApp por falta de `FORMSPREE_ID`.

---

## 8. TRAMPAS ESPECÍFICAS DE ESTE ENTORNO (verificadas, no teóricas)

1. **Web3Forms está descartado.** Devuelve error de CORS (`No 'Access-Control-Allow-Origin' header`) desde el navegador, tanto con `Content-Type: application/json` como con `FormData`. Formspree sí responde con las cabeceras correctas. Probado el 2026-08-19 desde `http://localhost:8080`.
2. **El formulario no funciona desde `file://`.** Hay que servir por HTTP para probarlo.
3. **`git status` avisa de CRLF.** El repositorio se creó en Windows y los archivos tienen finales de línea CRLF. Al editarlos con herramientas POSIX aparece `LF will be replaced by CRLF`. Es ruido, no un problema.
4. **Los mensajes de consola del navegador persisten entre navegaciones** en las herramientas de inspección usadas. Un error viejo puede parecer nuevo: recargar antes de concluir.
5. **`.hero-text-content` era un flex item sin `min-width`.** En columna tomaba su ancho `max-content` (480 px) dentro de un contenedor de 375 px y se recortaba, arrastrando toda la página a scroll horizontal. Corregido en la media query de 1024 px. **Si se toca el hero, revisar que no vuelva.**

---

## 9. PROTOCOLO PARA EL SIGUIENTE AGENTE

Al retomar el proyecto, en este orden:

1. Leer `contexto/RESUMEN-GENERAL.md` para el estado real.
2. Ejecutar `git log --oneline -20` y `git status` para ver qué se hizo de verdad y qué quedó sin subir.
3. Comprobar si lo local coincide con lo publicado **antes** de afirmar nada sobre "la web":
   ```bash
   git rev-list --left-right --count origin/main...main
   ```
   Si hay diferencias, o si hay archivos modificados sin commit, **la web no muestra los cambios**.
4. No inventar comandos de npm: este proyecto no tiene build.
5. No responder que usa Supabase. **No usa base de datos.** Ver sección 2.
6. No marcar nada como terminado sin haberlo abierto en el navegador y mostrado el resultado.
7. Actualizar los 3 archivos de `contexto/` al cerrar cada cambio.

---

## 10. BITÁCORA

| Fecha | Cambio |
|---|---|
| 2026-08-20 | **Rediseño desplegado a producción.** Se fusionó `rediseno-2026` en `main`. Los tres precios salen como "A convenir" en lugar de la cifra: el marcador `$PRECIO` se habría visto como un error de programación en la web pública, y las cifras reales todavía no están definidas. Buscar `PRECIO PENDIENTE` en `index.html` para cambiarlas. |
| 2026-08-20 | **Estrellas del hero y limpieza de capturas.** Se recuperó el campo de partículas conectadas del sitio anterior a petición del cliente, ahora solo dentro del hero, en el azul del logo y sin la cuadrícula del original; se pausa con `IntersectionObserver` cuando el hero sale de pantalla. Se retiraron de Sigmat las capturas `math_5` a `math_8`: no eran pantallas de la app sino del panel de Supabase (editor SQL, avisos de RLS y **una con la clave de API a la vista**), y llevaban descripciones inventadas. Sigmat queda con 4 capturas reales. |
| 2026-08-20 | **Tarjetas de trabajo rediseñadas y capturas ampliadas.** Las tarjetas pasaron de un bloque plano a una pieza con tres capas: la captura vive dentro de una ventana de navegador dibujada (semáforo y barra de dirección), la tarjeta se inclina en perspectiva siguiendo el cursor y un foco de luz lo acompaña; abajo, una ficha con cifras del proyecto. Capturas por proyecto: Olimpo 5, Sigmat 8, FastChatCenter 7, Asistencia 4. Las de FastChatCenter se generaron levantando el proyecto en local (Docker + backend + frontend) y **anonimizando nombres, teléfonos y correos de contactos reales** antes de guardarlas. Olimpo tiene una sola pantalla real de la app: se compuso una escena 16:9 repitiendo el teléfono en tres profundidades sobre el halo de marca, porque la captura vertical suelta no encajaba con el resto. |
| 2026-08-20 | **Rediseño completo (rama `rediseno-2026`).** Se retiró la estética cian-sobre-negro con cuadrícula y partículas. Paleta nueva muestreada del propio logo (tono 190-210°, azul hielo `#5AC8E8`) sobre fondo azul pizarra `#0A0E14`, sin resplandor. Tipografías Archivo, IBM Plex Sans y IBM Plex Mono. El logo pasó de 30 px en la barra a ser el protagonista del hero: arranca a 340 px y el scroll lo encoge y lo lleva hasta su hueco en la barra (verificado, aterriza a 1 px del destino). Nueva sección `#reel`: anclada con `position: sticky` sobre un recorrido de 420svh, donde el scroll mueve la secuencia de los 4 proyectos con su palabra gigante detrás, contador y barra de avance. Botones magnéticos. Proyectos actualizados: entran Olimpo, FastChatCenter y Asistencia; sale BODEGA-3. Capturas de FastChatCenter generadas levantando el proyecto en local, con los nombres de contactos reales anonimizados. |
| 2026-08-19 | Creación del documento y de la carpeta `contexto/`, replicando la estructura de 3 archivos usada en `sigmamath`. Auditoría completa del proyecto. **Hallazgo principal:** el formulario de contacto era una simulación que mostraba "TRANSFERENCIA DE DATOS COMPLETADA CON ÉXITO" sin enviar nada, y los mensajes de clientes se perdían en silencio. Migrado a POST real contra Formspree, con honeypot `_gotcha`, estados verdaderos en la terminal y degradación a WhatsApp si falla. Añadido botón flotante de WhatsApp con el número `+58 424-1237997`. Eliminados 4 proyectos sin capturas reales (`vortex`, `dashboard`, `aegis`, `chrono`) que mostraban una esfera decorativa genérica como si fuera el trabajo entregado; quedaron los 3 casos verificables. Añadido `#projectsEmptyState` para los filtros sin resultados. Corregido un desbordamiento horizontal en móvil **preexistente en producción**. Descartado Web3Forms por CORS. Todo verificado en navegador a 375 px y 1274 px. Desplegado en el commit `c85eba1` y verificado de nuevo ya en `https://jpdevslayer.com`. |
