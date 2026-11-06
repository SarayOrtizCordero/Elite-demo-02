# Elite Spinning · Design system (Neón nocturno)

Dirección: sala de spinning a oscuras con luz verde manzana. Negro profundo, un solo acento (verde manzana), tipografía condensada deportiva muy grande y movimiento corto y con propósito. No se basa en ejemplos de UXKIN (no estaba conectado); se apoya en el proyecto existente y en la petición del cliente.

## Color (no cambia: negro + verde manzana)
| Token | Valor | Rol |
|---|---|---|
| `--bg` | `#050505` | Fondo de página |
| `--s1` | `#0e0e0e` | Paneles y mapa de bicis |
| `--s2` | `#161616` | Tarjetas, inputs, chips |
| `--line` | `#262626` | Bordes y separadores |
| `--g` | `#9ADE2F` | Único acento: acciones, selección, números clave |
| `--g-glow` | `rgba(154,222,47,.35)` | Brillos y sombras luminosas |
| `--txt` | `#ffffff` | Texto principal (contraste 19:1) |
| `--mut` | `#a3a3a3` | Texto secundario (8.9:1 sobre `--bg`) |
| `--ink` | `#050505` | Texto sobre verde (12:1) |
| `--err` | `#ff8a8a` | Errores de formulario |

## Tipografía
- Display: **Big Shoulders Display** 800/900, mayúsculas, interlineado .86–1. Titulares y números.
- Cuerpo: **Hanken Grotesk** 400/500/600/700, 17px (16px móvil), interlineado 1.6.
- Escala: 14 · 16/17 · 19 · 24 · clamp(40–64) · clamp(64–200) hero.

## Espacio y forma
- Escala base 4/8: 8, 12, 16, 24, 32, 48, 80, 120. Ancho de contenido 1200px, gutter `clamp(20px,4vw,56px)`.
- Radio: 14 (inputs), 24 (tarjetas), 999 (botones, chips, barra).
- Sombras: solo brillo verde en elementos activos y una sombra profunda para la barra fija.

## Componentes
- **Botón primario**: pastilla verde, texto negro, hover sube 2px + brillo. **Ghost**: borde gris, hover verde. Deshabilitado gris.
- **Día / hora / bici**: seleccionado = relleno verde + brillo; ocupada = borde discontinuo; foco visible 3px verde.
- **Tarjetas**: `--s1`, borde `--line`, hover con luz verde que sigue al cursor.
- **Marquesina** verde con texto negro entre hero y reserva.

## Movimiento
- Entrada del titular por líneas, revelado al hacer scroll (`.rv`), contadores, marquesina, brillo que sigue al cursor, pulso en bici elegida, check que se dibuja al confirmar.
- Duraciones 200–900 ms, curva `cubic-bezier(.2,.7,.2,1)`. Con `prefers-reduced-motion` todo queda estático.

## Imágenes
- Fotos de stock provisionales (ver `assets/CREDITOS.md`), siempre oscurecidas con degradado. Icono de bici del logo como máscara verde.
