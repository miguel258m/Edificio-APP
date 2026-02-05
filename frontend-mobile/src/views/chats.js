// =====================================================
// CHATS VIEW - Lista de conversaciones para vigilante
// =====================================================

export function renderChats(container) {
  const user = window.appState.user;

  container.innerHTML = `
    <div class="page">
      <!-- Header Premium -->
      <div style="background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary)); padding: 3rem 0; border-bottom: 1px solid var(--glass-border); box-shadow: var(--shadow-md);">
        <div class="container">
          <div class="flex justify-between items-center">
            <div>
              <h1 style="font-size: 1.5rem; font-weight: 700; color: white;">💬 Conversaciones</h1>
              <p style="font-size: 0.875rem; opacity: 0.9; color: var(--text-secondary);">Mensajes con residentes y personal</p>
            </div>
            <button onclick="window.history.back()" class="btn btn-ghost" style="padding: 0.5rem; color: white;">
              ←
            </button>
          </div>
        </div>
      </div>


      <div class="container" style="position: relative; z-index: 10; padding-top: var(--spacing-lg);">

        <div id="chatsList">
          <div class="loading-spinner" style="margin: 2rem auto;"></div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <a href="#" class="nav-item" onclick="window.navigateTo('/dashboard-${user.rol}'); return false;">
          <span class="nav-icon">🏠</span>
          <span>Inicio</span>
        </a>
        <a href="#" class="nav-item active">
          <span class="nav-icon">💬</span>
          <span>Chats</span>
        </a>
        <a href="#" class="nav-item" onclick="showPerfil(); return false;">
          <span class="nav-icon">👤</span>
          <span>Perfil</span>
        </a>
      </nav>
    </div>
  `;

  loadConversaciones();

  async function loadConversaciones() {
    try {
      const response = await fetch(`${window.API_URL}/mensajes/conversaciones`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });

      const conversaciones = await response.json();
      const container = document.getElementById('chatsList');

      if (conversaciones.length === 0) {
        container.innerHTML = `
          <div class="card text-center" style="padding: 3rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">💬</div>
            <p style="color: var(--text-muted);">No tienes conversaciones</p>
          </div>
        `;
        return;
      }

      container.innerHTML = conversaciones.map(c => `
        <div 
          class="card mb-3 fade-in" 
          style="cursor: pointer; transition: transform 0.2s;"
          onclick="window.navigateTo('/chat', { userId: ${c.usuario_id}, userName: '${c.nombre}' })"
          onmouseover="this.style.transform='translateX(5px)'"
          onmouseout="this.style.transform='translateX(0)'"
        >
          <div class="flex justify-between items-center">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 style="font-weight: 600; font-size: 1rem; margin: 0;">${c.nombre}</h3>
                ${c.no_leidos > 0 ? `
                  <span class="badge badge-warning" style="font-size: 0.7rem;">
                    ${c.no_leidos}
                  </span>
                ` : ''}
              </div>
              <p style="font-size: 0.875rem; color: var(--text-secondary); margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${c.ultimo_mensaje || 'Sin mensajes'}
              </p>
            </div>
            <div style="text-align: right; color: var(--text-muted); font-size: 0.75rem;">
              ${c.ultima_fecha ? formatearFecha(c.ultima_fecha) : ''}
            </div>
          </div>
        </div>
      `).join('');

    } catch (error) {
      console.error('Error al cargar conversaciones:', error);
      document.getElementById('chatsList').innerHTML = `
        <div class="card" style="padding: 2rem; text-align: center; color: var(--danger);">
          <p>❌ Error al cargar conversaciones</p>
        </div>
      `;
    }
  }

  function formatearFecha(fecha) {
    const date = new Date(fecha);
    const ahora = new Date();
    const diff = ahora - date;
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (dias === 0) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (dias === 1) {
      return 'Ayer';
    } else if (dias < 7) {
      return `${dias}d`;
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    }
  }
}
