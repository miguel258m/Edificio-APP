// =====================================================
// DASHBOARD VIGILANTE - Sidebar Desktop Layout
// =====================================================
import { renderAnnouncementsWidget } from '../utils/announcements.js';
import { renderSidebarLayout } from '../utils/sidebar-layout.js';

export function renderDashboardVigilante(container) {
  const user = window.appState.user;
  const navItems = [
    { key: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/dashboard-vigilante' },
    { key: 'chats', icon: '💬', label: 'Chats', path: '/chats' },
    { key: 'aviso', icon: '📢', label: 'Crear Aviso', onClick: 'showAlertaModal()' },
    { key: 'perfil', icon: '⚙️', label: 'Perfil', path: '/perfil' },
  ];

  const main = renderSidebarLayout(container, {
    role: 'vigilante',
    activeNav: 'dashboard',
    pageTitle: 'Control de Seguridad',
    pageSubtitle: 'Panel de vigilancia y emergencias',
    breadcrumb: 'Dashboard',
    navItems,
  });

  main.innerHTML = `
    <!-- WELCOME BANNER -->
    <div class="fade-in" style="background: linear-gradient(135deg, #0c1a25 0%, #1a2c3d 100%); border: 1px solid rgba(100,116,139,0.25); border-radius: 16px; padding: 24px; margin-bottom: 24px; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -50px; right: -50px; width: 180px; height: 180px; background: radial-gradient(circle, rgba(248,113,113,0.05), transparent 70%);"></div>
      <div style="position: absolute; bottom: -30px; left: 20px; font-size: 5rem; opacity: 0.05;">🛡️</div>
      <div style="position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <p style="font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px;">OFICIAL DE SEGURIDAD</p>
          <h2 style="font-size: 1.5rem; font-weight: 800; color: white; margin-bottom: 6px;">Turno activo, ${user.nombre.split(' ')[0]} 🛡️</h2>
          <p style="color: rgba(255,255,255,0.45); font-size: 0.85rem; margin: 0;">Monitoreo de emergencias, mensajes y avisos del edificio.</p>
        </div>
        <button onclick="showAlertaModal()" style="background: rgba(248,113,113,0.12); border: 1px solid rgba(248,113,113,0.3); color: #f87171; border-radius: 10px; padding: 10px 18px; font-size: 0.8rem; font-weight: 700; cursor: pointer; font-family: inherit; white-space: nowrap;">
          📢 Crear Aviso
        </button>
      </div>
    </div>

    <!-- STATS -->
    <div class="ds-stats-grid fade-in">
      <div class="ds-stat-card red">
        <div class="ds-stat-label">🚨 Emergencias</div>
        <div class="ds-stat-value" id="emergenciasCount" style="color: #f87171;">0</div>
        <div class="ds-stat-sub">activas ahora</div>
      </div>
      <div class="ds-stat-card amber">
        <div class="ds-stat-label">💬 Mensajes</div>
        <div class="ds-stat-value" id="mensajesCount" style="color: #fbbf24;">0</div>
        <div class="ds-stat-sub">sin leer</div>
      </div>
      <div class="ds-stat-card blue">
        <div class="ds-stat-label">📡 Estado</div>
        <div class="ds-stat-value" style="color: #4ade80; font-size: 0.9rem;">EN TURNO</div>
        <div class="ds-stat-sub">activo</div>
      </div>
    </div>

    <!-- EMERGENCIAS ACTIVAS -->
    <div id="emergenciasAlert" class="fade-in" style="display:none; background:rgba(248,113,113,0.06); border:1px solid rgba(248,113,113,0.2); border-left:3px solid #f87171; border-radius:12px; padding:16px; margin-bottom:16px;">
      <p style="font-size:0.8rem;font-weight:700;color:#f87171;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.1em;">🚨 Emergencias Activas</p>
      <div id="emergenciasList"></div>
    </div>

    <div class="ds-grid-2 fade-in">
      <!-- MENSAJES NUEVOS -->
      <div class="ds-card">
        <div class="ds-card-header">
          <p class="ds-card-title">💬 Mensajes Nuevos</p>
          <button onclick="window.navigateTo('/chats')" style="background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.2); color: #38bdf8; border-radius: 8px; padding: 4px 10px; font-size: 0.7rem; font-weight: 600; cursor: pointer; font-family: inherit;">Ver chats →</button>
        </div>
        <div id="mensajesList"><div class="loading-spinner" style="margin:1.5rem auto;"></div></div>
      </div>

      <!-- AVISOS -->
      <div class="ds-card">
        <div class="ds-card-header">
          <p class="ds-card-title">📣 Avisos del Edificio</p>
        </div>
        <div id="announcementsWidget"></div>
      </div>
    </div>

    <!-- MODAL ALERTA -->
    <div id="alertaModal" class="hidden" style="position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(8px);">
      <div style="background:var(--sb-surface);border:1px solid var(--sb-border);border-radius:14px;padding:24px;width:100%;max-width:440px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
          <h2 style="font-size:1rem;font-weight:700;color:var(--sb-text);margin:0;">📢 Nueva Alerta General</h2>
          <button onclick="closeAlertaModal()" style="background:rgba(255,255,255,0.07);border:1px solid var(--sb-border);width:30px;height:30px;border-radius:6px;color:var(--sb-muted);font-size:1.1rem;cursor:pointer;">×</button>
        </div>
        <form id="alertaForm">
          <div style="margin-bottom:12px;"><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:5px;font-weight:600;">Tipo</label><select class="form-select" id="tipoAlerta" required style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"><option value="emergencia">🚨 Emergencia</option><option value="informativa">ℹ️ Informativa</option><option value="mantenimiento">🔧 Mantenimiento</option></select></div>
          <div style="margin-bottom:12px;"><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:5px;font-weight:600;">Título</label><input type="text" class="form-input" id="tituloAlerta" required placeholder="Ej: Corte de agua programado" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"></div>
          <div style="margin-bottom:16px;"><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:5px;font-weight:600;">Mensaje</label><textarea class="form-textarea" id="mensajeAlerta" required placeholder="Describe la alerta..." style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);min-height:80px;resize:none;"></textarea></div>
          <div style="display:flex;gap:10px;"><button type="button" class="btn btn-ghost" onclick="closeAlertaModal()" style="flex:1;">Cancelar</button><button type="submit" class="btn btn-danger" style="flex:1.5;">Enviar Alerta</button></div>
        </form>
      </div>
    </div>
  `;

  loadEmergencias();
  loadMensajes();
  if (typeof renderAnnouncementsWidget === 'function') renderAnnouncementsWidget('announcementsWidget');
}

window.showAlertaModal = () => {
  document.getElementById('alertaModal').classList.remove('hidden');
  document.getElementById('alertaForm').onsubmit = async (e) => { e.preventDefault(); await enviarAlerta(); };
};
window.closeAlertaModal = () => { document.getElementById('alertaModal').classList.add('hidden'); document.getElementById('alertaForm').reset(); };

async function enviarAlerta() {
  const tipo = document.getElementById('tipoAlerta').value;
  const titulo = document.getElementById('tituloAlerta').value;
  const mensaje = document.getElementById('mensajeAlerta').value;
  try {
    const response = await fetch(`${window.API_URL}/alertas`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${window.appState.token}` }, body: JSON.stringify({ tipo, titulo, mensaje }) });
    if (response.ok) { alert('✅ Alerta enviada a todos los residentes'); closeAlertaModal(); if (typeof renderAnnouncementsWidget === 'function') renderAnnouncementsWidget('announcementsWidget'); }
    else { alert('❌ Error al enviar alerta'); }
  } catch (e) { alert('❌ Error de conexión'); }
}

async function loadEmergencias() {
  try {
    const response = await fetch(`${window.API_URL}/emergencias/activas`, { headers: { 'Authorization': `Bearer ${window.appState.token}` } });
    const emergencias = await response.json();
    const alertBox = document.getElementById('emergenciasAlert');
    const container = document.getElementById('emergenciasList');
    const count = document.getElementById('emergenciasCount');
    if (count) count.textContent = emergencias.length;
    if (emergencias.length > 0) {
      alertBox.style.display = 'block';
      container.innerHTML = emergencias.map(e => `
        <div style="background:rgba(248,113,113,0.05);border:1px solid rgba(248,113,113,0.15);border-radius:8px;padding:12px;margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="font-size:0.82rem;font-weight:600;color:#f87171;">🚨 ${e.tipo || 'Emergencia'}</span>
            <span style="font-size:0.68rem;color:var(--sb-muted);">${new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p style="font-size:0.78rem;color:var(--sb-text);margin:0 0 4px;">${e.descripcion}</p>
          <p style="font-size:0.7rem;color:var(--sb-muted);margin:0 0 8px;">📍 ${e.ubicacion} - ${e.usuario_nombre}${e.usuario_telefono ? ` <a href="tel:${e.usuario_telefono}" style="color:#f87171;">📞</a>` : ''}</p>
          <button onclick="atenderEmergencia(${e.id})" data-emergencia-id="${e.id}" style="width:100%;background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);color:#4ade80;border-radius:6px;padding:6px;font-size:0.75rem;font-weight:600;cursor:pointer;font-family:inherit;">✅ Marcar como Atendida</button>
        </div>
      `).join('');
    }
  } catch (e) { console.error('Error emergencias:', e); }
}

async function loadMensajes() {
  const container = document.getElementById('mensajesList');
  const countEl = document.getElementById('mensajesCount');
  if (!container) return;
  try {
    // Use conversations endpoint so messages don't disappear after being read
    const response = await fetch(`${window.API_URL}/mensajes/conversaciones`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const conversaciones = await response.json();
    const lista = Array.isArray(conversaciones) ? conversaciones : [];

    // Also fetch unread count for the badge
    const resUnread = await fetch(`${window.API_URL}/mensajes/no-leidos`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    }).catch(() => null);
    const noLeidos = resUnread?.ok ? await resUnread.json() : [];
    const unreadIds = new Set((Array.isArray(noLeidos) ? noLeidos : []).map(m => m.remitente_id));

    if (countEl) countEl.textContent = unreadIds.size > 0 ? unreadIds.size : lista.length;

    if (lista.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:2rem 1rem;">
          <div style="font-size:2rem;margin-bottom:8px;opacity:0.4;">💬</div>
          <p style="color:var(--sb-muted);font-size:0.82rem;margin:0;">Aún no tienes conversaciones</p>
        </div>`;
      return;
    }

    container.innerHTML = lista.slice(0, 6).map(conv => {
      const otherId = conv.otro_usuario_id || conv.id;
      const otherName = conv.otro_usuario_nombre || conv.nombre || 'Usuario';
      const lastMsg = conv.ultimo_mensaje || conv.contenido || '...';
      const time = conv.ultima_fecha || conv.created_at;
      const hasUnread = unreadIds.has(otherId);
      const initial = otherName[0]?.toUpperCase() || '?';
      const colors = ['#818cf8', '#f472b6', '#38bdf8', '#4ade80', '#fbbf24', '#f87171'];
      const color = colors[otherId % colors.length];

      return `
      <div onclick="abrirChat(${otherId},'${otherName}')"
        style="display:flex;align-items:center;gap:12px;padding:10px;border-radius:10px;cursor:pointer;transition:background 0.15s;${hasUnread ? 'background:rgba(255,255,255,0.03);' : ''}"
        onmouseover="this.style.background='rgba(255,255,255,0.05)'"
        onmouseout="this.style.background='${hasUnread ? 'rgba(255,255,255,0.03)' : 'transparent'}'">
        <div style="width:38px;height:38px;border-radius:50%;background:${color}22;border:1.5px solid ${color}55;display:flex;align-items:center;justify-content:center;font-size:0.85rem;font-weight:700;color:${color};flex-shrink:0;">${initial}</div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
            <span style="font-size:0.85rem;font-weight:${hasUnread ? '700' : '600'};color:${hasUnread ? 'var(--sb-text)' : 'var(--sb-muted)'};">${otherName}</span>
            ${hasUnread ? `<span style="background:rgba(251,191,36,0.2);color:#fbbf24;border-radius:8px;padding:1px 6px;font-size:0.6rem;font-weight:700;">NUEVO</span>` : ''}
          </div>
          <p style="font-size:0.72rem;color:var(--sb-muted);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${String(lastMsg).substring(0, 50)}</p>
        </div>
        ${time ? `<span style="font-size:0.62rem;color:var(--sb-muted);flex-shrink:0;">${new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>` : ''}
      </div>`;
    }).join('');
  } catch (e) {
    console.error('Error mensajes vigilante:', e);
    container.innerHTML = '<p style="color:#f87171;text-align:center;padding:1rem;font-size:0.78rem;">❌ Error al cargar mensajes</p>';
  }
}

async function loadSolicitudesPendientes() {
  try {
    const response = await fetch(`${window.API_URL}/solicitudes?estado=pendiente`, { headers: { 'Authorization': `Bearer ${window.appState.token}` } });
    const solicitudes = await response.json();
    const container = document.getElementById('solicitudesList');
    const count = document.getElementById('solicitudesCount');
    if (count) count.textContent = solicitudes.length;
    if (!container || solicitudes.length === 0) return;
    const pc = { baja: '#38bdf8', media: '#fbbf24', alta: '#f87171' };
    container.innerHTML = solicitudes.slice(0, 5).map(s => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--sb-border);">
        <div>
          <p style="font-size:0.82rem;font-weight:600;color:var(--sb-text);margin:0 0 2px;">${{ medica: '🏥', limpieza: '🧹', entretenimiento: '🎉' }[s.tipo] || '📋'} ${s.tipo}</p>
          <p style="font-size:0.7rem;color:var(--sb-muted);margin:0;">${s.descripcion?.substring(0, 45)}${(s.descripcion?.length || 0) > 45 ? '...' : ''}</p>
        </div>
        <span style="background:rgba(255,255,255,0.06);color:${pc[s.prioridad] || 'var(--sb-muted)'};border-radius:10px;padding:2px 7px;font-size:0.62rem;font-weight:600;">${s.prioridad || '—'}</span>
      </div>
    `).join('');
  } catch (e) { console.error('Error solicitudes:', e); }
}

window.atenderEmergencia = async (id) => {
  const btn = document.querySelector(`[data-emergencia-id="${id}"]`);
  if (btn) { btn.disabled = true; btn.textContent = 'Cerrando...'; }
  try {
    const r = await fetch(`${window.API_URL}/emergencias/${id}/cerrar`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    if (r.ok) {
      // Show success toast instead of alert
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#166534;border:1px solid rgba(74,222,128,0.4);color:#4ade80;padding:12px 20px;border-radius:10px;font-size:0.82rem;font-weight:600;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
      toast.textContent = '✅ Emergencia marcada como atendida';
      document.body.appendChild(toast);
      setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.4s'; setTimeout(() => toast.remove(), 400); }, 2500);
      loadEmergencias();
    } else {
      const err = await r.json().catch(() => ({}));
      alert('❌ ' + (err.error || 'No se pudo marcar como atendida'));
      if (btn) { btn.disabled = false; btn.textContent = '✅ Marcar como Atendida'; }
    }
  } catch (e) {
    console.error(e);
    alert('❌ Error de conexión');
    if (btn) { btn.disabled = false; btn.textContent = '✅ Marcar como Atendida'; }
  }
};
window.abrirChat = (userId, userName = 'Residente') => window.navigateTo('/chats', { userId, userName });
