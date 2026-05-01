# 🧠 RAG Knowledge Base — Customer CRM API

Este documento define la base de conocimiento utilizada por el asistente inteligente del sistema **CRM – Sistema de Gestión de Clientes**.

Su propósito es servir como fuente de contexto para un sistema RAG (Retrieval-Augmented Generation), permitiendo que el asistente responda preguntas sobre las funcionalidades reales del sistema sin inventar información.

---

## 📌 Alcance

Este documento incluye únicamente:

* Funcionalidades reales del sistema
* Endpoints disponibles en la API
* Descripción de cada operación

No incluye:

* Lógica interna de base de datos
* Implementaciones técnicas del backend
* Funcionalidades no desarrolladas

---

## 🔐 1. Autenticación

### Registro de usuario

* **Endpoint:** `POST /api/auth/register`
* **Descripción:** Permite crear un nuevo usuario en el sistema.

---

### Inicio de sesión

* **Endpoint:** `POST /api/auth/login`
* **Descripción:** Autentica al usuario y retorna un token JWT.

---

### Perfil del usuario

* **Endpoint:** `GET /api/auth/profile`
* **Descripción:** Retorna la información del usuario autenticado.

---

## 👤 2. Clientes

### Crear cliente

* **Endpoint:** `POST /api/clients`
* **Descripción:** Registra un nuevo cliente con datos básicos.

---

### Listar clientes

* **Endpoint:** `GET /api/clients`
* **Descripción:** Permite consultar clientes con filtros.

---

### Ver cliente

* **Endpoint:** `GET /api/clients/{id}`
* **Descripción:** Obtiene el detalle completo de un cliente.

---

### Actualizar cliente

* **Endpoint:** `PUT /api/clients/{id}`
* **Descripción:** Modifica la información de un cliente existente.

---

### Desactivar cliente

* **Endpoint:** `PATCH /api/clients/{id}/deactivate`
* **Descripción:** Realiza un soft delete del cliente.

---

### Exportar clientes

* **Endpoint:** `GET /api/clients/export/csv`
* **Descripción:** Genera un archivo CSV con la información de clientes.

---

## 📇 3. Contactos

### Crear contacto

* **Endpoint:** `POST /api/contacts`
* **Descripción:** Registra un contacto vinculado a un cliente.

---

### Listar contactos por cliente

* **Endpoint:** `GET /api/contacts/client/{clienteId}`
* **Descripción:** Obtiene todos los contactos asociados a un cliente.

---

## 💼 4. Oportunidades

### Crear oportunidad

* **Endpoint:** `POST /api/opportunities`
* **Descripción:** Registra una nueva oportunidad de negocio.

---

### Avanzar etapa de oportunidad

* **Endpoint:** `PATCH /api/opportunities/{id}/stage`
* **Descripción:** Actualiza la etapa de la oportunidad en el pipeline de ventas.

---

### Listar oportunidades por cliente

* **Endpoint:** `GET /api/opportunities/client/{clienteId}`
* **Descripción:** Consulta oportunidades asociadas a un cliente.

---

## 📝 5. Actividades

### Registrar actividad

* **Endpoint:** `POST /api/activities`
* **Descripción:** Registra una interacción con un cliente (llamada, reunión, correo, nota).

---

### Listar actividades

* **Endpoint:** `GET /api/activities`
* **Descripción:** Obtiene el historial de actividades registradas.

---

## 📊 6. Dashboard

### Resumen de métricas

* **Endpoint:** `GET /api/dashboard/summary`
* **Descripción:** Retorna KPIs del sistema como:

  * Clientes activos
  * Oportunidades abiertas
  * Valor total del pipeline

---

## 🤖 Reglas del Asistente IA

El asistente que utiliza este documento debe cumplir las siguientes reglas:

* Responder únicamente con base en esta información
* No inventar endpoints ni funcionalidades
* Explicar claramente cómo usar cada endpoint
* Mantener consistencia con la API real
* Si una funcionalidad no existe, responder:

```text
Esa funcionalidad no está disponible en el sistema actual
```

---

## 🚀 Uso en RAG

Este documento debe:

1. Ser dividido en fragmentos (chunks)
2. Convertirse en embeddings
3. Almacenarse en una base vectorial
4. Ser utilizado como contexto en consultas del asistente

---

## 🧩 Notas

* Este documento representa la fuente de verdad del asistente
* Debe actualizarse cada vez que se agregue un nuevo endpoint
* Mantiene alineación con la arquitectura hexagonal del sistema

---
