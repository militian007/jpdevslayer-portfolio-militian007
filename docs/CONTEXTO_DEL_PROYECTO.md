# Contexto del Proyecto: JPDevSlayer Portfolio

## ¿Qué es este proyecto?
Es un portafolio web personal e interactivo diseñado para mostrar los proyectos de ingeniería, desarrollo web y creación de videojuegos de **JPDevSlayer**. Cuenta con un diseño fuertemente inspirado en temas Cyberpunk/Sci-Fi (tonos oscuros, neón, terminales seguras) y ofrece una experiencia inmersiva a través de animaciones y sonido.

## Tecnologías Utilizadas
Este proyecto está construido de manera "Vanilla" para asegurar el máximo rendimiento (Lighthouse 100/100) y tiempos de carga instantáneos sin depender de frameworks pesados:
- **HTML5:** Estructura semántica.
- **CSS3 Puro:** Uso extensivo de variables nativas de CSS (`:root`), Grid, Flexbox, animaciones clave (`@keyframes`) y efectos de *Glassmorphism* (cristal líquido).
- **JavaScript Vanilla (ES6):** Control del DOM, lógica de filtrado de proyectos, generador del modal holográfico y la terminal interactiva de contacto.
- **Web Audio API:** Generador de sintetizador integrado para emitir pitidos y efectos de sonido al hacer clic o interactuar con elementos, sin necesidad de cargar pesados archivos mp3.
- **HTML5 Canvas:** Generador de sistema de partículas de circuitos (nodos interconectados) renderizado en tiempo real en el fondo.

## Estructura del Proyecto
- `index.html`: Contiene toda la estructura visual, la barra de navegación, las tarjetas de "Bento Grid", la matriz de habilidades y el formulario de la terminal.
- `styles.css`: Contiene todos los estilos visuales, colores neón (`--color-cyan`, `--color-green`), efectos de luz de tarjetas y responsividad para móviles.
- `script.js`: El motor interactivo. Aquí se manejan:
  1. El sistema de partículas del fondo (Canvas).
  2. Los efectos de sonido sintetizados.
  3. El observador de intersección (Intersection Observer) para animar barras de habilidades cuando entran en pantalla.
  4. La lógica de filtrado de la galería de proyectos.
  5. El **Modal de Detalles Holográfico** y su carrusel dinámico.
- `assets/`: Carpeta que almacena todas las imágenes estáticas, capturas de pantalla de los proyectos y logos.

## Cómo agregar nuevos proyectos (Guía)
Toda la información de los proyectos que aparece al hacer clic en las tarjetas NO está escrita en el HTML, sino que se genera de forma dinámica. Para agregar uno nuevo:
1. Crear una nueva tarjeta HTML dentro de `<section id="projects">` asegurando asignarle un `data-project-id="tu_id"`.
2. Abrir `script.js` y buscar el objeto `const projectData = { ... }`.
3. Agregar una nueva entrada usando el mismo `tu_id` y llenar sus propiedades (título, metas, descripción, características e imágenes).
4. Subir las capturas a la carpeta `assets/` y referenciarlas en el array de `images`.

## Últimas Modificaciones Realizadas
- **Última Actualización:** Se añadió el proyecto **"NEXUS Motor Analítico"** a la lista de proyectos de la categoría Web.
- **Cambios en Código:** 
  - Se agregó la nueva tarjeta en `index.html`.
  - Se alimentó la base de datos local en `script.js` con todas las descripciones, etiquetas, cliente e imágenes de NEXUS.
  - Se integraron 3 capturas de pantalla en formato `.gif` (debido al formato por defecto del capturador de Windows) y se ajustó el código del carrusel para soportarlo.

---
*Documentación generada para mantener el control de la estructura Vanilla JS y facilitar futuras actualizaciones de portafolio.*
