```md
# GroceryList Backend – Setup & Decision Log

## 1. Qué tenemos instalado

- Node.js (runtime para backend Serverless)
- npm / npx
- AWS CLI (para interacción con DynamoDB local)
- Docker Desktop
- Amazon DynamoDB Local (en contenedor Docker)
- Serverless Framework
- Serverless Offline
- Proyecto backend Node.js (Lambda + API Gateway emulado)

## 2. Cómo se instaló

### Base tooling
- Instalación de Node.js (LTS recomendado)
- Instalación de AWS CLI
- Instalación de Docker Desktop
- Instalación global de Serverless Framework:
  - npm install -g serverless

### Proyecto
- serverless create para bootstrap del proyecto
- npm install para dependencias
- instalación de serverless-offline

### DynamoDB Local
- ejecución con Docker:
  docker run -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -inMemory -sharedDb


## 3. Problemas encontrados y decisiones

### DynamoDB Local (Docker)
Problema:
- Errores con flags incompatibles según imagen (-sharedDb, -jar)

Decisión:
- Usar imagen oficial amazon/dynamodb-local
- Ejecutar en modo in-memory para simplificar desarrollo

---

### Versiones Node / AWS SDK
Problema:
- Incompatibilidad entre AWS SDK v2 y v3 en ejemplos y código existente

Decisión:
- Estandarizar en AWS SDK v3 (@aws-sdk/client-dynamodb)
- Evitar SDK v2 completamente

---

### Serverless Offline vs AWS real
Problema:
- Diferencias entre ejecución local y comportamiento real de Lambda/API Gateway
- Confusión sobre qué runtime estaba activo

Decisión:
- Desarrollo estándar:
  - API: serverless offline
  - DB: DynamoDB Local en Docker

---

### Endpoint DynamoDB
Problema:
- client.config.endpoint no apuntaba correctamente a http://localhost:8000
- fallback implícito a AWS real en algunos casos

Decisión:
- Forzar endpoint explícito en local:
  endpoint: http://localhost:8000
- Separar config por entorno (local/dev/prod)

---

### Persistencia DynamoDB Local
Problema:
- Datos no persistían entre reinicios (in-memory)

Decisión:
- Aceptado uso de in-memory para desarrollo rápido
- Re-creación manual de tablas cuando sea necesario


## 4. Estado final del sistema

- API REST funcionando con serverless offline en http://localhost:3000
- Lambdas Node.js ejecutándose localmente
- DynamoDB Local en Docker en http://localhost:8000
- AWS CLI apuntando a endpoint local para debug
- Conexión Lambda ↔ DynamoDB estable
- Tabla grocerylist-dev creada y accesible

## 5. Resultado

- GET /dev/list/{id} funcionando correctamente
- Persistencia operativa en entorno local (con limitaciones de in-memory)
- Entorno completamente reproducible:
  - Docker (DB)
  - Serverless Offline (API)
  - Node.js + AWS SDK v3 (backend)
```
