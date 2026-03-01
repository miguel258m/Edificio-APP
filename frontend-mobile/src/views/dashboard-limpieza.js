// =====================================================
// DASHBOARD LIMPIEZA - Sidebar Desktop Layout
// =====================================================
import { renderAnnouncementsWidget } from '../utils/announcements.js';
import { renderSidebarLayout } from '../utils/sidebar-layout.js';

export function renderDashboardLimpieza(container) {
  const user = window.appState.user;
  const navItems = [
    { key: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/dashboard-limpieza' },
    { key: 'chats', icon: '💬', label: 'Mensajes', path: '/chats' },
    { key: 'perfil', icon: '⚙️', label: 'Perfil', path: '/perfil' },
  ];

  const main = renderSidebarLayout(container, {
    role: 'limpieza',
    activeNav: 'dashboard',
    pageTitle: 'Panel de Limpieza',
    pageSubtitle: 'Gestión de higiene y mantenimiento',
    breadcrumb: 'Dashboard',
    navItems,
  });

  // Render initial structure
  main.innerHTML = `
    <!-- HEADER / WELCOME BANNER -->
    <div class="ds-welcome-banner fade-in" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 1px solid var(--sb-border); border-radius: 16px; padding: 24px; margin-bottom: 24px; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(56, 189, 248, 0.05); border-radius: 50%; blur: 40px;"></div>
      <div style="position: relative; z-index: 1;">
        <h2 style="font-size: 1.5rem; font-weight: 800; color: white; margin-bottom: 8px;">¡Hola, ${user.nombre.split(' ')[0]}! 👋</h2>
        <p style="color: var(--sb-muted); font-size: 0.9rem; margin-bottom: 0;">Aquí tienes el resumen de tu jornada de hoy.</p>
      </div>
    </div>

    <!-- STATS GRID -->
    <div class="ds-stats-grid fade-in">
      <div class="ds-stat-card blue">
        <div class="ds-stat-label">✨ Tareas Hoy</div>
        <div class="ds-stat-value" id="stats-total">0</div>
        <div class="ds-stat-sub">Asignadas hoy</div>
      </div>
      <div class="ds-stat-card amber">
        <div class="ds-stat-label">⏳ Pendientes</div>
        <div class="ds-stat-value" id="stats-pending">0</div>
        <div class="ds-stat-sub">Esperando inicio</div>
      </div>
      <div class="ds-stat-card green">
        <div class="ds-stat-label">✅ Completadas</div>
        <div class="ds-stat-value" id="stats-completed">0</div>
        <div class="ds-stat-sub">Buen trabajo</div>
      </div>
    </div>

    <div class="ds-grid-2 fade-in">
      <!-- LEFT: ANNOUNCEMENTS -->
      <div class="ds-card">
        <div class="ds-card-header"><p class="ds-card-title">📢 Avisos del Condominio</p></div>
        <div id="announcementsWidget"></div>
      </div>

      <!-- RIGHT: LISTA DE TAREAS -->
      <div class="ds-card" style="display: flex; flex-direction: column;">
        <div class="ds-card-header" style="flex-wrap: wrap; gap: 12px; border-bottom: none; margin-bottom: 12px;">
          <p class="ds-card-title">📋 Mis Tareas</p>
          <div style="display:flex;gap:6px; margin-left: auto;">
            ${['todas', 'pendiente', 'en_proceso', 'completada'].map((f, i) => `
              <button class="lim-filter ${i === 0 ? 'lim-active' : ''}" data-filter="${f}" 
                style="font-size:0.65rem; padding:5px 10px; border-radius:8px; border:1px solid var(--sb-border); background:${i === 0 ? 'rgba(56,189,248,0.1)' : 'transparent'}; color:${i === 0 ? '#38bdf8' : 'var(--sb-muted)'}; cursor:pointer; font-family:inherit; font-weight: 600; transition: all 0.2s;">
                ${['Todas', 'Pend.', 'Proceso', 'Comp.'][i]}
              </button>
            `).join('')}
          </div>
        </div>
        
        <div id="tareasLimpiezaList" style="flex: 1;">
          <div class="loading-spinner" style="margin:4rem auto;"></div>
        </div>
      </div>
    </div>
  `;

  let currentFilter = 'todas';
  loadTareas();
  if (typeof renderAnnouncementsWidget === 'function') renderAnnouncementsWidget('announcementsWidget');

  // Filter logic
  document.querySelectorAll('.lim-filter').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.lim-filter').forEach(b => {
        b.style.background = 'transparent';
        b.style.color = 'var(--sb-muted)';
        b.style.borderColor = 'var(--sb-border)';
      });
      btn.style.background = 'rgba(56,189,248,0.1)';
      btn.style.color = '#38bdf8';
      btn.style.borderColor = 'rgba(56,189,248,0.2)';
      currentFilter = btn.dataset.filter;
      loadTareas(currentFilter);
    };
  });

  async function loadTareas(filter = 'todas') {
    try {
      const response = await fetch(`${window.API_URL}/solicitudes`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      let solicitudes = await response.json();

      // Filter only cleaning tasks
      solicitudes = solicitudes.filter(s => s.tipo === 'limpieza');

      // Update stats
      const total = solicitudes.length;
      const pending = solicitudes.filter(s => s.estado === 'pendiente').length;
      const completed = solicitudes.filter(s => s.estado === 'completada').length;

      document.getElementById('stats-total').textContent = total;
      document.getElementById('stats-pending').textContent = pending;
      document.getElementById('stats-completed').textContent = completed;

      // Apply current filter
      if (filter !== 'todas') solicitudes = solicitudes.filter(s => s.estado === filter);

      const listContainer = document.getElementById('tareasLimpiezaList');

      if (solicitudes.length === 0) {
        listContainer.innerHTML = `
          <div style="text-align:center; padding:4rem 1rem;">
            <div style="font-size:3rem; margin-bottom:16px; opacity: 0.5;">🧹</div>
            <p style="color:var(--sb-muted); font-size:0.9rem;">No hay tareas en esta categoría</p>
          </div>
        `;
        return;
      }

      const eColor = { pendiente: '#fbbf24', en_proceso: '#38bdf8', completada: '#4ade80' };
      const eLabel = { pendiente: 'Pendiente', en_proceso: 'En Proceso', completada: 'Completada' };
      const aLabel = { apartamento: 'Apartamento', salon: 'Salón Eventos', piscina: 'Área Piscina', gimnasio: 'Gimnasio' };

      listContainer.innerHTML = solicitudes.map(s => {
        let detalles = s.detalles;
        if (typeof detalles === 'string') { try { detalles = JSON.parse(detalles); } catch (e) { detalles = {}; } }
        const zona = detalles?.area ? (aLabel[detalles.area] || detalles.area) : `Dpto ${s.usuario_apartamento || 'N/A'}`;
        const fecha = new Date(s.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });

        return `
        <div class="ds-task-card fade-in" style="background: rgba(255,255,255,0.02); border: 1px solid var(--sb-border); border-radius: 12px; padding: 16px; margin-bottom: 12px; transition: all 0.2s;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="font-size: 0.65rem; background: rgba(56, 189, 248, 0.1); color: #38bdf8; padding: 2px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase;">${zona}</span>
                <span style="font-size: 0.65rem; color: var(--sb-muted);">${fecha}</span>
              </div>
              <p style="font-size:0.9rem; font-weight:700; color:var(--sb-text); margin:0;">${s.descripcion}</p>
            </div>
            <span class="ds-badge" style="background: ${eColor[s.estado]}20; color: ${eColor[s.estado]}; border: 1px solid ${eColor[s.estado]}30;">
              ${eLabel[s.estado] || s.estado}
            </span>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; border-top: 1px solid var(--sb-border); padding-top: 12px; margin-top: 4px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 24px; height: 24px; border-radius: 50%; background: #1f6feb; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: white; font-weight: 700;">
                ${(s.usuario_nombre || '?')[0]}
              </div>
              <span style="font-size: 0.75rem; color: var(--sb-muted);">${s.usuario_nombre}</span>
            </div>
            
            <div style="display:flex; gap:8px;">
              ${s.usuario_telefono ? `<a href="tel:${s.usuario_telefono}" class="btn" style="padding: 6px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--sb-border);">📞</a>` : ''}
              
              ${s.estado === 'pendiente' ? `
                <button onclick="cambiarEstado(${s.id},'en_proceso')" 
                  style="background:#38bdf8; color:white; border:none; border-radius:8px; padding:6px 14px; font-size:0.75rem; font-weight:700; cursor:pointer; font-family:inherit; box-shadow: 0 4px 10px rgba(56, 189, 248, 0.3);">
                  Iniciar
                </button>
              ` : ''}
              
              ${s.estado === 'en_proceso' ? `
                <button onclick="cambiarEstado(${s.id},'completada')" 
                  style="background:#4ade80; color:white; border:none; border-radius:8px; padding:6px 14px; font-size:0.75rem; font-weight:700; cursor:pointer; font-family:inherit; box-shadow: 0 4px 10px rgba(74, 222, 128, 0.3);">
                  Terminar
                </button>
              ` : ''}
            </div>
          </div>
        </div>`;
      }).join('');
    } catch (e) {
      console.error('Error tareas:', e);
      document.getElementById('tareasLimpiezaList').innerHTML = '<p style="color:#f87171;text-align:center;padding:2rem;">❌ Error al cargar tareas</p>';
    }
  }

  window.cambiarEstado = async (solicitudId, nuevoEstado) => {
    try {
      const r = await fetch(`${window.API_URL}/solicitudes/${solicitudId}/estado`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${window.appState.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (!r.ok) throw new Error('Error');
      loadTareas(currentFilter);

      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:#161b22; border:1px solid rgba(74,222,128,0.3); color:#4ade80; padding:12px 24px; border-radius:12px; font-size:0.85rem; font-weight:700; z-index:9999; box-shadow:0 10px 30px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 10px; animtion: slideUp 0.3s ease;';
      toast.innerHTML = `<span>${nuevoEstado === 'en_proceso' ? '▶️ Tarea iniciada' : '✅ Tarea completada'}</span>`;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    } catch (e) {
      alert('❌ Error al actualizar estado');
    }
  };
}
