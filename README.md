# 🏢 Sistema de Administración de Edificios

Sistema completo de gestión de edificios con aplicación móvil PWA para residentes y vigilantes, panel web para administradores, chat en tiempo real, sistema de emergencias y gestión de solicitudes.

## 📋 Características

### Para Residentes
- 🏥 Solicitud de atención médica
- 🧹 Solicitud de limpieza
- 🎉 Agendar entretenimiento (con/sin alcohol)
- 💰 Registro de pagos
- 💬 Chat con vigilante en tiempo real
- 🚨 Botón de emergencia

### Para Vigilantes
- 📨 Recibir y responder mensajes
- 🚨 Gestión de emergencias
- 📢 Enviar alertas generales a todos los residentes
- 📋 Ver solicitudes pendientes

### Para Administradores
- 👥 Gestión de usuarios y edificios
- 📊 Reportes y estadísticas
- ⚙️ Configuración del sistema

## 🚀 Instalación

### Requisitos Previos

- **Node.js** v18 o superior (✅ Ya tienes v24.11.1)
- **PostgreSQL** 14 o superior (✅ Ya tienes pgAdmin instalado)
- **PowerShell** con ejecución de scripts habilitada

### 1. Habilitar Scripts en PowerShell

Abre PowerShell **como Administrador** y ejecuta:

\`\`\`powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
\`\`\`

### 2. Configurar Base de Datos

1. Abre **pgAdmin**
2. Crea una nueva base de datos llamada \`edificio_db\`
3. Abre el Query Tool y ejecuta los scripts en orden:
   - \`database/init.sql\` (crea las tablas)
   - \`database/seed.sql\` (datos de prueba)

### 3. Configurar Backend

\`\`\`powershell
# Navegar a la carpeta backend
cd backend

# Copiar archivo de variables de entorno
copy .env.example .env

# Editar .env y configurar tu contraseña de PostgreSQL
# DB_PASSWORD=tu_password_aqui

# Instalar dependencias
npm install
\`\`\`

### 4. Configurar Frontend Móvil

\`\`\`powershell
# Navegar a la carpeta frontend-mobile
cd ../frontend-mobile

# Instalar dependencias
npm install
\`\`\`

## ▶️ Ejecutar la Aplicación

### Opción 1: Ejecutar todo manualmente

**Terminal 1 - Backend:**
\`\`\`powershell
cd backend
npm start
\`\`\`

**Terminal 2 - Frontend Móvil:**
\`\`\`powershell
cd frontend-mobile
npm run dev
\`\`\`

### Opción 2: Script de inicio rápido

Crea un archivo \`start.ps1\` en la raíz del proyecto:

\`\`\`powershell
# Iniciar backend en segundo plano
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

# Esperar 3 segundos
Start-Sleep -Seconds 3

# Iniciar frontend móvil
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend-mobile; npm run dev"

Write-Host "✅ Aplicación iniciada"
Write-Host "📱 App móvil: http://localhost:5173"
Write-Host "🔌 Backend: http://localhost:3000"
\`\`\`

Ejecuta:
\`\`\`powershell
.\\start.ps1
\`\`\`

## 📱 Acceder a la Aplicación

### Desde tu PC
- Abre tu navegador en: **http://localhost:5173**

### Desde tu celular (misma red WiFi)
1. Encuentra la IP de tu PC:
   \`\`\`powershell
   ipconfig
   # Busca "Dirección IPv4" (ej: 192.168.1.100)
   \`\`\`

2. En tu celular, abre el navegador y ve a:
   **http://TU_IP:5173** (ej: http://192.168.1.100:5173)

3. El navegador te preguntará si quieres "Agregar a pantalla de inicio"
4. ¡Listo! Ahora tienes la app instalada como una app nativa

## 🔑 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Residente** | maria@email.com | password123 |
| **Vigilante** | vigilante@edificio.com | password123 |
| **Admin** | admin@edificio.com | password123 |

## 🎨 Diseño de la App

La aplicación móvil tiene un diseño moderno con:
- 🌙 Tema oscuro con gradientes
- 🎨 Colores vibrantes (púrpura y rosa)
- ✨ Animaciones suaves
- 📱 Diseño mobile-first responsive
- 🔔 Notificaciones push
- 💬 Chat en tiempo real
- 🚨 Botón de emergencia flotante

## 📁 Estructura del Proyecto

\`\`\`
edificio-app/
├── backend/                 # Servidor Node.js
│   ├── config/             # Configuración (DB, etc.)
│   ├── middleware/         # Autenticación JWT
│   ├── routes/             # Rutas de la API
│   ├── sockets/            # Handlers de Socket.io
│   └── server.js           # Servidor principal
│
├── frontend-mobile/        # App móvil PWA
│   ├── src/
│   │   ├── views/         # Vistas (login, dashboards)
│   │   ├── styles/        # CSS
│   │   └── socket/        # Cliente Socket.io
│   └── index.html
│
└── database/               # Scripts SQL
    ├── init.sql           # Crear tablas
    └── seed.sql           # Datos de prueba
\`\`\`

## 🔧 Tecnologías Utilizadas

### Backend
- Node.js + Express
- Socket.io (WebSocket)
- PostgreSQL
- JWT (autenticación)
- bcrypt (encriptación)

### Frontend
- Vite (build tool)
- Vanilla JavaScript
- CSS moderno con variables
- Socket.io-client
- PWA (Service Worker)

## 🐛 Solución de Problemas

### Error: "npm no se reconoce"
- Reinicia PowerShell después de habilitar la ejecución de scripts

### Error: "No se puede conectar a PostgreSQL"
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en \`.env\`
- Asegúrate de haber creado la base de datos \`edificio_db\`

### La app móvil no carga
- Verifica que el backend esté corriendo en el puerto 3000
- Revisa la consola del navegador (F12) para ver errores

### No puedo acceder desde el celular
- Asegúrate de estar en la misma red WiFi
- Desactiva temporalmente el firewall de Windows
- Verifica la IP con \`ipconfig\`

## 📝 Próximas Funcionalidades

- [ ] Panel de administración web completo
- [ ] Subida de comprobantes de pago
- [ ] Notificaciones push nativas
- [ ] Modo offline completo
- [ ] Exportar reportes en PDF
- [ ] Integración con pasarelas de pago

## 🤝 Soporte

Si tienes problemas o preguntas:
1. Revisa la sección de "Solución de Problemas"
2. Verifica los logs en la consola del backend
3. Revisa la consola del navegador (F12)

## 📄 Licencia

MIT License - Libre para uso personal y comercial

---

**¡Disfruta tu sistema de administración de edificios!** 🏢✨
