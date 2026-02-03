// =====================================================
// SOCKET.IO CLIENT - Cliente WebSocket
// =====================================================

import { io } from 'socket.io-client';

let socket = null;

export function initSocket(token) {
    if (socket) {
        socket.disconnect();
    }

    // Derivar la URL del socket de la API_URL global
    const socketUrl = window.API_URL
        ? window.API_URL.replace('/api', '')
        : (import.meta.env.VITE_API_URL
            ? import.meta.env.VITE_API_URL.replace('/api', '')
            : `http://${window.location.hostname}:3000`);

    socket = io(socketUrl, {
        auth: {
            token
        }
    });

    socket.on('connect', () => {
        console.log('✅ Conectado al servidor WebSocket');
        window.appState.socket = socket;
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Error de conexión WebSocket:', error.message);
    });

    socket.on('disconnect', (reason) => {
        console.log('❌ Desconectado del servidor WebSocket:', reason);
    });

    // Eventos de chat
    socket.on('nuevo_mensaje', (mensaje) => {
        console.log('💬 Nuevo mensaje:', mensaje);
        // Aquí puedes mostrar una notificación o actualizar la UI
        mostrarNotificacion('Nuevo mensaje', mensaje.contenido);
    });

    // Eventos de emergencia
    socket.on('nueva_emergencia', (emergencia) => {
        console.log('🚨 Nueva emergencia:', emergencia);
        mostrarNotificacionEmergencia(emergencia);
    });

    // Eventos de alerta general
    socket.on('alerta_general', (alerta) => {
        console.log('📢 Alerta general:', alerta);
        mostrarAlertaGeneral(alerta);
    });

    window.appState.socket = socket;
    return socket;
}

export function getSocket() {
    return socket;
}

export function sendMessage(destinatarioId, contenido) {
    if (socket) {
        socket.emit('enviar_mensaje', {
            destinatario_id: destinatarioId,
            contenido
        });
    }
}

export function sendEmergencia(tipo, descripcion, ubicacion) {
    if (socket) {
        socket.emit('nueva_emergencia', {
            tipo,
            descripcion,
            ubicacion
        });
    }
}

function mostrarNotificacion(titulo, mensaje) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(titulo, {
            body: mensaje,
            icon: '/icon-192.png'
        });
    }
}

function mostrarNotificacionEmergencia(emergencia) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🚨 EMERGENCIA', {
            body: `${emergencia.descripcion} - ${emergencia.ubicacion}`,
            icon: '/icon-192.png',
            tag: 'emergencia',
            requireInteraction: true
        });
    }

    // También mostrar alerta en la app
    if (confirm(`🚨 EMERGENCIA\n\n${emergencia.descripcion}\nUbicación: ${emergencia.ubicacion}\n\n¿Ver detalles?`)) {
        // Navegar a la vista de emergencias
    }
}

function mostrarAlertaGeneral(alerta) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(alerta.titulo, {
            body: alerta.mensaje,
            icon: '/icon-192.png'
        });
    }

    alert(`📢 ${alerta.titulo}\n\n${alerta.mensaje}`);
}

// Solicitar permiso para notificaciones
export function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}
