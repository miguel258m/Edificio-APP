// =====================================================
// DASHBOARD MÉDICO - Sidebar Desktop Layout
// =====================================================
import { renderSidebarLayout } from '../utils/sidebar-layout.js';

export function renderDashboardMedico(container) {
  const user = window.appState.user;

  const navItems = [
    { key: 'alertas', icon: '🚨', label: 'Alertas Activas', onClick: "switchMedicoView('alertas')" },
    { key: 'calendario', icon: '📅', label: 'Calendario', onClick: "switchMedicoView('calendario')" },
    { key: 'historial', icon: '📜', label: 'Mi Historial', onClick: "switchMedicoView('historial')" },
    { key: 'chats', icon: '💬', label: 'Mensajes', path: '/chats' },
    { key: 'perfil', icon: '⚙️', label: 'Perfil', path: '/perfil' },
  ];

  const main = renderSidebarLayout(container, {
    role: 'medico',
    activeNav: 'alertas',
    pageTitle: 'Servicio de Salud',
    pageSubtitle: 'Panel médico del edificio',
    breadcrumb: 'Dashboard',
    navItems,
  });

  main.innerHTML = `
    <!-- WELCOME BANNER -->
    <div class="fade-in" style="background: linear-gradient(135deg, #0f1f2e 0%, #1a2f42 100%); border: 1px solid rgba(248,113,113,0.2); border-radius: 16px; padding: 24px; margin-bottom: 24px; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -40px; right: -40px; width: 180px; height: 180px; background: radial-gradient(circle, rgba(248,113,113,0.07), transparent 70%);"></div>
      <div style="position: absolute; bottom: -30px; left: 20px; font-size: 5rem; opacity: 0.06;">🏥</div>
      <div style="position: relative; z-index: 1;">
        <p style="font-size: 0.7rem; font-weight: 700; color: #f87171; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px;">SERVICIO MÉDICO</p>
        <h2 style="font-size: 1.5rem; font-weight: 800; color: white; margin-bottom: 6px;">Dr. ${user.nombre.split(' ')[0]} 👨‍⚕️</h2>
        <p style="color: rgba(255,255,255,0.5); font-size: 0.85rem; margin: 0;">Panel de atención de emergencias y consultas médicas.</p>
      </div>
    </div>

    <!-- STATS -->
    <div class="ds-stats-grid fade-in">
      <div class="ds-stat-card" style="border-color: rgba(248,113,113,0.15); background: rgba(248,113,113,0.04);">
        <div class="ds-stat-label" style="color: #f87171;">🚨 Emergencias</div>
        <div class="ds-stat-value" id="md-emergenciasCount" style="color: #f87171;">0</div>
        <div class="ds-stat-sub">activas ahora</div>
      </div>
      <div class="ds-stat-card" style="border-color: rgba(129,140,248,0.15); background: rgba(99,102,241,0.04);">
        <div class="ds-stat-label" style="color: #818cf8;">🩺 Consultas</div>
        <div class="ds-stat-value" id="md-solicitudesCount" style="color: #818cf8;">0</div>
        <div class="ds-stat-sub">en espera</div>
      </div>
      <div class="ds-stat-card" style="border-color: rgba(56,189,248,0.15); background: rgba(56,189,248,0.04);">
        <div class="ds-stat-label" style="color: #38bdf8;">📡 Estado</div>
        <div class="ds-stat-value" style="color: #4ade80; font-size: 0.9rem;">ACTIVO</div>
        <div class="ds-stat-sub">en servicio</div>
      </div>
    </div>

    <!-- TABS -->
    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;" class="fade-in">
      <button id="tabAlertas" onclick="switchMedicoView('alertas')" style="background:rgba(248,113,113,0.12);border:1px solid rgba(248,113,113,0.3);color:#f87171;border-radius:10px;padding:9px 20px;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:inherit;">🏥 Alertas Activas</button>
      <button id="tabCalendario" onclick="switchMedicoView('calendario')" style="background:transparent;border:1px solid var(--sb-border);color:var(--sb-muted);border-radius:10px;padding:9px 20px;font-size:0.78rem;font-weight:600;cursor:pointer;font-family:inherit;">📅 Calendario</button>
      <button id="tabHistorial" onclick="switchMedicoView('historial')" style="background:transparent;border:1px solid var(--sb-border);color:var(--sb-muted);border-radius:10px;padding:9px 20px;font-size:0.78rem;font-weight:600;cursor:pointer;font-family:inherit;">📜 Mi Historial</button>
    </div>

    <!-- VISTA ALERTAS -->
    <div id="viewAlertas" class="ds-grid-2 fade-in">
      <!-- Emergencias -->
      <div class="ds-card">
        <div class="ds-card-header">
          <p class="ds-card-title" style="color:#f87171;">🚨 Emergencias Críticas</p>
        </div>
        <div id="md-emergenciasList"><div class="loading-spinner" style="margin:1.5rem auto;"></div></div>
      </div>

      <!-- Consultas médicas -->
      <div class="ds-card">
        <div class="ds-card-header">
          <p class="ds-card-title" style="color:#818cf8;">📋 Consultas y Pedidos</p>
        </div>
        <div id="md-solicitudesList"><div class="loading-spinner" style="margin:1.5rem auto;"></div></div>
      </div>
    </div>

    <!-- VISTA HISTORIAL -->
    <div id="viewHistorial" class="hidden fade-in">
      <div class="ds-card">
        <div class="ds-card-header">
          <p class="ds-card-title" style="color:#4ade80;">✅ Mis Atenciones Finalizadas</p>
        </div>
        <div id="historialList"><div class="loading-spinner" style="margin:2rem auto;"></div></div>
      </div>
    </div>

    <!-- VISTA CALENDARIO -->
    <div id="viewCalendario" class="hidden fade-in">
      <div class="ds-grid-2">
        <!-- Calendario -->
        <div class="ds-card">
          <div class="ds-card-header">
            <p class="ds-card-title">📅 Agenda</p>
            <div style="display:flex;gap:8px;align-items:center;">
              <button id="calPrev" onclick="navegarCalendario(-1)" style="background:transparent;border:1px solid var(--sb-border);color:var(--sb-muted);width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:1rem;">‹</button>
              <span id="calMesLabel" style="font-size:0.82rem;font-weight:700;color:var(--sb-text);white-space:nowrap;"></span>
              <button id="calNext" onclick="navegarCalendario(1)" style="background:transparent;border:1px solid var(--sb-border);color:var(--sb-muted);width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:1rem;">›</button>
            </div>
          </div>
          <div id="calendarGrid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;padding:4px 0;"></div>
          <div id="calDayPanel" style="margin-top:12px;border-top:1px solid var(--sb-border);padding-top:12px;min-height:80px;"></div>
        </div>

        <!-- Panel lateral -->
        <div class="ds-card">
          <div class="ds-card-header">
            <p class="ds-card-title">📋 Próximas Citas</p>
            <button onclick="abrirModalCita()" style="background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.3);color:#818cf8;border-radius:8px;padding:5px 12px;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:inherit;">+ Nueva Cita</button>
          </div>
          <div id="citasProximas"><div class="loading-spinner" style="margin:2rem auto;"></div></div>
        </div>
      </div>
    </div>

    <!-- MODAL NUEVA CITA -->
    <div id="citaModal" class="hidden" style="position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(8px);">
      <div style="background:var(--sb-surface);border:1px solid var(--sb-border);border-radius:14px;padding:24px;width:100%;max-width:460px;max-height:90vh;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
          <h2 id="citaModalTitle" style="font-size:1rem;font-weight:700;color:var(--sb-text);margin:0;">📅 Nueva Cita</h2>
          <button onclick="cerrarModalCita()" style="background:rgba(255,255,255,0.07);border:1px solid var(--sb-border);width:30px;height:30px;border-radius:6px;color:var(--sb-muted);font-size:1.1rem;cursor:pointer;">×</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Título *</label><input type="text" id="citaTitulo" class="form-input" placeholder="Ej: Control de presión" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"></div>
          <div><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Residente</label>
            <select id="citaResidente" class="form-select" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);">
              <option value="">— Sin asignar —</option>
            </select>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Fecha *</label><input type="date" id="citaFecha" class="form-input" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"></div>
            <div><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Hora *</label><input type="time" id="citaHora" class="form-input" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"></div>
          </div>
          <div><label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:4px;font-weight:600;">Notas</label><textarea id="citaDescripcion" class="form-input" rows="2" placeholder="Observaciones opcionales..." style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);resize:none;"></textarea></div>
          <div style="display:flex;gap:10px;margin-top:4px;">
            <button type="button" class="btn btn-ghost" onclick="cerrarModalCita()" style="flex:1;">Cancelar</button>
            <button type="button" id="btnGuardarCita" onclick="guardarCita()" class="btn btn-primary" style="flex:1.5;">Guardar Cita</button>
          </div>
          <div id="citaMsg" style="display:none;"></div>
        </div>
      </div>
    </div>
  `;

  loadEmergenciasMedicas();
  loadSolicitudesMedicas();

  if (window.appState.socket) {
    window.appState.socket.off('nueva_emergencia');
    window.appState.socket.on('nueva_emergencia', (e) => { if (e.tipo === 'medica') { loadEmergenciasMedicas(); try { new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play(); } catch (e) { } } });
    window.appState.socket.off('emergencia_actualizada');
    window.appState.socket.on('emergencia_actualizada', () => loadEmergenciasMedicas());
    window.appState.socket.off('nueva_solicitud');
    window.appState.socket.on('nueva_solicitud', (s) => { if (s.tipo === 'medica') loadSolicitudesMedicas(); });
  }
}

window.switchMedicoView = (view) => {
  const tabA = document.getElementById('tabAlertas');
  const tabH = document.getElementById('tabHistorial');
  const tabC = document.getElementById('tabCalendario');
  const vA = document.getElementById('viewAlertas');
  const vH = document.getElementById('viewHistorial');
  const vC = document.getElementById('viewCalendario');
  if (!vA) return;

  const TABS = { tabAlertas: tabA, tabHistorial: tabH, tabCalendario: tabC };
  const VIEWS = { alertas: vA, historial: vH, calendario: vC };
  const STYLES = {
    active: { alertas: 'rgba(248,113,113,0.12)', historial: 'rgba(74,222,128,0.12)', calendario: 'rgba(99,102,241,0.12)' },
    color: { alertas: '#f87171', historial: '#4ade80', calendario: '#818cf8' },
    border: { alertas: 'rgba(248,113,113,0.3)', historial: 'rgba(74,222,128,0.3)', calendario: 'rgba(99,102,241,0.3)' }
  };

  // Reset all
  Object.values(VIEWS).forEach(v => v && v.classList.add('hidden'));
  Object.entries(TABS).forEach(([k, t]) => {
    if (t) t.style.cssText = 'background:transparent;border:1px solid var(--sb-border);color:var(--sb-muted);border-radius:10px;padding:9px 20px;font-size:0.78rem;font-weight:600;cursor:pointer;font-family:inherit;';
  });

  const activeView = VIEWS[view];
  if (activeView) activeView.classList.remove('hidden');

  const tabKey = 'tab' + view.charAt(0).toUpperCase() + view.slice(1);
  const tab = TABS[tabKey];
  if (tab) tab.style.cssText = `background:${STYLES.active[view]};border:1px solid ${STYLES.border[view]};color:${STYLES.color[view]};border-radius:10px;padding:9px 20px;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:inherit;`;

  if (view === 'alertas') { loadEmergenciasMedicas(); loadSolicitudesMedicas(); }
  else if (view === 'historial') loadHistorialPersonal();
  else if (view === 'calendario') { loadCitas(); renderCalendario(); cargarResidenetsSelector(); }
};

// ── CALENDARIO STATE ──────────────────────────────────────────
let _calYear = new Date().getFullYear();
let _calMonth = new Date().getMonth();
let _allCitas = [];
let _selectedDay = null;

window.navegarCalendario = (delta) => {
  _calMonth += delta;
  if (_calMonth < 0) { _calMonth = 11; _calYear--; }
  if (_calMonth > 11) { _calMonth = 0; _calYear++; }
  renderCalendario();
};

function renderCalendario() {
  const grid = document.getElementById('calendarGrid');
  const label = document.getElementById('calMesLabel');
  if (!grid) return;

  const DIAS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
  const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  label.textContent = `${MESES[_calMonth]} ${_calYear}`;

  const firstDay = new Date(_calYear, _calMonth, 1).getDay();
  const daysInMonth = new Date(_calYear, _calMonth + 1, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Group citas by date string
  const citasByDate = {};
  _allCitas.forEach(c => {
    const d = c.fecha?.substring(0, 10);
    if (d) (citasByDate[d] = citasByDate[d] || []).push(c);
  });

  let html = DIAS.map(d => `<div style="text-align:center;font-size:0.6rem;font-weight:700;color:var(--sb-muted);padding:4px 0;">${d}</div>`).join('');

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) html += '<div></div>';

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${_calYear}-${String(_calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hasCitas = citasByDate[dateStr]?.length > 0;
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === _selectedDay;
    const isPast = dateStr < todayStr;

    html += `<div onclick="selectCalDay('${dateStr}')" style="
      text-align:center;padding:5px 2px;border-radius:7px;cursor:pointer;position:relative;transition:all 0.15s;
      ${isSelected ? 'background:rgba(99,102,241,0.25);border:1px solid #818cf8;' : isToday ? 'background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.3);' : 'border:1px solid transparent;'}
    " onmouseover="if(!this.dataset.sel)this.style.background='rgba(255,255,255,0.05)'" onmouseout="if(!this.dataset.sel)this.style.background='${isSelected ? 'rgba(99,102,241,0.25)' : isToday ? 'rgba(56,189,248,0.12)' : 'transparent'}'">
      <span style="font-size:0.75rem;font-weight:${isToday || isSelected ? '700' : '500'};color:${isSelected ? '#818cf8' : isToday ? '#38bdf8' : isPast ? 'var(--sb-muted)' : 'var(--sb-text)'};">${d}</span>
      ${hasCitas ? `<div style="display:flex;justify-content:center;gap:2px;margin-top:2px;">${citasByDate[dateStr].slice(0, 3).map(() => '<div style="width:4px;height:4px;border-radius:50%;background:#818cf8;"></div>').join('')}</div>` : ''}
    </div>`;
  }
  grid.innerHTML = html;

  if (_selectedDay) showDayPanel(_selectedDay);
}

window.selectCalDay = (dateStr) => {
  _selectedDay = dateStr;
  renderCalendario();
  showDayPanel(dateStr);
};

function showDayPanel(dateStr) {
  const panel = document.getElementById('calDayPanel');
  if (!panel) return;
  const citas = _allCitas.filter(c => c.fecha?.substring(0, 10) === dateStr);
  const [y, m, d] = dateStr.split('-');
  const label = new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  if (citas.length === 0) {
    panel.innerHTML = `
      <p style="font-size:0.75rem;color:var(--sb-muted);margin:0 0 8px;">${label}</p>
      <div style="text-align:center;padding:12px;color:var(--sb-muted);font-size:0.78rem;opacity:0.6;">Sin citas este día</div>
      <button onclick="abrirModalCita('${dateStr}')" style="width:100%;margin-top:8px;background:rgba(99,102,241,0.1);border:1px dashed rgba(99,102,241,0.3);color:#818cf8;border-radius:8px;padding:7px;font-size:0.75rem;font-weight:600;cursor:pointer;font-family:inherit;">+ Agendar cita</button>`;
    return;
  }
  panel.innerHTML = `
    <p style="font-size:0.75rem;color:var(--sb-muted);margin:0 0 8px;">${label} — ${citas.length} cita${citas.length > 1 ? 's' : ''}</p>
    ${citas.map(c => `
      <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:8px;padding:8px 10px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <p style="font-size:0.8rem;font-weight:600;color:var(--sb-text);margin:0 0 2px;">${c.hora?.substring(0, 5)} — ${c.titulo}</p>
          ${c.residente_nombre ? `<p style="font-size:0.7rem;color:var(--sb-muted);margin:0;">👤 ${c.residente_nombre}${c.residente_apartamento ? ' · Dpto ' + c.residente_apartamento : ''}</p>` : ''}
        </div>
        <button onclick="cancelarCita(${c.id})" style="background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.25);color:#f87171;border-radius:6px;padding:3px 8px;font-size:0.65rem;font-weight:600;cursor:pointer;font-family:inherit;">✕</button>
      </div>`).join('')}
    <button onclick="abrirModalCita('${dateStr}')" style="width:100%;margin-top:4px;background:rgba(99,102,241,0.08);border:1px dashed rgba(99,102,241,0.25);color:#818cf8;border-radius:8px;padding:6px;font-size:0.72rem;font-weight:600;cursor:pointer;font-family:inherit;">+ Agregar otra</button>`;
}

async function loadCitas() {
  try {
    const r = await fetch(`${window.API_URL}/citas`, { headers: { 'Authorization': `Bearer ${window.appState.token}` } });
    _allCitas = await r.json();
    if (!Array.isArray(_allCitas)) _allCitas = [];
    renderCalendario();
    renderCitasProximas();
  } catch (e) { console.error('Error citas:', e); }
}

function renderCitasProximas() {
  const el = document.getElementById('citasProximas');
  if (!el) return;
  const hoy = new Date().toISOString().substring(0, 10);
  const proximas = _allCitas.filter(c => c.fecha?.substring(0, 10) >= hoy).slice(0, 8);
  if (proximas.length === 0) {
    el.innerHTML = `<div style="text-align:center;padding:2rem;"><div style="font-size:2rem;opacity:0.3;margin-bottom:8px;">📅</div><p style="color:var(--sb-muted);font-size:0.8rem;">No hay citas programadas</p></div>`;
    return;
  }
  el.innerHTML = proximas.map(c => {
    const fecha = new Date(c.fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    return `
      <div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;border:1px solid var(--sb-border);margin-bottom:8px;background:rgba(255,255,255,0.02);">
        <div style="background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.25);border-radius:8px;padding:6px 10px;text-align:center;flex-shrink:0;min-width:48px;">
          <p style="font-size:0.65rem;font-weight:700;color:#818cf8;margin:0;text-transform:uppercase;">${fecha.split(' ')[1] || ''}</p>
          <p style="font-size:1rem;font-weight:800;color:var(--sb-text);margin:0;">${fecha.split(' ')[0] || ''}</p>
        </div>
        <div style="flex:1;min-width:0;">
          <p style="font-size:0.82rem;font-weight:600;color:var(--sb-text);margin:0 0 2px;">${c.titulo}</p>
          <p style="font-size:0.7rem;color:var(--sb-muted);margin:0;">${c.hora?.substring(0, 5)}${c.residente_nombre ? ' · ' + c.residente_nombre : ''}</p>
        </div>
        <button onclick="cancelarCita(${c.id})" style="background:transparent;border:none;color:var(--sb-muted);cursor:pointer;font-size:1rem;">✕</button>
      </div>`;
  }).join('');
}

async function cargarResidenetsSelector() {
  try {
    const r = await fetch(`${window.API_URL}/citas/residentes`, { headers: { 'Authorization': `Bearer ${window.appState.token}` } });
    const residentes = await r.json();
    const sel = document.getElementById('citaResidente');
    if (!sel || !Array.isArray(residentes)) return;
    sel.innerHTML = '<option value="">— Sin asignar —</option>' + residentes.map(u =>
      `<option value="${u.id}">${u.nombre}${u.apartamento ? ' (Dpto ' + u.apartamento + ')' : ''}</option>`).join('');
  } catch (e) { console.error('Error residentes:', e); }
}

window.abrirModalCita = (fecha = '') => {
  const modal = document.getElementById('citaModal');
  if (!modal) return;
  document.getElementById('citaTitulo').value = '';
  document.getElementById('citaFecha').value = fecha || new Date().toISOString().substring(0, 10);
  document.getElementById('citaHora').value = '09:00';
  document.getElementById('citaDescripcion').value = '';
  const msg = document.getElementById('citaMsg');
  if (msg) { msg.style.display = 'none'; msg.textContent = ''; }
  cargarResidenetsSelector();
  modal.classList.remove('hidden');
};
window.cerrarModalCita = () => document.getElementById('citaModal')?.classList.add('hidden');

window.guardarCita = async () => {
  const titulo = document.getElementById('citaTitulo')?.value?.trim();
  const fecha = document.getElementById('citaFecha')?.value;
  const hora = document.getElementById('citaHora')?.value;
  const descripcion = document.getElementById('citaDescripcion')?.value?.trim();
  const residente_id = document.getElementById('citaResidente')?.value || null;
  const msg = document.getElementById('citaMsg');
  const btn = document.getElementById('btnGuardarCita');

  if (!titulo || !fecha || !hora) {
    if (msg) { msg.textContent = '⚠️ Título, fecha y hora son requeridos'; msg.style.cssText = 'display:block;color:#fbbf24;font-size:0.78rem;padding:8px;background:rgba(251,191,36,0.08);border-radius:6px;'; }
    return;
  }
  if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }
  try {
    const r = await fetch(`${window.API_URL}/citas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${window.appState.token}` },
      body: JSON.stringify({ titulo, fecha, hora, descripcion, residente_id: residente_id || undefined })
    });
    if (r.ok) {
      cerrarModalCita();
      await loadCitas();
      if (_selectedDay) showDayPanel(_selectedDay);
    } else {
      const e = await r.json().catch(() => ({}));
      if (msg) { msg.textContent = '❌ ' + (e.error || 'Error al guardar'); msg.style.cssText = 'display:block;color:#f87171;font-size:0.78rem;padding:8px;background:rgba(248,113,113,0.08);border-radius:6px;'; }
    }
  } catch (e) {
    if (msg) { msg.textContent = '❌ Error de conexión'; msg.style.cssText = 'display:block;color:#f87171;font-size:0.78rem;padding:8px;border-radius:6px;'; }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Guardar Cita'; }
  }
};

window.cancelarCita = async (id) => {
  try {
    await fetch(`${window.API_URL}/citas/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${window.appState.token}` } });
    await loadCitas();
    if (_selectedDay) showDayPanel(_selectedDay);
  } catch (e) { console.error(e); }
};


async function loadEmergenciasMedicas() {
  const user = window.appState.user;
  try {
    const response = await fetch(`${window.API_URL}/emergencias/activas`, { headers: { 'Authorization': `Bearer ${window.appState.token}` } });
    const emergencias = await response.json();
    const container = document.getElementById('md-emergenciasList');
    const count = document.getElementById('md-emergenciasCount');
    if (!container) return;
    const medicas = Array.isArray(emergencias) ? emergencias.filter(e => e.tipo === 'medica') : [];
    if (count) count.textContent = medicas.length;
    if (medicas.length === 0) { container.innerHTML = '<div style="text-align:center;padding:2rem;"><div style="font-size:2rem;margin-bottom:8px;">✅</div><p style="color:var(--sb-muted);font-size:0.82rem;">Sin emergencias pendientes</p></div>'; return; }
    container.innerHTML = medicas.map(e => {
      const isAttending = e.estado === 'atendida', isMine = e.atendido_por === user.id;
      return `
      <div style="background:${isAttending ? 'rgba(255,255,255,0.02)' : 'rgba(248,113,113,0.06)'};border:1px solid ${isAttending ? 'rgba(56,189,248,0.2)' : 'rgba(248,113,113,0.25)'};border-radius:12px;padding:14px;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <p style="font-size:0.8rem;font-weight:700;color:${isAttending ? '#38bdf8' : '#f87171'};margin:0;">${isAttending ? '🩺 EN ATENCIÓN' : '🚨 NUEVA EMERGENCIA'}</p>
          <span style="background:${isAttending ? 'rgba(56,189,248,0.1)' : 'rgba(248,113,113,0.1)'};color:${isAttending ? '#38bdf8' : '#f87171'};border-radius:20px;padding:3px 9px;font-size:0.6rem;font-weight:700;">${isAttending ? 'PROCESO' : 'PENDIENTE'}</span>
        </div>
        <p style="font-size:0.88rem;font-weight:700;color:var(--sb-text);margin:0 0 2px;">${e.usuario_nombre}</p>
        <p style="font-size:0.72rem;color:var(--sb-muted);margin:0 0 10px;">📍 Dpto ${e.usuario_apartamento || 'N/A'}</p>
        ${isAttending ? `<p style="font-size:0.7rem;color:#38bdf8;margin:0 0 10px;font-weight:600;">👨‍⚕️ ${isMine ? 'Tú (Ahora)' : e.medico_nombre || 'otro médico'}</p>` : ''}
        <div style="display:flex;gap:8px;">
          ${!isAttending ? `<button onclick="tomarEmergencia(${e.id})" style="flex:1;background:#f87171;color:white;border:none;border-radius:8px;padding:7px;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:inherit;">🚑 Tomar Alerta</button>` : ''}
          ${isMine ? `<button onclick="abrirChat(${e.usuario_id},'${e.usuario_nombre?.replace(/'/g, "\\'")}')" style="background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.25);color:#38bdf8;border-radius:8px;padding:7px 12px;cursor:pointer;">💬</button><button onclick="resolverEmergencia(${e.id})" style="flex:1;background:#4ade80;color:white;border:none;border-radius:8px;padding:7px;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:inherit;">✅ Finalizar</button>` : ''}
          ${isAttending && !isMine ? `<p style="color:var(--sb-muted);text-align:center;width:100%;font-size:0.72rem;margin:0;">En atención por otro médico...</p>` : ''}
        </div>
      </div>`;
    }).join('');
  } catch (e) { console.error('Error emergencias médicas:', e); }
}

async function loadSolicitudesMedicas() {
  try {
    const response = await fetch(`${window.API_URL}/solicitudes?tipo=medica`, { headers: { 'Authorization': `Bearer ${window.appState.token}` } });
    const solicitudes = await response.json();
    const container = document.getElementById('md-solicitudesList');
    const count = document.getElementById('md-solicitudesCount');
    if (!container) return;
    const pendientes = Array.isArray(solicitudes) ? solicitudes.filter(s => s.estado === 'pendiente' || s.estado === 'en_proceso') : [];
    if (count) count.textContent = pendientes.length;
    if (pendientes.length === 0) { container.innerHTML = '<p style="text-align:center;color:var(--sb-muted);padding:1rem 0;font-size:0.8rem;">No hay solicitudes médicas</p>'; return; }
    container.innerHTML = pendientes.map(s => `
      <div style="background:var(--sb-card);border:1px solid var(--sb-border);border-radius:8px;padding:12px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
          <p style="font-size:0.8rem;font-weight:700;color:#818cf8;margin:0;">🩺 Consulta</p>
          <span style="background:rgba(255,255,255,0.06);color:${s.estado === 'pendiente' ? '#fbbf24' : '#38bdf8'};border-radius:20px;padding:2px 7px;font-size:0.6rem;font-weight:600;">${s.estado === 'pendiente' ? 'NUEVA' : 'ATENDIENDO'}</span>
        </div>
        <p style="font-size:0.82rem;font-weight:500;color:var(--sb-text);margin:0 0 2px;">${s.usuario_nombre} <span style="color:var(--sb-muted);">(Dpto ${s.usuario_apartamento})</span></p>
        <p style="font-size:0.75rem;color:rgba(255,255,255,0.7);margin:6px 0 10px;line-height:1.5;background:rgba(255,255,255,0.03);padding:8px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">${s.descripcion}</p>
        <div style="display:flex;gap:8px;">
          <button onclick="abrirChat(${s.usuario_id},'${s.usuario_nombre?.replace(/'/g, "\\'")}')" style="background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.25);color:#38bdf8;border-radius:8px;padding:6px 12px;cursor:pointer;font-family:inherit;transition:all 0.2s;">💬 Chat</button>
          <button onclick="actualizarSolicitudMedica(${s.id},'${s.estado === 'pendiente' ? 'en_proceso' : 'completada'}')" style="flex:1;background:${s.estado === 'pendiente' ? 'rgba(99,102,241,0.1)' : 'rgba(74,222,128,0.1)'};border:1px solid ${s.estado === 'pendiente' ? 'rgba(99,102,241,0.25)' : 'rgba(74,222,128,0.25)'};color:${s.estado === 'pendiente' ? '#818cf8' : '#4ade80'};border-radius:6px;padding:6px;font-size:0.72rem;font-weight:600;cursor:pointer;font-family:inherit;">${s.estado === 'pendiente' ? '🩺 Iniciar' : '✅ Finalizar'}</button>
        </div>
      </div>
    `).join('');
  } catch (e) { console.error('Error solicitudes médicas:', e); }
}

async function loadHistorialPersonal() {
  const container = document.getElementById('historialList');
  if (!container) return;
  container.innerHTML = '<div class="loading-spinner" style="margin:2rem auto;"></div>';
  try {
    const [resE, resS] = await Promise.all([
      fetch(`${window.API_URL}/emergencias/medico/historial`, { headers: { 'Authorization': `Bearer ${window.appState.token}` } }),
      fetch(`${window.API_URL}/solicitudes/medico/historial`, { headers: { 'Authorization': `Bearer ${window.appState.token}` } })
    ]);
    const emergencias = await resE.json();
    const solicitudes = await resS.json();
    const historial = [...emergencias.map(e => ({ ...e, _ti: 'emergencia' })), ...solicitudes.map(s => ({ ...s, _ti: 'solicitud' }))].sort((a, b) => new Date(b.created_at || b.fecha_solicitud) - new Date(a.created_at || a.fecha_solicitud));
    if (historial.length === 0) { container.innerHTML = '<div style="text-align:center;padding:2rem;"><div style="font-size:2rem;margin-bottom:8px;">📑</div><p style="color:var(--sb-muted);">Aún no has finalizado ninguna atención.</p></div>'; return; }
    container.innerHTML = historial.map(item => `
      <div style="padding:10px 0;border-bottom:1px solid var(--sb-border);">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
          <span style="background:rgba(255,255,255,0.06);color:${item._ti === 'emergencia' ? '#f87171' : '#38bdf8'};border-radius:10px;padding:2px 7px;font-size:0.6rem;font-weight:700;">${item._ti === 'emergencia' ? '🚨 EMERGENCIA' : '🩺 CONSULTA'}</span>
          <span style="font-size:0.65rem;color:var(--sb-muted);">${new Date(item.created_at || item.fecha_solicitud).toLocaleDateString('es-ES')}</span>
        </div>
        <p style="font-size:0.82rem;font-weight:600;color:var(--sb-text);margin:3px 0 2px;">${item.usuario_nombre}</p>
        <p style="font-size:0.7rem;color:var(--sb-muted);margin:0 0 3px;line-height:1.4;">${item.descripcion?.substring(0, 65)}${(item.descripcion?.length || 0) > 65 ? '...' : ''}</p>
        <span style="font-size:0.68rem;color:#4ade80;font-weight:600;">✅ COMPLETADA</span>
      </div>
    `).join('');
  } catch (e) { container.innerHTML = '<p style="color:#f87171;text-align:center;padding:2rem;">❌ Error al cargar el historial</p>'; }
}

window.tomarEmergencia = async (id) => {
  try { const r = await fetch(`${window.API_URL}/emergencias/${id}/atender`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${window.appState.token}` } }); if (r.ok) { if (window.appState.socket) window.appState.socket.emit('actualizar_emergencia', { id }); loadEmergenciasMedicas(); } } catch (e) { console.error(e); }
};
window.resolverEmergencia = async (id) => {
  if (confirm('¿Dar por finalizada esta atención?')) { try { const r = await fetch(`${window.API_URL}/emergencias/${id}/resolver`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${window.appState.token}` } }); if (r.ok) { if (window.appState.socket) window.appState.socket.emit('actualizar_emergencia', { id }); loadEmergenciasMedicas(); } } catch (e) { console.error(e); } }
};
window.actualizarSolicitudMedica = async (id, estado) => {
  try { const r = await fetch(`${window.API_URL}/solicitudes/${id}/estado`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${window.appState.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ estado }) }); if (r.ok) loadSolicitudesMedicas(); } catch (e) { console.error(e); }
};
window.abrirChat = (userId, userName = 'Residente') => window.navigateTo('/chat', { userId, userName });
