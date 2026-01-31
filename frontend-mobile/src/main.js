// =====================================================
// MAIN.JS - Punto de entrada de la aplicación
// =====================================================

import { renderLogin } from './views/login.js';
import { renderRegister } from './views/register.js';
import { renderDashboardResidente } from './views/dashboard-residente.js';
import { renderDashboardVigilante } from './views/dashboard-vigilante.js';
import { initSocket } from './socket/client.js';

// Estado global de la aplicación
window.appState = {
    user: null,
    token: null,
    socket: null
};

// Configuración de la API
// En producción usa la variable de entorno, en desarrollo usa la IP local
window.API_URL = import.meta.env.VITE_API_URL || 'http://192.168.18.5:3000/api';

// Router simple
const routes = {
    '/': renderLogin,
    '/register': renderRegister,
    '/dashboard-residente': renderDashboardResidente,
    '/dashboard-vigilante': renderDashboardVigilante
};

// Función para navegar
window.navigateTo = (path) => {
    window.history.pushState({}, '', path);
    router();
};

// Router
function router() {
    const path = window.location.pathname;
    const render = routes[path] || routes['/'];

    const app = document.getElementById('app');
    app.innerHTML = '';
    render(app);
}

// Manejar navegación del navegador
window.addEventListener('popstate', router);

// Verificar si hay sesión guardada
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        window.appState.token = token;
        window.appState.user = JSON.parse(user);

        // Inicializar socket
        initSocket(token);

        // Redirigir al dashboard correspondiente
        if (window.appState.user.rol === 'residente') {
            window.navigateTo('/dashboard-residente');
        } else if (window.appState.user.rol === 'vigilante') {
            window.navigateTo('/dashboard-vigilante');
        }
    } else {
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
checkAuth();

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ Service Worker registrado'))
            .catch(err => console.error('❌ Error al registrar SW:', err));
    });
}
