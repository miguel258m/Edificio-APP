// =====================================================
// SOLICITUDES VIEW - Con sidebar layout y filtro por tipo
// =====================================================
import { renderSidebarLayout } from '../utils/sidebar-layout.js';

export function renderSolicitudes(container, tipoFiltro = null) {
  const user = window.appState.user;
  const isResidente = user.rol === 'residente';

  // Nav items based on role
  const dashboardPath = {
    residente: '/dashboard-residente', vigilante: '/dashboard-vigilante', admin: '/dashboard-admin',
    limpieza: '/dashboard-limpieza', gerente: '/dashboard-gerente', medico: '/dashboard-medico',
    entretenimiento: '/dashboard-entretenimiento'
  }[user.rol] || '/';

  const navItems = isResidente ? [
    { key: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/dashboard-residente' },
    { key: 'chat', icon: '💬', label: 'Chat', path: '/chats' },
    { key: 'medica', icon: '🏥', label: 'Atención Médica', onClick: "window.navigateTo('/solicitudes',{tipo:'medica'})" },
    { key: 'limpieza', icon: '🧹', label: 'Limpieza', onClick: "window.navigateTo('/solicitudes',{tipo:'limpieza'})" },
    { key: 'eventos', icon: '🎉', label: 'Eventos', onClick: "window.navigateTo('/solicitudes',{tipo:'entretenimiento'})" },
    { key: 'solicitudes', icon: '📋', label: 'Mis Solicitudes', path: '/solicitudes' },
    { key: 'perfil', icon: '⚙️', label: 'Perfil', path: '/perfil' },
  ] : [
    { key: 'dashboard', icon: '🏠', label: 'Dashboard', path: dashboardPath },
    { key: 'solicitudes', icon: '📋', label: 'Solicitudes', path: '/solicitudes' },
    { key: 'perfil', icon: '⚙️', label: 'Perfil', path: '/perfil' },
  ];

  // Determine page title from tipo filter
  const tipoMeta = {
    medica: { label: 'Atención Médica', icon: '🏥', createLabel: 'Nueva solicitud médica', createTipo: 'medica' },
    limpieza: { label: 'Limpieza', icon: '🧹', createLabel: 'Solicitar limpieza', createTipo: 'limpieza' },
    entretenimiento: { label: 'Eventos', icon: '🎉', createLabel: 'Agendar evento', createTipo: 'entretenimiento' },
  };
  const meta = tipoFiltro ? tipoMeta[tipoFiltro] : null;
  const pageTitle = meta ? `${meta.icon} ${meta.label}` : '📋 Mis Solicitudes';

  const activeNav = tipoFiltro === 'medica' ? 'medica'
    : tipoFiltro === 'limpieza' ? 'limpieza'
      : tipoFiltro === 'entretenimiento' ? 'eventos'
        : 'solicitudes';

  const main = renderSidebarLayout(container, {
    role: user.rol,
    activeNav,
    pageTitle,
    pageSubtitle: isResidente ? user.nombre : 'Gestión del edificio',
    breadcrumb: meta ? meta.label : 'Mis Solicitudes',
    navItems,
  });

  main.innerHTML = `
    <!-- HEADER ACTIONS -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;flex-wrap:wrap;gap:10px;">
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${isResidente && tipoFiltro ? `
          <button onclick="window.navigateTo('/solicitudes')" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:var(--sb-muted);border-radius:8px;padding:6px 12px;font-size:0.75rem;font-weight:600;cursor:pointer;font-family:inherit;">
            ← Ver todas
          </button>
        ` : ''}
        ${isResidente ? `
          <span style="font-size:0.75rem;color:var(--sb-muted);align-self:center;">
            ${tipoFiltro ? `Mostrando solo: ${meta?.label}` : 'Todas tus solicitudes'}
          </span>
        ` : ''}
      </div>
      ${isResidente && meta ? `
        <button onclick="window._showSolicitudFromList('${meta.createTipo}')" style="background:rgba(88,166,255,0.12);border:1px solid rgba(88,166,255,0.25);color:#58a6ff;border-radius:8px;padding:8px 14px;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px;">
          ＋ ${meta.createLabel}
        </button>
      ` : ''}
    </div>

    <!-- ESTADO FILTERS (tabs) -->
    <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;">
      ${['todas', 'pendiente', 'en_proceso', 'completada'].map(f => `
        <button class="sol-filter-btn" data-f="${f}" onclick="window._solFilter('${f}')"
          style="background:${f === 'todas' ? 'rgba(88,166,255,0.15)' : 'rgba(255,255,255,0.05)'};border:1px solid ${f === 'todas' ? 'rgba(88,166,255,0.4)' : 'rgba(255,255,255,0.1)'};color:${f === 'todas' ? '#58a6ff' : '#7d8590'};border-radius:20px;padding:5px 14px;font-size:0.72rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.15s;">
          ${{ todas: 'Todas', pendiente: 'Pendientes', en_proceso: 'En Proceso', completada: 'Completadas' }[f]}
        </button>
      `).join('')}
    </div>

    <!-- LIST -->
    <div id="solList"><div class="loading-spinner" style="margin:2rem auto;"></div></div>

    <!-- CREATE MODAL (for residente) -->
    <div id="solCreateModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(8px);">
      <div id="solCreateModalInner" style="background:var(--sb-surface);border:1px solid var(--sb-border);border-radius:12px;padding:24px;width:100%;max-width:460px;max-height:85vh;overflow-y:auto;"></div>
    </div>
  `;

  let currentEstado = 'todas';

  loadSolicitudes(currentEstado);

  // ── ESTADO FILTER ───────────────────────────────
  window._solFilter = (f) => {
    currentEstado = f;
    document.querySelectorAll('.sol-filter-btn').forEach(b => {
      const active = b.dataset.f === f;
      b.style.background = active ? 'rgba(88,166,255,0.15)' : 'rgba(255,255,255,0.05)';
      b.style.borderColor = active ? 'rgba(88,166,255,0.4)' : 'rgba(255,255,255,0.1)';
      b.style.color = active ? '#58a6ff' : '#7d8590';
    });
    loadSolicitudes(f);
  };

  // ── LOAD ─────────────────────────────────────────
  async function loadSolicitudes(estadoFilter = 'todas') {
    const list = document.getElementById('solList');
    if (!list) return;
    list.innerHTML = '<div class="loading-spinner" style="margin:2rem auto;"></div>';
    try {
      const isStaff = !isResidente;
      const endpoint = isStaff
        ? `${window.API_URL}/solicitudes`
        : `${window.API_URL}/solicitudes/mis-solicitudes`;
      const res = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${window.appState.token}` } });
      let data = await res.json();

      // Apply tipo filter (sidebar nav)
      if (tipoFiltro) data = data.filter(s => s.tipo === tipoFiltro);
      // Apply estado filter
      if (estadoFilter !== 'todas') data = data.filter(s => s.estado === estadoFilter);

      if (!data.length) {
        list.innerHTML = `
          <div style="text-align:center;padding:3rem 1rem;background:var(--sb-surface);border:1px solid var(--sb-border);border-radius:10px;">
            <div style="font-size:2.5rem;margin-bottom:10px;">${meta?.icon || '📋'}</div>
            <p style="color:#7d8590;font-size:0.85rem;">
              ${isResidente ? 'Aún no tienes solicitudes' : 'No hay solicitudes'}
              ${tipoFiltro ? ` de ${meta?.label}` : ''}
              ${estadoFilter !== 'todas' ? ` con estado "${estadoFilter}"` : ''}.
            </p>
          </div>`;
        return;
      }

      const eColor = { pendiente: '#fbbf24', en_proceso: '#38bdf8', completada: '#4ade80', rechazada: '#f87171' };
      const eBg = { pendiente: 'rgba(251,191,36,0.08)', en_proceso: 'rgba(56,189,248,0.08)', completada: 'rgba(74,222,128,0.08)', rechazada: 'rgba(248,113,113,0.08)' };
      const eLabel = { pendiente: 'Pendiente', en_proceso: 'En Proceso', completada: 'Completada', rechazada: 'Rechazada' };
      const tIcon = { medica: '🏥', limpieza: '🧹', entretenimiento: '🎉', mantenimiento: '🔧', general: '📋' };
      const tLabel = { medica: 'Atención Médica', limpieza: 'Limpieza', entretenimiento: 'Entretenimiento', mantenimiento: 'Mantenimiento', general: 'General' };

      list.innerHTML = data.map(s => `
        <div style="background:var(--sb-surface);border:1px solid var(--sb-border);border-left:3px solid ${eColor[s.estado] || '#7d8590'};border-radius:10px;padding:16px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
            <div>
              <p style="font-size:0.88rem;font-weight:700;color:var(--sb-text);margin:0 0 3px;">
                ${tIcon[s.tipo] || '📋'} ${tLabel[s.tipo] || s.tipo}
              </p>
              <p style="font-size:0.68rem;color:#7d8590;margin:0;">
                ${new Date(s.fecha_solicitud).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <span style="background:${eBg[s.estado] || 'rgba(255,255,255,0.05)'};color:${eColor[s.estado] || '#7d8590'};border-radius:20px;padding:3px 10px;font-size:0.65rem;font-weight:700;white-space:nowrap;margin-left:10px;">
              ${eLabel[s.estado] || s.estado}
            </span>
          </div>
          <p style="font-size:0.82rem;color:#c9d1d9;margin:0 0 8px;line-height:1.5;">${s.descripcion || ''}</p>
          ${isStaff ? `
            <div style="background:rgba(255,255,255,0.03);border:1px dashed rgba(255,255,255,0.08);border-radius:6px;padding:8px 10px;margin-bottom:8px;font-size:0.72rem;color:#7d8590;">
              👤 <strong style="color:#c9d1d9;">${s.usuario_nombre}</strong> · Dpto ${s.usuario_apartamento || 'N/A'}
            </div>` : ''}
          ${renderDetalles(s.detalles)}
          ${isStaff && s.estado !== 'completada' && s.estado !== 'rechazada' ? `
            <div style="display:flex;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06);">
              ${s.estado === 'pendiente' ? `<button onclick="actualizarEstado(${s.id},'en_proceso')" style="flex:1;background:rgba(31,111,235,0.15);border:1px solid rgba(31,111,235,0.3);color:#58a6ff;border-radius:6px;padding:7px;font-size:0.75rem;font-weight:600;cursor:pointer;font-family:inherit;">✔ Atender</button>` : ''}
              ${s.estado === 'en_proceso' ? `<button onclick="actualizarEstado(${s.id},'completada')" style="flex:1;background:rgba(74,222,128,0.12);border:1px solid rgba(74,222,128,0.25);color:#4ade80;border-radius:6px;padding:7px;font-size:0.75rem;font-weight:600;cursor:pointer;font-family:inherit;">✅ Finalizar</button>` : ''}
              <button onclick="actualizarEstado(${s.id},'rechazada')" style="background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);color:#f87171;border-radius:6px;padding:7px 12px;font-size:0.75rem;font-weight:600;cursor:pointer;font-family:inherit;">✕</button>
            </div>` : ''}
        </div>
      `).join('');
    } catch (e) {
      const list = document.getElementById('solList');
      if (list) list.innerHTML = '<p style="color:#f87171;text-align:center;padding:2rem;">❌ Error al cargar solicitudes</p>';
    }
  }

  // ── UPDATE STATE (staff) ─────────────────────────
  window.actualizarEstado = async (id, nuevoEstado) => {
    if (!confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) return;
    try {
      const res = await fetch(`${window.API_URL}/solicitudes/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${window.appState.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (res.ok) loadSolicitudes(currentEstado);
      else alert('Error al actualizar el estado');
    } catch (e) { alert('Error de conexión'); }
  };

  // ── CREATE from list page ─────────────────────────
  window._showSolicitudFromList = (tipo) => {
    const modal = document.getElementById('solCreateModal');
    const inner = document.getElementById('solCreateModalInner');
    if (!modal || !inner) return;
    const titles = { medica: '🏥 Atención Médica', limpieza: '🧹 Solicitud de Limpieza', entretenimiento: '🎉 Agendar Evento' };
    let extras = '';
    if (tipo === 'entretenimiento') {
      extras = `<div style="margin-bottom:12px;"><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Fecha</label><input type="date" id="sl_fecha" class="form-input" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"></div>
                <div style="margin-bottom:12px;"><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Hora</label><input type="time" id="sl_hora" class="form-input" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"></div>
                <div style="margin-bottom:12px;"><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Invitados</label><input type="number" id="sl_inv" min="1" class="form-input" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"></div>`;
    } else if (tipo === 'limpieza') {
      extras = `<div style="margin-bottom:12px;"><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Área</label><select id="sl_area" class="form-select" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"><option value="">Seleccionar...</option><option value="apartamento">Mi apartamento</option><option value="salon">Salón</option><option value="piscina">Piscina</option><option value="gimnasio">Gimnasio</option></select></div>`;
    } else {
      extras = `<div style="margin-bottom:12px;"><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Urgencia</label><select id="sl_urgencia" class="form-select" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"><option value="baja">Baja</option><option value="media" selected>Media</option><option value="alta">Alta</option></select></div>`;
    }
    inner.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
        <h2 style="font-size:1rem;font-weight:700;color:var(--sb-text);margin:0;">${titles[tipo] || 'Solicitud'}</h2>
        <button onclick="document.getElementById('solCreateModal').style.display='none'" style="background:rgba(255,255,255,0.07);border:1px solid var(--sb-border);width:30px;height:30px;border-radius:6px;color:var(--sb-muted);font-size:1.1rem;cursor:pointer;">×</button>
      </div>
      <div style="margin-bottom:14px;">
        <label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:5px;font-weight:600;">Descripción del problema</label>
        <textarea id="sl_desc" rows="3" placeholder="Escribe los detalles..." style="width:100%;background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);border-radius:8px;padding:10px 12px;font-family:inherit;font-size:0.85rem;resize:none;box-sizing:border-box;"></textarea>
      </div>
      ${extras}
      <div id="slMsgBar"></div>
      <div style="display:flex;gap:10px;margin-top:16px;">
        <button onclick="document.getElementById('solCreateModal').style.display='none'" style="flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#7d8590;border-radius:8px;padding:10px;font-size:0.82rem;font-weight:600;cursor:pointer;font-family:inherit;">Cancelar</button>
        <button id="slSubmitBtn" onclick="window._submitSolList('${tipo}')" style="flex:1.5;background:rgba(31,111,235,0.85);border:none;color:white;border-radius:8px;padding:10px;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:inherit;">Enviar Solicitud</button>
      </div>
    `;
    modal.style.display = 'flex';
  };

  window._submitSolList = async (tipo) => {
    const desc = document.getElementById('sl_desc')?.value?.trim();
    if (!desc) { showSlMsg('⚠️ Escribe una descripción.', '#fbbf24'); return; }
    const detalles = {};
    if (tipo === 'entretenimiento') { detalles.fecha = document.getElementById('sl_fecha')?.value; detalles.hora = document.getElementById('sl_hora')?.value; detalles.invitados = document.getElementById('sl_inv')?.value; }
    if (tipo === 'limpieza') { detalles.area = document.getElementById('sl_area')?.value; }
    const prioridad = document.getElementById('sl_urgencia')?.value || 'media';
    const btn = document.getElementById('slSubmitBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }
    try {
      const res = await fetch(`${window.API_URL}/solicitudes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${window.appState.token}` },
        body: JSON.stringify({ tipo, descripcion: desc, detalles, prioridad })
      });
      if (res.ok) {
        document.getElementById('solCreateModal').style.display = 'none';
        loadSolicitudes(currentEstado);
        const sucMsg = { medica: '✅ Solicitud médica enviada. Por favor espere al médico de turno.', limpieza: '✅ Solicitud de limpieza enviada.', entretenimiento: '✅ Evento agendado correctamente.' }[tipo] || '✅ Solicitud enviada.';
        const t = document.createElement('div');
        t.style.cssText = 'position:fixed;top:20px;right:20px;background:#1c2333;border:1px solid rgba(74,222,128,0.3);color:#4ade80;padding:12px 18px;border-radius:8px;font-size:0.82rem;font-weight:600;z-index:10001;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
        t.textContent = sucMsg; document.body.appendChild(t); setTimeout(() => t.remove(), 4000);
      } else { const d = await res.json().catch(() => ({})); showSlMsg('❌ ' + (d.error || 'No se pudo enviar'), '#f87171'); }
    } catch (e) { showSlMsg('⚠️ Sin conexión con el servidor.', '#fbbf24'); }
    finally { if (btn) { btn.disabled = false; btn.textContent = 'Enviar Solicitud'; } }
  };

  function showSlMsg(msg, color) {
    const el = document.getElementById('slMsgBar');
    if (!el) return;
    el.style.cssText = `background:rgba(255,255,255,0.04);border:1px solid ${color}33;border-left:3px solid ${color};border-radius:6px;padding:8px 12px;margin-bottom:10px;font-size:0.75rem;color:${color};`;
    el.textContent = msg;
  }

  function renderDetalles(detalles) {
    if (!detalles) return '';
    if (typeof detalles === 'string') { try { detalles = JSON.parse(detalles); } catch { return ''; } }
    const items = [];
    if (detalles.fecha) items.push(`📅 Fecha: ${detalles.fecha}`);
    if (detalles.hora) items.push(`🕐 Hora: ${detalles.hora}`);
    if (detalles.invitados) items.push(`👥 Invitados: ${detalles.invitados}`);
    if (detalles.area) items.push(`📍 Área: ${detalles.area}`);
    if (detalles.fecha_preferida) items.push(`📅 Fecha preferida: ${detalles.fecha_preferida}`);
    if (!items.length) return '';
    return `<div style="background:rgba(255,255,255,0.03);border-radius:6px;padding:8px 10px;font-size:0.72rem;color:#7d8590;line-height:1.8;">${items.join(' · ')}</div>`;
  }
}
