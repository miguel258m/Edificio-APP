// =====================================================
// DASHBOARD ADMINISTRADOR - Layout Desktop con Sidebar
// =====================================================

import { renderAnnouncementsWidget } from '../utils/announcements.js';
import { renderSidebarLayout } from '../utils/sidebar-layout.js';

export function renderDashboardAdmin(container) {
  const user = window.appState.user;

  // Nav items del sidebar
  const navItems = [
    { key: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/dashboard-admin' },
    { key: 'usuarios', icon: '👥', label: 'Gestión Usuarios', path: '/gestion-usuarios', badge: '' },
    { key: 'reportes', icon: '📋', label: 'Reportes', path: '/solicitudes' },
    { key: 'alertas', icon: '🔔', label: 'Alertas', onClick: 'showAlertaModal()' },
    { key: 'perfil', icon: '⚙️', label: 'Mi Perfil', path: '/perfil' },
  ];

  const main = renderSidebarLayout(container, {
    role: 'admin',
    activeNav: 'dashboard',
    pageTitle: 'Dashboard',
    pageSubtitle: 'Panel de administración del edificio',
    breadcrumb: 'Dashboard',
    navItems,
  });

  // Inyectar el contenido del dashboard
  main.innerHTML += `
    <!-- ===== BIENVENIDA Y SELECTOR ===== -->
    <div style="margin-bottom: 25px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px;">
        <div>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: white; margin: 0;">¡Hola, ${user.nombre.split(' ')[0]}! 👋</h2>
          <p id="dashboardWelcomeMsg" style="font-size: 0.88rem; color: var(--sb-muted); margin: 4px 0 0;">Cargando resumen del estado actual...</p>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; background: var(--sb-card); padding: 10px 14px; border-radius: 12px; border: 1px solid var(--sb-border);">
          <span style="font-size: 0.78rem; color: var(--sb-muted); font-weight: 600;">📍 Condominio:</span>
          <select id="dashboardEdificioSelector" onchange="window.filterDashboardByEdificio(this.value)" style="background: var(--sb-surface); border: 1px solid var(--sb-border); color: var(--sb-text); border-radius: 8px; padding: 5px 10px; font-size: 0.8rem; cursor: pointer; outline: none; min-width: 160px;">
            <option value="all">🌍 Todos los edificios</option>
          </select>
          <div id="statsLoader" class="loading-spinner" style="width: 14px; height: 14px; border-width: 2px; display: none;"></div>
        </div>
      </div>
    </div>

    <!-- ===== KPI STATS ===== -->
    <div class="ds-stats-grid">
      <div class="ds-stat-card amber">
        <div class="ds-stat-label">⏳ Pendientes</div>
        <div class="ds-stat-value" id="count-pending">–</div>
        <div class="ds-stat-sub">Usuarios por aprobar</div>
      </div>
      <div class="ds-stat-card red" id="card-emergencias">
        <div class="ds-stat-label">🚨 Emergencias</div>
        <div class="ds-stat-value" id="adminEmergenciasCount">–</div>
        <div class="ds-stat-sub">Alertas activas ahora</div>
      </div>
      <div class="ds-stat-card blue">
        <div class="ds-stat-label">👥 Residentes</div>
        <div class="ds-stat-value" id="count-residente">–</div>
        <div class="ds-stat-sub">En el edificio actual</div>
      </div>
      <div class="ds-stat-card green">
        <div class="ds-stat-label">🛡️ Vigilantes</div>
        <div class="ds-stat-value" id="count-vigilante">–</div>
        <div class="ds-stat-sub">Personal de seguridad</div>
      </div>
    </div>

    <!-- ===== ACCIONES RAPIDAS + PERSONAL ===== -->
    <div class="ds-grid-2" style="margin-bottom: 20px;">

      <!-- Estado del Sistema (Insights Operativos) -->
      <div class="ds-card">
        <div class="ds-card-header">
          <div>
            <p class="ds-card-title">🚀 Estado del Sistema</p>
            <p class="ds-card-subtitle">Tareas y métricas clave</p>
          </div>
        </div>
        <div class="ds-grid-2" style="gap: 12px;">
          <div class="insight-card" onclick="window.navigateTo('/gestion-usuarios')">
            <div class="insight-icon" style="background:rgba(251,191,36,0.1); color:#fbbf24;">⏳</div>
            <div>
              <p class="insight-value" id="insight-pending">–</p>
              <p class="insight-label">Registros pendientes</p>
            </div>
          </div>
          <div class="insight-card" onclick="window.scrollToDsEmergencias()">
            <div class="insight-icon" style="background:rgba(248,113,113,0.1); color:#f87171;">🚨</div>
            <div>
              <p class="insight-value" id="insight-emergencies">–</p>
              <p class="insight-label">Emergencias activas</p>
            </div>
          </div>
          <div class="insight-card" onclick="window.navigateTo('/solicitudes')">
            <div class="insight-icon" style="background:rgba(59,130,246,0.1); color:#3b82f6;">📋</div>
            <div>
              <p class="insight-value" id="insight-reports">–</p>
              <p class="insight-label">Reportes totales</p>
            </div>
          </div>
          <div class="insight-card" onclick="window.scrollToActivityFeed()">
            <div class="insight-icon" style="background:rgba(34,211,238,0.1); color:#22d3ee;">📈</div>
            <div>
              <p class="insight-value" id="insight-activity">Alta</p>
              <p class="insight-label">Actividad hoy</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Widget de Usuarios en Línea -->
      <div class="ds-card" id="onlineUsersWidget" style="min-height: 200px;">
        <div class="ds-card-header">
          <div>
            <p class="ds-card-title">🟢 Usuarios en Línea</p>
            <p class="ds-card-subtitle">Actividad en tiempo real</p>
          </div>
          <span id="onlineCountBadge" class="badge badge-success" style="font-size: 0.7rem;">0</span>
        </div>
        <div id="onlineUsersList" class="ds-online-list" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="text-align:center;padding:1rem;color:var(--sb-muted);font-size:0.8rem;">Conectando al servidor...</div>
        </div>
      </div>

      <!-- Personal del Edificio -->
      <div class="ds-card">
        <div class="ds-card-header">
          <div>
            <p class="ds-card-title">🛡️ Personal del Edificio</p>
            <p class="ds-card-subtitle">Staff y servicios</p>
          </div>
        </div>
        <div class="ds-role-grid">
          <div class="ds-role-pill" onclick="verListaUsuarios('vigilante')">
            <div class="ds-role-pill-icon">🛡️</div>
            <div class="ds-role-pill-count" id="pr-vigilante">–</div>
            <div class="ds-role-pill-label">Vigilantes</div>
          </div>
          <div class="ds-role-pill" onclick="verListaUsuarios('medico')">
            <div class="ds-role-pill-icon">🩺</div>
            <div class="ds-role-pill-count" id="pr-medico">–</div>
            <div class="ds-role-pill-label">Médicos</div>
          </div>
          <div class="ds-role-pill" onclick="verListaUsuarios('limpieza')">
            <div class="ds-role-pill-icon">🧹</div>
            <div class="ds-role-pill-count" id="pr-limpieza">–</div>
            <div class="ds-role-pill-label">Limpieza</div>
          </div>
          <div class="ds-role-pill" onclick="verListaUsuarios('entretenimiento')">
            <div class="ds-role-pill-icon">🎭</div>
            <div class="ds-role-pill-count" id="pr-entretenimiento">–</div>
            <div class="ds-role-pill-label">Recreación</div>
          </div>
          <div class="ds-role-pill" onclick="verListaUsuarios('gerente')">
            <div class="ds-role-pill-icon">📊</div>
            <div class="ds-role-pill-count" id="pr-gerente">–</div>
            <div class="ds-role-pill-label">Gerentes</div>
          </div>
        </div>
      </div>

      <!-- Residentes del Edificio -->
      <div class="ds-card">
        <div class="ds-card-header">
          <div>
            <p class="ds-card-title">👥 Residentes del Edificio</p>
            <p class="ds-card-subtitle">Habitantes registrados</p>
          </div>
        </div>
        <div class="ds-role-grid">
          <div class="ds-role-pill" onclick="verListaUsuarios('residente')" style="width: 100%; grid-column: span 2;">
            <div class="ds-role-pill-icon">🏠</div>
            <div class="ds-role-pill-count" id="pr-residente">–</div>
            <div class="ds-role-pill-label">Total Residentes</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== AVISOS + EDIFICIOS ===== -->
    <div class="ds-grid-2" style="margin-bottom: 20px;">
      <!-- Avisos recientes -->
      <div class="ds-card">
        <div class="ds-card-header" style="border-bottom: 1px solid var(--sb-border); margin-bottom: 15px; padding-bottom: 10px;">
          <div>
            <p class="ds-card-title">📢 Comunicados Recientes</p>
          </div>
          <button onclick="showAlertaModal()" style="background:rgba(31,111,235,0.15);border:1px solid rgba(31,111,235,0.3);color:#58a6ff;border-radius:8px;padding:6px 14px;font-size:0.75rem;cursor:pointer;font-weight:600;">+ Nuevo</button>
        </div>
        <div id="announcementsWidget"></div>
      </div>

      <!-- Actividad Reciente (Nuevo Feed) -->
      <div class="ds-card" id="activityFeedContainer">
        <div class="ds-card-header">
          <div>
            <p class="ds-card-title">🕒 Actividad Reciente</p>
            <p class="ds-card-subtitle">Últimos eventos del sistema</p>
          </div>
        </div>
        <div id="activityFeed" style="margin-top: 10px;">
          <div class="activity-item">
            <div class="activity-dot" style="background: #3b82f6;"></div>
            <div style="flex: 1;">
              <p style="font-size: 0.8rem; color: white; margin: 0;"><strong>Sistema</strong> iniciado correctamente</p>
              <p style="font-size: 0.7rem; color: var(--sb-muted); margin: 2px 0 0;">Hoy, 08:00 AM</p>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-dot" style="background: #fbbf24;"></div>
            <div style="flex: 1;">
              <p style="font-size: 0.8rem; color: white; margin: 0;">Buscando actualizaciones de <strong>registros</strong>...</p>
              <p style="font-size: 0.7rem; color: var(--sb-muted); margin: 2px 0 0;">Hace 5 min</p>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-dot" style="background: #4ade80;"></div>
            <div style="flex: 1;">
              <p style="font-size: 0.8rem; color: white; margin: 0;">Resumen del dashboard actualizado</p>
              <p style="font-size: 0.7rem; color: var(--sb-muted); margin: 2px 0 0;">Ahora</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== DESGLOSE POR CONDOMINIO (Si aplica) ===== -->
    <div id="edificiosStatsCard" class="ds-card" style="margin-bottom: 20px;">
      <div class="ds-card-header">
        <div>
          <p class="ds-card-title">📊 Desglose por Condominio</p>
        </div>
      </div>
      <div id="edificiosStatsContainer">
        <div style="text-align:center;padding:2rem;color:var(--sb-muted);">Cargando...</div>
      </div>
    </div>

    <!-- ===== EMERGENCIAS ACTIVAS ===== -->
    <div class="ds-card" id="section-emergencias">
      <div class="ds-card-header">
        <div>
          <p class="ds-card-title" style="color:#f87171;">🚨 Emergencias Activas</p>
        </div>
      </div>
      <div id="adminEmergenciasList">
        <p style="text-align:center;color:var(--sb-muted);padding:1.5rem;">✅ Sin alertas críticas activas</p>
      </div>
    </div>

    <!-- ===== MODAL COMUNICADO ===== -->
    <div id="alertaModal" class="hidden" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(8px);">
      <div style="background:var(--sb-surface);border:1px solid var(--sb-border);border-radius:12px;padding:24px;max-width:500px;width:100%;box-shadow:0 25px 60px rgba(0,0,0,0.7);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <h2 style="font-size:1rem;font-weight:700;color:var(--sb-text);margin:0;">📢 Nuevo Comunicado</h2>
          <button onclick="closeAlertaModal()" style="background:rgba(255,255,255,0.07);border:1px solid var(--sb-border);width:30px;height:30px;border-radius:6px;cursor:pointer;color:var(--sb-muted);font-size:1.1rem;display:flex;align-items:center;justify-content:center;">×</button>
        </div>
        <form id="alertaForm">
          <div style="margin-bottom:14px;">
            <label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:6px;font-weight:600;">Edificio de destino</label>
            <select class="form-select" id="edificioAlerta" required style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);">
              <option value="global">🌍 Todos los edificios (Global)</option>
            </select>
          </div>
          <div style="margin-bottom:14px;">
            <label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:6px;font-weight:600;">Tipo de prioridad</label>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
              <label style="cursor:pointer;"><input type="radio" name="tipoAlerta" value="informativa" checked style="display:none;"><div style="padding:8px;text-align:center;border-radius:6px;background:var(--sb-card);font-size:0.75rem;border:1px solid var(--sb-border);" class="radio-tab">ℹ️ Info</div></label>
              <label style="cursor:pointer;"><input type="radio" name="tipoAlerta" value="mantenimiento" style="display:none;"><div style="padding:8px;text-align:center;border-radius:6px;background:var(--sb-card);font-size:0.75rem;border:1px solid var(--sb-border);" class="radio-tab">🔧 Mant.</div></label>
              <label style="cursor:pointer;"><input type="radio" name="tipoAlerta" value="emergencia" style="display:none;"><div style="padding:8px;text-align:center;border-radius:6px;background:var(--sb-card);font-size:0.75rem;border:1px solid var(--sb-border);" class="radio-tab">🚨 Crítica</div></label>
            </div>
          </div>
          <div style="margin-bottom:14px;">
            <label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:6px;font-weight:600;">Título</label>
            <input type="text" class="form-input" id="tituloAlerta" required placeholder="Ej: Corte de agua programado" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);">
          </div>
          <div style="margin-bottom:18px;">
            <label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:6px;font-weight:600;">Mensaje</label>
            <textarea class="form-textarea" id="mensajeAlerta" required placeholder="Describe el detalle del aviso..." style="min-height:100px;background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);"></textarea>
          </div>
          <div style="display:flex;gap:10px;">
            <button type="button" class="btn btn-ghost" onclick="closeAlertaModal()" style="flex:1;">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="btnEnviarAlerta" style="flex:1.5;">Enviar Comunicado</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ===== MODAL LISTA USUARIOS ===== -->
    <div id="modalListaUsuarios" class="hidden" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.88);z-index:10000;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(12px);">
      <div style="background:var(--sb-surface);width:100%;max-width:640px;height:88vh;border-radius:16px 16px 0 0;padding:24px;display:flex;flex-direction:column;box-shadow:0 -10px 50px rgba(0,0,0,0.7);border-top:1px solid var(--sb-border);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <div>
            <h2 id="modalListaTitulo" style="font-size:1.1rem;font-weight:700;color:var(--sb-text);margin:0;">Usuarios</h2>
            <p id="modalListaSubtitulo" style="font-size:0.78rem;color:var(--sb-muted);margin:0;">Gestionar cuentas</p>
          </div>
          <button onclick="cerrarListaUsuarios()" style="background:rgba(255,255,255,0.08);border:1px solid var(--sb-border);width:38px;height:38px;border-radius:8px;color:var(--sb-text);font-size:1.3rem;cursor:pointer;">×</button>
        </div>
        <div id="modalListaContenido" style="flex:1;overflow-y:auto;padding-bottom:2rem;">
          <div class="loading-spinner" style="margin:4rem auto;"></div>
        </div>
      </div>
    </div>

    <!-- ===== MODAL PASSWORD ===== -->
    <div id="modalPasswordAdmin" class="hidden" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:10001;display:flex;align-items:center;justify-content:center;padding:1.5rem;backdrop-filter:blur(10px);">
      <div style="background:var(--sb-surface);border:1px solid var(--sb-border);border-radius:12px;padding:24px;width:100%;max-width:380px;">
        <h3 style="font-size:1rem;font-weight:700;color:var(--sb-text);margin:0 0 6px;">🔑 Nueva Contraseña</h3>
        <p id="passwordUsuarioNombre" style="color:var(--sb-muted);margin-bottom:16px;font-size:0.85rem;"></p>
        <input type="password" id="nuevaPassInput" class="form-input" placeholder="Mínimo 4 caracteres" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);margin-bottom:16px;">
        <div style="display:flex;gap:10px;">
          <button class="btn btn-ghost" onclick="cerrarModalPass()" style="flex:1;">Cancelar</button>
          <button class="btn btn-primary" id="btnConfirmPass" onclick="confirmarCambioPass()" style="flex:1;">Guardar</button>
        </div>
      </div>
    </div>

    <style>
      .user-mgmt-card { background: var(--sb-card); border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; border: 1px solid var(--sb-border); display:flex;align-items:center;justify-content:space-between; }
      .insight-card { background: var(--sb-surface); border: 1px solid var(--sb-border); border-radius: 12px; padding: 12px; display: flex; align-items: center; gap: 12px; transition: all 0.2s; cursor: pointer; }
      .insight-card:hover { border-color: rgba(59,130,246,0.3); transform: translateY(-2px); background: rgba(255,255,255,0.02); }
      .insight-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
      .insight-value { font-size: 1.1rem; font-weight: 800; color: white; margin: 0; line-height: 1; }
      .insight-label { font-size: 0.720rem; color: var(--sb-muted); margin: 2px 0 0; font-weight: 500; }
      
      .activity-item { padding: 10px 0; border-bottom: 1px solid var(--sb-border); display: flex; gap: 10px; }
      .activity-item:last-child { border-bottom: none; }
      .activity-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
      
      .pulse-icon { width:10px;height:10px;background:#f87171;border-radius:50%;display:inline-block;animation:pulse-red 2s infinite; }
      @keyframes pulse-red {
        0% { transform:scale(0.95);box-shadow:0 0 0 0 rgba(248,113,113,0.7); }
        70% { transform:scale(1);box-shadow:0 0 0 8px rgba(248,113,113,0); }
        100% { transform:scale(0.95);box-shadow:0 0 0 0 rgba(248,113,113,0); }
      }
      .radio-tab { transition: all 0.2s; cursor:pointer; }
      input[type="radio"]:checked + .radio-tab { background: rgba(31,111,235,0.2)!important; border-color: #388bfd!important; color:#58a6ff; font-weight:700; }
    </style>
  `;

  // ─── LOGICA ──────────────────────────────────────────
  let usuariosCache = [];
  let userPassSelected = null;
  let currentEdificioFilter = 'all';

  window.filterDashboardByEdificio = (val) => {
    currentEdificioFilter = val;
    loadAdminStats(val);
  };

  window.verListaUsuarios = async (rol) => {
    const modal = document.getElementById('modalListaUsuarios');
    const titulo = document.getElementById('modalListaTitulo');
    const content = document.getElementById('modalListaContenido');
    const labels = { residente: 'Residentes', medico: 'Médicos', limpieza: 'Personal Limpieza', entretenimiento: 'Recreación', vigilante: 'Vigilantes', gerente: 'Gerentes' };
    titulo.textContent = labels[rol] || 'Usuarios';
    modal.classList.remove('hidden');
    content.innerHTML = '<div class="loading-spinner" style="margin:4rem auto;"></div>';
    try {
      const url = new URL(`${window.API_URL}/usuarios`);
      url.searchParams.append('rol', rol);
      if (currentEdificioFilter !== 'all') {
        url.searchParams.append('edificio_id', currentEdificioFilter);
      }
      const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      usuariosCache = await res.json();
      renderListaModal();
    } catch (e) {
      content.innerHTML = '<p style="color:#f87171;text-align:center;padding:2rem;">Error al cargar usuarios</p>';
    }
  };

  const renderListaModal = () => {
    const content = document.getElementById('modalListaContenido');
    if (!usuariosCache || usuariosCache.length === 0) {
      content.innerHTML = '<p style="text-align:center;color:var(--sb-muted);padding:2rem;">No hay usuarios en esta categoría.</p>';
      return;
    }
    content.innerHTML = usuariosCache.map(u => `
      <div class="user-mgmt-card fade-in">
        <div>
          <h4 style="font-weight:700;color:var(--sb-text);margin:0 0 3px;">${u.nombre}</h4>
          <p style="font-size:0.78rem;color:var(--sb-muted);margin:0;">📧 ${u.email}</p>
          <p style="font-size:0.75rem;color:#58a6ff;margin:3px 0 0;">${u.apartamento ? `📍 Dpto ${u.apartamento}` : '📍 Personal'}</p>
        </div>
        <div style="display:flex;gap:8px;">
          <button onclick="abrirModalPass(${u.id}, '${u.nombre}')" style="background:rgba(31,111,235,0.12);border:1px solid rgba(31,111,235,0.3);color:#58a6ff;border-radius:6px;padding:6px 10px;font-size:0.72rem;cursor:pointer;font-family:inherit;">🔑 Pwd</button>
          <button onclick="eliminarUsuario(${u.id}, '${u.nombre}')" style="background:rgba(248,113,113,0.12);border:1px solid rgba(248,113,113,0.3);color:#f87171;border-radius:6px;padding:6px 10px;font-size:0.72rem;cursor:pointer;font-family:inherit;">🗑️</button>
        </div>
      </div>
    `).join('');
  };

  window.cerrarListaUsuarios = () => document.getElementById('modalListaUsuarios').classList.add('hidden');

  window.abrirModalPass = (id, nombre) => {
    userPassSelected = id;
    document.getElementById('passwordUsuarioNombre').textContent = `Usuario: ${nombre}`;
    document.getElementById('modalPasswordAdmin').classList.remove('hidden');
    document.getElementById('nuevaPassInput').value = '';
    document.getElementById('nuevaPassInput').focus();
  };

  window.cerrarModalPass = () => {
    document.getElementById('modalPasswordAdmin').classList.add('hidden');
    userPassSelected = null;
  };

  window.confirmarCambioPass = async () => {
    const pass = document.getElementById('nuevaPassInput').value;
    if (pass.length < 4) return alert('Mínimo 4 caracteres');
    const btn = document.getElementById('btnConfirmPass');
    btn.disabled = true; btn.textContent = 'Guardando...';
    try {
      const res = await fetch(`${window.API_URL}/usuarios/${userPassSelected}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${window.appState.token}` },
        body: JSON.stringify({ password: pass })
      });
      if (res.ok) { alert('✅ Contraseña actualizada'); cerrarModalPass(); }
      else { const d = await res.json(); alert('❌ Error: ' + d.error); }
    } catch (e) { alert('❌ Error de conexión'); }
    finally { btn.disabled = false; btn.textContent = 'Guardar'; }
  };

  window.eliminarUsuario = async (id, nombre) => {
    if (!confirm(`¿Eliminar permanentemente a ${nombre}?`)) return;
    try {
      const res = await fetch(`${window.API_URL}/usuarios/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      if (res.ok) {
        alert('✅ Usuario eliminado');
        usuariosCache = usuariosCache.filter(u => u.id !== id);
        renderListaModal();
        loadAdminStats();
      } else { const d = await res.json(); alert('❌ Error: ' + d.error); }
    } catch (e) { alert('❌ Error de conexión'); }
  };

  // Radio tabs
  setTimeout(() => {
    document.querySelectorAll('.radio-tab').forEach(tab => {
      tab.parentElement.onclick = () => { tab.previousElementSibling.checked = true; };
    });
  }, 100);

  // Scroll elements
  window.scrollToDsEmergencias = () => {
    const el = document.getElementById('section-emergencias');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  window.scrollToActivityFeed = () => {
    const el = document.getElementById('activityFeedContainer');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Initial calls and socket setup
  loadAdminStats();
  loadAdminEmergencias();
  loadEdificiosParaDashboard();
  setupOnlineUsersSocket();

  setTimeout(() => {
    const form = document.getElementById('alertaForm');
    if (form) form.onsubmit = (e) => { e.preventDefault(); enviarAlertaAdmin(); };
  }, 100);
}

// ── MODAL ALERTS ──────────────────────────────────────
window.showAlertaModal = () => {
  const modal = document.getElementById('alertaModal');
  if (modal) modal.classList.remove('hidden');
};

window.closeAlertaModal = () => {
  const modal = document.getElementById('alertaModal');
  const form = document.getElementById('alertaForm');
  if (modal) modal.classList.add('hidden');
  if (form) form.reset();
};

window.scrollToEmergencias = () => {
  const el = document.getElementById('section-emergencias');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

// ── DATA LOADERS ──────────────────────────────────────
async function loadEdificiosParaDashboard() {
  try {
    const response = await fetch(`${window.API_URL}/edificios/public`);
    const edificios = await response.json();

    // Filtrar duplicados por nombre por si acaso
    const edificiosUnicos = Array.isArray(edificios)
      ? edificios.filter((e, i, a) => a.findIndex(x => x.nombre === e.nombre) === i) : [];

    // Llenar select de alertas
    const selectAlerta = document.getElementById('edificioAlerta');
    if (selectAlerta && Array.isArray(edificiosUnicos)) {
      selectAlerta.innerHTML = '<option value="global">🌍 Todos los edificios (Global)</option>';
      edificiosUnicos.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = `🏢 ${e.nombre}`;
        selectAlerta.appendChild(opt);
      });
    }

    // Llenar select de dashboard
    const selectDash = document.getElementById('dashboardEdificioSelector');
    if (selectDash && Array.isArray(edificiosUnicos)) {
      selectDash.innerHTML = '<option value="all">🌍 Todos los edificios</option>';
      edificiosUnicos.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = `🏢 ${e.nombre}`;
        selectDash.appendChild(opt);
      });
    }
  } catch (error) { console.warn('Error al cargar edificios:', error); }
}

let currentOnlineUsers = [];

function setupOnlineUsersSocket() {
  const socket = window.appState?.socket;
  if (!socket) {
    // Try again in 1 second if socket not yet ready
    setTimeout(setupOnlineUsersSocket, 1000);
    return;
  }

  socket.off('usuarios_en_linea_global');
  // Escuchar actualización de usuarios en línea (como admin recibimos el global)
  socket.on('usuarios_en_linea_global', (users) => {
    currentOnlineUsers = users;
    renderOnlineUsers();
  });

  // Request an initial update immediately
  // The backend sends the list on connection - but if we set up listener late,
  // emit a ping to trigger a resend from other users connecting after
  renderOnlineUsers();
}

function renderOnlineUsers() {
  const list = document.getElementById('onlineUsersList');
  const badge = document.getElementById('onlineCountBadge');
  const selectedEdificio = document.getElementById('dashboardEdificioSelector')?.value || 'all';

  if (!list) return;

  // Filtrar por edificio seleccionado
  const filtered = selectedEdificio === 'all'
    ? currentOnlineUsers
    : currentOnlineUsers.filter(u => u.edificio_id == selectedEdificio);

  badge.textContent = filtered.length;

  if (filtered.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:1.5rem;color:var(--sb-muted);font-size:0.8rem;opacity:0.6;">No hay otros usuarios en línea</div>`;
    return;
  }

  list.innerHTML = filtered.map(u => `
    <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
      <div style="position: relative;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; color: white;">
          ${u.nombre.charAt(0).toUpperCase()}
        </div>
        <div style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: #22c55e; border: 2px solid #0f172a; border-radius: 50%;"></div>
      </div>
      <div style="flex: 1; overflow: hidden;">
        <div style="font-size: 0.85rem; font-weight: 600; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${u.nombre}</div>
        <div style="font-size: 0.7rem; color: var(--sb-muted); display: flex; align-items: center; gap: 5px;">
          <span class="badge" style="padding: 1px 6px; font-size: 0.6rem; background: rgba(59,130,246,0.1); color: #3b82f6; border: 1px solid rgba(59,130,246,0.2);">
            ${u.rol.charAt(0).toUpperCase() + u.rol.slice(1)}
          </span>
          ${u.email}
        </div>
      </div>
    </div>
  `).join('');
}

let _loadingStats = false;
async function loadAdminStats(edificioId = 'all') {
  if (_loadingStats) return;
  _loadingStats = true;
  const loader = document.getElementById('statsLoader');
  if (loader) loader.style.display = 'block';

  try {
    const queryParams = edificioId !== 'all' ? `?edificio_id=${edificioId}` : '';

    // Mostrar/Ocultar el card de desglose
    const statsCard = document.getElementById('edificiosStatsCard');
    if (statsCard) {
      statsCard.style.display = edificioId === 'all' ? 'block' : 'none';
    }

    // Re-renderizar usuarios en línea con el nuevo filtro
    renderOnlineUsers();

    const [resUsers, resEdificios] = await Promise.all([
      fetch(`${window.API_URL}/usuarios${queryParams}`, { headers: { 'Authorization': `Bearer ${window.appState.token}` } }),
      fetch(`${window.API_URL}/edificios/public`)
    ]);
    const users = await resUsers.json();
    const edificios = await resEdificios.json();

    const resPend = await fetch(`${window.API_URL}/usuarios/pendientes${queryParams}`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const pendientes = await resPend.json();

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('count-pending', Array.isArray(pendientes) ? pendientes.length : 0);

    const counts = { residente: 0, limpieza: 0, vigilante: 0, gerente: 0, medico: 0, entretenimiento: 0 };
    const idToNombre = {};
    if (Array.isArray(edificios)) edificios.forEach(e => { idToNombre[e.id] = e.nombre; });

    let edificiosFiltrados = Array.isArray(edificios)
      ? edificios.filter((e, i, a) => a.findIndex(x => x.nombre === e.nombre) === i) : [];

    if (edificioId !== 'all') {
      edificiosFiltrados = edificiosFiltrados.filter(e => e.id.toString() === edificioId.toString());
    }

    const statsPorNombre = {};
    edificiosFiltrados.forEach(e => {
      statsPorNombre[e.nombre] = { nombre: e.nombre, residente: 0, limpieza: 0, entretenimiento: 0, medico: 0, gerente: 0, vigilante: 0, emergencias: 0 };
    });

    // Role pills in card
    ['residente', 'vigilante', 'medico', 'limpieza', 'entretenimiento', 'gerente'].forEach(r => {
      setEl(`pr-${r}`, counts[r]);
    });

    // Cargar reportes para el insight
    try {
      const resRep = await fetch(`${window.API_URL}/solicitudes`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      const reports = await resRep.json();
      setEl('insight-reports', Array.isArray(reports) ? reports.length : 0);
    } catch (e) { console.warn('Error loading reports for insight', e); }

    if (Array.isArray(users)) {
      users.forEach(u => {
        if (counts.hasOwnProperty(u.rol)) counts[u.rol]++;
        const nb = idToNombre[u.edificio_id];
        if (nb && statsPorNombre[nb] && statsPorNombre[nb].hasOwnProperty(u.rol)) {
          statsPorNombre[nb][u.rol]++;
        }
      });
    }

    let numEmergencias = 0;
    // Cargar emergencias para el desglose por edificio
    try {
      const resEmeList = await fetch(`${window.API_URL}/emergencias/activas`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      const emes = await resEmeList.json();
      if (Array.isArray(emes)) {
        numEmergencias = emes.length;
        setEl('adminEmergenciasCount', numEmergencias);
        emes.forEach(eme => {
          const nb = idToNombre[eme.edificio_id];
          if (nb && statsPorNombre[nb]) statsPorNombre[nb].emergencias++;
        });
      }
    } catch (e) { console.warn('Error loading emergencies for breakdown', e); }

    // Stat cards header
    setEl('count-residente', counts.residente);
    setEl('count-vigilante', counts.vigilante);

    // Insight card values
    setEl('insight-pending', Array.isArray(pendientes) ? pendientes.length : 0);
    setEl('insight-emergencies', numEmergencias);

    // Welcome message update
    const welcomeMsg = document.getElementById('dashboardWelcomeMsg');
    if (welcomeMsg) {
      if (numEmergencias > 0) {
        welcomeMsg.innerHTML = `<span style="color:#f87171;font-weight:700;">⚠️ Atención:</span> Hay ${numEmergencias} emergencia${numEmergencias > 1 ? 's' : ''} activa${numEmergencias > 1 ? 's' : ''} ahora.`;
      } else if (Array.isArray(pendientes) && pendientes.length > 0) {
        welcomeMsg.innerHTML = `<span style="color:#fbbf24;font-weight:700;">🔹 Tareas:</span> Tienes ${pendientes.length} usuario${pendientes.length > 1 ? 's' : ''} esperando aprobación.`;
      } else {
        welcomeMsg.innerHTML = `<span style="color:#4ade80;font-weight:700;">✅ Todo bajo control:</span> No se requieren acciones inmediatas.`;
      }
    }

    // Edificios table
    const bc = document.getElementById('edificiosStatsContainer');
    if (bc) {
      if (edificiosFiltrados.length === 0) {
        bc.innerHTML = '<p style="text-align:center;color:var(--sb-muted);padding:1rem;">No hay edificios registrados</p>';
      } else {
        bc.innerHTML = `
          <table class="ds-table">
            <thead>
              <tr>
                <th>Condominio</th>
                <th>Res</th><th>Per</th><th>Eme</th>
              </tr>
            </thead>
            <tbody>
              ${edificiosFiltrados.map(e => {
          const s = statsPorNombre[e.nombre] || {};
          const totalPersonal = (s.limpieza || 0) + (s.vigilante || 0) + (s.medico || 0) + (s.entretenimiento || 0) + (s.gerente || 0);
          return `<tr>
                  <td style="font-weight:600;">🏢 ${e.nombre}</td>
                  <td>${s.residente || 0}</td>
                  <td style="color:#3b82f6;">${totalPersonal}</td>
                  <td style="color:#f87171;">${s.emergencias || 0}</td>
                </tr>`;
        }).join('')}
            </tbody>
          </table>
        `;
      }
    }
  } catch (error) { console.warn('Error stats admin:', error); }
  finally {
    _loadingStats = false;
    if (loader) loader.style.display = 'none';
  }
}

async function loadAdminEmergencias() {
  try {
    const response = await fetch(`${window.API_URL}/emergencias/activas`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const emergencias = await response.json();
    const container = document.getElementById('adminEmergenciasList');
    const count = document.getElementById('adminEmergenciasCount');
    if (count) count.textContent = Array.isArray(emergencias) ? emergencias.length : 0;
    if (!container) return;
    if (!Array.isArray(emergencias) || emergencias.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--sb-muted);padding:1.5rem;">✅ Sin alertas críticas activas</p>';
      return;
    }
    container.innerHTML = emergencias.map(e => `
      <div class="ds-emergency-item fade-in">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
          <span style="font-weight:700;font-size:0.9rem;color:var(--sb-text);">📍 Dpto. ${e.usuario_apartamento || 'N/A'}</span>
          <span style="font-size:0.68rem;color:var(--sb-muted);">${new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <p style="font-size:0.82rem;color:#fecaca;margin-bottom:4px;line-height:1.5;">${e.descripcion}</p>
        <p style="font-size:0.7rem;color:var(--sb-muted);margin:0;">👤 ${e.usuario_nombre}${e.usuario_telefono ? ` · 📞 ${e.usuario_telefono}` : ''}</p>
      </div>
    `).join('');
  } catch (error) { console.error('Error emergencias:', error); }
}

async function enviarAlertaAdmin() {
  const edificio_id_val = document.getElementById('edificioAlerta').value;
  const tipo = document.querySelector('input[name="tipoAlerta"]:checked').value;
  const titulo = document.getElementById('tituloAlerta').value;
  const mensaje = document.getElementById('mensajeAlerta').value;
  const btn = document.getElementById('btnEnviarAlerta');
  const edificio_id = edificio_id_val === 'global' ? null : edificio_id_val;
  try {
    if (btn) { btn.disabled = true; btn.innerText = 'Enviando...'; }
    const response = await fetch(`${window.API_URL}/alertas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${window.appState.token}` },
      body: JSON.stringify({ tipo, titulo, mensaje, edificio_id })
    });
    if (response.ok) {
      alert('✅ Comunicado enviado correctamente');
      closeAlertaModal();
      if (typeof renderAnnouncementsWidget === 'function') renderAnnouncementsWidget('announcementsWidget');
    } else {
      const data = await response.json();
      alert('❌ Error: ' + (data.error || 'No se pudo enviar'));
    }
  } catch (error) { alert('❌ Error de conexión al servidor'); }
  finally { if (btn) { btn.disabled = false; btn.innerText = 'Enviar Comunicado'; } }
}
