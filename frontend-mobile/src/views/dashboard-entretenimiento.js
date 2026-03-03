// =====================================================
// DASHBOARD ENTRETENIMIENTO - Premium Redesign
// =====================================================
import { renderSidebarLayout } from '../utils/sidebar-layout.js';
import { renderAnnouncementsWidget } from '../utils/announcements.js';

export function renderDashboardEntretenimiento(container) {
  const user = window.appState.user;
  const nombre = user.nombre.split(' ')[0];

  const navItems = [
    { key: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/dashboard-entretenimiento' },
    { key: 'chats', icon: '💬', label: 'Mensajes', path: '/chats' },
    { key: 'solicitudes', icon: '📋', label: 'Solicitudes', path: '/solicitudes' },
    { key: 'perfil', icon: '⚙️', label: 'Perfil', path: '/perfil' },
  ];

  const main = renderSidebarLayout(container, {
    role: 'entretenimiento',
    activeNav: 'dashboard',
    pageTitle: 'Panel de Recreación',
    pageSubtitle: 'Gestión de eventos y actividades',
    breadcrumb: 'Dashboard',
    navItems,
  });

  main.innerHTML = `
    <!-- WELCOME BANNER -->
    <div class="fade-in" style="background: linear-gradient(135deg, #1a0533 0%, #2d1465 100%); border: 1px solid rgba(167,139,250,0.2); border-radius: 16px; padding: 24px; margin-bottom: 24px; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -40px; right: -40px; width: 160px; height: 160px; background: radial-gradient(circle, rgba(244,114,182,0.15), transparent 70%); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -30px; left: 20px; font-size: 5rem; opacity: 0.07;">🎭</div>
      <div style="position: relative; z-index: 1;">
        <p style="font-size: 0.75rem; font-weight: 700; color: #c084fc; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px;">PERSONAL DE RECREACIÓN</p>
        <h2 style="font-size: 1.5rem; font-weight: 800; color: white; margin-bottom: 6px;">¡Hola, ${nombre}! 🎉</h2>
        <p style="color: rgba(255,255,255,0.55); font-size: 0.85rem; margin: 0;">Gestiona eventos y anima la comunidad del edificio.</p>
      </div>
    </div>

    <!-- STATS -->
    <div class="ds-stats-grid fade-in">
      <div class="ds-stat-card" style="border-color: rgba(244,114,182,0.15); background: rgba(244,114,182,0.04);">
        <div class="ds-stat-label" style="color: #f472b6;">🎟️ Solicitudes</div>
        <div class="ds-stat-value" id="ent-stat-total" style="color: #f472b6;">–</div>
        <div class="ds-stat-sub">de actividades</div>
      </div>
      <div class="ds-stat-card" style="border-color: rgba(251,191,36,0.15); background: rgba(251,191,36,0.04);">
        <div class="ds-stat-label" style="color: #fbbf24;">⏳ Pendientes</div>
        <div class="ds-stat-value" id="ent-stat-pending" style="color: #fbbf24;">–</div>
        <div class="ds-stat-sub">por gestionar</div>
      </div>
      <div class="ds-stat-card" style="border-color: rgba(74,222,128,0.15); background: rgba(74,222,128,0.04);">
        <div class="ds-stat-label" style="color: #4ade80;">✅ Completadas</div>
        <div class="ds-stat-value" id="ent-stat-done" style="color: #4ade80;">–</div>
        <div class="ds-stat-sub">este mes</div>
      </div>
    </div>

    <div class="ds-grid-2 fade-in">
      <!-- LEFT: AVISOS -->
      <div class="ds-card">
        <div class="ds-card-header"><p class="ds-card-title">📢 Avisos del Condominio</p></div>
        <div id="announcementsWidget"></div>
      </div>

      <!-- RIGHT: SOLICITUDES PENDIENTES -->
      <div class="ds-card" style="display: flex; flex-direction: column;">
        <div class="ds-card-header" style="margin-bottom: 12px;">
          <p class="ds-card-title" style="color: #f472b6;">📋 Solicitudes de Actividades</p>
          <button onclick="window.navigateTo('/solicitudes')" style="background: rgba(244,114,182,0.1); border: 1px solid rgba(244,114,182,0.25); color: #f472b6; border-radius: 8px; padding: 5px 12px; font-size: 0.72rem; font-weight: 600; cursor: pointer; font-family: inherit;">Ver todas →</button>
        </div>
        <div id="ent-solicitudes-list">
          <div class="loading-spinner" style="margin: 3rem auto;"></div>
        </div>
      </div>
    </div>
  `;

  if (typeof renderAnnouncementsWidget === 'function') renderAnnouncementsWidget('announcementsWidget');
  loadSolicitudesEnt();

  async function loadSolicitudesEnt() {
    try {
      const res = await fetch(`${window.API_URL}/solicitudes`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      const data = await res.json();
      const solicitudes = Array.isArray(data) ? data.filter(s => s.tipo === 'entretenimiento') : [];

      const total = solicitudes.length;
      const pending = solicitudes.filter(s => s.estado === 'pendiente' || s.estado === 'en_proceso').length;
      const done = solicitudes.filter(s => s.estado === 'completada').length;

      document.getElementById('ent-stat-total').textContent = total;
      document.getElementById('ent-stat-pending').textContent = pending;
      document.getElementById('ent-stat-done').textContent = done;

      const listEl = document.getElementById('ent-solicitudes-list');
      const activas = solicitudes.filter(s => s.estado !== 'completada');

      if (activas.length === 0) {
        listEl.innerHTML = `
          <div style="text-align: center; padding: 3rem 1rem;">
            <div style="font-size: 3rem; margin-bottom: 12px; opacity: 0.4;">🎉</div>
            <p style="color: var(--sb-muted); font-size: 0.85rem;">No hay solicitudes pendientes</p>
          </div>`;
        return;
      }

      const eColor = { pendiente: '#fbbf24', en_proceso: '#38bdf8', completada: '#4ade80' };
      const eLabel = { pendiente: 'Pendiente', en_proceso: 'En Proceso', completada: 'Completada' };

      listEl.innerHTML = activas.map(s => {
        let detalles = s.detalles;
        if (typeof detalles === 'string') try { detalles = JSON.parse(detalles); } catch { detalles = {}; }
        const area = detalles?.area || 'Área común';
        const invitados = detalles?.invitados || detalles?.cantidad || 'N/A';
        return `
        <div style="background: rgba(244,114,182,0.04); border: 1px solid rgba(244,114,182,0.1); border-radius: 12px; padding: 14px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
            <div>
              <span style="font-size: 0.65rem; background: rgba(244,114,182,0.1); color: #f472b6; padding: 2px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase;">${area}</span>
              <span style="font-size: 0.65rem; color: rgba(255,255,255,0.4); margin-left: 8px;">👥 ${invitados} invitados</span>
              <p style="font-size: 0.88rem; font-weight: 700; color: white; margin: 6px 0 0;">${s.descripcion?.substring(0, 65)}${(s.descripcion?.length || 0) > 65 ? '...' : ''}</p>
            </div>
            <span style="background: ${eColor[s.estado]}20; color: ${eColor[s.estado]}; border: 1px solid ${eColor[s.estado]}30; border-radius: 20px; padding: 3px 10px; font-size: 0.62rem; font-weight: 700; white-space: nowrap; margin-left: 8px;">${eLabel[s.estado]}</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--sb-border); padding-top: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 24px; height: 24px; border-radius: 50%; background: #a855f7; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: white; font-weight: 700;">${(s.usuario_nombre || '?')[0]}</div>
              <span style="font-size: 0.75rem; color: var(--sb-muted);">${s.usuario_nombre} · Dpto ${s.usuario_apartamento || 'N/A'}</span>
            </div>
            <div style="display: flex; gap: 8px;">
              ${s.usuario_telefono ? `<a href="tel:${s.usuario_telefono}" style="background: rgba(255,255,255,0.05); border: 1px solid var(--sb-border); border-radius: 8px; padding: 5px 8px; text-decoration: none;">📞</a>` : ''}
              <button onclick="window.navigateTo('/chat', { userId: ${s.usuario_id}, userName: '${s.usuario_nombre?.replace(/'/g, "\\'")}' })" 
                style="background: rgba(244,114,182,0.1); border: 1px solid rgba(244,114,182,0.25); color: #f472b6; border-radius: 8px; padding: 5px 8px; cursor: pointer;">💬</button>
              ${s.estado === 'pendiente' ? `<button onclick="entCambiarEstado(${s.id},'en_proceso')" style="background:#a855f7;color:white;border:none;border-radius:8px;padding:6px 12px;font-size:0.72rem;font-weight:700;cursor:pointer;font-family:inherit;">Iniciar</button>` : ''}
              ${s.estado === 'en_proceso' ? `<button onclick="entCambiarEstado(${s.id},'completada')" style="background:#4ade80;color:white;border:none;border-radius:8px;padding:6px 12px;font-size:0.72rem;font-weight:700;cursor:pointer;font-family:inherit;">Finalizar</button>` : ''}
            </div>
          </div>
        </div>`;
      }).join('');
    } catch (e) {
      console.error('Error entretenimiento:', e);
      document.getElementById('ent-solicitudes-list').innerHTML = '<p style="color:#f87171;text-align:center;padding:2rem;">❌ Error al cargar</p>';
    }
  }
}

window.entCambiarEstado = async (id, estado) => {
  try {
    const r = await fetch(`${window.API_URL}/solicitudes/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${window.appState.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    });
    if (!r.ok) throw new Error();
    // En lugar de navegar y causar error de actualización, simplemente recargar la lista
    const currentContainer = document.getElementById('ent-solicitudes-list');
    if (currentContainer) {
      // Buscar la función de carga que está en el scope del renderizador
      // Una forma segura es disparar el evento de recarga si lo tuviéramos, 
      // pero aquí simplemente llamaremos a la función global si la exportamos o la guardamos.
      // Por ahora, recargamos la vista completa para asegurar consistencia
      window.navigateTo('/dashboard-entretenimiento');
    }
  } catch (e) {
    console.error(e);
    // Silent fail if it was just a navigation issue, but let's try to reload
    window.location.reload();
  }
};
