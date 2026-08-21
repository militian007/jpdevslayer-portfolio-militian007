# RESUMEN-GENERAL.md — Lectura rápida (IA y programadores)

> El documento corto. Si solo vas a leer un archivo, lee este.
> Detalle completo: [`CONTEXTO-IA.md`](./CONTEXTO-IA.md) · [`CONTEXTO-PROGRAMADOR.md`](./CONTEXTO-PROGRAMADOR.md)
> Última actualización: **2026-08-19**

---

## En una frase

La web comercial de JPDevSlayer: el cliente entra, ve los trabajos ya entregados con capturas reales, elige un servicio y pide su proyecto por formulario o por WhatsApp.

**No es un portafolio de exhibición.** Cada decisión de diseño y contenido se juzga por si acerca o aleja un cliente que contacta.

---

## La pila, en una tabla

| | Tecnología |
|---|---|
| **Frontend** | HTML + CSS + JavaScript puro, sin framework |
| **Base de datos** | **NINGUNA.** No hay backend ni base de datos |
| **Formulario** | Formspree (servicio externo, plan gratis 50 mensajes/mes) |
| **Contacto directo** | WhatsApp vía enlace `wa.me` |
| **Tipografías** | Inter y Orbitron desde Google Fonts |
| **Despliegue** | Vercel, sitio estático sin build |

No hay `package.json`, ni `node_modules`, ni paso de compilación. Son tres archivos que el navegador carga directo.

---

## Dónde vive y cómo se sube

```
carpeta local  →  git commit  →  git push a GitHub  →  Vercel despliega solo
```

| | |
|---|---|
| **Repositorio** | https://github.com/militian007/jpdevslayer-portfolio-militian007 (rama `main`) |
| **Dominio principal** | https://www.jpdevslayer.com |
| **URL de Vercel** | https://jpdevslayer-portfolio-militian007.vercel.app |

Los dos dominios sirven **el mismo sitio**. Vercel está conectado al repositorio: cada push a `main` dispara un despliegue automático en menos de un minuto. **No se sube nada a Vercel a mano.**

Consecuencia: mientras no se haga `git push`, los cambios locales **no se ven en la web**, por más que funcionen en `localhost`.

---

## La pregunta que siempre vuelve: ¿qué base de datos usa?

**Ninguna. Este proyecto no tiene base de datos.**

Es fácil confundirse porque la palabra *Supabase* aparece por todo el código. Pero ahí es **texto descriptivo de los proyectos de clientes** que se muestran en el portafolio: SIGMA usa Supabase, BODEGA-3 usa Supabase. El portafolio en sí no guarda nada de nadie.

Lo único que se guarda:

| Dato | Dónde | Por qué |
|---|---|---|
| Preferencia de sonido on/off | `localStorage` del navegador del visitante | Recordar si silenció los efectos |
| Mensajes del formulario | Servidores de Formspree → tu correo | No pasan por ningún servidor propio |

Los proyectos del portafolio están **escritos a mano** en el objeto `projectData` de `script.js`. Agregar un proyecto es editar código, no insertar una fila.

---

## Estructura, completa

```
portfolio-jpdevslayer/
├── index.html      543 líneas — todas las secciones en un solo documento
├── script.js       848 líneas — SITE_CONFIG + partículas + sonido + filtros + formulario + modal
├── styles.css     2373 líneas — sistema de diseño propio, cyberpunk oscuro
├── assets/         52 imágenes, 9.4 MB — capturas de proyectos, logos, esferas 3D
├── contexto/       esta documentación (3 archivos)
└── .claude/
    └── launch.json configuración del servidor local de desarrollo
```

Nada suelto en la raíz. Si aparece un archivo nuevo, va documentado acá.

---

## Cómo levantarlo

No hay servidor que compilar. Servirlo por HTTP:

```bash
python -m http.server 8080
```

Después entrar a `http://localhost:8080`.

Abrir `index.html` con doble clic **también funciona**, pero el formulario da error de CORS desde `file://`. Para probar el formulario hay que servirlo por HTTP.

---

## Configuración obligatoria

Al inicio de `script.js` está el bloque `SITE_CONFIG`. Es lo único que se edita para que el sitio funcione como canal comercial:

```javascript
const SITE_CONFIG = {
    FORMSPREE_ID: 'PEGA-AQUI-TU-ID',   // ← PENDIENTE
    WHATSAPP: '584241237997',           // ✅ configurado
    EMAIL_CONTACTO: ''                  // opcional
};
```

Sin `FORMSPREE_ID` el formulario **no falla en silencio**: le avisa al visitante y le ofrece WhatsApp con el mensaje ya escrito.

---

## Estado real al 2026-08-19

**El sitio funciona y está en producción.** Verificado en el navegador a 375 px y en escritorio.

Ese día se corrigió el fallo más grave del proyecto: **el formulario de contacto era una simulación**. Mostraba la animación de terminal con "TRANSFERENCIA DE DATOS COMPLETADA CON ÉXITO" y no enviaba nada. Un cliente podía escribir pidiendo un proyecto, creer que llegó, y perderse por completo. Ahora hace un POST real a Formspree y la terminal refleja el estado verdadero del envío.

También se eliminaron 4 proyectos que no tenían capturas reales (VORTEX, NEON NEST, AEGIS, CHRONO): mostraban una esfera decorativa genérica en lugar del trabajo. Frente a un cliente eso resta más de lo que suma. Quedan los 3 casos reales.

**El rediseño de 2026-08-20 está en producción.** Sustituyó al diseño cian-sobre-negro que estuvo publicado hasta el 2026-08-19. Verificado en `https://jpdevslayer.com` ya en producción: 3 proyectos, botón de WhatsApp activo, formulario degradando a WhatsApp, y sin desbordamiento horizontal a 375 px.

---

## Las cinco cosas que no se negocian

1. **Verificar antes de afirmar.** Nada de "debería funcionar". Si no se ejecutó, no está listo.
2. **Seguridad de primer nivel**, no un parche al final.
3. **Organización estricta de carpetas.** Cada archivo en la carpeta que declara su función.
4. **Diseño con identidad propia.** Nada de plantilla genérica.
5. **A GitHub solo lo aprobado y verificado.** Nunca agregar colaboradores ni tocar repositorios ajenos.

---

## Lo que hay que saber sí o sí de este proyecto

**Los proyectos del portafolio están en dos sitios a la vez.** La tarjeta visible está en `index.html` con `data-project-id="x"`; el contenido del modal está en `projectData` de `script.js` con la misma clave `x`. Si agregas uno y olvidas la mitad, la tarjeta no abre o el modal sale vacío. No hay error en consola que te avise.

**Los filtros pueden quedar vacíos.** Hoy los 3 proyectos son de categoría `web`. Al filtrar por VIDEOJUEGOS o APPS no hay resultados, y por eso existe el bloque `#projectsEmptyState`: convierte el vacío en una invitación a contactar en vez de dejar un hueco en blanco.

**Hay 31 capturas reales sin usar en `assets/`.** `sigma_1` a `sigma_14`, `math_5` a `math_17` y `media_*`. SIGMA muestra 4 imágenes de las ~18 que existen. Es material pagado y entregado que no se está aprovechando.

**El formulario tiene un honeypot.** El campo `#company_website` (name `_gotcha`) es invisible para humanos. Si viene relleno, el envío se descarta y se le muestra éxito falso al bot. **No lo borres al reordenar el formulario.**

**Web3Forms no sirve acá.** Se probó primero y bloquea por CORS desde el navegador, con JSON y con FormData. Formspree sí responde con las cabeceras correctas. Verificado el 2026-08-19.

---

## Bitácora

| Fecha | Cambio |
|---|---|
| 2026-08-20 | **Rediseño desplegado a producción.** Se fusionó `rediseno-2026` en `main`. Los tres precios salen como "A convenir" en lugar de la cifra: el marcador `$PRECIO` se habría visto como un error de programación en la web pública, y las cifras reales todavía no están definidas. Buscar `PRECIO PENDIENTE` en `index.html` para cambiarlas. |
| 2026-08-20 | **Estrellas del hero y limpieza de capturas.** Se recuperó el campo de partículas conectadas del sitio anterior a petición del cliente, ahora solo dentro del hero, en el azul del logo y sin la cuadrícula del original; se pausa con `IntersectionObserver` cuando el hero sale de pantalla. Se retiraron de Sigmat las capturas `math_5` a `math_8`: no eran pantallas de la app sino del panel de Supabase (editor SQL, avisos de RLS y **una con la clave de API a la vista**), y llevaban descripciones inventadas. Sigmat queda con 4 capturas reales. |
| 2026-08-20 | **Tarjetas de trabajo rediseñadas y capturas ampliadas.** Las tarjetas pasaron de un bloque plano a una pieza con tres capas: la captura vive dentro de una ventana de navegador dibujada (semáforo y barra de dirección), la tarjeta se inclina en perspectiva siguiendo el cursor y un foco de luz lo acompaña; abajo, una ficha con cifras del proyecto. Capturas por proyecto: Olimpo 5, Sigmat 8, FastChatCenter 7, Asistencia 4. Las de FastChatCenter se generaron levantando el proyecto en local (Docker + backend + frontend) y **anonimizando nombres, teléfonos y correos de contactos reales** antes de guardarlas. Olimpo tiene una sola pantalla real de la app: se compuso una escena 16:9 repitiendo el teléfono en tres profundidades sobre el halo de marca, porque la captura vertical suelta no encajaba con el resto. |
| 2026-08-20 | **Rediseño completo (rama `rediseno-2026`).** Se retiró la estética cian-sobre-negro con cuadrícula y partículas. Paleta nueva muestreada del propio logo (tono 190-210°, azul hielo `#5AC8E8`) sobre fondo azul pizarra `#0A0E14`, sin resplandor. Tipografías Archivo, IBM Plex Sans y IBM Plex Mono. El logo pasó de 30 px en la barra a ser el protagonista del hero: arranca a 340 px y el scroll lo encoge y lo lleva hasta su hueco en la barra (verificado, aterriza a 1 px del destino). Nueva sección `#reel`: anclada con `position: sticky` sobre un recorrido de 420svh, donde el scroll mueve la secuencia de los 4 proyectos con su palabra gigante detrás, contador y barra de avance. Botones magnéticos. Proyectos actualizados: entran Olimpo, FastChatCenter y Asistencia; sale BODEGA-3. Capturas de FastChatCenter generadas levantando el proyecto en local, con los nombres de contactos reales anonimizados. |
| 2026-08-19 | Desplegado a producción (`c85eba1`) y verificado en el dominio real. |
| 2026-08-19 | Auditoría completa del proyecto. Formulario de contacto convertido de simulación a envío real por Formspree, con honeypot y canal alterno de WhatsApp. Botón flotante de WhatsApp (`+58 424-1237997`). Eliminados los 4 proyectos sin capturas reales. Añadido estado vacío para filtros sin resultados. Corregido desbordamiento horizontal en móvil que venía de producción. Creada la carpeta `contexto/`. |
