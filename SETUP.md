# Configuración Inicial - Sistema de Administración de Edificios

## ✅ Lo que ya tienes instalado:
- **Node.js v24.11.1** ✅

## 🔧 Configuraciones necesarias:

### 1. Habilitar ejecución de scripts en PowerShell

Abre PowerShell **como Administrador** y ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Esto permitirá ejecutar npm y otros scripts.

### 2. PostgreSQL

Ya tienes **pgAdmin** instalado, lo que significa que PostgreSQL está instalado. Solo necesitas agregar `psql` al PATH de Windows:

**Opción A: Agregar al PATH manualmente**
1. Busca la carpeta de instalación de PostgreSQL (usualmente: `C:\Program Files\PostgreSQL\14\bin` o `C:\Program Files\PostgreSQL\15\bin`)
2. Copia la ruta completa
3. Ve a: Panel de Control → Sistema → Configuración avanzada del sistema → Variables de entorno
4. En "Variables del sistema", busca "Path" y haz clic en "Editar"
5. Haz clic en "Nuevo" y pega la ruta
6. Acepta todo y reinicia PowerShell

**Opción B: Usar pgAdmin directamente**
- No necesitas `psql` en la terminal
- Puedes ejecutar todos los scripts SQL desde pgAdmin
- Es más visual y fácil

## 📦 Lo que NO necesitas descargar:

- ❌ Android Studio
- ❌ React Native
- ❌ Expo
- ❌ Otros IDEs

## ✅ Todo lo demás se instalará automáticamente:

Cuando ejecutes `npm install` en cada carpeta del proyecto, se instalarán automáticamente:
- Express, Socket.io, PostgreSQL driver
- Vite, dependencias de PWA
- Todas las librerías necesarias

## 🚀 Próximos pasos:

1. Habilitar scripts en PowerShell (comando arriba)
2. Yo crearé todo el código del proyecto
3. Tú ejecutarás `npm install` en cada carpeta
4. Crearás la base de datos desde pgAdmin
5. ¡Listo para probar!

---

**¿Quieres que continúe creando el proyecto mientras configuras PowerShell?**
