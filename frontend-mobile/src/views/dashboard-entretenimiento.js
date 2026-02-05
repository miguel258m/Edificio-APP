// =====================================================
// DASHBOARD ENTRETENIMIENTO - Vista para personal de social/eventos
// =====================================================

export function renderDashboardEntretenimiento(container) {
    const user = window.appState.user;

    container.innerHTML = `
    <div class="page">
      <!-- Header Premium -->
      <div style="background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary)); padding: 3rem 0; border-bottom: 1px solid var(--glass-border); box-shadow: var(--shadow-md);">
        <div class="container">
          <div class="flex justify-between items-center">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <div style="width: 45px; height: 45px; border-radius: 12px; background: rgba(244, 114, 182, 0.1); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 1px solid rgba(244, 114, 182, 0.2);">
                  🎭
                </div>
                <div>
                  <h1 style="font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em;">Hola, ${user.nombre.split(' ')[0]}</h1>
                  <p style="font-size: 0.875rem; color: var(--text-muted); font-weight: 500;">Personal de Entretenimiento</p>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
               <button class="btn btn-ghost" onclick="window.logout()" style="padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 12px;">
                 🚪
               </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container" style="position: relative; z-index: 10; padding-top: var(--spacing-lg);">
        
        <!-- Panel de Acciones -->
        <h2 style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.25rem;">Gestión de Actividades</h2>
        <div class="grid grid-2 gap-3 mb-4">
          <div class="card p-4 flex flex-col items-center justify-center text-center clickable fade-in" style="animation-delay: 0.1s; border: 1px solid var(--glass-border); background: var(--glass-bg);" onclick="showToast('Próximamente: Crear Evento')">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">📅</div>
            <h3 style="font-size: 0.9rem; font-weight: 600;">Crear Evento</h3>
          </div>
          <div class="card p-4 flex flex-col items-center justify-center text-center clickable fade-in" style="animation-delay: 0.2s; border: 1px solid var(--glass-border); background: var(--glass-bg);" onclick="showToast('Próximamente: Reservas')">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">🎟️</div>
            <h3 style="font-size: 0.9rem; font-weight: 600;">Ver Reservas</h3>
          </div>
          <div class="card p-4 flex flex-col items-center justify-center text-center clickable fade-in" style="animation-delay: 0.3s; border: 1px solid var(--glass-border); background: var(--glass-bg);" onclick="window.navigateTo('/solicitudes')">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">📋</div>
            <h3 style="font-size: 0.9rem; font-weight: 600;">Solicitudes</h3>
          </div>
          <div class="card p-4 flex flex-col items-center justify-center text-center clickable fade-in" style="animation-delay: 0.4s; border: 1px solid var(--glass-border); background: var(--glass-bg);" onclick="window.navigateTo('/chats')">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">💬</div>
            <h3 style="font-size: 0.9rem; font-weight: 600;">Mensajes</h3>
          </div>
        </div>

        <!-- Próximos Eventos (Placeholder) -->
        <div class="card fade-in" style="animation-delay: 0.5s; border: 1px solid var(--glass-border); background: var(--glass-bg);">
          <div class="flex justify-between items-center mb-4">
            <h2 class="card-title" style="margin: 0; font-size: 1.1rem; display: flex; align-items: center; gap: 0.75rem;">
              <span style="color: var(--role-entretenimiento);">⭐</span> Próximos Eventos
            </h2>
          </div>
          <div style="padding: 2rem; text-align: center; border: 1px dashed var(--glass-border); border-radius: var(--radius-md);">
            <p style="color: var(--text-muted); font-size: 0.9rem;">No hay eventos programados para hoy.</p>
            <button class="btn btn-sm btn-primary mt-3" onclick="showToast('Próximamente: Programar')">Programar Actividad</button>
          </div>
        </div>

      </div>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <a href="#" class="nav-item active">
          <span class="nav-icon">🏠</span>
          <span>Inicio</span>
        </a>
        <a href="#" class="nav-item" onclick="window.navigateTo('/chats'); return false;">
          <span class="nav-icon">💬</span>
          <span>Mensajes</span>
        </a>
        <a href="#" class="nav-item" onclick="window.navigateTo('/perfil'); return false;">
          <span class="nav-icon">👤</span>
          <span>Perfil</span>
        </a>
      </nav>
    </div>
  `;
}

function showToast(mensaje) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: var(--bg-secondary); color: white; padding: 1rem 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); z-index: 9999; border: 1px solid var(--glass-border); backdrop-filter: blur(10px);';
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
