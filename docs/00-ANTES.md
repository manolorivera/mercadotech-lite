# 00 — ANTES (Sesión 1)

Punto de partida del curso, con hechos y su evidencia. Fecha: 2026-11-10.

## 1. ENTORNO

| Herramienta | Comando | Salida real | Estado |
|---|---|---|---|
| claude | `claude --version` | 2.1.319 (Claude Code) | OK |
| node | `node --version` | v25.8.2 | cumple el mínimo de 20 |
| npm | `npm --version` | 11.11.1 | OK |
| git | `git --version` | git version 2.53.0.windows.1 | OK |
| supabase | `supabase --version` | 3.1.0 | OK |
| docker | `docker --version` / `docker info` | Docker version 29.1.3; el servidor responde (29.1.3) | OK |

Memoria global: no existe `~/.claude/CLAUDE.md`. `~/.claude/settings.json` solo
fija `theme: dark` y `autoUpdatesChannel: latest`. `~/.claude/skills/synced`
contiene solo archivos de sincronización de la app, no Skills personales.

Carpeta `mercadotech-lite`: vacía al iniciar (0 elementos, incluidos ocultos).

## 2. CÓMO PAGO

Tengo un **plan de Claude** (techo de uso). Cuando se agota, la herramienta se
detiene hasta que el cupo se renueve o hasta que pase a saldo de API.

Diferencia: un plan tiene techo de **uso** y el saldo de API tiene techo de
**dinero**. Con mi plan, lo que me frena primero es el techo de uso, no el dinero.

Criterio para elegir un modelo: vale pagar más por capacidad cuando el error
cuesta más que el modelo (una migración de base de datos, un cambio de
arquitectura); no vale cuando el error es barato y se corrige leyendo
(renombrar, documentar, boilerplate). La elección medida es la sesión 3.

## 3. MODO DE APROBACIÓN

Modos que ofrece esta instalación (`claude --help`, opción `--permission-mode`),
de "pregunta por todo" a "actúa sin preguntar":

1. `manual`
2. `plan`
3. `acceptEdits`
4. `auto`
5. `dontAsk`
6. `bypassPermissions`

**Modo elegido por mí: `manual`.**

**Riesgo aceptado:** en `manual` cada acción me pide aprobación, y en una
generación masiva el cansancio de aprobar puede hacer que apruebe sin leer; así,
el agente podría ejecutar un `npm install` de un paquete que no quería o
sobrescribir un archivo mío sin que me dé cuenta.

## 4. FACTURA (Fase 1.2)

| Dato | Valor |
|---|---|
| Costo de la conversación | sin medir (el agente no tiene acceso al contador de costo; hay que leerlo en la app antes de cerrar) |
| Duración | sin medir (no se anotó la hora de inicio) |
| Veces que el agente pidió aprobación | 0 preguntas de diseño; 1 acción bloqueada por el clasificador de permisos (matar todos los `node.exe`), rehecha de forma acotada |
| Preguntas al usuario durante la generación | 0 |
| Verificación realizada | `next build` sin errores; servidor de producción: catálogo con 12 productos, `/product/3`, `/admin`, `/login` responden 200. Flujo registro → carrito → compra NO probado |

## 5. INVENTARIO DE DAÑOS (Fase 1.3)

Fotografía, sin corregir nada. Comandos ejecutados en la raíz del proyecto (Git Bash); salidas recortadas.
Nota: el prompt de la 1.3 habla de RLS y de la clave de servicio (era Supabase); el stack real es SQLite, así que el defecto 4 se comprueba con la §3 de ENCARGO_LITE.md (sesión, administrador, hash).

| # | Defecto | Comando | Salida real (recortada) | Se cierra en |
|---|---|---|---|---|
| 1 · Interfaz consulta la BD | **Apareció** | `grep -rnE "lib/db\|db\.prepare\|better-sqlite3" app --include=*.tsx` | `app/page.tsx:7: db.prepare("SELECT * FROM products ORDER BY id")`; `app/product/[id]/page.tsx:9`; `app/cart/page.tsx:12`; `app/orders/page.tsx:10` (4 páginas `.tsx` importan `@/lib/db` y ejecutan SQL). Además `app/actions.ts:52-67` (`checkout`) mezcla SQL, comprobación de stock (l.57) y cálculo del total (l.59) | S2 y S5 |
| 2 · Valores incrustados | **Apareció** | `find . ( -iname "*const*" -o -iname "*config*" )` (sin node_modules/.next) | solo `.git/config`, `tsconfig.json` y `next.config.mjs`: no existe archivo de constantes | S2 y S5 |
| | | `grep -rnE "length < 6\|minLength=\{6\}" app lib` | `app/actions.ts:12: if (password.length < 6)` y `app/auth-form.tsx:11: ... minLength={6}`: el mismo límite escrito dos veces | |
| | | `grep -rn 'S/' app` | 6 ocurrencias en 5 archivos (admin, cart, orders, page, product): moneda repetida; la URL `picsum.photos` por defecto también (`app/actions.ts:80`, `lib/db.ts:30`) | |
| 3 · Cero pruebas | **Apareció** | `find . -name "*.test.*" -o -name "*.spec.*"` (sin node_modules) | sin resultados | S6 |
| | | `npm test` | `npm error Missing script: "test"` | |
| | | `grep -nE "jest\|vitest\|playwright\|mocha\|testing-library" package.json` | sin coincidencias | |
| 4a · Admin sin comprobar quién | **Apareció** | `sed -n '/export async function createProduct/,/^}/p' app/actions.ts \| grep -E "currentUser\|redirect"` | sin salida: `createProduct` no mira la sesión; `app/admin/page.tsx` tampoco | S6 y S7 |
| | | `grep -rniE "admin\|role\|is_admin" lib app/actions.ts` | sin resultados: no existe el concepto de administrador | |
| 4b · Contraseña sin cifrar | **No apareció** | `grep -n "bcrypt" app/actions.ts` | `:14 bcrypt.hashSync(password, 10)` y `:23 bcrypt.compareSync(...)`: la contraseña se guarda con hash porque yo (el agente) elegí bcryptjs sin que se pidiera | — |
| 4c · Sesión en el navegador | **Apareció** | `grep -nE "cookies\(\)\)\.set" app/actions.ts` | `:15` y `:24`: `.set("uid", String(id), { path: "/" })`: el id de usuario en claro, sin firma ni `httpOnly`; cualquiera puede editar la cookie y suplantar a otro usuario | S6 y S7 |

### Problemas fuera de la lista

| # | Problema | Evidencia | Se cierra en |
|---|---|---|---|
| 5 | `removeFromCart` borra por id sin comprobar de quién es la fila (un usuario puede vaciar el carrito de otro) | `app/actions.ts:45: db.prepare("DELETE FROM cart_items WHERE id = ?").run(Number(fd.get("id")))`, sin `currentUser()` | S7 |
| 6 | Los ítems del pedido van como JSON en `orders.items`, no en tabla propia (decisión del agente, anticipada en ENCARGO_LITE §2) | `lib/db.ts`: `items TEXT NOT NULL` en `orders` | S5 |
| 7 | `checkout` comprueba el stock fuera de la transacción (`:55-58`) y descuenta dentro (`:60-68`); dos compras simultáneas pueden dejar stock negativo. No probado, deducido del código | `app/actions.ts` | S5 |
| 8 | Flujo registro → carrito → compra no probado de punta a punta (solo build y respuestas 200) | ver FACTURA | S6 |

Resultado: 3 de los 4 defectos aparecieron completos (1, 2, 3); el 4 apareció en 2 de sus 3 variantes (a, c). Lo que lo evitó en 4b fue una decisión mía, no del encargo: usar `bcryptjs`.
