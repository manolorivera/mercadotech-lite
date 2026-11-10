# BITÁCORA

## Sesión 1 — Tu app en una sesión (2026-11-10)

### Qué se construyó
- **MercadoTech Lite** (Next.js + TypeScript + SQLite con `better-sqlite3`), generada con el encargo literal de `ENCARGO_LITE.md` §1: catálogo, detalle, carrito, compra simulada (registra el pedido y descuenta stock), registro e inicio de sesión, y `/admin` para cargar productos. 12 productos de ejemplo, precios en soles.
- **Filtro por categoría** (tarea patrón, corrida S1): selector en el catálogo, estado en la URL (`/?categoria=Audio`), en `app/page.tsx`.
- Documentos: `docs/00-ANTES.md` (entorno, forma de pago, modo de aprobación, factura, inventario de daños) y `docs/MEDICIONES.md` (fila S1).

### Qué decidió el agente sin que se lo pidieran
- Sin capas: SQL en 4 páginas `.tsx` y en `app/actions.ts`; las reglas de stock y total viven dentro de `checkout`.
- Sin archivo de constantes; el mínimo de contraseña (6) está escrito dos veces.
- Cero pruebas.
- Contraseñas con `bcryptjs` (esta variante del defecto 4 no apareció).
- Sesión = cookie `uid` con el id en claro; `/admin` y `createProduct` sin comprobar sesión.
- Ítems del pedido como JSON en `orders.items`; página `/orders` extra; imágenes de picsum.photos.

### Números medidos
| Dato | Valor |
|---|---|
| Entorno | node v25.8.2, npm 11.11.1, git 2.53.0, claude 2.1.319 |
| Modo de aprobación elegido | `manual` |
| Tarea patrón S1 | ✅, 0 turnos de corrección, estado en la URL, ~1 min 07 s |
| Costo de la generación (1.2) | sin medir |
| Costo de la tarea patrón (1.4) | sin medir |
| Duración de la generación (1.2) | sin medir |
| Defectos del inventario | 1, 2 y 3 completos; el 4 en 2 de 3 variantes (admin abierto, cookie editable) |
| Otros hallazgos | `removeFromCart` sin comprobar propietario; stock comprobado fuera de la transacción (deducido, no probado) |

### Qué salió mal
- No se anotó la hora de inicio ni el costo de la 1.2: esos números no se pueden recuperar y quedan "sin medir".
- El flujo registro → carrito → compra no se probó de punta a punta; solo `next build` y respuestas 200.
- El filtro se verificó con peticiones HTTP, no con un navegador (consola y F5 reales sin comprobar).
- Los prompts de `PROMPTS_sesion1.md` y la spec aún hablan de Supabase, Docker y RLS; el encargo ya es SQLite. Hubo que adaptar la 1.3 a mano.
- Un comando que mataba todos los `node.exe` fue bloqueado por el clasificador de permisos; se rehízo acotado.
- `next dev` creó `AGENTS.md` y reescribió `next-env.d.ts`; `tsc` dejó `tsconfig.tsbuildinfo`. No son parte del trabajo y no se subieron.

### Pendiente para la sesión 2
- Escribir el `CLAUDE.md` (no existe a propósito): capa de datos separada de la interfaz, constantes en un solo sitio, filtros en la URL, pruebas, permisos del admin.
- Segunda corrida de la tarea patrón: partir del código **antes** del filtro (commit `8fc804a`) y en conversación nueva.
- Leer el costo real en la app y rellenar los "sin medir" que se puedan; no estimar.
- Decidir qué hacer con `AGENTS.md` y `next-env.d.ts`.
- Probar a mano el flujo completo de compra.
