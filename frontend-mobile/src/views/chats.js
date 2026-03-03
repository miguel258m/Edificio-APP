// =====================================================
// CHATS VIEW - Two-panel WhatsApp-Web style layout
// Left: conversation list  |  Right: active chat
// =====================================================
import { renderSidebarLayout } from '../utils/sidebar-layout.js';

export function renderChats(container) {
  const user = window.appState.user;
  const token = window.appState.token;

  const dashboardPath = {
    residente: '/dashboard-residente', vigilante: '/dashboard-vigilante', admin: '/dashboard-admin',
    limpieza: '/dashboard-limpieza', gerente: '/dashboard-gerente', medico: '/dashboard-medico',
    entretenimiento: '/dashboard-entretenimiento'
  }[user.rol] || '/';

  const navItems = [
    { key: 'inicio', icon: '🏠', label: 'Inicio', path: dashboardPath },
    { key: 'chats', icon: '💬', label: 'Mensajes', path: '/chats' },
    { key: 'perfil', icon: '⚙️', label: 'Perfil', path: '/perfil' },
  ];

  const main = renderSidebarLayout(container, {
    role: user.rol,
    activeNav: 'chats',
    pageTitle: 'Mensajes',
    pageSubtitle: 'Conversaciones con residentes y personal',
    breadcrumb: 'Mensajes',
    navItems,
  });

  // Override ds-page padding/overflow so the chat panel fills correctly
  main.style.padding = '0';
  main.style.display = 'flex';
  main.style.flexDirection = 'column';
  main.style.overflow = 'hidden';
  main.style.height = 'calc(100vh - 60px)'; // subtract header height

  main.innerHTML = `
    <style>
      #chatTwoPanel { display: flex; flex: 1; height: 100%; overflow: hidden; position: relative; }
      #convList { width: 320px; flex-shrink: 0; background: #161b22; border-right: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; overflow: hidden; transition: transform 0.3s ease; }
      #activeChatPanel { flex: 1; display: flex; flex-direction: column; background: #0d1117; transition: transform 0.3s ease; }
      
      /* Mobile styles */
      @media (max-width: 768px) {
        #convList { width: 100%; position: absolute; top: 0; left: 0; bottom: 0; z-index: 10; }
        #activeChatPanel { width: 100%; position: absolute; top: 0; left: 0; bottom: 0; transform: translateX(100%); z-index: 20; }
        #chatTwoPanel.show-chat #convList { transform: translateX(-100%); }
        #chatTwoPanel.show-chat #activeChatPanel { transform: translateX(0); }
        #btnBackToConvs { display: flex !important; }
      }
    </style>

    <!-- Two-panel chat layout -->
    <div id="chatTwoPanel" class="">
      <!-- LEFT: Conversation list -->
      <div id="convList">
        <!-- Search bar -->
        <div style="padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.06);">
          <input id="searchConv" type="text" placeholder="🔍 Buscar conversación..." oninput="filterConversaciones(this.value)" style="width:100%; background:#1c2333; border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:8px 12px; color:#e6edf3; font-size:0.82rem; font-family:inherit; box-sizing:border-box;">
        </div>
        <!-- List -->
        <div id="convItems" style="flex:1; overflow-y:auto; padding:8px 0;">
          <div class="loading-spinner" style="margin:2rem auto;"></div>
        </div>
      </div>

      <!-- RIGHT: Active chat panel -->
      <div id="activeChatPanel">
        <!-- Empty state -->
        <div id="noChatSelected" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px;">
          <div style="font-size:3rem;">💬</div>
          <p style="color:#7d8590; font-size:0.9rem; font-weight:500;">Selecciona una conversación para comenzar</p>
        </div>

        <!-- Chat header -->
        <div id="chatHeader" style="display:none; background:#161b22; border-bottom:1px solid rgba(255,255,255,0.08); padding:12px 16px; align-items:center; gap:12px; flex-shrink:0;">
          <button id="btnBackToConvs" onclick="backToList()" style="display:none; background:none; border:none; color:#58a6ff; font-size:1.2rem; cursor:pointer; padding:4px;">⬅️</button>
          <div id="chatHeaderAvatar" style="width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#1f6feb,#a78bfa); display:flex; align-items:center; justify-content:center; font-size:0.9rem; font-weight:700; color:white; flex-shrink:0;"></div>
          <div style="flex:1;">
            <p id="chatHeaderName" style="font-size:0.9rem; font-weight:700; color:#e6edf3; margin:0;"></p>
            <p id="chatHeaderStatus" style="font-size:0.7rem; color:#4ade80; margin:0;">En línea</p>
          </div>
        </div>

        <!-- Messages area -->
        <div id="messagesArea" style="display:none; flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:8px;"></div>

        <!-- Typing indicator -->
        <div id="typingIndicator" style="display:none; padding:0 20px 4px; font-size:0.72rem; color:#7d8590; height:20px;"></div>

        <!-- Input -->
        <form id="chatForm" style="display:none; padding:12px 16px; background:#161b22; border-top:1px solid rgba(255,255,255,0.08); flex-direction:row; gap:10px; align-items:center; flex-shrink:0;">
          <input type="text" id="messageInput" placeholder="Escribe un mensaje..." autocomplete="off"
            style="flex:1; background:#1c2333; border:1px solid rgba(255,255,255,0.1); border-radius:24px; padding:10px 16px; color:#e6edf3; font-size:0.85rem; font-family:inherit; outline:none;">
          <button type="submit" style="background:rgba(31,111,235,0.85); border:none; border-radius:50%; width:40px; height:40px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1rem; flex-shrink:0; color:white;">➤</button>
        </form>
      </div>
    </div>
  `;

  // State
  let allConversaciones = [];
  let activeUserId = null;
  let activeUserName = '';

  loadConversaciones();

  // ── LOAD CONVERSATION LIST ─────────────────────────
  async function loadConversaciones() {
    try {
      const res = await fetch(`${window.API_URL}/mensajes/conversaciones`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      allConversaciones = await res.json();
      if (!Array.isArray(allConversaciones)) allConversaciones = [];

      // Si es residente o gerente, asegurar que aparezca el Vigilante
      if (user.rol === 'residente' || user.rol === 'gerente') {
        try {
          const vRes = await fetch(`${window.API_URL}/usuarios/vigilantes`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (vRes.ok) {
            const vigilantes = await vRes.json();
            if (Array.isArray(vigilantes) && vigilantes.length > 0) {
              const v = vigilantes[0];
              const existe = allConversaciones.find(c => c.usuario_id === v.id);
              if (!existe) {
                allConversaciones.unshift({
                  usuario_id: v.id,
                  nombre: `${v.nombre}`,
                  ultimo_mensaje: 'Chat con seguridad',
                  ultima_fecha: null,
                  no_leidos: 0,
                  is_default: true
                });
              }
            }
          }
        } catch (err) {
          console.warn('⚠️ No se pudo cargar el chat de vigilancia por defecto:', err);
        }
      }

      renderConvList(allConversaciones);
    } catch (e) {
      document.getElementById('convItems').innerHTML =
        '<p style="color:#f87171;text-align:center;padding:2rem;font-size:0.8rem;">❌ Error al cargar</p>';
    }
  }

  function renderConvList(convs) {
    const el = document.getElementById('convItems');
    if (!convs || convs.length === 0) {
      el.innerHTML = '<div style="text-align:center;padding:3rem 1rem;"><div style="font-size:2rem;margin-bottom:8px;">💬</div><p style="color:#7d8590;font-size:0.82rem;">No tienes conversaciones</p></div>';
      return;
    }
    el.innerHTML = convs.map(c => {
      const initials = (c.nombre || '?')[0].toUpperCase();
      const unread = c.no_leidos > 0;
      const subLabel = c.is_default ? '<span style="color:#58a6ff;font-size:0.6rem;font-weight:600;display:block;margin-top:2px;">SOPORTE</span>' : '';
      return `
      <div class="conv-item" data-id="${c.usuario_id}" data-name="${c.nombre}"
        onclick="selectChat(${c.usuario_id},'${c.nombre.replace(/'/g, "\\'")}',this)"
        style="display:flex;align-items:center;gap:12px;padding:12px 16px;cursor:pointer;border-left:3px solid transparent;transition:background 0.15s;"
        onmouseover="if(!this.classList.contains('active-conv'))this.style.background='rgba(255,255,255,0.04)'"
        onmouseout="if(!this.classList.contains('active-conv'))this.style.background='transparent'">
        <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#1f6feb,#a78bfa);display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:700;color:white;flex-shrink:0;position:relative;">
          ${initials}
          ${unread ? '<span style="position:absolute;top:-2px;right:-2px;width:10px;height:10px;background:#f87171;border-radius:50%;border:2px solid #161b22;"></span>' : ''}
        </div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
            <p style="font-size:0.85rem;font-weight:${unread ? '700' : '500'};color:${unread ? '#e6edf3' : '#c9d1d9'};margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${c.nombre}</p>
            <span style="font-size:0.65rem;color:#7d8590;white-space:nowrap;margin-left:8px;">${c.ultima_fecha ? formatFecha(c.ultima_fecha) : 'Ahora'}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <p style="font-size:0.72rem;color:#7d8590;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${c.ultimo_mensaje || 'Sin mensajes'}</p>
            ${unread ? `<span style="background:#f87171;color:white;border-radius:10px;padding:1px 6px;font-size:0.6rem;font-weight:700;margin-left:6px;">${c.no_leidos}</span>` : ''}
          </div>
          ${subLabel}
        </div>
      </div>`;
    }).join('');
  }

  window.filterConversaciones = (q) => {
    const filtered = allConversaciones.filter(c => c.nombre.toLowerCase().includes(q.toLowerCase()));
    renderConvList(filtered);
  };

  // ── SELECT A CONVERSATION ──────────────────────────
  window.selectChat = (userId, userName, el) => {
    // Highlight selected
    document.querySelectorAll('.conv-item').forEach(i => {
      i.classList.remove('active-conv');
      i.style.background = 'transparent';
      i.style.borderLeftColor = 'transparent';
    });
    el.classList.add('active-conv');
    el.style.background = 'rgba(31,111,235,0.1)';
    el.style.borderLeftColor = '#58a6ff';

    // Mobile navigation
    document.getElementById('chatTwoPanel').classList.add('show-chat');

    activeUserId = userId;
    activeUserName = userName;

    // Show chat panels
    document.getElementById('noChatSelected').style.display = 'none';
    const header = document.getElementById('chatHeader');
    const msgs = document.getElementById('messagesArea');
    const form = document.getElementById('chatForm');
    const typing = document.getElementById('typingIndicator');
    header.style.display = 'flex';
    msgs.style.display = 'flex';
    form.style.display = 'flex';
    typing.style.display = 'block';

    document.getElementById('chatHeaderAvatar').textContent = (userName || '?')[0].toUpperCase();
    document.getElementById('chatHeaderName').textContent = userName;

    loadHistory(userId);
  };

  window.backToList = () => {
    document.getElementById('chatTwoPanel').classList.remove('show-chat');
  };

  // ── LOAD HISTORY ──────────────────────────────────
  async function loadHistory(userId) {
    const msgs = document.getElementById('messagesArea');
    msgs.innerHTML = '<div class="loading-spinner" style="margin:auto;"></div>';
    try {
      const res = await fetch(`${window.API_URL}/mensajes/conversacion/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      msgs.innerHTML = '';
      if (data.length === 0) {
        msgs.innerHTML = '<p style="color:#7d8590;text-align:center;margin:auto;font-size:0.82rem;">Aún no hay mensajes. ¡Envía el primero!</p>';
      } else {
        data.forEach(appendMessage);
        msgs.scrollTop = msgs.scrollHeight;
      }
      // Mark as read
      fetch(`${window.API_URL}/mensajes/conversacion/${userId}/leer`, {
        method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` }
      }).catch(console.error);
      // Remove unread dot in list
      const convItem = document.querySelector(`.conv-item[data-id="${userId}"]`);
      if (convItem) {
        const dot = convItem.querySelector('span[style*="10px"]');
        const badge = convItem.querySelector('span[style*="f87171"][style*="border-radius:10px"]');
        if (dot) dot.remove();
        if (badge) badge.remove();
      }
    } catch (e) {
      msgs.innerHTML = '<p style="color:#f87171;text-align:center;padding:2rem;">❌ Error al cargar mensajes</p>';
    }
  }

  // ── SEND MESSAGE ──────────────────────────────────
  const chatForm = document.getElementById('chatForm');
  const messageInput = document.getElementById('messageInput');
  chatForm.onsubmit = (e) => {
    e.preventDefault();
    const content = messageInput.value.trim();
    if (!content || !activeUserId) return;
    if (window.appState.socket?.connected) {
      window.appState.socket.emit('enviar_mensaje', { destinatario_id: activeUserId, contenido: content });
      messageInput.value = '';
    } else {
      alert('⚠️ Sin conexión con el servidor');
    }
  };

  // Input focus style
  messageInput.addEventListener('focus', () => messageInput.style.borderColor = 'rgba(88,166,255,0.5)');
  messageInput.addEventListener('blur', () => messageInput.style.borderColor = 'rgba(255,255,255,0.1)');

  // Typing
  let typingTimer;
  messageInput.oninput = () => {
    if (window.appState.socket && activeUserId) {
      window.appState.socket.emit('typing', { targetUserId: activeUserId });
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => { }, 2000);
    }
  };

  // ── SOCKET LISTENERS ──────────────────────────────
  if (window.appState.socket) {
    window.appState.socket.off('nuevo_mensaje');
    window.appState.socket.on('nuevo_mensaje', (msg) => {
      // Update conv list
      const ci = document.querySelector(`.conv-item[data-id="${msg.remitente_id}"]`);
      if (ci) {
        const lastMsg = ci.querySelector('p:last-of-type');
        if (lastMsg) lastMsg.textContent = msg.contenido;
      }
      // Append to active chat
      if (
        (msg.remitente_id === activeUserId && msg.destinatario_id === user.id) ||
        (msg.remitente_id === user.id && msg.destinatario_id === activeUserId)
      ) {
        appendMessage(msg);
        const msgs = document.getElementById('messagesArea');
        msgs.scrollTop = msgs.scrollHeight;
      } else {
        // Show dot on conv item for the sender
        const item = document.querySelector(`.conv-item[data-id="${msg.remitente_id}"]`);
        if (item && !item.classList.contains('active-conv')) {
          const avatar = item.querySelector('div[style*="border-radius:50%"]');
          if (avatar && !avatar.querySelector('span')) {
            avatar.insertAdjacentHTML('beforeend', '<span style="position:absolute;top:-2px;right:-2px;width:10px;height:10px;background:#f87171;border-radius:50%;border:2px solid #161b22;"></span>');
          }
        }
      }
    });

    window.appState.socket.on('user_typing', (data) => {
      const typing = document.getElementById('typingIndicator');
      if (typing && data.userId === activeUserId) {
        typing.textContent = `${activeUserName} está escribiendo...`;
        setTimeout(() => { if (typing) typing.textContent = ''; }, 3000);
      }
    });
  }

  // ── APPEND MESSAGE ────────────────────────────────
  function appendMessage(msg) {
    const msgs = document.getElementById('messagesArea');
    if (!msgs) return;
    // Remove empty state text if present
    const emptyMsg = msgs.querySelector('p');
    if (emptyMsg && emptyMsg.textContent.includes('primero')) emptyMsg.remove();

    const isMine = msg.remitente_id === user.id;
    const bubble = document.createElement('div');
    bubble.style.cssText = `align-self:${isMine ? 'flex-end' : 'flex-start'};max-width:65%;display:flex;flex-direction:column;gap:2px;`;
    bubble.innerHTML = `
      <div style="background:${isMine ? '#1f6feb' : '#1c2333'};color:${isMine ? 'white' : '#e6edf3'};padding:10px 14px;border-radius:${isMine ? '14px 14px 2px 14px' : '14px 14px 14px 2px'};font-size:0.85rem;line-height:1.4;word-break:break-word;">
        ${msg.contenido}
      </div>
      <div style="font-size:0.65rem;color:#7d8590;text-align:${isMine ? 'right' : 'left'};padding:0 4px;">
        ${new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    `;
    msgs.appendChild(bubble);
  }

  // ── DATE FORMATTER ────────────────────────────────
  function formatFecha(fecha) {
    if (!fecha) return '';
    const d = new Date(fecha), now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    if (diff === 1) return 'Ayer';
    if (diff < 7) return `${diff}d`;
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  }
}
