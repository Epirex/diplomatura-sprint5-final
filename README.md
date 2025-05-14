
# 🌎 PaisesApp

Aplicación web desarrollada con **Node.js**, **Express**, **MongoDB** y **EJS** que permite administrar un listado de países hispanohablantes. Implementa operaciones **CRUD completas** y un formulario de contacto.

---

## 🚀 Tecnologías utilizadas

- **Node.js** + **Express**
- **MongoDB** (usando **Mongoose**)
- Motor de vistas **EJS**
- Arquitectura **MVC** + capas:
  - Repositorio
  - Servicio
  - Controlador
- **Method-Override** para métodos PUT y DELETE
- **Bootstrap** para estilos en vistas

---

## 🗂 Estructura del proyecto

```
src/
├── config/             # Conexión a base de datos
├── controllers/        # Lógica de control (rutas → servicios)
├── models/             # Esquemas Mongoose
├── repositories/       # Acceso a datos
├── routes/             # Rutas Express
├── services/           # Lógica de negocio
├── utils/              # Validaciones
├── views/              # Vistas EJS
├── public/             # Archivos estáticos (CSS, imágenes)
app.mjs                 # Configuración principal del servidor
```

---

## 📌 Funcionalidades principales

- Listar todos los países
- Agregar un nuevo país
- Editar país existente
- Eliminar país
- Enviar formulario de contacto
- API JSON para integración externa

---

## 🛠 Cómo ejecutar

1. Clona el repositorio:

```bash
git clone https://github.com/Epirex/diplomatura-sprint5-final.git
cd diplomatura-sprint5-final
```

2. Instala dependencias:

```bash
npm install
```

3. Crea un archivo `.env` con tu URI de MongoDB:

```env
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/NombreDB
```

4. Inicia el servidor:

```bash
npm start
```

5. Abre el navegador en: [http://localhost:3000](http://localhost:3000)

---
