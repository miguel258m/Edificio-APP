// =====================================================
// DASHBOARD RESIDENTE - Sidebar Desktop Layout
// =====================================================
import { renderAnnouncementsWidget } from '../utils/announcements.js';
import { renderSidebarLayout } from '../utils/sidebar-layout.js';

export function renderDashboardResidente(container) {
  const user = window.appState.user;
  const baseUrl = window.API_URL.replace('/api', '');
  const getFotoUrl = (p) => { if (!p) return null; if (p.startsWith('http')) return p; return `${baseUrl}${p.startsWith('/') ? p : '/' + p}`; };

  const navItems = [
    { key: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/dashboard-residente' },
    { key: 'chat', icon: '💬', label: 'Chat', path: '/chats' },
    { key: 'medica', icon: '🏥', label: 'Atención Médica', onClick: "window.navigateTo('/solicitudes',{tipo:'medica'})" },
    { key: 'limpieza', icon: '🧹', label: 'Limpieza', onClick: "window.navigateTo('/solicitudes',{tipo:'limpieza'})" },
    { key: 'eventos', icon: '🎉', label: 'Eventos', onClick: "window.navigateTo('/solicitudes',{tipo:'entretenimiento'})" },
    { key: 'solicitudes', icon: '📋', label: 'Mis Solicitudes', path: '/solicitudes' },
    { key: 'perfil', icon: '⚙️', label: 'Perfil', path: '/perfil' },
  ];

  const main = renderSidebarLayout(container, {
    role: 'residente',
    activeNav: 'dashboard',
    pageTitle: `Bienvenido`,
    pageSubtitle: user.nombre,
    breadcrumb: 'Dashboard',
    navItems,
  });

  main.innerHTML += `
    <!-- INFO BAR -->
    <div style="display:flex;align-items:center;gap:10px;background:var(--sb-surface);border:1px solid var(--sb-border);border-radius:8px;padding:10px 16px;margin-bottom:18px;flex-wrap:wrap;">
      ${user.apartamento ? `<span style="font-size:0.78rem;font-weight:600;color:var(--sb-text);">📍 DPTO ${user.apartamento}</span><span style="color:var(--sb-border);">•</span>` : ''}
      <span style="font-size:0.78rem;color:var(--sb-muted);">Edificio ${user.edificio_nombre || 'A'}</span>
    </div>

    <!-- NOTIFICACIONES PERSONALES -->
    <div id="personalNotificationsWidget" style="margin-bottom:16px;"></div>

    <!-- ESTADO DE PAGO -->
    <div id="paymentStatusWidget" style="margin-bottom:16px;"></div>

    <!-- AVISOS -->
    <div class="ds-card" style="margin-bottom:16px;">
      <div class="ds-card-header">
        <p class="ds-card-title">Avisos</p>
        <a href="#" style="font-size:0.72rem;color:#58a6ff;text-decoration:none;" onclick="return false;">Ver todos →</a>
      </div>
      <div id="announcementsWidget"></div>
    </div>

    <!-- SEGURIDAD POR DEFECTO -->
    <div class="ds-card" style="margin-bottom:16px; border-left: 3px solid #3b82f6; background: linear-gradient(90deg, rgba(59,130,246,0.05) 0%, transparent 100%);">
      <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 16px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="font-size:1.5rem; background:rgba(59,130,246,0.1); width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; color: #3b82f6;">👮</div>
          <div>
            <p style="font-size:0.85rem; font-weight:700; color:white; margin:0;">Seguridad y Vigilancia</p>
            <p style="font-size:0.7rem; color:var(--sb-muted); margin:2px 0 0;">Chat directo con el vigilante de turno</p>
          </div>
        </div>
        <button onclick="window.openChatVigilante()" style="background:#1f6feb; border:none; color:white; border-radius:8px; padding:8px 16px; font-size:0.75rem; font-weight:600; cursor:pointer; font-family:inherit; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Abrir Chat</button>
      </div>
    </div>

    <!-- ACCIONES RÁPIDAS -->
    <div class="ds-card" style="margin-bottom:16px;">
      <div class="ds-card-header"><p class="ds-card-title">Acciones Rápidas</p></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
        ${[
      { icon: '❤️', label: 'Médica', action: "showSolicitudModal('medica')", color: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
      { icon: '🧹', label: 'Limpieza', action: "showSolicitudModal('limpieza')", color: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
      { icon: '📅', label: 'Eventos', action: "showSolicitudModal('entretenimiento')", color: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
    ].map(a => `
          <button onclick="${a.action}" style="background:${a.color};border:1px solid ${a.border};border-radius:10px;padding:22px 8px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;font-family:inherit;transition:filter 0.15s,transform 0.15s;width:100%;" onmouseover="this.style.filter='brightness(1.2)';this.style.transform='translateY(-2px)'" onmouseout="this.style.filter='brightness(1)';this.style.transform='translateY(0)'">
            <span style="font-size:1.8rem;">${a.icon}</span>
            <span style="font-size:0.75rem;font-weight:600;color:var(--sb-text);">${a.label}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- FLOATING SOS BUTTON -->
    <button id="sosFab" onclick="window.showSosWarning()" title="Enviar alerta de emergencia"
      style="position:fixed;bottom:28px;right:28px;z-index:1000;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#ef4444,#b91c1c);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.5rem;box-shadow:0 4px 20px rgba(239,68,68,0.5);animation:sosPulse 2s infinite;">
      🆘
    </button>
    <style>
      @keyframes sosPulse {
        0%,100%{box-shadow:0 4px 20px rgba(239,68,68,0.5);}
        50%{box-shadow:0 4px 32px rgba(239,68,68,0.85),0 0 0 10px rgba(239,68,68,0.12);}
      }
    </style>

    <!-- SOS WARNING MODAL -->
    <div id="sosWarningModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(8px);">
      <div style="background:#161b22;border:1px solid rgba(239,68,68,0.35);border-radius:14px;padding:28px 24px;width:100%;max-width:420px;text-align:center;">
        <div style="font-size:3rem;margin-bottom:14px;">🚨</div>
        <h2 style="font-size:1rem;font-weight:700;color:#f87171;margin:0 0 14px;">Alerta de Emergencia</h2>
        <p style="font-size:0.85rem;color:#e6edf3;line-height:1.7;margin:0 0 20px;">
          Estimado usuario, si presenta una emergencia por favor envíe su alerta por este medio.<br><br>
          <strong style="color:#fbbf24;">⚠️ Solo para situaciones importantes.</strong><br>
          El personal será notificado de inmediato.
        </p>
        <div style="display:flex;gap:10px;">
          <button onclick="document.getElementById('sosWarningModal').style.display='none'" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#7d8590;border-radius:8px;padding:11px;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:inherit;">Cancelar</button>
          <button onclick="window.confirmarEmergencia()" style="flex:1.5;background:linear-gradient(135deg,#ef4444,#b91c1c);border:none;color:white;border-radius:8px;padding:11px;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:inherit;">Enviar Alerta Ahora</button>
        </div>
      </div>
    </div>


    <!-- MIS SOLICITUDES -->
    <div class="ds-card" style="margin-bottom:16px;">
      <div class="ds-card-header">
        <p class="ds-card-title">Mis Solicitudes</p>
        <button onclick="window.navigateTo('/solicitudes')" style="background:rgba(31,111,235,0.12);border:1px solid rgba(31,111,235,0.25);color:#58a6ff;border-radius:6px;padding:4px 10px;font-size:0.72rem;cursor:pointer;font-family:inherit;">Ver todas →</button>
      </div>
      <div id="solicitudesList"><div class="loading-spinner" style="margin:1.5rem auto;"></div></div>
    </div>

    <!-- DELIVERY -->
    <div class="ds-card" id="deliveryContainer">
      <div class="ds-card-header">
        <p class="ds-card-title" style="color:#fbbf24;">🍕 Delivery y Restaurantes</p>
      </div>
      <div id="deliveryList" style="display:flex;flex-direction:column;gap:8px;">
        <div class="loading-spinner" style="margin:1.5rem auto;"></div>
      </div>
    </div>

    <!-- MODAL SOLICITUD -->
    <div id="solicitudModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(8px);">
      <div style="background:var(--sb-surface);border:1px solid var(--sb-border);border-radius:12px;padding:24px;width:100%;max-width:460px;max-height:85vh;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
          <h2 id="modalTitle" style="font-size:1rem;font-weight:700;color:var(--sb-text);margin:0;">Solicitud</h2>
          <button onclick="closeSolicitudModal()" style="background:rgba(255,255,255,0.07);border:1px solid var(--sb-border);width:30px;height:30px;border-radius:6px;color:var(--sb-muted);font-size:1.1rem;cursor:pointer;">×</button>
        </div>
        <div style="margin-bottom:14px;">
          <label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:5px;font-weight:600;">Descripción del problema</label>
          <textarea class="form-input" id="descripcion" rows="3" placeholder="Escribe aquí los detalles..." required style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);resize:none;"></textarea>
        </div>
        <input type="hidden" id="tipoSolicitud">
        <div id="camposAdicionales"></div>
        <div style="display:flex;gap:10px;margin-top:16px;">
          <button type="button" class="btn btn-ghost" style="flex:1;" onclick="closeSolicitudModal()">Cancelar</button>
          <button type="button" id="btnEnviarSolicitud" class="btn btn-primary" style="flex:1.5;" onclick="window.enviarSolicitud()">Enviar Solicitud</button>
        </div>
      </div>
    </div>
  `;

  loadSolicitudes();
  loadPaymentStatus();
  loadDeliveryServices();
  loadPersonalNotifications();
  checkMedicalChatContext();
  if (typeof renderAnnouncementsWidget === 'function') renderAnnouncementsWidget('announcementsWidget');

  // Notificaciones en tiempo real
  if (window.appState.socket) {
    window.appState.socket.off('notificacion');
    window.appState.socket.on('notificacion', (n) => {
      loadPersonalNotifications();
      // Reproducir sonido o vibración opcional
    });
  }
}

async function loadPersonalNotifications() {
  const widget = document.getElementById('personalNotificationsWidget');
  if (!widget) return;
  try {
    const res = await fetch(`${window.API_URL}/notificaciones`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const notifs = await res.json();
    const noLeidas = notifs.filter(n => !n.leida);
    if (noLeidas.length === 0) {
      widget.innerHTML = '';
      return;
    }

    widget.innerHTML = noLeidas.map(n => `
      <div style="background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.25); border-left:3px solid #3b82f6; border-radius:10px; padding:12px; margin-bottom:8px; display:flex; align-items:flex-start; gap:10px; animation: slideIn 0.3s ease-out;">
        <div style="font-size:1.2rem;">🔔</div>
        <div style="flex:1;">
          <p style="font-size:0.8rem; font-weight:700; color:white; margin:0 0 3px;">${n.titulo}</p>
          <p style="font-size:0.75rem; color:var(--sb-muted); margin:0 0 8px; line-height:1.4;">${n.mensaje}</p>
          <button onclick="window.marcarNotifLeida(${n.id})" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#7d8590; border-radius:6px; padding:4px 10px; font-size:0.65rem; cursor:pointer; font-family:inherit;">Entendido</button>
        </div>
      </div>
    `).join('');
  } catch (e) { console.error('Error loadNotifications:', e); }
}

window.marcarNotifLeida = async (id) => {
  try {
    const res = await fetch(`${window.API_URL}/notificaciones/${id}/leida`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    if (res.ok) loadPersonalNotifications();
  } catch (e) { }
};

// ── MODALS / LOGIC ─────────────────────────────────
window.showSolicitudModal = (tipo) => {
  const modal = document.getElementById('solicitudModal');
  const title = document.getElementById('modalTitle');
  const tipoInput = document.getElementById('tipoSolicitud');
  const camposAdicionales = document.getElementById('camposAdicionales');
  if (!modal) return;
  tipoInput.value = tipo;
  title.textContent = { medica: '🏥 Atención Médica', limpieza: '🧹 Solicitud de Limpieza', entretenimiento: '🎉 Agendar Evento' }[tipo] || 'Solicitud';
  if (tipo === 'entretenimiento') {
    camposAdicionales.innerHTML = `
      <div style="margin-bottom:12px;"><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Fecha del evento</label><input type="date" class="form-input" id="fecha" required style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"></div>
      <div style="margin-bottom:12px;"><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Hora</label><input type="time" class="form-input" id="hora" required style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"></div>
      <div style="margin-bottom:12px;"><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Número de invitados</label><input type="number" class="form-input" id="invitados" min="1" required style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"></div>`;
  } else if (tipo === 'limpieza') {
    camposAdicionales.innerHTML = `
      <div style="margin-bottom:12px;"><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Área a limpiar</label><select class="form-select" id="area" required style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"><option value="">Seleccionar...</option><option value="apartamento">Mi apartamento</option><option value="salon">Salón de eventos</option><option value="piscina">Área de piscina</option><option value="gimnasio">Gimnasio</option></select></div>
      <div style="margin-bottom:12px;"><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Fecha preferida</label><input type="date" class="form-input" id="fechaPreferida" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"></div>`;
  } else {
    camposAdicionales.innerHTML = `
      <div style="margin-bottom:12px;"><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Urgencia</label><select class="form-select" id="urgencia" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"><option value="baja">Baja</option><option value="media" selected>Media</option><option value="alta">Alta</option></select></div>`;
  }
  // Clear previous description
  const desc = document.getElementById('descripcion');
  if (desc) desc.value = '';
  modal.style.display = 'flex';
};

window.closeSolicitudModal = () => {
  const modal = document.getElementById('solicitudModal');
  if (modal) {
    modal.style.display = 'none';
    const desc = document.getElementById('descripcion');
    if (desc) desc.value = '';
    const campos = document.getElementById('camposAdicionales');
    if (campos) campos.innerHTML = '';
  }
};

window.enviarSolicitud = async () => {
  const tipo = document.getElementById('tipoSolicitud')?.value;
  const descripcion = document.getElementById('descripcion')?.value?.trim();
  if (!descripcion) {
    showModalMsg('⚠️ Por favor escribe una descripción del problema.', '#fbbf24');
    return;
  }
  const detalles = {};
  if (tipo === 'entretenimiento') { detalles.fecha = document.getElementById('fecha')?.value; detalles.hora = document.getElementById('hora')?.value; detalles.invitados = document.getElementById('invitados')?.value; }
  else if (tipo === 'limpieza') { detalles.area = document.getElementById('area')?.value; detalles.fecha_preferida = document.getElementById('fechaPreferida')?.value; }
  const prioridad = document.getElementById('urgencia')?.value || 'media';
  const btn = document.getElementById('btnEnviarSolicitud');
  if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }
  try {
    const response = await fetch(`${window.API_URL}/solicitudes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${window.appState.token}` },
      body: JSON.stringify({ tipo, descripcion, detalles, prioridad })
    });
    if (response.ok) {
      // Show a prominent in-modal success screen
      const successMsg = {
        medica: '🏥 Su solicitud médica fue enviada exitosamente.\n\nPor favor espere al médico de turno — recibirá atención en breve. Puede chatear con el médico desde la sección de mensajes.',
        limpieza: '🧹 Su solicitud de limpieza fue enviada.\n\nNuestro personal la atenderá pronto.',
        entretenimiento: '🎉 Su solicitud de evento fue registrada.\n\nEl equipo de entretenimiento confirmará los detalles.'
      }[tipo] || '✅ Solicitud enviada correctamente.';
      showSuccessModal(successMsg);
      loadSolicitudes();
      if (tipo === 'medica' && window.appState.socket) window.appState.socket.emit('nueva_solicitud', await response.json().catch(() => ({})));
    } else {
      const d = await response.json().catch(() => ({}));
      showModalMsg('❌ ' + (d.error || 'No se pudo enviar la solicitud. Intenta de nuevo.'), '#f87171');
    }
  } catch (error) {
    showModalMsg('⚠️ Sin conexión con el servidor. Verifica que el backend esté activo e intenta de nuevo.', '#fbbf24');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Enviar Solicitud'; }
  }
};

function showModalMsg(msg, color = '#f87171') {
  // Show inline error/warning message above the send button
  let msgEl = document.getElementById('solicitudMsgBar');
  if (!msgEl) {
    msgEl = document.createElement('div');
    msgEl.id = 'solicitudMsgBar';
    const btn = document.getElementById('btnEnviarSolicitud');
    if (btn?.parentElement) btn.parentElement.insertAdjacentElement('beforebegin', msgEl);
  }
  msgEl.style.cssText = `background:rgba(255,255,255,0.05);border:1px solid ${color}33;border-left:3px solid ${color};border-radius:6px;padding:10px 12px;margin-bottom:12px;font-size:0.78rem;color:${color};white-space:pre-wrap;line-height:1.5;`;
  msgEl.textContent = msg;
  setTimeout(() => { if (msgEl.parentElement) msgEl.remove(); }, 6000);
}

function showSuccessModal(msg) {
  const modal = document.getElementById('solicitudModal');
  if (!modal) return;
  const inner = modal.querySelector('div');
  if (!inner) return;
  inner.innerHTML = `
    <div style="text-align:center;padding:16px 0;">
      <div style="font-size:3rem;margin-bottom:16px;">✅</div>
      <p style="font-size:0.88rem;font-weight:600;color:#4ade80;margin:0 0 12px;">¡Solicitud Enviada!</p>
      <p style="font-size:0.82rem;color:var(--sb-text);line-height:1.6;margin:0 0 20px;white-space:pre-wrap;">${msg}</p>
      <button onclick="window.closeSolicitudModal()" style="background:rgba(74,222,128,0.12);border:1px solid rgba(74,222,128,0.3);color:#4ade80;border-radius:8px;padding:10px 24px;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:inherit;">
        Entendido
      </button>
    </div>
  `;
}

window.showSosWarning = () => {
  const m = document.getElementById('sosWarningModal');
  if (m) m.style.display = 'flex';
};

window.confirmarEmergencia = () => {
  const m = document.getElementById('sosWarningModal');
  if (m) m.style.display = 'none';
  const user = window.appState.user;
  if (window.appState.socket?.connected) {
    window.appState.socket.emit('nueva_emergencia', {
      tipo: 'medica',
      descripcion: 'EMERGENCIA: Residente requiere atención inmediata.',
      ubicacion: `Dpto ${user.apartamento || '?'}`
    });
    // Show confirmation inside the FAB area
    const fab = document.getElementById('sosFab');
    if (fab) {
      fab.style.animation = 'none';
      fab.style.background = 'linear-gradient(135deg,#16a34a,#15803d)';
      fab.textContent = '✅';
      setTimeout(() => {
        fab.style.background = 'linear-gradient(135deg,#ef4444,#b91c1c)';
        fab.textContent = '🆘';
        fab.style.animation = 'sosPulse 2s infinite';
      }, 4000);
    }
    alert('✅ Alerta enviada. El personal ha sido notificado.');
  } else {
    alert('⚠️ Sin conexión. Contacta directamente a la vigilancia.');
  }
};


async function loadSolicitudes() {
  try {
    const response = await fetch(`${window.API_URL}/solicitudes/mis-solicitudes`, { headers: { 'Authorization': `Bearer ${window.appState.token}` } });
    const solicitudes = await response.json();
    const container = document.getElementById('solicitudesList');
    if (!container) return;
    if (!solicitudes || solicitudes.length === 0) { container.innerHTML = '<p style="text-align:center;color:var(--sb-muted);padding:1.5rem 0;font-size:0.82rem;">No tienes solicitudes activas</p>'; return; }
    const eColor = { pendiente: '#fbbf24', en_proceso: '#38bdf8', completada: '#4ade80' };
    container.innerHTML = solicitudes.slice(0, 3).map(s => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--sb-border);">
        <div>
          <p style="font-size:0.82rem;font-weight:600;color:var(--sb-text);margin:0 0 2px;">${{ medica: '🏥', limpieza: '🧹', entretenimiento: '🎉' }[s.tipo] || '📋'} ${{ medica: 'Médica', limpieza: 'Limpieza', entretenimiento: 'Eventos' }[s.tipo] || s.tipo}</p>
          <p style="font-size:0.7rem;color:var(--sb-muted);margin:0;">${s.descripcion?.substring(0, 55)}${(s.descripcion?.length || 0) > 55 ? '...' : ''}</p>
        </div>
        <span style="background:rgba(255,255,255,0.06);color:${eColor[s.estado] || '#7d8590'};border-radius:20px;padding:2px 8px;font-size:0.62rem;font-weight:600;white-space:nowrap;margin-left:10px;">${s.estado}</span>
      </div>
    `).join('');
  } catch (error) { console.error('Error solicitudes:', error); }
}

window.activarEmergencia = () => {
  const user = window.appState.user;
  if (confirm('🚨 ¿Confirmas activar EMERGENCIA? Se notificará al personal inmediatamente.')) {
    if (window.appState.socket?.connected) { window.appState.socket.emit('nueva_emergencia', { tipo: 'medica', descripcion: 'EMERGENCIA CRÍTICA: Residente requiere atención inmediata.', ubicacion: `Dpto ${user.apartamento || '?'}` }); alert('✅ Emergencia activada. El personal ha sido notificado.'); }
    else { alert('⚠️ Sin conexión. Contacta directo a vigilancia.'); }
  }
};

window.openChatVigilante = async () => {
  try {
    const response = await fetch(`${window.API_URL}/usuarios/vigilantes`, { headers: { 'Authorization': `Bearer ${window.appState.token}` } });
    const vigilantes = await response.json();
    if (vigilantes?.length > 0) window.navigateTo('/chat', { userId: vigilantes[0].id, userName: vigilantes[0].nombre });
    else alert('⚠️ No hay vigilantes disponibles en este momento');
  } catch (error) { alert('❌ Error al conectar con el chat'); }
};

window.openChatMedico = (userId, userName) => window.navigateTo('/chat', { userId, userName });

async function checkMedicalChatContext() {
  const medicContainer = document.getElementById('medicChatContainer');
  if (!medicContainer) return;
  try {
    const [resE, resS] = await Promise.all([
      fetch(`${window.API_URL}/emergencias/activas`, { headers: { 'Authorization': `Bearer ${window.appState.token}` } }),
      fetch(`${window.API_URL}/solicitudes/mis-solicitudes`, { headers: { 'Authorization': `Bearer ${window.appState.token}` } })
    ]);
    const emergencias = await resE.json();
    const solicitudes = await resS.json();
    if (emergencias.find(e => e.usuario_id === window.appState.user.id && e.tipo === 'medica') || solicitudes.find(s => s.tipo === 'medica' && (s.estado === 'pendiente' || s.estado === 'en_proceso'))) {
      const resMedicos = await fetch(`${window.API_URL}/usuarios/medicos`, { headers: { 'Authorization': `Bearer ${window.appState.token}` } });
      const medicos = await resMedicos.json();
      if (medicos?.length > 0) {
        const m = medicos[0];
        medicContainer.innerHTML = `<button onclick="openChatMedico(${m.id},'${m.nombre}')" style="width:100%;background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.25);color:#38bdf8;border-radius:8px;padding:10px 14px;margin-top:6px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:0.82rem;font-weight:500;font-family:inherit;">👨‍⚕️ Chat con Médico (${m.nombre})<span style="background:rgba(74,222,128,0.2);color:#4ade80;border-radius:10px;padding:1px 7px;font-size:0.6rem;">ACTIVO</span></button>`;
      }
    }
  } catch (error) { console.error('Error contexto médico:', error); }
}

async function loadPaymentStatus() {
  const widget = document.getElementById('paymentStatusWidget');
  if (!widget) return;
  try {
    const response = await fetch(`${window.API_URL}/pagos/mis-pagos`, { headers: { 'Authorization': `Bearer ${window.appState.token}` } });
    const pagos = await response.json();
    const ahora = new Date();
    const pagadoEsteMes = Array.isArray(pagos) && pagos.some(p => { const f = new Date(p.fecha_pago); return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear() && p.estado === 'pagado'; });
    const mes = ahora.toLocaleString('es-ES', { month: 'long' });
    widget.innerHTML = pagadoEsteMes
      ? `<div onclick="window.navigateTo('/pago-metodos')" style="background:rgba(74,222,128,0.07);border:1px solid rgba(74,222,128,0.2);border-left:3px solid #4ade80;border-radius:8px;padding:12px 14px;display:flex;align-items:center;gap:10px;cursor:pointer;"><span style="font-size:1.2rem;">🌟</span><div><p style="font-size:0.82rem;font-weight:700;color:#4ade80;margin:0 0 2px;">¡Estás al día!</p><p style="font-size:0.7rem;color:var(--sb-muted);margin:0;">Pagos de ${mes} al corriente.</p></div></div>`
      : `<div onclick="window.navigateTo('/pago-metodos')" style="background:rgba(251,191,36,0.07);border:1px solid rgba(251,191,36,0.2);border-left:3px solid #fbbf24;border-radius:8px;padding:12px 14px;display:flex;align-items:center;gap:10px;cursor:pointer;"><span style="font-size:1.2rem;">💳</span><div><p style="font-size:0.82rem;font-weight:700;color:#fbbf24;margin:0 0 2px;">Aviso de Pago</p><p style="font-size:0.7rem;color:var(--sb-muted);margin:0;">Recuerda regularizar tu pago de ${mes}.</p></div></div>`;
  } catch (error) { console.error('Error estado de pago:', error); }
}

async function loadDeliveryServices() {
  const listEl = document.getElementById('deliveryList');
  if (!listEl) return;
  try {
    const response = await fetch(`${window.API_URL}/delivery`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const services = await response.json();
    if (services.length === 0) {
      document.getElementById('deliveryContainer').style.display = 'none';
      return;
    }
    listEl.innerHTML = services.map(s => `
      <div style="background:var(--sb-card);border:1px solid var(--sb-border);border-radius:8px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <p style="font-size:0.85rem;font-weight:600;color:var(--sb-text);margin:0 0 2px;">${s.nombre}</p>
          <p style="font-size:0.72rem;color:var(--sb-muted);margin:0;">${s.descripcion || ''}</p>
        </div>
        <a href="tel:${s.telefono}" style="background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.3);color:#fbbf24;border-radius:6px;padding:5px 10px;font-size:0.72rem;font-weight:600;text-decoration:none;">📞 Llamar</a>
      </div>
    `).join('');
  } catch (e) {
    console.error('Error al cargar delivery:', e);
    listEl.innerHTML = '<p style="color:#f87171;font-size:0.7rem;text-align:center;">Error al cargar</p>';
  }
}
