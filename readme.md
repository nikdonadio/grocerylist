# Family Shopping List App (AI-First MVP Experiment)

## Purpose

This project has two objectives:

### 1. Product Objective

A minimal shared shopping list for families:

* Add items collaboratively
* Check items while shopping
* Shared via a secret URL
* No login, no accounts

### 2. Engineering Experiment Objective

This project is also a controlled experiment in:

> **Rapid software development using AI as the primary implementation tool**

The goal is to evaluate:

* How fast a full-stack serverless application can be built using AI assistance
* How much manual coding is actually required
* How reliable AI-generated architectures are in real deployment scenarios
* Whether AI-first development can replace traditional incremental engineering workflows for MVPs

---

## Core Idea

* Minimize manual coding
* Maximize AI-generated implementation
* Iterate via prompts instead of direct development
* Treat AI as primary engineer, not assistant

---

## MVP Scope

### Included

* Single shared shopping list
* Access via secret token in URL
* Add / update / delete items
* Mark items as purchased
* Refresh-based synchronization

### Excluded

* Authentication
* User accounts
* Roles or permissions
* Real-time sync
* Offline mode
* Analytics
* Product catalog

---

## Architecture

* Frontend: React + TypeScript + Vite
* Backend: AWS Lambda (Node.js / TypeScript)
* API Gateway
* DynamoDB
* Serverless deployment (AWS SAM or Serverless Framework)

---

## Sync Model

* Eventual consistency
* No real-time updates
* Last write wins
* Refresh-based updates

---

## Access Model

* Single shared list
* Access controlled via secret `accessToken` in URL

Example:

```
/list/{accessToken}
```

---

## Success Criteria

The project is successful if:

* It can be fully built and deployed using AI-assisted development
* A real family can use it in grocery shopping scenarios
* The system remains simple and maintainable
* Development time is significantly reduced compared to traditional workflows

---

## Non-Goals

* Production-scale architecture
* Enterprise security model
* Multi-tenant SaaS design
* Complex domain modeling

---

## License

This project is experimental and intended for learning purposes.
