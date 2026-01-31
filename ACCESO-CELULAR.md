# 📱 Cómo Acceder a la App desde tu Celular

## ✅ Configuración Completada

He actualizado la aplicación para que puedas acceder desde tu celular. Aquí están los pasos:

## 📋 Requisitos Previos

1. **Tu celular y tu computadora deben estar en la MISMA red WiFi**
2. El servidor backend debe estar corriendo
3. El servidor frontend debe estar corriendo

## 🚀 Pasos para Acceder

### 1. Verifica que los servidores estén corriendo

Ejecuta en tu computadora:
```powershell
cd "C:\Users\MIGUEL SANCHEZ\.gemini\antigravity\scratch\edificio-app"
.\start.ps1
```

Deberías ver:
- ✅ Backend corriendo en puerto 3000
- ✅ Frontend corriendo en puerto 5173 o 5174

### 2. Abre tu celular

En el navegador de tu celular (Chrome, Safari, etc.), ingresa esta URL:

```
http://192.168.18.5:5173
```

O si el frontend está en el puerto 5174:

```
http://192.168.18.5:5174
```

## 🔧 Solución de Problemas

### ❌ "No se puede acceder al sitio"

**Causa:** Tu celular no está en la misma red WiFi que tu computadora.

**Solución:** 
- Conecta tu celular a la misma red WiFi que tu computadora
- Verifica que ambos dispositivos estén conectados

### ❌ "Error de conexión a la API"

**Causa:** El servidor backend no está corriendo o el firewall está bloqueando.

**Solución:**
1. Verifica que el backend esté corriendo en tu computadora
2. Permite el acceso en el Firewall de Windows:
   - Ve a "Firewall de Windows Defender"
   - Clic en "Permitir una aplicación o característica..."
   - Busca "Node.js" y asegúrate de que esté permitido en redes privadas

### ❌ La página carga pero no funciona el login

**Causa:** Problema con la base de datos.

**Solución:**
- Verifica que PostgreSQL esté corriendo
- Verifica que la base de datos `edificio_db` exista
- Revisa las credenciales en el archivo `.env`

## 📝 Información Técnica

- **IP de tu computadora:** 192.168.18.5
- **Puerto Backend:** 3000
- **Puerto Frontend:** 5173 o 5174
- **API URL:** http://192.168.18.5:3000/api

## 🔄 Si cambias de red WiFi

Si tu computadora cambia de IP (por ejemplo, te conectas a otra red WiFi), necesitarás:

1. Obtener la nueva IP:
```powershell
ipconfig | Select-String -Pattern "IPv4"
```

2. Actualizar estos archivos:
   - `frontend-mobile/src/main.js` (línea 18)
   - `frontend-mobile/src/socket/client.js` (línea 14)
   - `backend/.env` (línea 22)

## 💡 Tip: Instalar como PWA

Una vez que la app cargue en tu celular:

1. En Chrome (Android): Toca los 3 puntos → "Agregar a pantalla de inicio"
2. En Safari (iOS): Toca el botón de compartir → "Agregar a pantalla de inicio"

Esto te permitirá usar la app como si fuera una aplicación nativa.

## 🎯 Credenciales de Prueba

Usa estas credenciales para probar (IMPORTANTE: usa el EMAIL, no username):

**Residente:**
- Email: `maria@email.com`
- Contraseña: `password123`

**Vigilante:**
- Email: `vigilante@edificio.com`
- Contraseña: `password123`

**Admin:**
- Email: `admin@edificio.com`
- Contraseña: `password123`
