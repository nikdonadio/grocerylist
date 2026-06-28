# Bitácora de Desarrollo — grocerylist

## Sesión 2 — 2026-06-28

### Contexto
El proyecto ya corría localmente con stack AWS (Lambda + DynamoDB + Serverless Framework).
El deploy a AWS quedó bloqueado por problemas de verificación de cuenta (SMS no llegaba).
Se decidió pivotar a Railway + Vercel como alternativa sin tarjeta de crédito.

### Decisiones tomadas

- **Stack de deploy:** Railway (backend) + Vercel (frontend, pendiente)
- **Base de datos:** PostgreSQL en Railway — descartamos DynamoDB y MongoDB Atlas
- **Región:** EU West (Amsterdam) — óptimo desde Barcelona
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
6. PR mergeado a `main` con todos los checks en verde
7. Autodeploy en Railway exitoso

### Estado actual

| Componente | Estado | URL |
|---|---|---|
| Backend | ✅ Online | `https://grocerylist-production-ddd6.up.railway.app` |
| Base de datos | ✅ Online | PostgreSQL en Railway Amsterdam |
| Frontend | ⏳ Pendiente | Vercel — próxima sesión |

### Endpoints verificados

```
GET  /health          → { status: "ok" }
GET  /list/:token     → { accessToken, items: [] }
```

### Próximos pasos

- [ ] Sincronizar `dev-railway` con `main` post-merge
- [ ] Adaptar frontend: cambiar `VITE_API_URL` a la URL de Railway
- [ ] Deploy del frontend en Vercel
- [ ] Smoke test end-to-end en producción
- [ ] (v2) Hash del `access_token` como PK — sugerencia de CodeRabbit diferida

---

> Experimento de desarrollo asistido por IA — todo el código generado con Claude.
