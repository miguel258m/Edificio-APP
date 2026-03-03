// =====================================================
// SIDEBAR LAYOUT - Shared desktop layout for Admin & Gerente
// =====================================================

/**
 * Renders the full sidebar desktop layout into container.
 * @param {HTMLElement} container - The root app container
 * @param {Object} opts
 * @param {string} opts.role        - 'admin' | 'gerente'
 * @param {string} opts.activeNav   - key of the active nav item
 * @param {string} opts.pageTitle   - H1 title for the page
 * @param {string} opts.pageSubtitle- Subtitle under the title
 * @param {Array}  opts.navItems    - Array of { key, icon, label, path, badge? }
 * @param {string} opts.breadcrumb  - e.g. 'Dashboard'
 * @returns {HTMLElement} - The .ds-page element to render content into
 */
export function renderSidebarLayout(container, opts = {}) {
  const user = window.appState.user;
  const baseUrl = window.API_URL.replace('/api', '');
  const role = opts.role || 'admin';
  const navItems = opts.navItems || [];
  const active = opts.activeNav || '';

  const getFotoUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
  };

  const avatarContent = user.foto_perfil
    ? `<img src="${getFotoUrl(user.foto_perfil)}" onerror="this.style.display='none';this.parentElement.textContent='${(user.nombre || '?')[0].toUpperCase()}'">`
    : (user.nombre || '?')[0].toUpperCase();

  const roleMeta = {
    admin: { label: 'Administrador Global', color: '#a78bfa', icon: '🏢' },
    gerente: { label: 'Gerente General', color: '#38bdf8', icon: '📊' },
    residente: { label: 'Residente', color: '#60a5fa', icon: '🏠' },
    vigilante: { label: 'Oficial de Seguridad', color: '#fbbf24', icon: '🛡️' },
    limpieza: { label: 'Personal de Limpieza', color: '#34d399', icon: '🧹' },
    medico: { label: 'Médico de Guardia', color: '#22d3ee', icon: '🏥' },
    entretenimiento: { label: 'Entretenimiento', color: '#f472b6', icon: '🎭' },
  };
  const { label: roleLabel, color: roleColor, icon: logoIcon } = roleMeta[role] || roleMeta.admin;

  const navHTML = navItems.map(item => `
    <button class="ds-nav-item ${active === item.key ? 'active' : ''}"
      onclick="${item.onClick || `window.navigateTo('${item.path}')`}">
      <span class="ds-nav-icon">${item.icon}</span>
      ${item.label}
      ${item.badge ? `<span class="ds-nav-badge" id="nav-badge-${item.key}">${item.badge}</span>` : ''}
    </button>
  `).join('');

  container.innerHTML = `
    <div class="ds-overlay" id="dsOverlay"></div>

    <button class="ds-hamburger" id="dsHamburger" onclick="window._dsToggleSidebar()">☰</button>

    <div class="ds-layout">
      <!-- SIDEBAR -->
      <aside class="ds-sidebar" id="dsSidebar">
        <!-- Logo -->
        <div class="ds-sidebar-logo">
          <div class="ds-sidebar-logo-icon">${logoIcon}</div>
          <div class="ds-sidebar-logo-text">
            EdificioApp
            <span class="ds-sidebar-logo-sub">Gestión de condominios</span>
          </div>
        </div>

        <!-- User -->
        <div class="ds-sidebar-user">
          <div class="ds-sidebar-avatar">${avatarContent}</div>
          <div class="ds-sidebar-user-info">
            <span class="ds-sidebar-user-name">${user.nombre}</span>
            <span class="ds-sidebar-user-role">
              <span class="ds-sidebar-user-dot"></span>
              ${roleLabel}
            </span>
          </div>
        </div>

        <!-- Nav -->
        <nav class="ds-nav">
          <div class="ds-nav-section-title">Menú Principal</div>
          ${navHTML}
        </nav>

        <!-- Footer -->
        <div class="ds-sidebar-footer">
          <button class="ds-nav-item" onclick="logout()">
            <span class="ds-nav-icon">🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <!-- MAIN -->
      <div class="ds-content">
        <!-- Top header -->
        <header class="ds-header">
          <div class="ds-breadcrumb">
            <span>EdificioApp</span>
            <span class="ds-breadcrumb-sep">/</span>
            <span class="ds-breadcrumb-current">${opts.breadcrumb || opts.pageTitle || 'Dashboard'}</span>
          </div>
          <div class="ds-header-right">
            <button class="ds-header-refresh" onclick="window.refrescarVista()" title="Refrescar vista">
              <span class="refresh-icon">🔄</span>
            </button>
            <span class="ds-header-time" id="dsHeaderTime"></span>
            <div class="ds-header-avatar" onclick="window.navigateTo('/perfil')">${avatarContent}</div>
          </div>
        </header>

        <!-- Page content -->
        <main class="ds-page" id="dsMainPage">
          <h1 class="ds-page-title">${opts.pageTitle || ''}</h1>
          <p class="ds-page-subtitle">${opts.pageSubtitle || ''}</p>
          <!-- Content injected here -->
        </main>
      </div>
    </div>
  `;

  // Clock
  const clockEl = document.getElementById('dsHeaderTime');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
      + '  ·  ' + now.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
  }
  updateClock();
  const clockInterval = setInterval(updateClock, 30000);

  // Sidebar toggle (mobile)
  window._dsToggleSidebar = () => {
    const sb = document.getElementById('dsSidebar');
    const ov = document.getElementById('dsOverlay');
    if (!sb || !ov) return;
    const open = sb.classList.toggle('open');
    ov.classList.toggle('open', open);
  };

  const overlay = document.getElementById('dsOverlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      const sb = document.getElementById('dsSidebar');
      const ov = document.getElementById('dsOverlay');
      if (sb) sb.classList.remove('open');
      if (ov) ov.classList.remove('open');
    });
  }

  // Clean up clock on navigation
  const observer = new MutationObserver(() => {
    if (!document.getElementById('dsHeaderTime')) {
      clearInterval(clockInterval);
      observer.disconnect();
    }
  });
  const appEl = document.getElementById('app');
  if (appEl) observer.observe(appEl, { childList: true, subtree: false });

  return document.getElementById('dsMainPage');
}
