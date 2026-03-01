// =====================================================
// GESTIÓN DE USUARIOS - Vista para aprobar y asignar roles
// =====================================================

import { renderSidebarLayout } from '../utils/sidebar-layout.js';

export function renderGestionUsuarios(container) {
  const user = window.appState.user;

  // Nav items del sidebar (Igual que en el dashboard para consistencia)
  const navItems = [
    { key: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/dashboard-admin' },
    { key: 'usuarios', icon: '👥', label: 'Gestión Usuarios', path: '/gestion-usuarios', badge: '' },
    { key: 'reportes', icon: '📋', label: 'Reportes', path: '/solicitudes' },
    { key: 'alertas', icon: '🔔', label: 'Alertas', onClick: 'showAlertaModal()' },
    { key: 'perfil', icon: '⚙️', label: 'Mi Perfil', path: '/perfil' },
  ];

  const main = renderSidebarLayout(container, {
    role: 'admin',
    activeNav: 'usuarios',
    pageTitle: 'Gestión de Usuarios',
    pageSubtitle: 'Aprobar nuevos registros y gestionar roles del personal',
    breadcrumb: 'Usuarios',
    navItems,
  });

  // Inyectar el contenido de la gestión de usuarios
  main.innerHTML = `
    <!-- Filtro para Admin -->
    <div id="adminFilterContainer" style="margin-bottom: 20px; display: flex; align-items: center; gap: 12px; background: var(--sb-card); padding: 12px 16px; border-radius: 12px; border: 1px solid var(--sb-border);">
      <span style="font-size: 0.85rem; color: var(--sb-muted); font-weight: 600;">📍 Filtrar por Edificio:</span>
      <select id="edificioFilter" style="background: var(--sb-surface); border: 1px solid var(--sb-border); color: var(--sb-text); border-radius: 8px; padding: 6px 12px; font-size: 0.85rem; cursor: pointer; outline: none; min-width: 200px;">
        <option value="all">🌍 Todos los edificios</option>
      </select>
    </div>

    <!-- Tabs Estilo Premium -->
    <div class="ds-card" style="margin-bottom: 20px; padding: 10px;">
      <div style="display: flex; gap: 10px;">
        <button class="ds-tab-btn active" data-tab="pendientes" id="btnTabPendientes">
          Pendientes <span class="badge badge-warning" id="countPendientes" style="margin-left: 5px;">0</span>
        </button>
        <button class="ds-tab-btn" data-tab="aprobados" id="btnTabAprobados">
          Aprobados
        </button>
      </div>
    </div>

    <!-- Contenido de las Tabs -->
    <div id="tabPendientes" class="tab-content">
      <div id="usuariosPendientesList" class="ds-user-grid">
        <div class="loading-spinner" style="margin: 4rem auto;"></div>
      </div>
    </div>

    <div id="tabAprobados" class="tab-content hidden">
      <div id="usuariosAprobadosList" class="ds-user-grid">
        <div class="loading-spinner" style="margin: 4rem auto;"></div>
      </div>
    </div>

    <!-- Modal para asignar rol (Estilo similar al de alertas) -->
    <div id="asignarRolModal" class="hidden" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(8px);">
      <div style="background:var(--sb-surface);border:1px solid var(--sb-border);border-radius:12px;padding:24px;max-width:400px;width:100%;box-shadow:0 25px 60px rgba(0,0,0,0.7);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
          <h2 style="font-size:1rem;font-weight:700;color:var(--sb-text);margin:0;">🎯 Asignar Rol</h2>
          <button onclick="cerrarModalRol()" style="background:rgba(255,255,255,0.07);border:1px solid var(--sb-border);width:30px;height:30px;border-radius:6px;cursor:pointer;color:var(--sb-muted);font-size:1.1rem;display:flex;align-items:center;justify-content:center;">×</button>
        </div>
        <p style="font-size: 0.85rem; color: var(--sb-muted); margin-bottom: 20px;" id="modalUsuarioNombre"></p>
        
        <div style="margin-bottom: 20px;">
          <label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:8px;font-weight:600;">Seleccionar nuevo rol</label>
          <select id="nuevoRol" style="width:100%; background:var(--sb-card); border:1px solid var(--sb-border); color:var(--sb-text); padding:10px; border-radius:8px; outline:none;">
            <option value="">Selecciona un rol...</option>
            <option value="residente">🏠 Residente</option>
            <option value="vigilante">🛡️ Vigilante</option>
            <option value="gerente">📊 Gerente</option>
            <option value="medico">🩺 Médico</option>
            <option value="limpieza">🧹 Limpieza</option>
            <option value="entretenimiento">🎭 Recreación</option>
          </select>
        </div>

        <div style="display:flex;gap:10px;">
          <button class="btn btn-ghost" onclick="cerrarModalRol()" style="flex:1;">Cancelar</button>
          <button class="btn btn-primary" onclick="confirmarAsignacion()" style="flex:1.5;">Confirmar</button>
        </div>
      </div>
    </div>

    <style>
      .ds-user-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
      .ds-tab-btn { background: transparent; border: none; color: var(--sb-muted); padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
      .ds-tab-btn.active { background: rgba(59,130,246,0.1); color: #3b82f6; }
      .ds-tab-btn:hover:not(.active) { background: rgba(255,255,255,0.05); color: var(--sb-text); }
      .ds-user-card { background: var(--sb-card); border-radius: 12px; border: 1px solid var(--sb-border); padding: 16px; transition: transform 0.2s, border-color 0.2s; }
      .ds-user-card:hover { border-color: rgba(59,130,246,0.3); transform: translateY(-2px); }
      .ds-user-initials { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1rem; }
    </style>
  `;

  let currentTab = 'pendientes';
  let usuarioSeleccionado = null;
  let currentEdificioFilter = 'all';

  // Cargar edificios para el filtro
  loadEdificios();

  async function loadEdificios() {
    try {
      const response = await fetch(`${window.API_URL}/edificios/public`);
      const edificios = await response.json();
      const select = document.getElementById('edificioFilter');
      if (select && Array.isArray(edificios)) {
        const edificiosUnicos = edificios.filter((e, i, a) => a.findIndex(x => x.nombre === e.nombre) === i);
        select.innerHTML = '<option value="all">🌍 Todos los edificios</option>';
        edificiosUnicos.forEach(e => {
          const opt = document.createElement('option');
          opt.value = e.id;
          opt.textContent = `🏢 ${e.nombre}`;
          select.appendChild(opt);
        });
      }

      select.onchange = (e) => {
        currentEdificioFilter = e.target.value;
        refreshData();
      };
    } catch (error) { console.error('Error al cargar edificios:', error); }
  }

  // Lógica de Tabs
  const btns = { pendientes: document.getElementById('btnTabPendientes'), aprobados: document.getElementById('btnTabAprobados') };
  Object.keys(btns).forEach(key => {
    btns[key].onclick = () => {
      currentTab = key;
      Object.values(btns).forEach(b => b.classList.remove('active'));
      btns[key].classList.add('active');

      document.getElementById('tabPendientes').classList.toggle('hidden', currentTab !== 'pendientes');
      document.getElementById('tabAprobados').classList.toggle('hidden', currentTab !== 'aprobados');

      refreshData();
    };
  });

  function refreshData() {
    if (currentTab === 'pendientes') loadUsuariosPendientes();
    else loadUsuariosAprobados();
  }

  refreshData();

  async function loadUsuariosPendientes() {
    const list = document.getElementById('usuariosPendientesList');
    list.innerHTML = '<div class="loading-spinner" style="margin: 4rem auto;"></div>';
    try {
      let url = `${window.API_URL}/usuarios/pendientes`;
      if (currentEdificioFilter !== 'all') url += `?edificio_id=${currentEdificioFilter}`;

      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${window.appState.token}` } });
      const usuarios = await res.json();

      document.getElementById('countPendientes').textContent = usuarios.length;

      if (usuarios.length === 0) {
        list.innerHTML = `<div class="ds-card" style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--sb-muted);">✅ No hay solicitudes pendientes</div>`;
        return;
      }

      list.innerHTML = usuarios.map(u => `
        <div class="ds-user-card fade-in">
          <div style="display: flex; gap: 12px; align-items: flex-start; margin-bottom: 15px;">
            <div class="ds-user-initials">${u.nombre[0].toUpperCase()}</div>
            <div style="flex: 1; overflow: hidden;">
              <h3 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${u.nombre}</h3>
              <p style="font-size: 0.78rem; color: var(--sb-muted); margin: 2px 0;">${u.email}</p>
            </div>
          </div>
          
          <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 10px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="font-size: 0.7rem; color: var(--sb-muted); margin-bottom: 4px;">TIPO DE SOLICITUD</div>
            <div style="font-size: 0.8rem; font-weight: 600; color: ${u.apartamento ? '#3b82f6' : '#a78bfa'};">
              ${u.apartamento ? `🏠 Residente (Dpto ${u.apartamento})` : '👷 Personal Administrativo/Staff'}
            </div>
            <div style="font-size: 0.7rem; color: var(--sb-muted); margin-top: 8px; display: flex; align-items: center; gap: 4px;">
              📍 ${u.edificio_nombre || 'Edificio no especificado'}
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn btn-primary btn-sm" style="flex: 1; font-size: 0.75rem;" onclick="abrirModalAsignar(${u.id}, '${u.nombre}')">Asignar Rol</button>
            ${u.apartamento ? `<button class="btn btn-success btn-sm" style="flex: 1; font-size: 0.75rem;" onclick="aprobarUsuarioDirecto(${u.id})">Aprobar</button>` : ''}
            <button class="btn btn-danger btn-sm" style="padding: 0 12px;" onclick="rechazarUsuario(${u.id})">🗑️</button>
          </div>
        </div>
      `).join('');
    } catch (e) { list.innerHTML = `<p style="color:#f87171; text-align:center; grid-column:1/-1;">Error al cargar datos</p>`; }
  }

  async function loadUsuariosAprobados() {
    const list = document.getElementById('usuariosAprobadosList');
    list.innerHTML = '<div class="loading-spinner" style="margin: 4rem auto;"></div>';
    try {
      let url = `${window.API_URL}/usuarios/aprobados`;
      if (currentEdificioFilter !== 'all') url += `?edificio_id=${currentEdificioFilter}`;

      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${window.appState.token}` } });
      const usuarios = await res.json();

      if (usuarios.length === 0) {
        list.innerHTML = `<div class="ds-card" style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--sb-muted);">No hay usuarios aprobados</div>`;
        return;
      }

      list.innerHTML = usuarios.map(u => `
        <div class="ds-user-card fade-in">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 12px; align-items: center;">
              <div class="ds-user-initials" style="width: 34px; height: 34px; font-size: 0.85rem;">${u.nombre[0].toUpperCase()}</div>
              <div>
                <h4 style="font-size: 0.88rem; font-weight: 600; color: white; margin: 0;">${u.nombre}</h4>
                <p style="font-size: 0.75rem; color: var(--sb-muted); margin: 0;">${u.email}</p>
              </div>
            </div>
            <span class="badge" style="background: rgba(59,130,246,0.1); color: #3b82f6; border: 1px solid rgba(59,130,246,0.2); font-size: 0.65rem;">
              ${getRolLabel(u.rol)}
            </span>
          </div>
        </div>
      `).join('');
    } catch (e) { list.innerHTML = `<p style="color:#f87171; text-align:center; grid-column:1/-1;">Error al cargar datos</p>`; }
  }

  window.abrirModalAsignar = (userId, nombre) => {
    usuarioSeleccionado = userId;
    document.getElementById('modalUsuarioNombre').textContent = `Usuario: ${nombre}`;
    document.getElementById('asignarRolModal').classList.remove('hidden');
  };

  window.cerrarModalRol = () => {
    document.getElementById('asignarRolModal').classList.add('hidden');
    usuarioSeleccionado = null;
  };

  window.confirmarAsignacion = async () => {
    const nuevoRol = document.getElementById('nuevoRol').value;
    if (!nuevoRol) return alert('Selecciona un rol');
    try {
      const res = await fetch(`${window.API_URL}/usuarios/${usuarioSeleccionado}/asignar-rol`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${window.appState.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol: nuevoRol })
      });
      if (res.ok) {
        alert('✅ Rol asignado correctamente');
        cerrarModalRol();
        loadUsuariosPendientes();
      } else { alert('❌ Error al asignar rol'); }
    } catch (e) { alert('❌ Error de conexión'); }
  };

  window.aprobarUsuarioDirecto = async (userId) => {
    if (!confirm('¿Aprobar este residente?')) return;
    try {
      const res = await fetch(`${window.API_URL}/usuarios/${userId}/aprobar`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${window.appState.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ aprobado: true })
      });
      if (res.ok) { alert('✅ Residente aprobado'); loadUsuariosPendientes(); }
      else { alert('❌ Error al aprobar'); }
    } catch (e) { alert('❌ Error de conexión'); }
  };

  window.rechazarUsuario = async (userId) => {
    if (!confirm('¿Rechazar este usuario? Se eliminará permanentemente.')) return;
    try {
      const res = await fetch(`${window.API_URL}/usuarios/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      if (res.ok) { alert('✅ Solicitud rechazada'); loadUsuariosPendientes(); }
      else { alert('❌ Error al eliminar'); }
    } catch (e) { alert('❌ Error de conexión'); }
  };

  function getRolLabel(rol) {
    const labels = { limpieza: 'Limpieza', vigilante: 'Vigilante', gerente: 'Gerente', medico: 'Médico', entretenimiento: 'Recreación', residente: 'Residente' };
    return labels[rol] || rol;
  }
}
