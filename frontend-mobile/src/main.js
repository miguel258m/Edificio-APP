// =====================================================
// MAIN.JS - Punto de entrada de la aplicación
// =====================================================
import './styles/main.css';

import { renderLogin } from './views/login.js';
import { renderRegister } from './views/register.js';
import { renderDashboardResidente } from './views/dashboard-residente.js';
import { renderDashboardVigilante } from './views/dashboard-vigilante.js';
import { renderChat } from './views/chat.js';
import { renderSolicitudes } from './views/solicitudes.js';
import { renderDashboardLimpieza } from './views/dashboard-limpieza.js';
import { renderChats } from './views/chats.js';
import { renderPerfil } from './views/perfil.js';
import { renderDashboardGerente } from './views/dashboard-gerente.js';
import { renderDashboardAdmin } from './views/dashboard-admin.js';
import { renderDashboardMedico } from './views/dashboard-medico.js';
import { renderGestionUsuarios } from './views/gestion-usuarios.js';
import { initSocket } from './socket/client.js';

// Estado global de la aplicación
window.appState = {
    user: null,
    token: null,
    socket: null
};

// Configuración de la API
// Priorizamos la variable de entorno de Vite si existe
const VITE_API_URL = import.meta.env.VITE_API_URL;
const PRODUCTION_API_URL = 'https://edificio-backend.onrender.com/api';
const LOCAL_API_URL = `http://${window.location.hostname}:3000/api`;

// Detectamos si estamos en un entorno local
const isLocal = window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.') ||
    window.location.hostname.endsWith('.local');

// Determinamos la URL inicial
let baseApiUrl = VITE_API_URL || (isLocal ? LOCAL_API_URL : PRODUCTION_API_URL);

// [ADVERTENCIA] Si estamos en localhost pero hitting render, avisar
if (isLocal && baseApiUrl.includes('onrender.com')) {
    console.warn('⚠️ ATENCIÓN: Estás en localhost pero usando el BACKEND de PRODUCCIÓN (Render).');
    console.warn('Para usar el backend local, asegúrate de que VITE_API_URL no esté definida o apunta a localhost:3000');
}

// Aseguramos que termine en /api y no tenga barras dobles al final
if (baseApiUrl.endsWith('/')) baseApiUrl = baseApiUrl.slice(0, -1);
if (!baseApiUrl.endsWith('/api')) baseApiUrl += '/api';

window.API_URL = baseApiUrl;

console.log('🔌 Conectando a API:', window.API_URL);

// Router simple
const routes = {
    '/': renderLogin,
    '/register': renderRegister,
    '/dashboard-residente': renderDashboardResidente,
    '/dashboard-vigilante': renderDashboardVigilante,
    '/dashboard-limpieza': renderDashboardLimpieza,
    '/dashboard-gerente': renderDashboardGerente,
    '/dashboard-admin': renderDashboardAdmin,
    '/dashboard-medico': renderDashboardMedico,
    '/chat': renderChat,
    '/chats': renderChats,
    '/solicitudes': renderSolicitudes,
    '/perfil': renderPerfil,
    '/gestion-usuarios': renderGestionUsuarios
};

// Función para navegar
window.navigateTo = (path, params = {}) => {
    window.history.pushState(params, '', path);
    router();
};

// Router con manejo de errores
function router() {
    try {
        const path = window.location.pathname;
        const render = routes[path] || routes['/'];

        const app = document.getElementById('app');
        if (!app) {
            console.error('❌ No se encontró el elemento #app');
            return;
        }

        app.innerHTML = '';

        if (path === '/chat') {
            const state = window.history.state || {};
            if (!state.userId) {
                console.warn('⚠️ No hay userId para el chat, volviendo al inicio');
                window.navigateTo('/');
                return;
            }
            renderChat(app, state.userId, state.userName);
        } else {
            render(app);
        }
    } catch (error) {
        console.error('❌ Error en el router:', error);
        mostrarErrorCarga('Error al renderizar la página: ' + error.message);
    }
}

// Función para mostrar error si la app no carga
function mostrarErrorCarga(mensaje) {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `
            <div class="loading-screen" style="padding: 2rem; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h2 style="color: var(--danger); margin-bottom: 1rem;">No se pudo cargar la aplicación</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">${mensaje}</p>
                <button onclick="window.location.reload()" class="btn btn-primary">Reintentar</button>
            </div>
        `;
    }
}

// Manejar navegación del navegador
window.addEventListener('popstate', router);

// Verificar si hay sesión guardada
async function checkAuth() {
    try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            const user = JSON.parse(userStr);
            window.appState.token = token;
            window.appState.user = user;

            // Inicializar socket (no bloqueante)
            try {
                initSocket(token);
            } catch (e) {
                console.warn('⚠️ Error al inicializar socket:', e);
            }

            // Redirigir al dashboard correspondiente
            let redirectToPath = '/'; // Default to login page
            if (user.rol === 'residente') {
                redirectToPath = '/dashboard-residente';
            } else if (user.rol === 'vigilante') {
                redirectToPath = '/dashboard-vigilante';
            } else if (user.rol === 'admin') {
                redirectToPath = '/dashboard-admin';
            } else if (user.rol === 'limpieza') {
                redirectToPath = '/dashboard-limpieza';
            } else if (user.rol === 'gerente') {
                redirectToPath = '/dashboard-gerente';
            } else if (user.rol === 'medico') {
                redirectToPath = '/dashboard-medico';
            }
            window.navigateTo(redirectToPath);
        } else {
            router();
        }
    } catch (error) {
        console.error('❌ Error en checkAuth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router();
    }
}

// Función de logout
window.logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.appState.user = null;
    window.appState.token = null;

    if (window.appState.socket) {
        window.appState.socket.disconnect();
    }

    window.navigateTo('/');
};

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', () => {
    try {
        checkAuth();
    } catch (error) {
        console.error('❌ Error crítico al iniciar:', error);
        mostrarErrorCarga('Error crítico al iniciar la aplicación.');
    }
});

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ Service Worker registrado'))
            .catch(err => console.error('❌ Error al registrar SW:', err));
    });
}
