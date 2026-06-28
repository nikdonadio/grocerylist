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

> Experimento de desarrollo asistido por IA — todo el código generado con Claude.
