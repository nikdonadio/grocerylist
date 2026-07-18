# Bitácora de Desarrollo — grocerylist

## Sesión 2 — 2026-06-28

### Contexto
El proyecto ya corría localmente con stack AWS (Lambda + DynamoDB + Serverless Framework).
El deploy a AWS quedó bloqueado por problemas de verificación de cuenta (SMS no llegaba).
Se decidió pivotar a Railway como alternativa sin tarjeta de crédito.

### Decisiones tomadas

- **Stack de deploy:** Railway (backend + frontend en el mismo proyecto)
- **Base de datos:** PostgreSQL en Railway — descartamos DynamoDB y MongoDB Atlas
- **Región:** EU West (Amsterdam) — óptimo desde Barcelona
- **Frontend:** servido como sitio estático desde Railway con `serve --single` (SPA routing)
- **Branching strategy:**
  - `main` → producción, autodeploy en Railway
  - `dev-railway` → rama de trabajo diaria
  - `legacy-aws` → snapshot del stack AWS original, sin tocar

### Lo que se hizo

1. Creación de branches `legacy-aws` y `dev-railway`
2. Migración del backend:
   - Lambda handlers → Express route handlers
   - DynamoDB → PostgreSQL (`pg`)
   - Serverless Framework → servidor Express con `server.ts`
   - Agregado `helmet`, async error wrapper, validación de inputs
3. PostgreSQL provisionado en Railway (Amsterdam)
4. Migración de tabla `items` ejecutada exitosamente
5. Review de código con CodeRabbit — 8 issues encontrados y resueltos:
   - Validación de tipos en `addItem` y `updateItem`
   - Placeholders `$N` corregidos en queries de `updateItem`
   - 404 en `deleteItem` cuando no existe el item
   - Guard de `DATABASE_URL` al startup en `db.ts`
   - Async error wrapper en `server.ts`
   - `helmet` para security headers
   - `created_at` como `TIMESTAMP` en vez de `TEXT`
6. Deploy del backend en Railway — online
7. Deploy del frontend en Railway como sitio estático:
   - Agregado `vite-env.d.ts` para tipos de `ImportMeta` (fix build)
   - Flag `--single` en `serve` para SPA routing (fix 404 en rutas de React)
   - Variable `VITE_API_URL` configurada en Railway
8. Smoke test end-to-end en producción — agregar, marcar, borrar items: ✅

### Estado final

| Componente | Estado | URL |
|---|---|---|
| Backend | ✅ Online | `https://grocerylist-production-ddd6.up.railway.app` |
| Frontend | ✅ Online | `https://brave-stillness-production-483f.up.railway.app` |
| Base de datos | ✅ Online | PostgreSQL en Railway Amsterdam |

### Endpoints verificados

```
GET    /health                          → { status: "ok" }
GET    /list/:token                     → { accessToken, items: [] }
POST   /list/:token/items               → item creado
PUT    /list/:token/items/:id           → item actualizado
DELETE /list/:token/items/:id           → item borrado
```

### Pendiente para próximas sesiones

- [ ] Sincronizar `dev-railway` con `main` y commitear bitácora
- [ ] Tests de integración adaptados a PostgreSQL (los anteriores apuntaban a DynamoDB Local)
- [ ] (v2) Hash del `access_token` como PK — sugerencia de CodeRabbit diferida
- [ ] (v2) Considerar mobile app como cliente adicional

---

## Sesión 5 (2026-07-05) — Reestructuración de documentación de proceso

### Contexto

El master prompt original (`MASTER PROMPT - AI-Driven MVP Dev.md`) especificaba
stack AWS Lambda + API Gateway + DynamoDB + SAM/Serverless, heredado del plan
inicial del proyecto. Esto contradecía el estado real en producción (Node +
Express + PostgreSQL en Railway), generando riesgo de confusión/contradicción
en sesiones futuras.

### Decisión

Separaron las responsabilidades de los documentos de proceso/producto en dos
archivos con una única fuente de verdad cada uno:

- **`docs/MASTER PROMPT - AI-Driven MVP Dev.md`** → cómo trabajamos: branching,
  Jira, disciplina de commits, límites de scope por componente, entorno de
  desarrollo. Se agregó una nota histórica explicando el abandono del plan AWS
  (bloqueo de verificación de cuenta + problema de diseño de esquema en
  DynamoDB detectado en tests tempranos).
- **`specs/spec.md`** → qué es el producto ahora: requisitos, stack vigente,
  endpoints, reglas de arquitectura, decisiones técnicas aplicadas, roadmap.

Se estableció una jerarquía explícita de documentos (ver §0 del master prompt)
para que cada dato viva en un solo lugar: proceso → master prompt; producto →
spec; histórico/decisiones puntuales → esta bitácora.

Las 3 decisiones de diseño marcadas `[Decision]` en Jira (estado "No hay",
categorías JSON vs. tabla, persistencia de listas favoritas) ya fueron
respondidas y cerradas en sus tickets — pendiente sincronizar el detalle de
cada una al spec en una próxima sesión.

### Archivos versionados

- `docs/MASTER PROMPT - AI-Driven MVP Dev - OLD-20260705.md` (snapshot del original)
- `docs/MASTER PROMPT - AI-Driven MVP Dev.md` (nuevo, vigente)
- `specs/spec-DEPRECATED-20260705.md` (snapshot del original)
- `specs/spec.md` (nuevo, vigente)

### Pendiente para próximas sesiones

- [ ] Sincronizar el detalle de las 3 decisiones `[Decision]` ya cerradas en Jira hacia `spec.md`
- [ ] Validar que Project Instructions (texto pegado en Claude) refleje el nuevo master prompt

---

---

## Sesión 6 — Mobile Polish Quick Wins (GL-8, GL-9) — 2026-07-18

### Contexto

Arranque de la épica GL-1 (Mobile Polish). Se trabajaron GL-8 (rename app) y
GL-9 (ícono carrito) como primer intento del flujo "PR por ticket" (rama +
PR individual por cada ticket, en vez de por épica completa).

### Decisión — vuelta a "PR por épica", se abandona "PR por ticket"

Se probó branch + PR individual por ticket (GL-8-nombre-app, GL-9-icono-app)
y resultó overhead innecesario para desarrollo en solitario sin trabajo en
paralelo: crear rama, pushear, abrir PR, mergear, sincronizar `dev-railway`
con `main`, borrar rama — por cada cambio chico. Se vuelve al flujo ya
documentado en el master prompt (§4.6): trabajar los tickets de una épica
directo en `dev-railway`, un solo PR `dev-railway → main` al cerrar la
épica o un grupo lógico de tickets. El master prompt no necesitó cambios,
ya reflejaba este flujo — la desviación fue solo de esta sesión.

### Hallazgo — ramas de ticket creadas sobre `dev-railway` desincronizada

Al crear `GL-8-nombre-app` sobre un `dev-railway` que ya estaba adelantado
respecto a `main` (con la consolidación de docs de Sesión 5 sin mergear
todavía), el PR de GL-8 arrastró esos 7 archivos de docs sin relación con el
ticket. CodeRabbit los señaló con 5 findings — agrupados en **GL-33** (bajo
GL-7), sin bloquear el merge de GL-8.

### Decisión — modelo de seguridad del accessToken (via GL-33)

CodeRabbit marcó que se perdió el requisito de "token de alta entropía" del
spec viejo (`spec-DEPRECATED-20260705.md`, pensado para el plan AWS). No fue
un descuido: la implementación real usa tokens legibles a propósito (ej.
"family-list", "saturday-shop") para que la familia los recuerde sin
fricción. Riesgo aceptado para este MVP (sin datos sensibles, uso familiar).
Queda pendiente documentar esto explícitamente en `spec.md` (parte de GL-33).

### Notas operativas

- `git branch -d` puede advertir "not yet merged to HEAD" aun después de un
  merge real, si el merge en GitHub fue squash/rebase (SHAs distintos aunque
  el contenido sea el mismo) — no es un error.
- Confirmado con el usuario paso a paso: **nunca asumir que un `git merge`
  ocurrió sin ver el output** — un salto de paso (borrar rama antes de
  sincronizar) dejó `dev-railway` desactualizado silenciosamente.
- Para íconos mobile: Filesystem MCP no puede escribir binarios al disco del
  usuario (`write_file` es solo texto) — el flujo es generar en el
  contenedor de Claude, `present_files`, y que el usuario copie manualmente.
- Adaptive icon de Android necesita padding (~62% del canvas) para respetar
  la safe zone de la máscara circular/redondeada; el ícono normal (`icon.png`)
  puede ir full-bleed.
- CodeRabbit excluye PNGs/binarios por defecto (`!**/*.png`) — "Review was
  skipped due to path filters" en PRs de solo-assets es esperado, no un error.

### Estado al cierre

- GL-8: Hecho (merge a `main`, `dev-railway` sincronizada)
- GL-9: probado en dispositivo, pendiente merge final y cierre en Jira
- GL-1: En curso

---

> Experimento de desarrollo asistido por IA — todo el código generado con Claude.
