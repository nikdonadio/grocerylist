# MASTER PROMPT — AI-Driven MVP Development

You are a senior full-stack engineer.

Your task is to generate a complete production-ready **MVP codebase** for a Family Shopping List App using **AWS serverless architecture**, optimized for **maximum speed of development using AI assistance**.

## IMPORTANT CONTEXT

This project is NOT a traditional software project.

It is also an experiment in:

> Rapid application development using AI as the primary coding tool.

The goal is to minimize manual coding and maximize AI-generated implementation quality.

Repo : c:\projects\grocery_list
SCMS : gh
Main spec: c:\projects\grocery_list\specs\spec.md

---

# PRODUCT GOAL

A single shared family shopping list:

* Everyone adds items
* In-store users check/cross items when purchased
* All users see updated list on refresh
* No authentication
* Access via secret token in URL

---

# CORE REQUIREMENTS (MVP v1)

## Functional

* Access list via `/list/{accessToken}`
* Add item
* Toggle item (checked/un-checked)
* Delete item
* Refresh fetches latest state

## Non-functional

* No real-time sync (no WebSockets)
* Eventual consistency acceptable
* Last write wins
* Mobile-first UI
* Extremely simple architecture

---

# TECH STACK (MANDATORY)

## Frontend

* React + TypeScript
* Vite
* Simple responsive UI (mobile-first)
* No UI framework required unless necessary

## Backend

* Node.js (TypeScript)
* AWS Lambda
* API Gateway
* DynamoDB

## Infrastructure

* Serverless deployment (AWS)
* Prefer AWS SAM or Serverless Framework

---

# ARCHITECTURE RULES

* Keep architecture minimal
* Avoid over-engineering
* No microservices
* No authentication system
* Single list model
* Access controlled ONLY via accessToken in URL

---

# OUTPUT EXPECTATIONS

Generate:

1. Full repository structure
2. Frontend implementation
3. Backend Lambda functions
4. API Gateway routes
5. DynamoDB schema
6. Infrastructure definition
7. Basic deployment instructions

---

# DEVELOPMENT STYLE

* Prefer simple code over abstract design
* Avoid unnecessary patterns
* Avoid over-modularization
* Optimize for readability and fast iteration
* Assume future refactoring will happen later

---

# CRITICAL OPTIMIZATION GOAL

The success metric is:

> "Can this be built and deployed in < 1–2 days using AI-assisted development?"

Not scalability.

Not perfection.

Not extensibility.

---

# IMPORTANT CONSTRAINT

Do NOT introduce:

* Authentication
* User accounts
* Complex permissions
* Real-time sync
* Event sourcing
* CQRS
* Microservices

Keep it intentionally minimal.

---

# FINAL INSTRUCTION

Generate the complete working system, not partial snippets.
