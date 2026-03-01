// =====================================================
// DASHBOARD GERENTE - Layout Desktop con Sidebar
// =====================================================

import { initAnnouncements, renderAnnouncementsWidget } from '../utils/announcements.js';
import { renderSidebarLayout } from '../utils/sidebar-layout.js';

export function renderDashboardGerente(container) {

  const navItems = [
    { key: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/dashboard-gerente' },
    { key: 'avisos', icon: '📢', label: 'Publicar Aviso', onClick: 'abrirNuevoAviso()' },
    { key: 'residentes', icon: '👥', label: 'Residentes', onClick: 'verResidentes()' },
    { key: 'delivery', icon: '🍕', label: 'Gestionar Delivery', onClick: 'gestionarDelivery()' },
    { key: 'seguridad', icon: '👮', label: 'Vigilante', path: '/chats' },
    { key: 'metodos_pago', icon: '💳', label: 'Métodos de Pago', onClick: 'gestionarMetodosPago()' },
    { key: 'perfil', icon: '⚙️', label: 'Mi Perfil', path: '/perfil' },
  ];

  const main = renderSidebarLayout(container, {
    role: 'gerente',
    activeNav: 'dashboard',
    pageTitle: 'Panel Ejecutivo',
    pageSubtitle: 'Gestión y supervisión del condominio',
    breadcrumb: 'Dashboard',
    navItems,
  });

  main.innerHTML += `

    <!-- ===== KPI ===== -->
    <div class="ds-stats-grid">
      <div class="ds-stat-card blue">
        <div class="ds-stat-label">📋 Total Reportes</div>
        <div class="ds-stat-value" id="totalSolicitudes">0</div>
        <div class="ds-stat-sub">Solicitudes del edificio</div>
      </div>
      <div class="ds-stat-card amber">
        <div class="ds-stat-label">⏳ Pendientes</div>
        <div class="ds-stat-value" id="pendientes">0</div>
        <div class="ds-stat-sub">Sin atender</div>
      </div>
      <div class="ds-stat-card green">
        <div class="ds-stat-label">✅ Completadas</div>
        <div class="ds-stat-value" id="completadas">0</div>
        <div class="ds-stat-sub">Resueltas</div>
      </div>
      <div class="ds-stat-card red">
        <div class="ds-stat-label">🚨 Emergencias</div>
        <div class="ds-stat-value" id="emergenciasCount">0</div>
        <div class="ds-stat-sub">Activas ahora</div>
      </div>
    </div>

    <!-- ===== ACCIONES RAPIDAS ===== -->
    <div class="ds-card" style="margin-bottom:20px;">
      <div class="ds-card-header">
        <p class="ds-card-title">Acciones Rápidas</p>
      </div>
      <div class="ds-grid-4" style="gap:10px;">
        <div class="ds-action-card" onclick="abrirNuevoAviso()">
          <div class="ds-action-icon">📢</div>
          <p class="ds-action-title">Publicar Aviso</p>
          <p class="ds-action-desc">Comunicar a todos</p>
        </div>
        <div class="ds-action-card" onclick="verResidentes()">
          <div class="ds-action-icon">👥</div>
          <p class="ds-action-title">Residentes</p>
          <p class="ds-action-desc">Ver estado de pagos</p>
        </div>
        <div id="btnGestionarDelivery" class="ds-action-card" onclick="gestionarDelivery()">
          <div class="ds-action-icon">🍕</div>
          <p class="ds-action-title">Delivery</p>
          <p class="ds-action-desc">Nombres y Números</p>
        </div>
        <div class="ds-action-card" onclick="window.navigateTo('/perfil')">
          <div class="ds-action-icon">⚙️</div>
          <p class="ds-action-title">Mi Perfil</p>
          <p class="ds-action-desc">Configuración</p>
        </div>
      </div>
    </div>

    <!-- ===== EMERGENCIAS ACTIVAS ===== -->
    <div id="emergenciasAlert" class="ds-card hidden" style="border-left:3px solid #f87171;margin-bottom:20px;">
      <div class="ds-card-header">
        <p class="ds-card-title" style="color:#f87171;">🚨 Emergencias Activas</p>
      </div>
      <div id="emergenciasList"></div>
    </div>

    <!-- ===== AVISOS + SOLICITUDES ===== -->
    <div class="ds-grid-2">
      <div class="ds-card">
        <div class="ds-card-header">
          <p class="ds-card-title">Avisos del Edificio</p>
          <button onclick="abrirNuevoAviso()" style="background:rgba(31,111,235,0.15);border:1px solid rgba(31,111,235,0.3);color:#58a6ff;border-radius:6px;padding:5px 12px;font-size:0.75rem;cursor:pointer;font-family:inherit;">+ Publicar</button>
        </div>
        <div id="announcementsWidget"></div>
      </div>

      <div class="ds-card">
        <div class="ds-card-header">
          <p class="ds-card-title">Solicitudes e Incidencias</p>
          <div style="display:flex;gap:6px;">
            <button class="filter-btn-ds active" data-filter="todas" style="font-size:0.72rem;padding:4px 10px;border-radius:6px;border:1px solid var(--sb-border);background:rgba(31,111,235,0.15);color:#58a6ff;cursor:pointer;font-family:inherit;">Todas</button>
            <button class="filter-btn-ds" data-filter="pendiente" style="font-size:0.72rem;padding:4px 10px;border-radius:6px;border:1px solid var(--sb-border);background:var(--sb-card);color:var(--sb-muted);cursor:pointer;font-family:inherit;">Pendientes</button>
            <button class="filter-btn-ds" data-filter="completada" style="font-size:0.72rem;padding:4px 10px;border-radius:6px;border:1px solid var(--sb-border);background:var(--sb-card);color:var(--sb-muted);cursor:pointer;font-family:inherit;">Completadas</button>
          </div>
        </div>
        <div id="solicitudesList" style="max-height:400px;overflow-y:auto;">
          <div class="loading-spinner" style="margin:2rem auto;"></div>
        </div>
      </div>
    </div>
  `;

  let currentFilter = 'todas';

  // Inicializar avisos
  initAnnouncements(container);
  renderAnnouncementsWidget('announcementsWidget');

  // Cargar datos
  loadSolicitudes();
  loadEmergencias();

  // Filtros
  document.querySelectorAll('.filter-btn-ds').forEach(btn => {
    btn.onclick = () => {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn-ds').forEach(b => {
        b.style.background = 'var(--sb-card)';
        b.style.color = 'var(--sb-muted)';
        b.style.borderColor = 'var(--sb-border)';
      });
      btn.style.background = 'rgba(31,111,235,0.15)';
      btn.style.color = '#58a6ff';
      loadSolicitudes(currentFilter);
    };
  });

  async function loadSolicitudes(filter = 'todas') {
    try {
      const response = await fetch(`${window.API_URL}/solicitudes`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      let solicitudes = await response.json();

      if (filter !== 'todas') {
        solicitudes = solicitudes.filter(s => s.estado === filter);
      }

      const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      setEl('totalSolicitudes', solicitudes.length);
      setEl('pendientes', solicitudes.filter(s => s.estado === 'pendiente').length);
      setEl('completadas', solicitudes.filter(s => s.estado === 'completada').length);

      const listEl = document.getElementById('solicitudesList');
      if (solicitudes.length === 0) {
        listEl.innerHTML = '<p style="text-align:center;color:var(--sb-muted);padding:2rem;">No hay solicitudes</p>';
        return;
      }
      listEl.innerHTML = solicitudes.map(s => `
        <div style="padding:12px;border-bottom:1px solid var(--sb-border);display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
              <span>${getTipoIcon(s.tipo)}</span>
              <span style="font-size:0.85rem;font-weight:600;color:var(--sb-text);">${getTipoNombre(s.tipo)}</span>
            </div>
            <p style="font-size:0.75rem;color:var(--sb-muted);margin:0;">👤 ${s.usuario_nombre} – Dpto ${s.usuario_apartamento || 'N/A'}</p>
            <p style="font-size:0.72rem;color:var(--sb-muted);margin:3px 0 0;">📅 ${new Date(s.fecha_solicitud).toLocaleDateString('es-ES')}</p>
          </div>
          <span class="ds-badge ${getEstadoColor(s.estado)}">${getEstadoLabel(s.estado)}</span>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      document.getElementById('solicitudesList').innerHTML = '<p style="color:#f87171;text-align:center;padding:2rem;">❌ Error</p>';
    }
  }

  async function loadEmergencias() {
    try {
      const response = await fetch(`${window.API_URL}/emergencias/activas`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      const emergencies = await response.json();
      const alertBox = document.getElementById('emergenciasAlert');
      const list = document.getElementById('emergenciasList');
      const count = document.getElementById('emergenciasCount');
      if (count) count.textContent = emergencies.length;
      if (emergencies.length > 0) {
        alertBox.classList.remove('hidden');
        list.innerHTML = emergencies.map(e => `
          <div class="ds-emergency-item">
            <strong>${e.tipo.toUpperCase()}</strong> – ${e.ubicacion || ''}<br>
            <span style="font-size:0.75rem;color:var(--sb-muted);">${e.usuario_nombre} (Dpto ${e.usuario_apartamento})</span>
          </div>
        `).join('');
      } else {
        alertBox.classList.add('hidden');
      }
    } catch (e) { console.error(e); }
  }

  window.contactarVigilante = async () => {
    try {
      const response = await fetch(`${window.API_URL}/usuarios/vigilantes`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      const vigilantes = await response.json();
      if (vigilantes.length === 0) { alert('⚠️ No hay vigilantes activos'); return; }
      const v = vigilantes[0];
      window.navigateTo('/chat', { userId: v.id, userName: v.nombre });
    } catch (error) { console.error(error); alert('❌ Error al conectar con vigilante'); }
  };

  window.abrirNuevoAviso = () => {
    let modal = document.getElementById('nuevoAvisoModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'nuevoAvisoModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(8px);';
      modal.innerHTML = `
        <div style="background:var(--sb-surface);border:1px solid var(--sb-border);border-radius:12px;padding:24px;max-width:420px;width:100%;box-shadow:0 25px 60px rgba(0,0,0,0.7);">
          <h2 style="font-size:1rem;font-weight:700;color:var(--sb-text);margin:0 0 16px;">📢 Crear Nuevo Aviso</h2>
          <div style="margin-bottom:12px;">
            <label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:5px;font-weight:600;">Título</label>
            <input type="text" id="avisoTitulo" class="form-input" placeholder="Ej: Corte de agua" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);">
          </div>
          <div style="margin-bottom:12px;">
            <label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:5px;font-weight:600;">Mensaje</label>
            <textarea id="avisoMensaje" class="form-textarea" placeholder="Detalles del aviso..." style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);min-height:80px;"></textarea>
          </div>
          <div style="margin-bottom:18px;">
            <label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:5px;font-weight:600;">Prioridad</label>
            <select id="avisoTipo" class="form-select" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);">
              <option value="informativa">ℹ️ Informativa</option>
              <option value="mantenimiento">🔧 Mantenimiento</option>
              <option value="emergencia">🚨 Crítica / Urgente</option>
            </select>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-ghost" style="flex:1;" onclick="document.getElementById('nuevoAvisoModal').remove()">Cancelar</button>
            <button class="btn btn-primary" style="flex:1;" onclick="guardarAviso()">Publicar Aviso</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
  };

  window.guardarAviso = async () => {
    const titulo = document.getElementById('avisoTitulo').value;
    const mensaje = document.getElementById('avisoMensaje').value;
    const tipo = document.getElementById('avisoTipo').value;
    if (!titulo || !mensaje) return alert('Por favor llena todos los campos');
    const btn = document.querySelector('#nuevoAvisoModal .btn-primary');
    const orig = btn.textContent;
    btn.textContent = 'Publicando...'; btn.disabled = true;
    try {
      const response = await fetch(`${window.API_URL}/alertas`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${window.appState.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, mensaje, tipo })
      });
      if (response.ok) {
        document.getElementById('nuevoAvisoModal').remove();
        alert('✅ Aviso publicado correctamente');
        if (typeof renderAnnouncementsWidget === 'function') renderAnnouncementsWidget('announcementsWidget');
      } else {
        const errorData = await response.json();
        alert(`❌ Error: ${errorData.error || 'No se pudo publicar'}`);
      }
    } catch (e) { console.error(e); alert('❌ Error de conexión'); }
    finally { if (document.getElementById('nuevoAvisoModal')) { btn.textContent = orig; btn.disabled = false; } }
  };

  window.verResidentes = async () => {
    let modal = document.getElementById('residentesModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'residentesModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(8px);';
      modal.innerHTML = `
        <div style="background:var(--sb-surface);border:1px solid var(--sb-border);border-radius:12px;padding:24px;max-width:560px;width:100%;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 25px 60px rgba(0,0,0,0.7);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
            <h2 style="font-size:1rem;font-weight:700;color:var(--sb-text);margin:0;">👥 Estado de Residentes</h2>
            <button onclick="document.getElementById('residentesModal').remove()" style="background:rgba(255,255,255,0.07);border:1px solid var(--sb-border);width:30px;height:30px;border-radius:6px;color:var(--sb-muted);font-size:1.1rem;cursor:pointer;">×</button>
          </div>
          <div id="listaResidentesContent" style="flex:1;overflow-y:auto;">
            <div class="loading-spinner" style="margin:2rem auto;"></div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const content = document.getElementById('listaResidentesContent');
    try {
      const response = await fetch(`${window.API_URL}/pagos/estado-residentes`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      const residents = await response.json();
      if (residents.length === 0) {
        content.innerHTML = '<p style="text-align:center;color:var(--sb-muted);padding:2rem;">No hay residentes</p>';
        return;
      }
      content.innerHTML = residents.map(r => `
        <div style="padding:12px;border-bottom:1px solid var(--sb-border);display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:600;font-size:0.88rem;color:var(--sb-text);">${r.usuario_nombre}</div>
            <div style="font-size:0.72rem;color:var(--sb-muted);">📍 Dpto ${r.usuario_apartamento || 'N/A'} · ${r.email}</div>
          </div>
          <button onclick="togglePagoResidente(${r.id}, ${r.esta_pagado})"
            style="padding:5px 12px;border-radius:6px;font-size:0.72rem;font-weight:600;cursor:pointer;border:none;font-family:inherit;
            background:${r.esta_pagado ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)'};
            color:${r.esta_pagado ? '#4ade80' : '#f87171'};">
            ${r.esta_pagado ? '✅ Pagado' : '❌ No pago'}
          </button>
        </div>
      `).join('');
    } catch (error) {
      console.error(error);
      content.innerHTML = '<p style="color:#f87171;text-align:center;padding:2rem;">❌ Error al cargar</p>';
    }
  };

  window.togglePagoResidente = async (userId, currentlyPaid) => {
    try {
      const response = await fetch(`${window.API_URL}/pagos/toggle-estado`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${window.appState.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: userId, esta_pagado: !currentlyPaid })
      });
      if (response.ok) { verResidentes(); }
      else { alert('❌ Error al actualizar estado de pago'); }
    } catch (error) { console.error(error); alert('❌ Error de conexión'); }
  };

  // ── GESTIÓN DE MÉTODOS DE PAGO ──────────────────
  window.gestionarMetodosPago = async () => {
    let modal = document.getElementById('metodosPagoModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'metodosPagoModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(8px);';
      modal.innerHTML = `
        <div style="background:var(--sb-surface);border:1px solid var(--sb-border);border-radius:12px;padding:24px;max-width:600px;width:100%;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 25px 60px rgba(0,0,0,0.7);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
            <h2 style="font-size:1rem;font-weight:700;color:var(--sb-text);margin:0;">💳 Métodos de Pago del Edificio</h2>
            <button onclick="document.getElementById('metodosPagoModal').remove()" style="background:rgba(255,255,255,0.07);border:1px solid var(--sb-border);width:30px;height:30px;border-radius:6px;color:var(--sb-muted);font-size:1.1rem;cursor:pointer;">×</button>
          </div>
          
          <!-- Botón Agregar -->
          <button onclick="mostrarFormMetodo()" style="background:rgba(88,166,255,0.1);border:1px dashed rgba(88,166,255,0.3);color:#58a6ff;padding:10px;border-radius:8px;margin-bottom:15px;font-size:0.8rem;font-weight:600;cursor:pointer;width:100%;font-family:inherit;">
            ＋ Agregar Nuevo Método
          </button>

          <!-- Formulario (oculto por defecto) -->
          <div id="formMetodoContainer" style="display:none;background:rgba(255,255,255,0.02);border:1px solid var(--sb-border);border-radius:8px;padding:15px;margin-bottom:15px;">
            <h3 id="formMetodoTitle" style="font-size:0.85rem;margin:0 0 12px;color:var(--sb-text);">Nuevo Método</h3>
            <div style="margin-bottom:10px;">
              <label style="font-size:0.7rem;color:var(--sb-muted);display:block;margin-bottom:4px;">Tipo de Método</label>
              <select id="metodoTipo" class="form-select" onchange="actualizarCamposMetodo()" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);">
                <option value="Yape">🟣 Yape</option>
                <option value="Plin">🟢 Plin</option>
                <option value="Transferencia BCP">🏦 BCP</option>
                <option value="Transferencia Interbank">🏦 Interbank</option>
                <option value="Transferencia BBVA">🏦 BBVA</option>
                <option value="Transferencia Scotiabank">🏦 Scotiabank</option>
                <option value="Efectivo / Otros">💵 Efectivo / Otros</option>
              </select>
            </div>
            <div id="camposDinamicosMetodo"></div>
            <div style="display:flex;gap:8px;margin-top:10px;">
              <button class="btn btn-ghost btn-sm" style="flex:1;" onclick="cancelarFormMetodo()">Cancelar</button>
              <button class="btn btn-primary btn-sm" style="flex:1;" onclick="guardarMetodoPago()">Guardar</button>
            </div>
          </div>

          <div id="listaMetodosContent" style="flex:1;overflow-y:auto;">
            <div class="loading-spinner" style="margin:2rem auto;"></div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    renderListaMetodos();
  };

  window.renderListaMetodos = async () => {
    const content = document.getElementById('listaMetodosContent');
    try {
      const response = await fetch(`${window.API_URL}/pagos/metodos`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      const metodos = await response.json();
      if (metodos.length === 0) {
        content.innerHTML = '<p style="text-align:center;color:var(--sb-muted);padding:2rem;font-size:0.85rem;">No hay métodos configurados</p>';
        return;
      }
      content.innerHTML = metodos.map(m => {
        const d = m.detalles || {};
        let text = '';
        const t = m.tipo.toLowerCase();
        if (t.includes('yape') || t.includes('plin')) text = `📲 ${d.telefono || d.numero} – ${d.nombre || d.titular}`;
        else if (t.includes('transferencia') || t.includes('bcp') || t.includes('interbank')) text = `🏦 ${d.cuenta} – ${d.nombre || d.titular}`;
        else text = d.instrucciones || d.detalle || 'Revisar detalles';

        return `
            <div style="padding:12px;border-bottom:1px solid var(--sb-border);display:flex;justify-content:space-between;align-items:center;background:${m.activo ? 'transparent' : 'rgba(255,255,255,0.02)'}">
              <div style="flex:1;opacity:${m.activo ? 1 : 0.6}">
                <div style="font-weight:600;font-size:0.85rem;color:var(--sb-text);display:flex;align-items:center;gap:6px;">
                    ${m.tipo} ${m.activo ? '' : '<span style="font-size:0.65rem;background:rgba(255,255,255,0.1);padding:1px 5px;border-radius:4px;">Inactivo</span>'}
                </div>
                <div style="font-size:0.75rem;color:var(--sb-muted);margin-top:3px;">${text}</div>
              </div>
              <div style="display:flex;gap:6px;">
                <button onclick="toggleEstadoMetodo(${m.id}, ${m.activo})" 
                  style="padding:6px;border-radius:6px;border:1px solid var(--sb-border);background:var(--sb-card);cursor:pointer;font-size:0.8rem;" title="Activar/Desactivar">
                  ${m.activo ? '🔵' : '⚪'}
                </button>
                <button onclick="eliminarMetodoPago(${m.id})" 
                  style="padding:6px;border-radius:6px;border:1px solid rgba(248,113,113,0.2);background:rgba(248,113,113,0.05);color:#f87171;cursor:pointer;font-size:0.8rem;" title="Eliminar">
                  🗑️
                </button>
              </div>
            </div>
          `;
      }).join('');
    } catch (e) {
      content.innerHTML = '<p style="color:#f87171;text-align:center;padding:1rem;">❌ Error</p>';
    }
  };

  window.mostrarFormMetodo = () => {
    document.getElementById('formMetodoContainer').style.display = 'block';
    actualizarCamposMetodo();
  };

  window.cancelarFormMetodo = () => {
    document.getElementById('formMetodoContainer').style.display = 'none';
  };

  window.actualizarCamposMetodo = () => {
    const tipo = document.getElementById('metodoTipo').value.toLowerCase();
    const container = document.getElementById('camposDinamicosMetodo');
    let html = '';

    if (tipo.includes('yape') || tipo.includes('plin')) {
      html = `
            <input type="text" id="m_tel" class="form-input" placeholder="Número de Celular" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);margin-bottom:8px;">
            <input type="text" id="m_nombre" class="form-input" placeholder="Nombre completo" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);">
          `;
    } else if (tipo.includes('transferencia') || tipo.includes('bcp') || tipo.includes('interbank') || tipo.includes('bbva')) {
      html = `
            <input type="text" id="m_cuenta" class="form-input" placeholder="Número de Cuenta" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);margin-bottom:8px;">
            <input type="text" id="m_cci" class="form-input" placeholder="Código Interbancario (CCI)" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);margin-bottom:8px;">
            <input type="text" id="m_nombre" class="form-input" placeholder="Nombre del Titular" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);">
          `;
    } else {
      // Efectivo / Otros
      html = `
            <textarea id="m_inst" class="form-textarea" placeholder="Instrucciones detalladas de pago" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"></textarea>
          `;
    }

    container.innerHTML = html;
  };

  window.guardarMetodoPago = async () => {
    const tipo = document.getElementById('metodoTipo').value;
    const t = tipo.toLowerCase();
    let detalles = {};

    if (t.includes('yape') || t.includes('plin')) {
      detalles = { telefono: document.getElementById('m_tel').value, nombre: document.getElementById('m_nombre').value };
    } else if (t.includes('transferencia') || t.includes('bcp') || t.includes('interbank') || t.includes('bbva')) {
      detalles = { cuenta: document.getElementById('m_cuenta').value, cci: document.getElementById('m_cci').value, nombre: document.getElementById('m_nombre').value };
    } else {
      detalles = { instrucciones: document.getElementById('m_inst').value };
    }

    // Validar campos vacíos
    if (Object.values(detalles).some(v => !v)) return alert('Por favor llena todos los campos del método');

    try {
      const res = await fetch(`${window.API_URL}/pagos/metodos`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${window.appState.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, detalles })
      });
      if (res.ok) {
        cancelarFormMetodo();
        renderListaMetodos();
      } else { alert('❌ Error al guardar'); }
    } catch (e) { alert('❌ Error de conexión'); }
  };

  window.toggleEstadoMetodo = async (id, actual) => {
    try {
      const res = await fetch(`${window.API_URL}/pagos/metodos/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${window.appState.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !actual })
      });
      if (res.ok) renderListaMetodos();
    } catch (e) { alert('❌ Error'); }
  };

  window.eliminarMetodoPago = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este método de pago?')) return;
    try {
      const res = await fetch(`${window.API_URL}/pagos/metodos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      if (res.ok) renderListaMetodos();
    } catch (e) { alert('❌ Error'); }
  };

  // ── GESTIÓN DE DELIVERY ──────────────────────────
  window.gestionarDelivery = async () => {
    let modal = document.getElementById('deliveryModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'deliveryModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(8px);';
      modal.innerHTML = `
        <div style="background:var(--sb-surface);border:1px solid var(--sb-border);border-radius:12px;padding:24px;max-width:500px;width:100%;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 25px 60px rgba(0,0,0,0.7);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
            <h2 style="font-size:1rem;font-weight:700;color:var(--sb-text);margin:0;">🍕 Gestión de Delivery</h2>
            <button onclick="document.getElementById('deliveryModal').remove()" style="background:rgba(255,255,255,0.07);border:1px solid var(--sb-border);width:30px;height:30px;border-radius:6px;color:var(--sb-muted);font-size:1.1rem;cursor:pointer;">×</button>
          </div>
          
          <div style="margin-bottom:20px;background:rgba(255,255,255,0.02);border:1px solid var(--sb-border);border-radius:8px;padding:15px;">
            <h3 style="font-size:0.85rem;margin:0 0 12px;color:var(--sb-text);">Agregar / Editar Servicio</h3>
            <input type="hidden" id="deliveryId">
            <div style="margin-bottom:10px;">
              <input type="text" id="deliveryNombre" class="form-input" placeholder="Nombre (ej: Pizza Express)" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);">
            </div>
            <div style="margin-bottom:10px;">
              <input type="text" id="deliveryDesc" class="form-input" placeholder="Descripción corta" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);">
            </div>
            <div style="margin-bottom:10px;">
              <input type="text" id="deliveryTel" class="form-input" placeholder="Teléfono" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);">
            </div>
            <div style="display:flex;gap:8px;">
              <button class="btn btn-ghost btn-sm" style="flex:1;" onclick="limpiarFormDelivery()">Limpiar</button>
              <button class="btn btn-primary btn-sm" style="flex:1;" onclick="guardarDelivery()">Guardar</button>
            </div>
          </div>

          <div id="listaDeliveryContent" style="flex:1;overflow-y:auto;">
            <div class="loading-spinner" style="margin:2rem auto;"></div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    renderListaDelivery();
  };

  window.limpiarFormDelivery = () => {
    document.getElementById('deliveryId').value = '';
    document.getElementById('deliveryNombre').value = '';
    document.getElementById('deliveryDesc').value = '';
    document.getElementById('deliveryTel').value = '';
  };

  window.renderListaDelivery = async () => {
    const listEl = document.getElementById('listaDeliveryContent');
    try {
      const response = await fetch(`${window.API_URL}/delivery/all`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      const services = await response.json();
      if (services.length === 0) {
        listEl.innerHTML = '<p style="text-align:center;color:var(--sb-muted);padding:2rem;">No hay servicios registrados</p>';
        return;
      }
      listEl.innerHTML = services.map(s => `
        <div style="padding:12px;border-bottom:1px solid var(--sb-border);display:flex;justify-content:space-between;align-items:center;">
          <div style="flex:1;">
            <div style="font-weight:600;font-size:0.85rem;color:var(--sb-text);">${s.nombre} ${s.activo ? '' : '<small style="color:#f87171">(Inactivo)</small>'}</div>
            <div style="font-size:0.75rem;color:var(--sb-muted);">${s.telefono} · ${s.descripcion || ''}</div>
          </div>
          <div style="display:flex;gap:6px;">
            <button onclick="editarDelivery(${JSON.stringify(s).replace(/"/g, '&quot;')})" style="padding:6px;border-radius:6px;border:1px solid var(--sb-border);background:var(--sb-card);cursor:pointer;">✏️</button>
            <button onclick="toggleDeliveryActivo(${s.id}, ${s.activo})" style="padding:6px;border-radius:6px;border:1px solid var(--sb-border);background:var(--sb-card);cursor:pointer;">${s.activo ? '🔵' : '⚪'}</button>
            <button onclick="eliminarDelivery(${s.id})" style="padding:6px;border-radius:6px;border:1px solid rgba(248,113,113,0.2);background:rgba(248,113,113,0.05);color:#f87171;cursor:pointer;">🗑️</button>
          </div>
        </div>
      `).join('');
    } catch (e) {
      listEl.innerHTML = '<p style="color:#f87171;text-align:center;padding:1rem;">❌ Error</p>';
    }
  };

  window.editarDelivery = (s) => {
    document.getElementById('deliveryId').value = s.id;
    document.getElementById('deliveryNombre').value = s.nombre;
    document.getElementById('deliveryDesc').value = s.descripcion || '';
    document.getElementById('deliveryTel').value = s.telefono;
  };

  window.guardarDelivery = async () => {
    const id = document.getElementById('deliveryId').value;
    const nombre = document.getElementById('deliveryNombre').value;
    const descripcion = document.getElementById('deliveryDesc').value;
    const telefono = document.getElementById('deliveryTel').value;

    if (!nombre || !telefono) return alert('Nombre y teléfono obligatorios');

    try {
      const url = id ? `${window.API_URL}/delivery/${id}` : `${window.API_URL}/delivery`;
      const method = id ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${window.appState.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, telefono })
      });
      if (res.ok) {
        limpiarFormDelivery();
        renderListaDelivery();
      } else { alert('❌ Error al guardar'); }
    } catch (e) { alert('❌ Error de conexión'); }
  };

  window.toggleDeliveryActivo = async (id, actual) => {
    try {
      const res = await fetch(`${window.API_URL}/delivery/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${window.appState.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !actual })
      });
      if (res.ok) renderListaDelivery();
    } catch (e) { alert('❌ Error'); }
  };

  window.eliminarDelivery = async (id) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    try {
      const res = await fetch(`${window.API_URL}/delivery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      if (res.ok) renderListaDelivery();
    } catch (e) { alert('❌ Error'); }
  };

  function getTipoIcon(tipo) {
    const icons = { medica: '🏥', limpieza: '🧹', entretenimiento: '🎉', mantenimiento: '🔧', general: '📋' };
    return icons[tipo] || '📋';
  }

  function getTipoNombre(tipo) {
    const nombres = { medica: 'Médica', limpieza: 'Limpieza', entretenimiento: 'Entrega', mantenimiento: 'Mantenim.', general: 'General' };
    return nombres[tipo] || tipo;
  }

  function getEstadoColor(estado) {
    const c = { pendiente: 'warning', en_proceso: 'info', completada: 'success', rechazada: 'danger' };
    return c[estado] || 'info';
  }

  function getEstadoLabel(estado) {
    const l = { pendiente: 'Pendiente', en_proceso: 'En Proceso', completada: 'Completada', rechazada: 'Rechazada' };
    return l[estado] || estado;
  }
}
