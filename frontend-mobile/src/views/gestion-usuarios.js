// =====================================================
// GESTIÓN DE USUARIOS - Vista para aprobar y asignar roles
// =====================================================

export function renderGestionUsuarios(container) {
  const user = window.appState.user;

  container.innerHTML = `
    <div class="page">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #7c3aed, #6366f1); padding: 2rem 1rem; margin-bottom: 1rem;">
        <div class="container">
          <div class="flex justify-between items-center">
            <div>
              <h1 style="font-size: 1.5rem; font-weight: 700; color: white;">👥 Gestión de Usuarios</h1>
              <p style="font-size: 0.875rem; opacity: 0.9; color: white;">Aprobar y asignar roles</p>
            </div>
            <button onclick="window.history.back()" class="btn btn-ghost" style="padding: 0.5rem; color: white;">
              ←
            </button>
          </div>
        </div>
      </div>

      <div class="container">
        <!-- Tabs -->
        <div class="card mb-3">
          <div class="flex gap-2">
            <button class="btn btn-sm tab-btn active" data-tab="pendientes">
              Pendientes <span class="badge badge-warning" id="countPendientes">0</span>
            </button>
            <button class="btn btn-sm tab-btn" data-tab="aprobados">
              Aprobados
            </button>
          </div>
        </div>

        <!-- Lista de usuarios pendientes -->
        <div id="tabPendientes" class="tab-content">
          <div id="usuariosPendientesList">
            <div class="loading-spinner" style="margin: 2rem auto;"></div>
          </div>
        </div>

        <!-- Lista de usuarios aprobados -->
        <div id="tabAprobados" class="tab-content hidden">
          <div id="usuariosAprobadosList">
            <div class="loading-spinner" style="margin: 2rem auto;"></div>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <a href="#" class="nav-item" onclick="goToDashboard(); return false;">
          <span class="nav-icon">🏠</span>
          <span>Inicio</span>
        </a>
        <a href="#" class="nav-item active">
          <span class="nav-icon">👥</span>
          <span>Usuarios</span>
        </a>
        <a href="#" class="nav-item" onclick="window.navigateTo('/perfil'); return false;">
          <span class="nav-icon">👤</span>
          <span>Perfil</span>
        </a>
      </nav>
    </div>

    <!-- Modal para asignar rol -->
    <div id="asignarRolModal" class="hidden" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div class="card" style="max-width: 400px; width: 100%;">
        <h2 class="card-title">Asignar Rol</h2>
        <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem;" id="modalUsuarioNombre"></p>
        
        <div class="form-group">
          <label class="form-label">Seleccionar rol</label>
          <select class="form-input" id="nuevoRol" required>
            <option value="">Selecciona un rol</option>
            <option value="limpieza">🧹 Personal de Limpieza</option>
            <option value="vigilante">👮 Vigilante</option>
            <option value="gerente">📊 Gerente</option>
            <option value="residente">🏠 Residente</option>
          </select>
        </div>

        <div class="flex gap-2 mt-3">
          <button class="btn btn-ghost flex-1" onclick="cerrarModalRol()">
            Cancelar
          </button>
          <button class="btn btn-primary flex-1" onclick="confirmarAsignacion()">
            Asignar
          </button>
        </div>
      </div>
    </div>
  `;

  let currentTab = 'pendientes';
  let usuarioSeleccionado = null;

  // Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.onclick = () => {
      currentTab = btn.dataset.tab;
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
      document.getElementById(`tab${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}`).classList.remove('hidden');

      if (currentTab === 'pendientes') {
        loadUsuariosPendientes();
      } else {
        loadUsuariosAprobados();
      }
    };
  });

  loadUsuariosPendientes();

  async function loadUsuariosPendientes() {
    try {
      const response = await fetch(`${window.API_URL}/usuarios/pendientes`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });

      const usuarios = await response.json();
      const container = document.getElementById('usuariosPendientesList');
      document.getElementById('countPendientes').textContent = usuarios.length;

      if (usuarios.length === 0) {
        container.innerHTML = `
          <div class="card text-center" style="padding: 3rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
            <p style="color: var(--text-muted);">No hay usuarios pendientes</p>
          </div>
        `;
        return;
      }

      container.innerHTML = usuarios.map(u => `
        <div class="card mb-3 fade-in">
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
              <h3 style="font-weight: 600; font-size: 1rem; margin-bottom: 0.25rem;">${u.nombre}</h3>
              <p style="font-size: 0.875rem; color: var(--text-muted);">${u.email}</p>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
                📅 Registrado: ${new Date(u.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
            <span class="badge badge-warning">Pendiente</span>
          </div>

          ${u.telefono ? `<p style="font-size: 0.875rem; margin-bottom: 0.5rem;">📞 ${u.telefono}</p>` : ''}

          <div class="flex gap-2 mt-2">
            <button class="btn btn-primary btn-sm flex-1" onclick="abrirModalAsignar(${u.id}, '${u.nombre}')">
              ✅ Aprobar y Asignar Rol
            </button>
            ${u.apartamento ? `
              <button class="btn btn-success btn-sm flex-1" onclick="aprobarUsuarioDirecto(${u.id})">
                🏠 Aprobar Residente (Dpto ${u.apartamento})
              </button>
            ` : ''}
            <button class="btn btn-danger btn-sm" onclick="rechazarUsuario(${u.id})">
              ❌
            </button>
          </div>
        </div>
      `).join('');

    } catch (error) {
      console.error('Error:', error);
      document.getElementById('usuariosPendientesList').innerHTML = `
        <div class="card" style="padding: 2rem; text-align: center; color: var(--danger);">
          <p>❌ Error al cargar usuarios</p>
        </div>
      `;
    }
  }

  async function loadUsuariosAprobados() {
    try {
      const response = await fetch(`${window.API_URL}/usuarios/aprobados`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });

      const usuarios = await response.json();
      const container = document.getElementById('usuariosAprobadosList');

      if (usuarios.length === 0) {
        container.innerHTML = `
          <div class="card text-center" style="padding: 3rem;">
            <p style="color: var(--text-muted);">No hay usuarios aprobados</p>
          </div>
        `;
        return;
      }

      container.innerHTML = usuarios.map(u => `
        <div class="card mb-3">
          <div class="flex justify-between items-center">
            <div>
              <h3 style="font-weight: 600; font-size: 1rem;">${u.nombre}</h3>
              <p style="font-size: 0.875rem; color: var(--text-muted);">${u.email}</p>
            </div>
            <span class="badge badge-${getRolColor(u.rol)}">${getRolLabel(u.rol)}</span>
          </div>
        </div>
      `).join('');

    } catch (error) {
      console.error('Error:', error);
    }
  }

  window.abrirModalAsignar = (userId, nombre) => {
    usuarioSeleccionado = userId;
    document.getElementById('modalUsuarioNombre').textContent = `Usuario: ${nombre}`;
    document.getElementById('asignarRolModal').classList.remove('hidden');
  };

  window.aprobarUsuarioDirecto = async (userId) => {
    if (!confirm('¿Aprobar este residente?')) return;
    try {
      const response = await fetch(`${window.API_URL}/usuarios/${userId}/aprobar`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${window.appState.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ aprobado: true })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al aprobar');

      showToast('✅ Usuario aprobado');
      loadUsuariosPendientes();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: ' + error.message);
    }
  };

  window.cerrarModalRol = () => {
    document.getElementById('asignarRolModal').classList.add('hidden');
    usuarioSeleccionado = null;
  };

  window.confirmarAsignacion = async () => {
    const nuevoRol = document.getElementById('nuevoRol').value;
    if (!nuevoRol) {
      alert('Selecciona un rol');
      return;
    }

    try {
      const response = await fetch(`${window.API_URL}/usuarios/${usuarioSeleccionado}/asignar-rol`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${window.appState.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rol: nuevoRol })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al asignar rol');

      showToast('✅ Rol asignado correctamente');
      cerrarModalRol();
      loadUsuariosPendientes();

    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: ' + error.message);
    }
  };

  window.rechazarUsuario = async (userId) => {
    if (!confirm('¿Rechazar este usuario? Esta acción eliminará su registro permanentemente.')) return;

    try {
      const response = await fetch(`${window.API_URL}/usuarios/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al rechazar');

      showToast('✅ Usuario rechazado y cuenta eliminada');
      loadUsuariosPendientes();

    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: ' + error.message);
    }
  };

  window.goToDashboard = () => {
    const dashboards = {
      'admin': '/dashboard-vigilante',
      'gerente': '/dashboard-gerente',
      'vigilante': '/dashboard-vigilante'
    };
    window.navigateTo(dashboards[user.rol] || '/dashboard-residente');
  };

  function getRolColor(rol) {
    const colores = {
      limpieza: 'success',
      vigilante: 'primary',
      gerente: 'info',
      residente: 'secondary'
    };
    return colores[rol] || 'secondary';
  }

  function getRolLabel(rol) {
    const labels = {
      limpieza: 'Personal de Limpieza',
      vigilante: 'Vigilante',
      gerente: 'Gerente',
      residente: 'Residente'
    };
    return labels[rol] || rol;
  }

  function showToast(mensaje) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--success); color: white; padding: 1rem 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); z-index: 9999;';
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}
