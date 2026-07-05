# SPEC — Grocery List App

> Este documento define **qué es el producto ahora mismo**: requisitos, stack
> vigente, endpoints, arquitectura. El *cómo trabajamos* (branching, Jira,
> disciplina de commits) vive en `docs/MASTER PROMPT - AI-Driven MVP Dev.md`, no acá.

---

## 1. Product goal

Una lista de compras familiar compartida:

- Todos pueden agregar ítems
- Los que están en el súper marcan/tildan ítems al comprarlos
- Todos ven el estado actualizado al refrescar
- Sin autenticación
- Acceso vía token secreto en la URL

---

## 2. Requisitos

### Funcionales

- Acceder a la lista vía `/list/{accessToken}`
- Agregar ítem
- Marcar/desmarcar ítem (checked/unchecked)
- Eliminar ítem
- Refrescar trae el estado más reciente

### No funcionales

- Sin sincronización en tiempo real (sin WebSockets)
- Consistencia eventual aceptable
- Last write wins
- UI mobile-first
- Arquitectura extremadamente simple

---

## 3. Estado actual — despliegue en producción

| Componente | Detalle |
|---|---|
| Backend | Node.js + Express + TypeScript — `grocerylist-production-ddd6.up.railway.app` |
| Frontend web | React + Vite + TypeScript — `brave-stillness-production-483f.up.railway.app` |
| Mobile | React Native + Expo SDK 54, APK vía EAS Build, instalada nativamente en Android (app ID `app.grocerylist.family`) |
| Base de datos | PostgreSQL en Railway (Amsterdam) |
| Hosting | Railway (los 3 servicios + Postgres) |

> Nota: el stack originalmente planeado era AWS Lambda + API Gateway +
> DynamoDB + SAM/Serverless. Ese plan se abandonó — ver contexto completo en
> `docs/MASTER PROMPT - AI-Driven MVP Dev.md` sección 2. Este `spec.md` refleja únicamente el
> stack **vigente**.

### Funcionalidad mobile implementada

CRUD completo vía `TokenScreen` + `ListScreen`; separación visual de ítems
pendientes vs. en el carrito; persistencia del token en AsyncStorage;
estados de carga por ítem; retry seguro en toggle (no en add, para evitar
duplicados); auto-refresh ante fallo al agregar; nombre de la lista mostrado
en el header.

---

## 4. Backend — endpoints

```
GET    /list/:accessToken
POST   /list/:accessToken/items        body: { name: string }
PUT    /list/:accessToken/items/:id    body: { checked?: boolean, name?: string }
DELETE /list/:accessToken/items/:id
```

---

## 5. Reglas de arquitectura

> Principios generales de estilo de código (simplicidad, evitar
> sobre-ingeniería) viven en `docs/MASTER PROMPT - AI-Driven MVP Dev.md` §1. Acá solo las
> restricciones concretas de este producto.

- Sin microservicios
- Sin sistema de autenticación, sin cuentas de usuario, sin permisos complejos
- Modelo de lista única
- Acceso controlado ÚNICAMENTE vía `accessToken` en la URL
- No introducir: cuentas de usuario, permisos complejos, sync en tiempo real,
  event sourcing, CQRS, microservicios

---

## 6. Decisiones técnicas ya tomadas (aplican hacia adelante)

- **Retry asimétrico:** retry es seguro en `toggle` (idempotente) pero causó
  ítems duplicados en `addItem` → se sacó el retry de add y se agregó
  auto-refresh para que el usuario vea el estado real tras una falla de red
- **Offline strategy:** distinguir "modo lista" (colaborativo, buena señal) de
  "modo compra" (usuario solo en el súper, señal mala) — offline-first debería
  aplicar solo al modo compra, no al modo lista
- **Diagnóstico de red:** la inestabilidad vista en Expo Go se debía a un
  doble salto de extensores WiFi, no al código — confirmado ausente con la
  APK nativa conectando directo a Railway. No re-investigar esto como bug de
  código si vuelve a aparecer en contexto similar.

---

## 7. Roadmap / backlog vigente

Backlog estructurado en Jira, proyecto GL: 7 épicas, ~25 tareas (GL-8 a
GL-32). Prioridad para próximas sesiones:

1. Renombrar app de "mobile" a "Lista de Compras" + ícono de carrito
2. Sección de "en el carrito" colapsable
3. Swipe para marcar múltiples ítems
4. Validación de duplicados al ingresar ítems (case/espacio-insensitive)
5. Cambio rápido entre 2–3 listas favoritas guardadas (AsyncStorage)
6. Ordenamiento de ítems
7. Estado "No hay" (sin stock) como tercer estado de ítem
8. Categorías fijas con persistencia entre listas
9. Actualización del README reflejando el stack actual

### Decisiones de diseño — resueltas

Las 3 decisiones marcadas como `[Decision]` en Jira (estado "No hay",
categorías fijas JSON vs. tabla, persistencia de listas favoritas) ya fueron
respondidas y cerradas en los comentarios de sus tickets respectivos. Falta
sincronizar el detalle de cada decisión a este spec — pendiente para una
próxima revisión conjunta, no bloquea el resto de este documento.

### Findings de CodeRabbit diferidos (pendientes de resolver)

- Retry logic en `toggle` no distingue error de red vs. error HTTP
- Fallas de AsyncStorage bloquean actualizaciones de estado de auth en
  `App.tsx`

---

> Instrucciones de cómo entregar el trabajo (sistema completo vs. snippets
> parciales, disciplina de cambios) viven en `docs/MASTER PROMPT - AI-Driven MVP Dev.md` §3 y §8.
> No se repiten acá para evitar contradicciones.
