# Sistema de Gestión de Productos con PHP MVC

Proyecto desarrollado con **PHP nativo** y arquitectura **MVC (Modelo-Vista-Controlador)**, implementando un panel de administración seguro con operaciones CRUD completas, gestión de categorías y autenticación de usuario. Diseñado para escalabilidad y mantenibilidad del código.

## 🛠️ **Stack Tecnológico**

### **Frontend**
- **HTML5** + **CSS3** → Maquetado semántico y estilos personalizados.
- **Bootstrap 5** → Diseño responsive y componentes UI optimizados.
- **JavaScript** → Validaciones de formularios e interacciones dinámicas.

### **Backend**
- **PHP puro** (Procedural + OOP) → Lógica de negocio y seguridad.
- **MySQL** → Base de datos relacional con relaciones `1:N` (productos ↔ categorías).
- **PHPMailer** → Envío de notificaciones por correo electrónico (ej. restablecimiento de contraseña).

### **Arquitectura**
- **Patrón MVC**:
  - **Modelo**: Clases PHP para acceso a datos (`JOIN`, transacciones SQL).
  - **Vista**: Templates reutilizables (HTML/PHP) sin lógica de negocio.
  - **Controlador**: Manejo de rutas y validaciones.

## 📊 **Estructura del Proyecto**

```
public/
├── backend/
│   ├── config/         # Configuraciones de base de datos y conexiones
│   ├── controllers/    # Controladores para manejar lógica de rutas
│   ├── models/         # Modelos de datos para interacción con base de datos
│   └── routes/         # Definición de rutas del sistema
│
├── frontend/
│   ├── assets/         # Recursos estáticos (CSS, JS, imágenes)
│   ├── pages/          # Páginas y vistas del sistema
│   └── uploads/        # Directorio para archivos subidos por usuarios
│
├── index.html          # Punto de entrada principal
└── .htaccess           # Configuraciones del servidor web
```

## 🔥 **Funcionalidades Clave**

### **Panel de Administración**
- **Autenticación Segura**:
  - Único rol: **Administrador**.
  - Cambio de credenciales (email/contraseña) con hash bcrypt.
  - Bloqueo tras intentos fallidos.

- **Gestión de Productos**:
  - CRUD completo (Crear, Leer, Actualizar, Eliminar).
  - Subida de imágenes con validación (tamaño/formato).
  - Filtrado avanzado por categorías (`SELECT` con `JOIN`).

- **Gestión de Categorías**:
  - Asignación dinámica de productos a categorías.
  - Edición en cascada (actualización automática en productos vinculados).

### **Consultas SQL Avanzadas**
- Uso de `INNER JOIN` para relaciones producto-categoría.
- Consultas parametrizadas para prevenir inyecciones SQL.
- Paginación con `LIMIT` y `OFFSET`.

## 🚀 **Relevancia para el Mundo Real**
- **Seguridad**: Hash de contraseñas, sanitización de inputs.
- **Escalabilidad**: Código modular fácil de extender (ej. añadir más roles).
- **Optimización**: Consultas SQL eficientes para grandes volúmenes de datos.

> ✨ **Nota**: Ideal para negocios que requieran un sistema interno de gestión de inventario con auditoría y control de acceso estricto.
