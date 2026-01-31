# 🚀 Guía de Deployment en Render.com

## ⏰ URGENTE - Deployment Rápido (2-3 horas)

Esta guía te permitirá tener la app funcionando en internet SIN tu PC en aproximadamente 2-3 horas.

---

## 📋 Paso 1: Crear Cuenta en GitHub (5 minutos)

1. Ve a [github.com](https://github.com)
2. Click en "Sign up"
3. Usa tu email (puede ser Gmail)
4. Crea un username y contraseña
5. Verifica tu email

---

## 📋 Paso 2: Instalar Git en tu PC (5 minutos)

1. Descarga Git desde: [git-scm.com/download/win](https://git-scm.com/download/win)
2. Instala con las opciones por defecto
3. Abre PowerShell y verifica:
   ```powershell
   git --version
   ```

---

## 📋 Paso 3: Subir el Código a GitHub (10 minutos)

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
cd "C:\Users\MIGUEL SANCHEZ\.gemini\antigravity\scratch\edificio-app"

# Inicializar Git
git init

# Configurar tu identidad
git config user.name "Tu Nombre"
git config user.email "tu@email.com"

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit - Edificio App"
```

Ahora crea el repositorio en GitHub:

1. Ve a [github.com/new](https://github.com/new)
2. Nombre del repositorio: `edificio-app`
3. Déjalo **Público** (o Privado si prefieres)
4. NO marques ninguna opción adicional
5. Click en "Create repository"

Luego, en PowerShell:

```powershell
# Conectar con GitHub (reemplaza TU-USERNAME con tu usuario de GitHub)
git remote add origin https://github.com/TU-USERNAME/edificio-app.git

# Subir el código
git branch -M main
git push -u origin main
```

Te pedirá tu usuario y contraseña de GitHub.

---

## 📋 Paso 4: Crear Cuenta en Render.com (5 minutos)

1. Ve a [render.com](https://render.com)
2. Click en "Get Started"
3. Regístrate con tu cuenta de GitHub (más fácil)
4. Autoriza a Render para acceder a tus repositorios

---

## 📋 Paso 5: Crear la Base de Datos PostgreSQL (5 minutos)

1. En Render Dashboard, click en "New +"
2. Selecciona "PostgreSQL"
3. Configuración:
   - **Name:** `edificio-db`
   - **Database:** `edificio_db`
   - **User:** `edificio_user`
   - **Region:** Oregon (US West) - es gratis
   - **Plan:** Free
4. Click en "Create Database"
5. **IMPORTANTE:** Copia la "Internal Database URL" (la necesitarás después)

---

## 📋 Paso 6: Desplegar el Backend (15 minutos)

1. En Render Dashboard, click en "New +" → "Web Service"
2. Conecta tu repositorio `edificio-app`
3. Configuración:
   - **Name:** `edificio-backend`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Variables de Entorno** (click en "Advanced"):
   
   Agrega estas variables:
   
   ```
   NODE_ENV = production
   DATABASE_URL = [Pega aquí la Internal Database URL que copiaste]
   JWT_SECRET = edificio_app_secret_key_change_in_production_12345
   JWT_REFRESH_SECRET = edificio_app_refresh_secret_key_67890
   PORT = 3000
   ```

5. Click en "Create Web Service"

6. **Espera 5-10 minutos** mientras se despliega

7. Una vez desplegado, copia la URL (será algo como: `https://edificio-backend.onrender.com`)

---

## 📋 Paso 7: Inicializar la Base de Datos (5 minutos)

1. En el panel del backend en Render, ve a la pestaña "Shell"
2. Ejecuta:
   ```bash
   node scripts/init-production-db.js
   ```

3. Deberías ver:
   ```
   ✅ Base de datos inicializada correctamente
   📝 Credenciales de prueba:
      Admin: admin@edificio.com / password123
      Vigilante: vigilante@edificio.com / password123
      Residente: maria@email.com / password123
   ```

---

## 📋 Paso 8: Desplegar el Frontend (15 minutos)

1. En Render Dashboard, click en "New +" → "Static Site"
2. Conecta tu repositorio `edificio-app`
3. Configuración:
   - **Name:** `edificio-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend-mobile`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Variables de Entorno**:
   ```
   VITE_API_URL = https://edificio-backend.onrender.com/api
   ```
   (Reemplaza con la URL de tu backend del Paso 6)

5. Click en "Create Static Site"

6. **Espera 5-10 minutos** mientras se despliega

7. Una vez desplegado, copia la URL (será algo como: `https://edificio-frontend.onrender.com`)

---

## 📋 Paso 9: Actualizar CORS en el Backend (5 minutos)

1. Ve al servicio del backend en Render
2. Ve a "Environment"
3. Agrega una nueva variable:
   ```
   ALLOWED_ORIGINS = https://edificio-frontend.onrender.com
   ```
   (Reemplaza con la URL de tu frontend del Paso 8)

4. El servicio se reiniciará automáticamente

---

## ✅ Paso 10: ¡Probar la Aplicación! (5 minutos)

1. Abre la URL del frontend en tu celular:
   ```
   https://edificio-frontend.onrender.com
   ```

2. Prueba el login con:
   - Email: `maria@email.com`
   - Contraseña: `password123`

3. ¡Listo! La app ya funciona sin tu PC

---

## 📱 URL Final para Presentar

Comparte esta URL con el dueño:

```
https://edificio-frontend.onrender.com
```

**Credenciales de demostración:**
- **Residente:** maria@email.com / password123
- **Vigilante:** vigilante@edificio.com / password123
- **Admin:** admin@edificio.com / password123

---

## ⚠️ Notas Importantes

1. **Primera carga lenta:** La primera vez que alguien acceda después de 15 minutos de inactividad, tardará ~30 segundos (plan gratuito)

2. **Límites del plan gratuito:**
   - 750 horas/mes (suficiente para uso continuo)
   - Base de datos: 1GB (más que suficiente)
   - Se "duerme" después de 15 min sin uso

3. **Para mantenerlo activo 24/7:**
   - Upgrade a plan de pago ($7/mes por servicio)
   - O usa un servicio de "ping" gratuito como UptimeRobot

---

## 🆘 Solución de Problemas

### El backend no inicia
- Revisa los logs en Render
- Verifica que DATABASE_URL esté configurado
- Asegúrate de que la base de datos esté creada

### El frontend no se conecta
- Verifica que VITE_API_URL apunte al backend correcto
- Verifica que ALLOWED_ORIGINS en el backend incluya el frontend
- Revisa la consola del navegador (F12)

### Error de base de datos
- Ejecuta nuevamente el script de inicialización
- Verifica que la conexión a la BD funcione

---

## 🎯 Tiempo Total Estimado

- **Mínimo:** 1.5 horas (si todo sale bien)
- **Promedio:** 2-3 horas (con troubleshooting)
- **Máximo:** 4 horas (si hay problemas)

---

## 💡 Después de la Presentación

Si el dueño aprueba, considera:

1. **Dominio personalizado** (opcional, ~$10/año)
2. **Plan de pago** para mejor rendimiento ($7-25/mes)
3. **Backup automático** de la base de datos
4. **Monitoreo** con UptimeRobot (gratis)
