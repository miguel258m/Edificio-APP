// =====================================================
// DASHBOARD ADMINISTRADOR - Vista principal para administradores
// =====================================================

import { renderAnnouncementsWidget } from '../utils/announcements.js';

export function renderDashboardAdmin(container) {
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
      <div style="background: linear-gradient(135deg, var(--bg-secondary), var(--role-admin)); padding: 2.5rem 0 3.5rem; margin-bottom: -2.5rem; border-bottom: 1px solid var(--glass-border); box-shadow: var(--shadow-lg);">
        <div class="container">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <div style="width: 64px; height: 64px; border-radius: var(--radius-full); background: var(--glass-bg); border: 2px solid var(--glass-border); padding: 3px; box-shadow: var(--shadow-md);">
                <div style="width: 100%; height: 100%; border-radius: var(--radius-full); overflow: hidden; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-size: 1.75rem;">
                  ${user.foto_perfil ? `<img src="${getFotoUrl(user.foto_perfil)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src=''; this.parentElement.innerHTML='👑'">` : '👤'}
                </div>
              </div>
              <div>
                <p style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.7); margin-bottom: 0.25rem;">Control Maestro</p>
                <h1 style="font-size: 1.5rem; font-weight: 800; line-height: 1.1;">${user.nombre}</h1>
                <p style="font-size: 0.875rem; opacity: 0.8; margin-top: 0.25rem; font-weight: 500;">Administrador Global</p>
              </div>
            </div>
            <button onclick="logout()" class="btn btn-ghost" style="padding: 0.6rem; border-radius: var(--radius-md); background: rgba(255,255,255,0.05);">
               🚪
            </button>
          </div>
        </div>
      </div>

      <div class="container" style="position: relative; z-index: 10;">
        <!-- Resumen de Cuentas (NUEVO) -->
        <h3 style="font-size: 0.85rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.05em; margin: 1rem 0;">Cuentas Registradas</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 2rem;">
          <div class="card text-center" style="padding: 1rem; background: var(--bg-secondary);">
            <div style="font-size: 1.25rem; margin-bottom: 0.25rem;">🏠</div>
            <div style="font-size: 1.5rem; font-weight: 700;" id="count-residente">0</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Residentes</div>
          </div>
          <div class="card text-center" style="padding: 1rem; background: var(--bg-secondary);">
            <div style="font-size: 1.25rem; margin-bottom: 0.25rem;">🧹</div>
            <div style="font-size: 1.5rem; font-weight: 700;" id="count-limpieza">0</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Limpieza</div>
          </div>
          <div class="card text-center" style="padding: 1rem; background: var(--bg-secondary);">
            <div style="font-size: 1.25rem; margin-bottom: 0.25rem;">🛡️</div>
            <div style="font-size: 1.5rem; font-weight: 700;" id="count-vigilante">0</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Vigilantes</div>
          </div>
          <div class="card text-center" style="padding: 1rem; background: var(--bg-secondary);">
            <div style="font-size: 1.25rem; margin-bottom: 0.25rem;">📊</div>
            <div style="font-size: 1.5rem; font-weight: 700;" id="count-gerente">0</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Gerentes</div>
          </div>
        </div>

        <div class="grid grid-2 gap-3" style="margin-top: 1.5rem; align-items: stretch; margin-bottom: 1.5rem;">
          <!-- Avisos Importantes Visibles -->
          <div id="announcementsWidget"></div>

          <!-- Enviar comunicado o acción rápida -->
          <div class="card flex flex-col" style="margin: 0; background: var(--bg-secondary);">
             <h2 class="card-title" style="font-size: 0.875rem;">Acción Rápida</h2>
             <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 0.75rem;">
                <button class="btn btn-danger" style="width: 100%; padding: 1rem;" onclick="showAlertaModal()">
                   📢 Comunicado
                </button>
                <p style="font-size: 0.7rem; color: var(--text-muted); text-align: center;">
                   Envía un aviso oficial
                </p>
             </div>
          </div>
        </div>

        <!-- Gestión de Usuarios - ACCESO RÁPIDO -->
        <div class="card mt-3 fade-in" style="animation-delay: 0.2s; background: var(--bg-secondary); border-left: 4px solid var(--primary);">
          <div class="flex items-center gap-3 mb-2">
            <span style="font-size: 2rem;">👥</span>
            <div>
              <h2 class="card-title" style="margin: 0;">Gestión de Usuarios</h2>
              <p style="font-size: 0.875rem; color: var(--text-muted);">Aprobar registros y asignar roles</p>
            </div>
          </div>
          <button class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;" onclick="window.navigateTo('/gestion-usuarios')">
            Ir a Administración
          </button>
        </div>

        <!-- Alertas activas Críticas -->
        <div class="card mt-3 fade-in" style="animation-delay: 0.3s; border: 2px solid var(--danger);">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title" style="margin: 0; color: var(--danger);">🚨 Emergencias Activas</h2>
            <span class="badge badge-danger" id="adminEmergenciasCount">0</span>
          </div>
          <div id="adminEmergenciasList">
            <p style="text-align: center; color: var(--text-muted); padding: 1rem;">No hay emergencias críticas</p>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <a href="#" class="nav-item active">
          <span class="nav-icon">🏠</span>
          <span>Resumen</span>
        </a>
        <a href="#" class="nav-item" onclick="window.navigateTo('/gestion-usuarios'); return false;">
          <span class="nav-icon">👥</span>
          <span>Usuarios</span>
        </a>
        <a href="#" class="nav-item" onclick="window.navigateTo('/solicitudes'); return false;">
          <span class="nav-icon">📋</span>
          <span>Reportes</span>
        </a>
        <a href="#" class="nav-item" onclick="window.navigateTo('/perfil'); return false;">
          <span class="nav-icon">👤</span>
          <span>Ajustes</span>
        </a>
      </nav>
    </div>

    <!-- Modal para comunicado -->
    <div id="alertaModal" class="hidden" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div class="card" style="max-width: 500px; width: 100%;">
        <div class="flex justify-between items-center mb-3">
          <h2 class="card-title" style="margin: 0;">📢 Nuevo Comunicado</h2>
          <button onclick="closeAlertaModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">×</button>
        </div>
        <form id="alertaForm">
          <div class="form-group">
            <label class="form-label">Edificio de destino</label>
            <select class="form-select" id="edificioAlerta" required>
              <option value="global">🌍 Todos los edificios (Global)</option>
              <option value="" disabled>─ O selecciona uno ─</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Tipo de prioridad</label>
            <select class="form-select" id="tipoAlerta" required>
              <option value="informativa">ℹ️ Informativa</option>
              <option value="emergencia">🚨 Crítica</option>
              <option value="mantenimiento">🔧 Mantenimiento</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Título</label>
            <input type="text" class="form-input" id="tituloAlerta" required placeholder="Título del comunicado">
          </div>
          <div class="form-group">
            <label class="form-label">Mensaje</label>
            <textarea class="form-textarea" id="mensajeAlerta" required placeholder="Contenido del mensaje..." style="min-height: 100px;"></textarea>
          </div>
          <div class="flex gap-2">
            <button type="button" class="btn btn-ghost" onclick="closeAlertaModal()" style="flex: 1;">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="btnEnviarAlerta" style="flex: 1; background: var(--role-admin);">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Cargar datos al iniciar
  loadAdminStats();
  loadAdminEmergencias();
  loadEdificiosParaAlertas();

  // Inicializar alertas
  if (typeof renderAnnouncementsWidget === 'function') {
    renderAnnouncementsWidget('announcementsWidget');
  }

  // Vincular el formulario
  setTimeout(() => {
    const form = document.getElementById('alertaForm');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        enviarAlertaAdmin();
      };
    }
  }, 100);
}

async function loadEdificiosParaAlertas() {
  try {
    const response = await fetch(`${window.API_URL}/edificios/public`);
    const edificios = await response.json();
    const select = document.getElementById('edificioAlerta');
    if (select && Array.isArray(edificios)) {
      edificios.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = `🏢 ${e.nombre}`;
        select.appendChild(opt);
      });
    }
  } catch (error) {
    console.warn('Error al cargar edificios para el modal de alertas:', error);
  }
}

async function loadAdminStats() {
  try {
    const resUsers = await fetch(`${window.API_URL}/usuarios`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const users = await resUsers.json();

    // Contar usuarios por rol
    const counts = {
      residente: 0,
      limpieza: 0,
      vigilante: 0,
      gerente: 0
    };

    if (Array.isArray(users)) {
      users.forEach(u => {
        if (counts.hasOwnProperty(u.rol)) {
          counts[u.rol]++;
        }
      });
    }

    // Actualizar UI
    Object.keys(counts).forEach(rol => {
      const el = document.getElementById(`count-${rol}`);
      if (el) el.textContent = counts[rol];
    });

  } catch (error) {
    console.warn('Error al cargar stats de usuarios:', error);
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

    if (count) count.textContent = emergencias.length;

    if (!container) return;

    if (emergencias.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 1rem;">No hay alertas críticas en curso</p>';
      return;
    }

    container.innerHTML = emergencias.map(e => `
      <div style="padding: 0.875rem; background: var(--bg-primary); border-radius: var(--radius-md); border: 1px solid var(--danger-light); margin-bottom: 0.5rem;">
        <div class="flex justify-between items-start mb-1">
          <span style="font-weight: 600; font-size: 0.9rem;">📍 Dpto. ${e.usuario_apartamento || 'N/A'}</span>
          <span style="font-size: 0.7rem; color: var(--text-muted);">${new Date(e.created_at).toLocaleTimeString()}</span>
        </div>
        <p style="font-size: 0.875rem;">${e.descripcion}</p>
        <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
          Por: ${e.usuario_nombre} ${e.usuario_telefono ? `| 📞 ${e.usuario_telefono}` : ''}
        </p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error al cargar emergencias:', error);
  }
}

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

async function enviarAlertaAdmin() {
  const edificio_id_val = document.getElementById('edificioAlerta').value;
  const tipo = document.getElementById('tipoAlerta').value;
  const titulo = document.getElementById('tituloAlerta').value;
  const mensaje = document.getElementById('mensajeAlerta').value;
  const btn = document.getElementById('btnEnviarAlerta');

  // Si selecciona global, el edificio_id será null para que el backend lo tome así
  const edificio_id = edificio_id_val === 'global' ? null : edificio_id_val;

  try {
    if (btn) btn.disabled = true;
    if (btn) btn.innerText = 'Enviando...';

    const response = await fetch(`${window.API_URL}/alertas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.appState.token}`
      },
      body: JSON.stringify({ tipo, titulo, mensaje, edificio_id })
    });

    if (response.ok) {
      alert('✅ Comunicado enviado correctamente');
      closeAlertaModal();
      // Recargar el widget de avisos si existe
      if (typeof renderAnnouncementsWidget === 'function') {
        renderAnnouncementsWidget('announcementsWidget');
      }
    } else {
      const data = await response.json();
      alert('❌ Error: ' + (data.error || 'No se pudo enviar'));
    }
  } catch (error) {
    alert('❌ Error de conexión al servidor');
  } finally {
    if (btn) btn.disabled = false;
    if (btn) btn.innerText = 'Enviar';
  }
}
