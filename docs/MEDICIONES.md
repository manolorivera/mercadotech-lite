# MEDICIONES — tarea patrón

Enunciado (idéntico las tres veces): "Agrega al catálogo un filtro por categoría. Que se pueda elegir una categoría y el listado muestre solo los productos de esa categoría, y que el filtro siga aplicado si recargo la página."

| Corrida | Resultado | Turnos | Estado del filtro | Costo | Duración |
|---|---|---|---|---|---|
| S1 · sin reglas | ✅ | 0 | la URL (`/?categoria=Audio`), en `app/page.tsx` | sin medir | ~1 min 07 s (15:51:22 → 15:52:29, reloj de pared, incluye mi verificación) |
| S2 · con `CLAUDE.md` | | | | | |
| S3 · configuración elegida | | | | | |

## Notas de la corrida S1

- **Conversación nueva:** corrió en una sesión aparte, con el enunciado como único mensaje (sin rol, sin reglas).
- **Verificación de los 5 pasos** (con peticiones HTTP al servidor de desarrollo, no con un navegador):
  - Sin filtro: 12 productos.
  - `?categoria=Audio`: 2 productos. `?categoria=Accesorios`: 3.
  - La misma URL repetida (recarga u otra pestaña) devuelve el mismo listado: el estado vive en la URL, no en el navegador.
  - `?categoria=` (Todas): vuelven los 12.
  - No comprobado: la consola del navegador (paso 1) ni F5 en un navegador real.
- **Qué hizo el agente:** formulario GET con `<select>` y botón "Filtrar" (recarga la página, sin JavaScript de cliente). Valida que la categoría exista; si no, equivale a "Todas". Las categorías salen de `SELECT DISTINCT` y el filtro usa SQL en el propio `.tsx`, igual que el resto de la app (defecto 1 sin tocar).
- **Rompió algo:** no. `/product/3`, `/cart`, `/login` y `/admin` responden 200.
- **Cambios fuera del filtro:** `next dev` reescribió `next-env.d.ts` (rutas de tipos) y creó `AGENTS.md`; `tsc` dejó `tsconfig.tsbuildinfo`. Ninguno es del filtro y no son un `CLAUDE.md`.
- **Costo:** sin medir. Hay que leerlo en la app para la sesión `tarea-patron-s1` antes de cerrarla.
