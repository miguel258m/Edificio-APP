// =====================================================
// CHAT VIEW - Pantalla de conversación
// =====================================================

export function renderChat(container, targetUserId, targetUserName) {
  const user = window.appState.user;
  const token = window.appState.token;

  container.innerHTML = `
    <div class="page" style="display: flex; flex-direction: column; height: 100vh; background: var(--bg-primary);">
      <!-- Header Premium -->
      <div style="background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary)); padding: 2rem 0; border-bottom: 1px solid var(--glass-border); box-shadow: var(--shadow-md); display: flex; align-items: center;">
        <div class="container" style="display: flex; align-items: center; gap: 1rem;">
          <button onclick="window.history.back()" style="background: none; border: none; font-size: 1.5rem; color: var(--text-primary); cursor: pointer;">←</button>
          <div style="flex: 1;">
            <h2 style="font-size: 1.125rem; font-weight: 600; margin: 0;">${targetUserName}</h2>
            <p id="chatStatus" style="font-size: 0.75rem; color: var(--success); margin: 0; opacity: 0.9;">En línea</p>
          </div>
        </div>
      </div>


      <!-- Messages Area -->
      <div id="messagesArea" style="flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
        <div class="loading-spinner" style="margin: auto;"></div>
      </div>

      <!-- Typing Indicator -->
      <div id="typingIndicator" style="padding: 0 1rem; font-size: 0.75rem; color: var(--text-muted); height: 1rem;"></div>

      <!-- Input Area -->
      <form id="chatForm" style="padding: 1rem; background: var(--bg-secondary); border-top: 1px solid var(--border-color); display: flex; gap: 0.5rem;">
        <input 
          type="text" 
          id="messageInput" 
          placeholder="Escribe un mensaje..." 
          style="flex: 1; padding: 0.75rem; border-radius: var(--radius-full); border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary);"
          autocomplete="off"
        >
        <button type="submit" class="btn btn-primary" style="border-radius: var(--radius-full); padding: 0.75rem 1.25rem;">
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
