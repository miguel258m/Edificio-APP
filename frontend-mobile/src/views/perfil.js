// =====================================================
// PERFIL VIEW - Sidebar Desktop Layout (all roles)
// =====================================================
import { renderSidebarLayout } from '../utils/sidebar-layout.js';

export function renderPerfil(container) {
  const user = window.appState.user;
  const baseUrl = window.API_URL.replace('/api', '');
  const getFotoUrl = (path) => { if (!path) return null; if (path.startsWith('http')) return path; return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`; };

  // Build nav items depending on role
  const dashboardPath = {
    residente: '/dashboard-residente', vigilante: '/dashboard-vigilante', admin: '/dashboard-admin',
    limpieza: '/dashboard-limpieza', gerente: '/dashboard-gerente', medico: '/dashboard-medico',
    entretenimiento: '/dashboard-entretenimiento'
  }[user.rol] || '/';

  const navItems = [
    { key: 'inicio', icon: '🏠', label: 'Inicio', path: dashboardPath },
    { key: 'perfil', icon: '👤', label: 'Mi Perfil', path: '/perfil' },
  ];

  // Role-specific extra nav items
  if (user.rol === 'residente') {
    navItems.splice(1, 0, { key: 'solicitudes', icon: '📋', label: 'Mis Solicitudes', path: '/solicitudes' });
    navItems.splice(1, 0, { key: 'chats', icon: '💬', label: 'Chat', path: '/chats' });
  } else if (user.rol === 'vigilante') {
    navItems.splice(1, 0, { key: 'solicitudes', icon: '📋', label: 'Solicitudes', path: '/solicitudes' });
    navItems.splice(1, 0, { key: 'chats', icon: '💬', label: 'Chats', path: '/chats' });
  } else if (user.rol !== 'limpieza') {
    navItems.splice(1, 0, { key: 'chats', icon: '💬', label: 'Mensajes', path: '/chats' });
  }

  const main = renderSidebarLayout(container, {
    role: user.rol,
    activeNav: 'perfil',
    pageTitle: 'Mi Perfil',
    pageSubtitle: `${user.email || ''}`,
    breadcrumb: 'Perfil',
    navItems,
  });

  main.innerHTML += `
    <div style="max-width:600px;margin:0 auto;">

      <!-- FOTO DE PERFIL -->
      <div class="ds-card" style="margin-bottom:16px;text-align:center;">
        <div id="profileImageContainer" style="width:100px;height:100px;margin:0 auto 14px;border-radius:50%;background:linear-gradient(135deg,#1f6feb,#a78bfa);display:flex;align-items:center;justify-content:center;font-size:2.5rem;overflow:hidden;border:3px solid rgba(255,255,255,0.1);">
          ${user.foto_perfil ? `<img src="${getFotoUrl(user.foto_perfil)}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='';this.parentElement.innerHTML='👤'">` : '👤'}
        </div>
        <input type="file" id="fotoInput" accept="image/*" style="display:none;">
        <button class="btn btn-ghost btn-sm" onclick="document.getElementById('fotoInput').click()">
          📸 Cambiar foto de perfil
        </button>
        <p style="font-size:0.7rem;color:var(--sb-muted);margin:6px 0 0;">Formatos: JPG, PNG. Máx 5MB.</p>
      </div>

      <!-- INFORMACIÓN PERSONAL -->
      <div class="ds-card" style="margin-bottom:16px;">
        <div class="ds-card-header">
          <p class="ds-card-title">👤 Información Personal</p>
        </div>
        <form id="perfilForm">
          <div style="margin-bottom:14px;">
            <label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:5px;font-weight:600;">Nombre completo</label>
            <input type="text" class="form-input" id="nombre" value="${user.nombre}" required style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);">
          </div>
          <div style="margin-bottom:14px;">
            <label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:5px;font-weight:600;">Email</label>
            <input type="email" class="form-input" id="email" value="${user.email}" required style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);">
          </div>
          <div style="margin-bottom:14px;">
            <label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:5px;font-weight:600;">Teléfono</label>
            <input type="tel" class="form-input" id="telefono" value="${user.telefono || ''}" placeholder="+51 999 999 999" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);">
          </div>
          ${user.rol === 'residente' ? `
          <div style="margin-bottom:14px;">
            <label style="font-size:0.75rem;color:var(--sb-muted);display:block;margin-bottom:5px;font-weight:600;">Apartamento</label>
            <input type="text" class="form-input" id="apartamento" value="${user.apartamento || ''}" placeholder="Ej: 301" style="background:var(--sb-card);border:1px solid var(--sb-border);color:var(--sb-text);">
          </div>` : ''}
          <div style="display:flex;gap:10px;margin-top:16px;">
            <button type="button" class="btn btn-ghost" style="flex:1;" onclick="window.navigateTo('${dashboardPath}')">← Volver</button>
            <button type="submit" class="btn btn-primary" style="flex:2;">Guardar Cambios</button>
          </div>
        </form>
      </div>

      <!-- CAMBIAR CONTRASEÑA (info) -->
      <div class="ds-card" style="margin-bottom:16px;">
        <div class="ds-card-header">
          <p class="ds-card-title">🔒 Seguridad</p>
        </div>
        <div style="background:var(--sb-card);border:1px solid var(--sb-border);border-radius:8px;padding:12px 14px;">
          <p style="font-size:0.82rem;color:var(--sb-muted);margin:0;">Para cambiar tu contraseña, contacta al administrador del edificio.</p>
        </div>
      </div>

      <!-- CERRAR SESIÓN -->
      <button onclick="logout()" style="width:100%;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);color:#f87171;border-radius:8px;padding:12px;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:inherit;margin-bottom:24px;">
        🚪 Cerrar Sesión
      </button>
    </div>
  `;

  // Form submit
  const form = document.getElementById('perfilForm');
  form.onsubmit = async (e) => { e.preventDefault(); await guardarPerfil(); };

  // Photo upload
  const fotoInput = document.getElementById('fotoInput');
  const profileImg = document.getElementById('profileImageContainer');
  fotoInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('foto', file);
    try {
      const response = await fetch(`${window.API_URL}/usuarios/foto-perfil`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${window.appState.token}` }, body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al subir foto');
      window.appState.user.foto_perfil = data.foto_perfil;
      localStorage.setItem('user', JSON.stringify(window.appState.user));
      profileImg.innerHTML = `<img src="${getFotoUrl(data.foto_perfil)}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='';this.parentElement.innerHTML='👤'">`;
      showToast('✅ Foto actualizada');
    } catch (error) { alert('❌ ' + error.message); }
  };

  async function guardarPerfil() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const apartamento = user.rol === 'residente' ? document.getElementById('apartamento').value : null;
    try {
      const response = await fetch(`${window.API_URL}/usuarios/perfil`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${window.appState.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, telefono, apartamento })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al guardar');
      window.appState.user = { ...window.appState.user, ...data };
      localStorage.setItem('user', JSON.stringify(window.appState.user));
      showToast('✅ Perfil actualizado');
    } catch (error) { alert('❌ ' + error.message); }
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:20px;right:20px;background:var(--sb-surface);border:1px solid rgba(74,222,128,0.3);color:#4ade80;padding:10px 16px;border-radius:8px;font-size:0.82rem;font-weight:600;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.4);';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }
}
