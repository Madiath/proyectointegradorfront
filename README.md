# Proyecto Integrador — Frontend

Aplicación web para la gestión de una clínica médica. Permite administrar pacientes, médicos, turnos, historial clínico, insumos, recipe y notificaciones en tiempo real.

---

## Requisitos previos

- Node.js 18 o superior
- El backend corriendo en `https://localhost:7128` (ver README del backend)

---

## Pasos para ejecutar

**1. Instalar dependencias**

```bash
cd ProyectoIntegradorFront
npm install
```

**2. Verificar la URL del backend**

Abrí `src/Services/config.js` y confirmá que apunte al backend:

```js
const API_BASE_URL = 'https://localhost:7128'
```

**3. Iniciar en modo desarrollo**

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

---

## Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@clinica.com | Admin123! |

> El usuario administrador se crea automáticamente al levantar el backend por primera vez.
