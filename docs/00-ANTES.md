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
