// =====================================================
// PERFIL VIEW - Vista de perfil del usuario
// =====================================================

export function renderPerfil(container) {
  const user = window.appState.user;
  const baseUrl = window.API_URL.replace('/api', '');

  const getFotoUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
  };

  container.innerHTML = `
    <div class="page">
      <!-- Header Premium -->
      <div style="background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary)); padding: 3rem 0; border-bottom: 1px solid var(--glass-border); box-shadow: var(--shadow-md);">

        <div class="container">
          <div class="flex justify-between items-center">
            <div>
              <h1 style="font-size: 1.5rem; font-weight: 700; color: white;">👤 Mi Perfil</h1>
              <p style="font-size: 0.875rem; opacity: 0.9; color: white;">${user.rol}</p>
            </div>
            <button onclick="window.history.back()" class="btn btn-ghost" style="padding: 0.5rem; color: white;">
              ←
            </button>
          </div>
        </div>
      </div>

      <div class="container" style="position: relative; z-index: 10; padding-top: var(--spacing-lg);">

        <!-- Foto de perfil -->
        <div class="card mb-3 text-center">
          <div id="profileImageContainer" style="width: 120px; height: 120px; margin: 0 auto 1rem; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-size: 3rem; box-shadow: var(--shadow-lg); overflow: hidden; border: 4px solid var(--bg-secondary);">
            ${user.foto_perfil ? `<img src="${getFotoUrl(user.foto_perfil)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src=''; this.parentElement.innerHTML='👤'">` : '👤'}
          </div>
          <input type="file" id="fotoInput" accept="image/*" style="display: none;">
          <button class="btn btn-ghost btn-sm" onclick="document.getElementById('fotoInput').click()">
            📸 Cambiar foto
          </button>
        </div>

        <!-- Formulario de edición -->
        <div class="card">
          <h2 class="card-title">Información Personal</h2>
          <form id="perfilForm">
            <div class="form-group">
              <label class="form-label">Nombre completo</label>
              <input 
                type="text" 
                class="form-input" 
                id="nombre" 
                value="${user.nombre}"
                required
              >
            </div>

            <div class="form-group">
              <label class="form-label">Email</label>
              <input 
                type="email" 
                class="form-input" 
                id="email"
                value="${user.email}"
                required
              >
            </div>

            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <input 
                type="tel" 
                class="form-input" 
                id="telefono" 
                value="${user.telefono || ''}"
                placeholder="+51 999 999 999"
              >
            </div>

            ${user.rol === 'residente' ? `
              <div class="form-group">
                <label class="form-label">Apartamento</label>
                <input 
                  type="text" 
                  class="form-input" 
                  id="apartamento" 
                  value="${user.apartamento || ''}"
                  placeholder="Ej: 301"
                  required
                >
              </div>
            ` : ''}

            <div class="flex gap-2 mt-4">
              <button type="button" class="btn btn-ghost flex-1" onclick="window.history.back()">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary flex-1">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>

        <!-- Cerrar sesión -->
        <div class="card mt-3">
          <button class="btn btn-danger" style="width: 100%;" onclick="logout()">
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <a href="#" class="nav-item" onclick="goToDashboard(); return false;">
          <span class="nav-icon">🏠</span>
          <span>Inicio</span>
        </a>
        ${user.rol !== 'limpieza' ? `
          <a href="#" class="nav-item" onclick="window.navigateTo('/solicitudes'); return false;">
            <span class="nav-icon">📋</span>
            <span>Solicitudes</span>
          </a>
        ` : ''}
        <a href="#" class="nav-item active">
          <span class="nav-icon">👤</span>
          <span>Perfil</span>
        </a>
      </nav>
    </div>
  `;

  const form = document.getElementById('perfilForm');
  form.onsubmit = async (e) => {
    e.preventDefault();
    await guardarPerfil();
  };

  const containerImg = document.getElementById('profileImageContainer');
  const fotoInput = document.getElementById('fotoInput');

  fotoInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('foto', file);

    try {
      const response = await fetch(`${window.API_URL}/usuarios/foto-perfil`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${window.appState.token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al subir foto');

      // Actualizar estado
      window.appState.user.foto_perfil = data.foto_perfil;
      localStorage.setItem('user', JSON.stringify(window.appState.user));

      // Actualizar imagen en la vista
      containerImg.innerHTML = `<img src="${getFotoUrl(data.foto_perfil)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src=''; this.parentElement.innerHTML='👤'">`;

      showToast('✅ Foto actualizada');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ ' + error.message);
    }
  };

  async function guardarPerfil() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const apartamento = user.rol === 'residente' ? document.getElementById('apartamento').value : null;

    try {
      const response = await fetch(`${window.API_URL}/usuarios/perfil`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${window.appState.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, telefono, apartamento })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al guardar');

      // Actualizar estado global
      window.appState.user = { ...window.appState.user, ...data };
      localStorage.setItem('user', JSON.stringify(window.appState.user));

      showToast('✅ Perfil actualizado');

    } catch (error) {
      console.error('Error:', error);
      alert('❌ ' + error.message);
    }
  }

  window.goToDashboard = () => {
    const dashboards = {
      'residente': '/dashboard-residente',
      'vigilante': '/dashboard-vigilante',
      'admin': '/dashboard-admin',
      'limpieza': '/dashboard-limpieza',
      'gerente': '/dashboard-gerente'
    };
    window.navigateTo(dashboards[user.rol] || '/dashboard-residente');
  };

  function showToast(mensaje) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--success); color: white; padding: 1rem 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); z-index: 9999;';
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}
