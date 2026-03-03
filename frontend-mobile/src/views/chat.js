import { renderSidebarLayout } from '../utils/sidebar-layout.js';

export function renderChat(container, targetUserId, targetUserName) {
  const user = window.appState.user;
  const token = window.appState.token;

  // Determinar navItems y rol para el layout
  const isResidente = user.rol === 'residente';

  // Mapa de rol a dashboard correcto
  const dashboardMap = {
    residente: '/dashboard-residente',
    vigilante: '/dashboard-vigilante',
    admin: '/dashboard-admin',
    limpieza: '/dashboard-limpieza',
    gerente: '/dashboard-gerente',
    medico: '/dashboard-medico',
    entretenimiento: '/dashboard-entretenimiento'
  };
  const myDashboard = dashboardMap[user.rol] || '/';

  const navItems = isResidente ? [
    { key: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/dashboard-residente' },
    { key: 'chat', icon: '💬', label: 'Chat', path: '/chats' },
    { key: 'solicitudes', icon: '📋', label: 'Mis Solicitudes', path: '/solicitudes' },
    { key: 'pagos', icon: '💳', label: 'Mis Pagos', path: '/pago-metodos' },
    { key: 'perfil', icon: '⚙️', label: 'Perfil', path: '/perfil' },
  ] : [
    { key: 'dashboard', icon: '🏠', label: 'Dashboard', path: myDashboard },
    { key: 'chat', icon: '💬', label: 'Chat', path: '/chats' },
    { key: 'solicitudes', icon: '📋', label: 'Solicitudes', path: '/solicitudes' },
    { key: 'perfil', icon: '⚙️', label: 'Perfil', path: '/perfil' },
  ];

  const main = renderSidebarLayout(container, {
    role: user.rol,
    activeNav: 'chat',
    pageTitle: `💬 Chat con ${targetUserName}`,
    pageSubtitle: 'Comunicación en tiempo real',
    breadcrumb: 'Chat',
    navItems,
  });

  main.innerHTML = `
    <div style="display: flex; flex-direction: column; height: calc(100vh - 180px); background: var(--sb-surface); border: 1px solid var(--sb-border); border-radius: 12px; overflow: hidden;">
      <!-- Messages Area -->
      <div id="messagesArea" style="flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
        <div class="loading-spinner" style="margin: auto;"></div>
      </div>

      <!-- Typing Indicator -->
      <div id="typingIndicator" style="padding: 0 1.5rem; font-size: 0.75rem; color: var(--sb-muted); height: 1.2rem;"></div>

      <!-- Input Area -->
      <form id="chatForm" style="padding: 1.2rem; background: rgba(0,0,0,0.2); border-top: 1px solid var(--sb-border); display: flex; gap: 0.8rem;">
        <input 
          type="text" 
          id="messageInput" 
          placeholder="Escribe un mensaje..." 
          style="flex: 1; padding: 0.8rem 1.2rem; border-radius: 8px; border: 1px solid var(--sb-border); background: var(--sb-card); color: var(--sb-text); font-family: inherit; font-size: 0.9rem;"
          autocomplete="off"
        >
        <button type="submit" class="btn btn-primary" style="padding: 0; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; border-radius: 8px;">
          ✈️
        </button>
      </form>
    </div>
  `;

  const messagesArea = document.getElementById('messagesArea');
  const chatForm = document.getElementById('chatForm');
  const messageInput = document.getElementById('messageInput');
  const typingIndicator = document.getElementById('typingIndicator');

  // Cargar historial
  loadHistory();
  checkChatStatus();

  async function checkChatStatus() {
    try {
      const res = await fetch(`${window.API_URL}/mensajes/check-active-chat/${targetUserId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.active === false) {
        // Chat desactivado (Consulta Médica Finalizada)
        const titleEl = main.querySelector('.ds-page-title');
        if (titleEl) titleEl.innerHTML = `💬 Chat con ${targetUserName} <span style="font-size:0.65rem; background:#f87171; color:white; padding:2px 8px; border-radius:10px; margin-left:10px; vertical-align:middle;">FINALIZADO</span>`;

        const sub = main.querySelector('.ds-page-subtitle');
        if (sub) sub.textContent = 'La consulta médica ha terminado. No se pueden enviar más mensajes.';

        document.getElementById('messageInput').disabled = true;
        document.getElementById('messageInput').placeholder = 'Consulta finalizada. Solicita una nueva para hablar.';
        const btn = chatForm.querySelector('button');
        if (btn) btn.disabled = true;
      }
    } catch (e) {
      console.error('Error checking chat status:', e);
    }
  }

  // Manejar envío de mensaje
  chatForm.onsubmit = (e) => {
    e.preventDefault();
    const content = messageInput.value.trim();
    if (!content) return;

    if (window.appState.socket && window.appState.socket.connected) {
      window.appState.socket.emit('enviar_mensaje', {
        destinatario_id: targetUserId,
        contenido: content
      });
      messageInput.value = '';
    } else {
      alert('⚠️ No hay conexión con el servidor. Reintentando...');
    }
  };

  // Typing indicator delay
  let typingTimer;
  messageInput.oninput = () => {
    if (window.appState.socket) {
      window.appState.socket.emit('typing', { targetUserId });
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        // stop typing event could be added here
      }, 2000);
    }
  };

  // Escuchar nuevos mensajes
  const onNuevoMensaje = (mensaje) => {
    if (
      (mensaje.remitente_id === targetUserId && mensaje.destinatario_id === user.id) ||
      (mensaje.remitente_id === user.id && mensaje.destinatario_id === targetUserId)
    ) {
      appendMessage(mensaje);
      messagesArea.scrollTop = messagesArea.scrollHeight;
    }
  };

  // Limpiar listener anterior si existe y registrar nuevo
  if (window.appState.socket) {
    window.appState.socket.off('nuevo_mensaje');
    window.appState.socket.on('nuevo_mensaje', onNuevoMensaje);

    window.appState.socket.on('user_typing', (data) => {
      if (data.userId === targetUserId) {
        typingIndicator.textContent = `${targetUserName} está escribiendo...`;
        setTimeout(() => typingIndicator.textContent = '', 3000);
      }
    });

    window.appState.socket.on('error_mensaje', (data) => {
      alert(data.message);
    });
  }

  async function loadHistory() {
    try {
      // Cargar historial
      const response = await fetch(`${window.API_URL}/mensajes/conversacion/${targetUserId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      messagesArea.innerHTML = '';
      data.forEach(appendMessage);
      messagesArea.scrollTop = messagesArea.scrollHeight;

      // Marcar como leídos
      fetch(`${window.API_URL}/mensajes/conversacion/${targetUserId}/leer`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(console.error);

    } catch (error) {
      messagesArea.innerHTML = '<p style="color: var(--danger); text-align: center;">Error al cargar mensajes</p>';
    }
  }

  function appendMessage(msg) {
    const isMine = msg.remitente_id === user.id;
    const msgDiv = document.createElement('div');
    msgDiv.style.alignSelf = isMine ? 'flex-end' : 'flex-start';
    msgDiv.style.maxWidth = '80%';
    msgDiv.style.padding = '0.75rem 1rem';
    msgDiv.style.borderRadius = isMine ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0';
    msgDiv.style.background = isMine ? 'var(--primary)' : 'var(--bg-secondary)';
    msgDiv.style.color = isMine ? 'white' : 'var(--text-primary)';
    msgDiv.style.fontSize = '0.875rem';
    msgDiv.style.boxShadow = 'var(--shadow-sm)';

    msgDiv.innerHTML = `
      <div>${msg.contenido}</div>
      <div style="font-size: 0.7rem; opacity: 0.7; text-align: right; margin-top: 0.25rem;">
        ${new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    `;
    messagesArea.appendChild(msgDiv);
  }
}
