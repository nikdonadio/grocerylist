# MASTER PROMPT — Grocery List — Proceso de desarrollo AI-driven

> Este documento define **cómo trabajamos**, no qué es el producto. El producto
> (stack vigente, requisitos, endpoints, arquitectura) vive en `specs/spec.md`.
> Ver sección 0 para la jerarquía completa de documentos.

---

## 0. Jerarquía de documentos — quién manda en qué

Para evitar contradicciones, cada documento tiene una única responsabilidad y
no debería repetir contenido de los otros (a lo sumo, referenciarlos).

| Documento | Responde a... | Se actualiza | Se lee |
|---|---|---|---|
| **Project Instructions** (texto del proyecto en Claude) | Espejo resumido de este archivo — proceso, disciplina, convenciones | Cuando cambia el proceso | Siempre, automático en cada sesión |
| **`docs/MASTER PROMPT - AI-Driven MVP Dev.md`** (este archivo) | Versión completa y versionada en el repo de lo anterior | Junto con Project Instructions | Al auditar/versionar el proceso |
| **`specs/spec.md`** | Qué es el producto *ahora*: requisitos, stack vigente, endpoints, reglas de arquitectura | Cuando cambia el *producto* | Al arrancar una sesión de desarrollo |
| **`docs/bitacora.md`** | Cuándo y por qué cambió algo — decision log cronológico, append-only | Se agrega **una entrada al cerrar cada sesión** | **No se abre de entrada en cada sesión.** Se abre solo para agregar la entrada de cierre, o para investigar el "por qué" de una decisión pasada |
| **`docs/session-logs/*`** | Snapshots puntuales de sesiones viejas (discontinuos, ya no se generan) | No se actualizan más desde ahora | Histórico únicamente |

**Regla de oro:** si un dato es "qué hace el producto hoy" → solo en `spec.md`.
Si es "cómo trabajamos" → solo acá. Si es "por qué decidimos X en tal fecha" →
solo en `bitacora.md`.

---

## 1. Contexto y propósito del experimento

Este proyecto no es un desarrollo de software tradicional. Es también un
experimento en:

> Desarrollo rápido de aplicaciones usando IA como herramienta principal de
> implementación.

El objetivo es minimizar el código manual y maximizar la calidad de lo
generado con asistencia de IA. La métrica de éxito es velocidad y calidad de
desarrollo asistido, no escalabilidad ni perfección arquitectónica.

**Estilo de desarrollo:**
- Preferir código simple sobre diseño abstracto
- Evitar patrones innecesarios y sobre-modularización
- Optimizar por legibilidad e iteración rápida
- Asumir que el refactor futuro va a pasar; no diseñar para eso ahora

---

## 2. Nota histórica — por qué no es AWS Lambda/DynamoDB

El plan original de este proyecto especificaba AWS Lambda + API Gateway +
DynamoDB + SAM/Serverless Framework. Ese camino se abandonó por bloqueos de
verificación de cuenta de AWS, y el proyecto migró a Railway (sin tarjeta de
crédito, autodeploy desde GitHub). Un test temprano en DynamoDB mostró además
un problema de diseño de esquema (tabla con solo partition key, sin sort key,
causando que los ítems se pisaran entre sí).

La rama `legacy-aws` se conserva como snapshot congelado del stack original,
por si en el futuro se retoma esa línea. El stack vigente está en `spec.md`.

---

## 3. Branching y control de versiones

### 3.1 Disciplina de tamaño de cambio

- Nunca implementar cambios grandes en un solo paso
- Cada commit representa un cambio atómico y funcional
- Si una tarea afecta múltiples capas (API, DB, infra, config), dividirla en
  pasos secuenciales

### 3.2 Límite de scope — pausa y confirmación

Reemplaza la regla genérica de "más de 5 archivos" por un límite dinámico
**por componente**, dado que el PR-por-épica + revisión de CodeRabbit ya actúa
como gate general, pero conviene un límite más bajo en las capas de mayor
riesgo:

| Componente | Umbral individual | Motivo |
|---|---|---|
| Backend (server) | > 5 archivos modificados en un mismo paso | Capa madura, ya probada |
| Frontend Web | > 5 archivos | Capa madura, ya probada |
| Mobile | > 3 archivos | Sin experiencia previa en mobile — conviene ir más despacio |
| Cross-componente (ej: backend + mobile en el mismo paso) | > 3 archivos **totales**, y se pausa siempre para confirmar el approach antes de tocar el segundo componente | Tocar dos capas a la vez es más riesgoso que tocar una sola aunque cada una esté dentro de su límite |

Además, pausar y pedir confirmación si:
- se está por reescribir lógica existente en vez de extenderla
- hay una decisión de diseño pendiente marcada como `[Decision]` en Jira

### 3.3 Entrega incremental

- Preferir agregar código nuevo sobre modificar el existente
- Aislar migraciones (DB, API, infra) en pasos separados
- El sistema debe quedar siempre "runnable" después de cada commit

### 3.4 Higiene de commits

- Cada commit debe compilar/correr lógicamente (sin estados intermedios rotos)
- Mensaje claro describiendo una sola intención
- Nunca mezclar refactor + feature en el mismo commit

### 3.5 Regla de seguridad

Ante duda de dirección o riesgo: preguntar antes de implementar, y preferir la
implementación mínima segura sobre un refactor completo.

Optimizar siempre por: claridad, reversibilidad, revisabilidad, diffs chicos.

---

## 4. Reglas Jira — proyecto GL

1. **Tickets en progreso:** al iniciar trabajo en un ticket, moverlo a "En
   progreso" junto con su épica padre.
2. **Tickets completados:** al terminar un ticket, moverlo a "Hecho" antes de
   pasar al siguiente.
3. **Correcciones de code review:** si CodeRabbit (u otra revisión) detecta
   issues en un PR, crear un ticket nuevo en Jira, asignarlo a la épica
   correspondiente, y trabajarlo antes de mergear. Filosofía: *"el reviewer
   revisa, nosotros implementamos"*.
4. **Cierre de épica:** una épica se cierra cuando todos sus tickets hijos
   están en "Hecho" y el PR correspondiente fue mergeado a `main`.
5. **Convención de nombres** (vinculación GitHub ↔ Jira):

   | Elemento | Convención | Ejemplo |
   |---|---|---|
   | Rama | `GL-##-descripcion-corta` | `GL-8-nombre-app` |
   | Commit | `GL-##: descripción del cambio` | `GL-8: cambiar nombre a Lista de Compras` |
   | PR | `GL-## GL-##: descripción` | `GL-8 GL-9: mobile polish - nombre e icono` |

6. **Flujo de PR por épica:**
   - Se trabajan todos los tickets de la épica en `dev-railway`
   - Al terminar: PR `dev-railway → main`, título referenciando todos los
     `GL-##` de la épica
   - CodeRabbit revisa; findings van a tickets nuevos (regla 3)
   - PR verde → merge → autodeploy Railway / EAS Build según corresponda
   - Épicas grandes (backend + web + mobile) pueden partirse en un PR por
     capa, a criterio de la sesión

---

## 5. Entorno de desarrollo

- **Comunicación:** español, sesiones guiadas paso a paso
- **Terminal:** PowerShell en Windows — usar `curl.exe` explícitamente (no
  `curl`, que en PowerShell aliasea a `Invoke-WebRequest`)
- **Rutas de archivo:** estilo Windows con backslash (`C:\Projects\grocerylist\...`)
- **Repo:** `C:\Projects\grocerylist` / `github.com/nikdonadio/grocerylist`
  (monorepo: `backend/`, `frontend/`, `mobile/`)
- **SCM:** `gh` CLI — los cuerpos de PR multilínea fallan en PowerShell con
  `gh`; en esos casos usar el flujo web de GitHub
- **Testing:** Playwright para e2e (frontend); suite de integración con
  llamadas HTTP reales para backend
- **Mobile:** sin experiencia previa en desarrollo mobile — guía paso a paso
  completa en tareas específicas de esa capa

---

## 6. Bitácora — cómo se usa

`docs/bitacora.md` es un **decision record cronológico, append-only**. No es
un documento de lectura habitual: no se abre al arrancar una sesión.

- Se agrega **una entrada al cerrar cada sesión de trabajo**, resumiendo qué
  cambió y por qué (decisiones tomadas, pivotes, hallazgos técnicos)
- Se abre fuera de eso solo para investigar el contexto histórico de una
  decisión pasada
- Los `docs/session-logs/*` viejos (discontinuos) se dejan como están; desde
  ahora ese contenido se vuelca directamente en la bitácora al cerrar sesión,
  no se generan más logs de sesión sueltos

---

## 7. Herramientas y accesos

- **Hosting:** Railway (backend, frontend, PostgreSQL)
- **Mobile builds:** EAS Build (Expo Application Services)
- **Jira:** proyecto GL —
  `nicolasdonadio.atlassian.net/jira/software/projects/GL/boards/34`
  - Cloud ID: `nicolasdonadio.atlassian.net`
  - Tipo de issue para tareas: `"Tarea"` (localización en español); épicas:
    `"Epic"`
  - Vinculación de tarea hija a épica: `{'parent': {'key': 'GL-X'}}` en
    `additional_fields`
  - Integración GitHub ↔ Jira activa vía "GitHub for Jira" (backfill
    completado)
- **Code review:** CodeRabbit
- **MCP tools:** Filesystem MCP (leer/escribir/editar archivos), Atlassian
  Rovo (Jira)

---

## 8. Instrucción final

Al generar código o cambios: generar el sistema completo y funcional para el
alcance del ticket, no snippets parciales. El detalle de qué construir vive en
`specs/spec.md`.
