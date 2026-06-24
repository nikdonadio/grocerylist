# setup-log.md

# SETUP LOG — instalación y configuración (paso a paso real)

Fecha: 2026-06-24  
Sistema: Windows 11  
Proyecto: grocerylist (AWS Serverless + DynamoDB Local)

---

# 1. INSTALACIÓN DE HERRAMIENTAS

## 1.1 Node.js

- Versión instalada: v24.18.0
- Instalación:
  - Opción elegida: “prebuilt for Windows x64”
  - Instalado directamente en Windows (no Docker)

Verificación:
- `node -v` → OK
- `npm -v` → OK

---

## 1.2 Git

- Versión: 2.48.1.windows.1
- Instalado previamente en sistema
- Sin configuración adicional requerida

Verificación:
- `git --version` → OK

---

## 1.3 AWS CLI

- Versión: aws-cli/2.35.11
- Instalado en Windows (installer oficial AWS CLI v2)
- Python embebido (automático por installer)

Verificación:
- `aws --version` → OK

Configuración:
- `aws configure` ejecutado
- region: `eu-west-1`
- credentials: dummy/local (no AWS real en uso activo)

---

## 1.4 Serverless Framework

- Instalación vía npm global:
  - `npm install -g serverless`

- Versión instalada:
  - Serverless Framework v4.38.1

Verificación:
- `serverless --version` → OK

---

## 1.5 Docker Desktop

- Instalado y activo en Windows
- Usado para ejecutar DynamoDB Local

Imagen utilizada:
- `amazon/dynamodb-local`

Container:
- expone puerto `8000`

Estado:
- container activo y corriendo

---

# 2. INFRA LOCAL (DOCKER)

## 2.1 DynamoDB Local

Ejecución:

- Imagen: amazon/dynamodb-local
- Puerto: 8000

Estado:
- container corriendo correctamente
- accesible vía `http://localhost:8000`

---

## 2.2 Tabla DynamoDB

Creación manual con AWS CLI:

- Tabla: `grocerylist-dev`
- Key schema:
  - partition key: `accessToken`
  - sort key: `itemId`

Comando ejecutado:

- create-table contra endpoint local (Docker)

Estado:
- tabla creada correctamente
- confirmada con `list-tables`

---

# 3. BACKEND / SERVERLESS

## 3.1 Inicialización proyecto

- Node project inicializado con npm
- Estructura creada:
  - backend/
  - src/
  - handlers/
  - serverless.yml

---

## 3.2 Dependencias instaladas

- AWS SDK v3:
  - @aws-sdk/client-dynamodb
  - @aws-sdk/lib-dynamodb

- Serverless plugins:
  - serverless-offline
  - serverless-plugin-typescript

- utilidades:
  - uuid
  - types node / aws-lambda

---

## 3.3 Serverless Offline

- Ejecutado con `npx serverless offline`
- API Gateway simulado en:
  - http://localhost:3000

- Lambdas disponibles:
  - getList
  - addItem
  - updateItem
  - deleteItem

---

# 4. ESTADO ACTUAL DEL SISTEMA

## Componentes funcionando:

- Node.js ✔
- npm ✔
- Git ✔
- AWS CLI ✔
- Serverless Framework ✔
- Docker ✔
- DynamoDB Local ✔
- Serverless Offline ✔
- Lambda execution ✔

---

# 5. PROBLEMA ACTUAL

## Error observado: 

Cada request al endpoint:  GET /dev/list/{token}

produce:  ResourceNotFoundException: Cannot do operations on a non-existent table

---

## Estado del error:

- Lambda ejecuta correctamente ✔
- Variables de entorno correctas ✔
- Tabla existe en DynamoDB Local ✔
- AWS CLI puede leer tabla ✔
- DynamoDB Local accesible ✔

---

## Problema identificado:

El SDK de AWS dentro del runtime serverless-offline:

- no está resolviendo correctamente el endpoint de DynamoDB Local
- produce inconsistencia entre cliente y tabla existente

---

# 6. ESTADO FINAL

## Infraestructura:

✔ completamente montada en local  
✔ todos los servicios activos  

## Estado funcional:

❌ integración Lambda → DynamoDB no funcional todavía  

---

# 7. PRÓXIMO PASO

Pendiente:

- reset limpio del entorno
- validación de conexión correcta entre:
  - serverless-offline
  - DynamoDB Local
  - AWS SDK v3

---

# FIN DEL LOG