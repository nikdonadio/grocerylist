# SESSION CONTEXT — grocerylist MVP

## Repo
`C:\Projects\grocerylist` — ya en GitHub, rama main.

## Stack decidido
- Frontend: React + TypeScript + Vite (puerto 5173)
- Backend: Node.js + TypeScript + Serverless Framework v3
- DB: DynamoDB Local en dev (puerto 8000), AWS DynamoDB en prod
- Deploy: Serverless Framework (`serverless deploy`) — NO AWS SAM

## Estado actual: CODEBASE COMPLETO, sin ejecutar todavía

### Archivos generados (todos escritos en disco)

```
grocerylist/
├── SETUP.md                          ← instrucciones de arranque
├── backend/
│   ├── package.json                  ← incluye serverless-dynamodb-local
│   ├── serverless.yml                ← 4 Lambdas + API GW + DynamoDB table
│   ├── tsconfig.json
│   └── src/
│       ├── db.ts                     ← detecta IS_LOCAL, apunta a localhost:8000
│       └── handlers/
│           ├── getList.ts            ← GET  /list/{token}
│           ├── addItem.ts            ← POST /list/{token}/items
│           ├── updateItem.ts         ← PUT  /list/{token}/items/{id}
│           └── deleteItem.ts         ← DELETE /list/{token}/items/{id}
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts                ← proxy /api → localhost:3000
    ├── index.html
    ├── .env.example
    └── src/
        ├── main.tsx
        ├── App.tsx                   ← lee token de URL /list/{token}
        ├── api.ts                    ← fetch helpers (get/add/toggle/delete)
        ├── index.css                 ← estilos mobile-first
        └── components/
            ├── ShoppingList.tsx      ← contenedor principal
            ├── AddItemForm.tsx       ← input + botón añadir
            └── ShoppingItem.tsx      ← fila: checkbox + nombre + borrar
```

## Stack local (3 terminales)
```
Terminal 1: cd backend && npm run dynamodb:install  (solo 1a vez)
Terminal 2: cd backend && npm run dev               (serverless offline, puerto 3000 + DynamoDB Local puerto 8000)
Terminal 3: cd frontend && npm run dev              (Vite, puerto 5173)
```
URL de prueba: http://localhost:5173/list/familia-2024

## Decisiones clave
- Sin AWS por ahora — el usuario quiere probar todo en local primero
- DynamoDB Local usa inMemory: true (datos se borran al reiniciar, ok para dev)
- IS_OFFLINE=true lo inyecta serverless-offline automáticamente → db.ts lo detecta
- El token en la URL ES el identificador de lista (no hay auth, por diseño)
- Optimistic updates en el frontend (toggle se refleja antes de que responda el servidor)

## Próximos pasos (en orden)
1. [ ] `cd backend && npm install` — instala dependencias
2. [ ] `npm run dynamodb:install` — descarga DynamoDB Local (Java requerido)
3. [ ] `npm run dev` — arranca serverless offline + DynamoDB Local
4. [ ] `cd frontend && npm install && npm run dev` — arranca Vite
5. [ ] Probar en http://localhost:5173/list/test
6. [ ] Si todo funciona → decidir si hacer deploy a AWS

## Posibles problemas conocidos
- `dynamodb:install` requiere Java instalado (`java -version` para verificar)
- Si Java no está: alternativa es usar Docker (`docker run -p 8000:8000 amazon/dynamodb-local`)
- Puerto 3000 ocupado: cambiar en serverless.yml `custom.dynamodb.start.port`
- CORS: ya configurado en cada handler con `Access-Control-Allow-Origin: *`

## Contexto del proyecto
Experimento de desarrollo rápido con AI. El objetivo es medir cuánto se puede
construir con AI como herramienta principal. MVP intencional: sin auth, sin
websockets, sin microservicios. Lista compartida vía token en URL.
