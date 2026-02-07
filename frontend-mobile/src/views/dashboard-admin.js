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
      <div style="background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary)); padding: 2.5rem 0; border-bottom: 1px solid var(--glass-border); position: relative; overflow: hidden;">
        <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(129, 140, 248, 0.15) 0%, transparent 70%); border-radius: 50%; filter: blur(40px);"></div>
        
        <div class="container">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <div style="width: 56px; height: 56px; border-radius: var(--radius-full); background: var(--glass-bg); border: 2px solid var(--primary); padding: 3px; box-shadow: 0 0 20px rgba(129, 140, 248, 0.3);">
                <div style="width: 100%; height: 100%; border-radius: var(--radius-full); overflow: hidden; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                  ${user.foto_perfil ? `<img src="${getFotoUrl(user.foto_perfil)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src=''; this.parentElement.innerHTML='👑'">` : '👤'}
                </div>
              </div>
              <div>
                <p style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: var(--primary-light); margin-bottom: 0.1rem;">Panel de Control</p>
                <h1 style="font-size: 1.25rem; font-weight: 800; color: #fff;">${user.nombre}</h1>
                <div class="flex items-center gap-2" style="margin-top: 0.1rem;">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
                  <span style="font-size: 0.75rem; color: rgba(255,255,255,0.6); font-weight: 500;">Administrador Global</span>
                </div>
              </div>
            </div>
            <button onclick="logout()" class="btn" style="padding: 0.5rem; border-radius: var(--radius-md); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); width: 44px; height: 44px;">
               🚪
            </button>
          </div>
        </div>
      </div>

      <div class="container" style="margin-top: -1.5rem; position: relative; z-index: 10;">
        <!-- Quick Stats Row -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
          <div class="card" style="margin-bottom: 0; background: var(--bg-card); border-left: 4px solid var(--warning); padding: 1.25rem; cursor: pointer;" onclick="window.navigateTo('/gestion-usuarios')">
            <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Pendientes</div>
            <div style="font-size: 1.75rem; font-weight: 800; margin: 0.25rem 0;" id="count-pending">0</div>
            <div style="font-size: 0.65rem; color: var(--warning);">Click para aprobar</div>
          </div>
          <div class="card" id="card-emergencias" style="margin-bottom: 0; background: var(--bg-card); border-left: 4px solid var(--danger); padding: 1.25rem; cursor: pointer;" onclick="scrollToEmergencias()">
            <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Emergencias</div>
            <div style="font-size: 1.75rem; font-weight: 800; margin: 0.25rem 0; color: var(--danger);" id="adminEmergenciasCount">0</div>
            <div style="font-size: 0.65rem; color: var(--danger);">Activas ahora</div>
          </div>
        </div>

        <!-- Role Summary Charts -->
        <h3 style="font-size: 0.85rem; font-weight: 700; color: var(--primary-light); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="width: 20px; height: 2px; background: var(--primary-light);"></span> Resumen Global (Click para gestionar)
        </h3>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 2rem;">
          <div class="card text-center clickable-card" style="padding: 1rem; margin-bottom: 0; cursor: pointer;" onclick="verListaUsuarios('residente')">
            <div style="font-size: 1.5rem;">👥</div>
            <div style="font-size: 1.25rem; font-weight: 700;" id="count-residente">0</div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">Residentes</div>
          </div>
          <div class="card text-center clickable-card" style="padding: 1rem; margin-bottom: 0; cursor: pointer;" onclick="verListaUsuarios('medico')">
            <div style="font-size: 1.5rem;">🩺</div>
            <div style="font-size: 1.25rem; font-weight: 700;" id="count-medico">0</div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">Médicos</div>
          </div>
          <div class="card text-center clickable-card" style="padding: 1rem; margin-bottom: 0; cursor: pointer;" onclick="verListaUsuarios('limpieza')">
            <div style="font-size: 1.5rem;">🧹</div>
            <div style="font-size: 1.25rem; font-weight: 700;" id="count-limpieza">0</div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">Limpieza</div>
          </div>
          <div class="card text-center clickable-card" style="padding: 1rem; margin-bottom: 0; cursor: pointer;" onclick="verListaUsuarios('entretenimiento')">
            <div style="font-size: 1.5rem;">🎭</div>
            <div style="font-size: 1.25rem; font-weight: 700;" id="count-entretenimiento">0</div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">Recreación</div>
          </div>
          <div class="card text-center clickable-card" style="padding: 1rem; margin-bottom: 0; cursor: pointer;" onclick="verListaUsuarios('vigilante')">
            <div style="font-size: 1.5rem;">🛡️</div>
            <div style="font-size: 1.25rem; font-weight: 700;" id="count-vigilante">0</div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">Vigilantes</div>
          </div>
          <div class="card text-center clickable-card" style="padding: 1rem; margin-bottom: 0; cursor: pointer;" onclick="verListaUsuarios('gerente')">
            <div style="font-size: 1.5rem;">📊</div>
            <div style="font-size: 1.25rem; font-weight: 700;" id="count-gerente">0</div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">Gerentes</div>
          </div>
        </div>

        <!-- NEW: Detailed Breakdown per Building -->
        <h3 style="font-size: 0.85rem; font-weight: 700; color: var(--primary-light); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="width: 20px; height: 2px; background: var(--primary-light);"></span> Desglose por Condominio
        </h3>
        
        <div id="edificiosStatsContainer" style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.5rem;">
          <div style="text-align: center; padding: 2rem; color: var(--text-muted);">Cargando estadísticas por edificio...</div>
        </div>

        <!-- Activity Feed & Quick Actions row -->
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2.5rem;">
          <!-- Avisos Importantes Visibles -->
          <div id="announcementsWidget"></div>

          <div class="card" style="margin-bottom: 0; background: var(--bg-secondary); border-top: 4px solid var(--primary);">
            <div class="flex items-center gap-3 mb-4">
              <span style="font-size: 1.5rem;">📢</span>
              <div>
                <h2 class="card-title" style="margin: 0; font-size: 1rem;">Acción Directa</h2>
                <p style="font-size: 0.75rem; color: var(--text-muted);">Gestionar alertas y avisos</p>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <button class="btn btn-primary" style="padding: 0.75rem;" onclick="showAlertaModal()">
                 Nuevo Aviso
              </button>
              <button class="btn btn-ghost" style="padding: 0.75rem;" onclick="window.navigateTo('/gestion-usuarios')">
                 Aprobar 👥
              </button>
            </div>
          </div>
        </div>

        <!-- Emergencias Section -->
        <div id="section-emergencias" class="card fade-in" style="animation-delay: 0.3s; border: 2px solid var(--danger); background: rgba(244, 63, 94, 0.05);">
          <div class="flex justify-between items-center mb-4">
            <h2 class="card-title" style="margin: 0; color: var(--danger); display: flex; align-items: center; gap: 0.5rem;">
              <span class="pulse-icon"></span> Emergencias Activas
            </h2>
          </div>
          <div id="adminEmergenciasList">
            <p style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No hay alertas críticas en curso</p>
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
          <span>Perfil</span>
        </a>
      </nav>
    </div>

    <!-- Modal para comunicado -->
    <div id="alertaModal" class="hidden" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem; backdrop-filter: blur(8px);">
      <div class="card" style="max-width: 500px; width: 100%; border: 1px solid var(--glass-border); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
        <div class="flex justify-between items-center mb-4">
          <h2 class="card-title" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
            <span>📢</span> Nuevo Comunicado
          </h2>
          <button onclick="closeAlertaModal()" style="background: rgba(255,255,255,0.05); border: none; font-size: 1.25rem; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; justify-content: center;">×</button>
        </div>
        <form id="alertaForm">
          <div class="form-group">
            <label class="form-label">Edificio de destino</label>
            <select class="form-select" id="edificioAlerta" required>
              <option value="global">🌍 Todos los edificios (Global)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Tipo de prioridad</label>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                <label style="cursor: pointer;">
                    <input type="radio" name="tipoAlerta" value="informativa" checked style="display:none;">
                    <div style="padding: 0.5rem; text-align: center; border-radius: var(--radius-md); background: var(--bg-tertiary); font-size: 0.75rem; border: 2px solid transparent;" class="radio-tab">ℹ️ Info</div>
                </label>
                <label style="cursor: pointer;">
                    <input type="radio" name="tipoAlerta" value="mantenimiento" style="display:none;">
                    <div style="padding: 0.5rem; text-align: center; border-radius: var(--radius-md); background: var(--bg-tertiary); font-size: 0.75rem; border: 2px solid transparent;" class="radio-tab">🔧 Mant.</div>
                </label>
                <label style="cursor: pointer;">
                    <input type="radio" name="tipoAlerta" value="emergencia" style="display:none;">
                    <div style="padding: 0.5rem; text-align: center; border-radius: var(--radius-md); background: var(--bg-tertiary); font-size: 0.75rem; border: 2px solid transparent;" class="radio-tab">🚨 Crítica</div>
                </label>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Título</label>
            <input type="text" class="form-input" id="tituloAlerta" required placeholder="Ej: Corte de agua programado">
          </div>
          <div class="form-group">
            <label class="form-label">Mensaje</label>
            <textarea class="form-textarea" id="mensajeAlerta" required placeholder="Describe el detalle del aviso..." style="min-height: 120px;"></textarea>
          </div>
          <div class="flex gap-3" style="margin-top: 1rem;">
            <button type="button" class="btn btn-ghost" onclick="closeAlertaModal()" style="flex: 1;">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="btnEnviarAlerta" style="flex: 1.5;">Enviar Comunicado</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para Lista de Usuarios (Gestion interactiva) -->
    <div id="modalListaUsuarios" class="hidden" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: flex-end; justify-content: center; backdrop-filter: blur(10px);">
      <div style="background: var(--bg-secondary); width: 100%; max-width: 600px; height: 90vh; border-radius: 24px 24px 0 0; padding: 1.5rem; display: flex; flex-direction: column; box-shadow: 0 -10px 40px rgba(0,0,0,0.5);">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 id="modalListaTitulo" style="font-size: 1.25rem; font-weight: 800; color: #fff; margin: 0;">Usuarios</h2>
            <p id="modalListaSubtitulo" style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Gestionar cuentas</p>
          </div>
          <button onclick="cerrarListaUsuarios()" style="background: rgba(255,255,255,0.1); border: none; width: 44px; height: 44px; border-radius: 50%; color: #fff; font-size: 1.5rem;">×</button>
        </div>
        <div id="modalListaContenido" style="flex: 1; overflow-y: auto; padding-bottom: 2rem;">
            <div class="loading-spinner" style="margin: 4rem auto;"></div>
        </div>
      </div>
    </div>

    <!-- Modal Cambio Password -->
    <div id="modalPasswordAdmin" class="hidden" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10001; display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
      <div class="card" style="width: 100%; max-width: 400px; border: 1px solid var(--primary);">
        <h3 class="card-title">🔑 Nueva Contraseña</h3>
        <p id="passwordUsuarioNombre" style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.9rem;"></p>
        <div class="form-group">
            <input type="password" id="nuevaPassInput" class="form-input" placeholder="Minimo 4 caracteres">
        </div>
        <div class="flex gap-3">
            <button class="btn btn-ghost flex-1" onclick="cerrarModalPass()">Cancelar</button>
            <button class="btn btn-primary flex-1" id="btnConfirmPass" onclick="confirmarCambioPass()">Guardar</button>
        </div>
      </div>
    </div>

    <style>
        .clickable-card { transition: transform 0.2s, background 0.2s; }
        .clickable-card:active { transform: scale(0.95); background: rgba(129, 140, 248, 0.1); }
        .user-mgmt-card { background: var(--bg-tertiary); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1rem; border: 1px solid var(--glass-border); }
        .pulse-icon {
            width: 12px;
            height: 12px;
            background: var(--danger);
            border-radius: 50%;
            display: inline-block;
            animation: pulse-red 2s infinite;
        }
        @keyframes pulse-red {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(244, 63, 94, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
        }
        .radio-tab { transition: all 0.2s; }
        input[type="radio"]:checked + .radio-tab {
            background: var(--primary) !important;
            border-color: var(--primary-light) !important;
            color: white;
            font-weight: 700;
        }
        .building-stat-row {
            display: grid;
            grid-template-columns: 2fr repeat(5, 1fr);
            gap: 2px;
            background: rgba(255,255,255,0.05);
            padding: 0.75rem;
            border-radius: var(--radius-md);
            align-items: center;
        }
        .building-stat-header {
            font-size: 0.6rem;
            font-weight: 800;
            color: var(--text-muted);
            text-transform: uppercase;
            text-align: center;
        }
        .building-stat-value {
            font-size: 0.85rem;
            font-weight: 700;
            text-align: center;
        }
    </style>
  `;

  // --- LOGICA FRONTEND GESTION ---
  let usuariosCache = [];
  let userPassSelected = null;

  window.verListaUsuarios = async (rol) => {
    const modal = document.getElementById('modalListaUsuarios');
    const titulo = document.getElementById('modalListaTitulo');
    const content = document.getElementById('modalListaContenido');

    const labels = {
      residente: 'Residentes',
      medico: 'Médicos',
      limpieza: 'Personal Limpieza',
      entretenimiento: 'Recreación',
      vigilante: 'Vigilantes',
      gerente: 'Gerentes'
    };

    titulo.textContent = labels[rol] || 'Usuarios';
    modal.classList.remove('hidden');
    content.innerHTML = '<div class="loading-spinner" style="margin: 4rem auto;"></div>';

    try {
      const res = await fetch(`${window.API_URL}/usuarios?rol=${rol}`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      usuariosCache = await res.json();
      renderListaModal();
    } catch (e) {
      content.innerHTML = '<p class="text-center color-danger">Error al cargar usuarios</p>';
    }
  };

  const renderListaModal = () => {
    const content = document.getElementById('modalListaContenido');
    if (!usuariosCache || usuariosCache.length === 0) {
      content.innerHTML = '<p class="text-center" style="margin-top: 2rem;">No hay usuarios en esta categoría.</p>';
      return;
    }

    content.innerHTML = usuariosCache.map(u => `
        <div class="user-mgmt-card fade-in">
            <div class="flex justify-between items-start">
               <div>
                  <h4 style="font-weight: 700; color: #fff; margin: 0 0 0.25rem 0;">${u.nombre}</h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">📧 ${u.email}</p>
                  <p style="font-size: 0.75rem; color: var(--primary-light); margin: 0.25rem 0;">📍 ${u.apartamento ? `Depto ${u.apartamento}` : 'Personal'}</p>
               </div>
               <div class="flex flex-direction-column gap-2">
                  <button class="btn btn-sm btn-ghost" onclick="abrirModalPass(${u.id}, '${u.nombre}')" style="background: rgba(129,140,248,0.1); color: var(--primary-light); border: 1px solid rgba(129,140,248,0.2);">
                    🔑 Pwd
                  </button>
                  <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.id}, '${u.nombre}')">
                    🗑️
                  </button>
               </div>
            </div>
        </div>
    `).join('');
  };

  window.cerrarListaUsuarios = () => {
    document.getElementById('modalListaUsuarios').classList.add('hidden');
  };

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
    btn.disabled = true;
    btn.textContent = 'Guardando...';

    try {
      const res = await fetch(`${window.API_URL}/usuarios/${userPassSelected}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.appState.token}`
        },
        body: JSON.stringify({ password: pass })
      });

      if (res.ok) {
        alert('✅ Contraseña actualizada');
        cerrarModalPass();
      } else {
        const data = await res.json();
        alert('❌ Error: ' + data.error);
      }
    } catch (e) {
      alert('❌ Error de conexión');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Guardar';
    }
  };

  window.eliminarUsuario = async (id, nombre) => {
    if (!confirm(`¿Seguro que quieres eliminar permanentemente a ${nombre}?`)) return;

    try {
      const res = await fetch(`${window.API_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });

      if (res.ok) {
        alert('✅ Usuario eliminado');
        usuariosCache = usuariosCache.filter(u => u.id !== id);
        renderListaModal();
        loadAdminStats(); // Actualizar contadores del fondo
      } else {
        const data = await res.json();
        alert('❌ Error: ' + data.error);
      }
    } catch (e) {
      alert('❌ Error de conexión');
    }
  };

  // --- FIN LOGICA GESTION ---

  // Inicializar lógica de radio buttons para el modal
  setTimeout(() => {
    const radioTabs = document.querySelectorAll('.radio-tab');
    radioTabs.forEach(tab => {
      tab.parentElement.onclick = () => {
        tab.previousElementSibling.checked = true;
      };
    });
  }, 100);

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

window.scrollToEmergencias = () => {
  const el = document.getElementById('section-emergencias');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

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
    const [resUsers, resEdificios] = await Promise.all([
      fetch(`${window.API_URL}/usuarios`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      }),
      fetch(`${window.API_URL}/edificios/public`)
    ]);

    const users = await resUsers.json();
    const edificios = await resEdificios.json();

    // Cargar pendientes
    const resPendientes = await fetch(`${window.API_URL}/usuarios/pendientes`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const pendientes = await resPendientes.json();
    const countPendingEl = document.getElementById('count-pending');
    if (countPendingEl) countPendingEl.textContent = Array.isArray(pendientes) ? pendientes.length : 0;

    // Contar usuarios global
    const countsGlobal = {
      residente: 0,
      limpieza: 0,
      vigilante: 0,
      gerente: 0,
      medico: 0,
      entretenimiento: 0
    };

    // Estructura para conteo por edificio
    const statsPorEdificio = {};
    if (Array.isArray(edificios)) {
      edificios.forEach(e => {
        statsPorEdificio[e.id] = {
          nombre: e.nombre,
          residente: 0,
          limpieza: 0,
          entretenimiento: 0,
          medico: 0,
          gerente: 0,
          vigilante: 0
        };
      });
    }

    if (Array.isArray(users)) {
      users.forEach(u => {
        // Global
        if (countsGlobal.hasOwnProperty(u.rol)) {
          countsGlobal[u.rol]++;
        }

        // Por edificio
        if (u.edificio_id && statsPorEdificio[u.edificio_id]) {
          if (statsPorEdificio[u.edificio_id].hasOwnProperty(u.rol)) {
            statsPorEdificio[u.edificio_id][u.rol]++;
          }
        }
      });
    }

    // Actualizar UI Global
    Object.keys(countsGlobal).forEach(rol => {
      const el = document.getElementById(`count-${rol}`);
      if (el) el.textContent = countsGlobal[rol];
    });

    // Renderizar desglose por edificio
    const buildingsContainer = document.getElementById('edificiosStatsContainer');
    if (buildingsContainer && Array.isArray(edificios)) {
      if (edificios.length === 0) {
        buildingsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No hay edificios registrados</p>';
      } else {
        buildingsContainer.innerHTML = `
                <div class="building-stat-row" style="background: transparent; padding-bottom: 0;">
                    <div style="font-size: 0.6rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Condominio</div>
                    <div class="building-stat-header">Res</div>
                    <div class="building-stat-header">Lim</div>
                    <div class="building-stat-header">Rec</div>
                    <div class="building-stat-header">Med</div>
                    <div class="building-stat-header">Ger</div>
                </div>
            `;

        Object.values(statsPorEdificio).forEach(stat => {
          const row = document.createElement('div');
          row.className = 'building-stat-row';
          row.innerHTML = `
                    <div style="font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">🏢 ${stat.nombre}</div>
                    <div class="building-stat-value">${stat.residente}</div>
                    <div class="building-stat-value" style="color: var(--role-limpieza);">${stat.limpieza}</div>
                    <div class="building-stat-value" style="color: var(--role-entretenimiento);">${stat.entretenimiento}</div>
                    <div class="building-stat-value" style="color: var(--role-medico);">${stat.medico}</div>
                    <div class="building-stat-value" style="color: var(--role-gerente);">${stat.gerente}</div>
                `;
          buildingsContainer.appendChild(row);
        });
      }
    }

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

    if (count) count.textContent = Array.isArray(emergencias) ? emergencias.length : 0;

    if (!container) return;

    if (!Array.isArray(emergencias) || emergencias.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No hay alertas críticas en curso</p>';
      return;
    }

    container.innerHTML = emergencias.map(e => `
      <div class="fade-in" style="padding: 1rem; background: var(--bg-primary); border-radius: var(--radius-md); border: 1px solid var(--danger-light); margin-bottom: 0.75rem; border-left: 4px solid var(--danger);">
        <div class="flex justify-between items-start mb-2">
          <span style="font-weight: 700; font-size: 0.95rem; color: #fff;">📍 Dpto. ${e.usuario_apartamento || 'N/A'}</span>
          <span style="font-size: 0.7rem; color: var(--text-muted); background: rgba(244, 63, 94, 0.1); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(244, 63, 94, 0.2);">${new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <p style="font-size: 0.85rem; color: #fff; margin-bottom: 0.5rem; line-height: 1.4;">${e.descripcion}</p>
        <div style="display: flex; align-items: center; gap: 0.5rem; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.05);">
          <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">👤</div>
          <div>
            <p style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin: 0;">${e.usuario_nombre}</p>
            <p style="font-size: 0.65rem; color: var(--text-muted); margin: 0;">🏢 Edificio ID: ${e.edificio_id} ${e.usuario_telefono ? `| 📞 ${e.usuario_telefono}` : ''}</p>
          </div>
        </div>
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
  const tipo = document.querySelector('input[name="tipoAlerta"]:checked').value;
  const titulo = document.getElementById('tituloAlerta').value;
  const mensaje = document.getElementById('mensajeAlerta').value;
  const btn = document.getElementById('btnEnviarAlerta');

  const edificio_id = edificio_id_val === 'global' ? null : edificio_id_val;

  try {
    if (btn) {
      btn.disabled = true;
      btn.innerText = 'Enviando...';
    }

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
    if (btn) {
      btn.disabled = false;
      btn.innerText = 'Enviar Comunicado';
    }
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
  const tipo = document.querySelector('input[name="tipoAlerta"]:checked').value;
  const titulo = document.getElementById('tituloAlerta').value;
  const mensaje = document.getElementById('mensajeAlerta').value;
  const btn = document.getElementById('btnEnviarAlerta');

  const edificio_id = edificio_id_val === 'global' ? null : edificio_id_val;

  try {
    if (btn) {
      btn.disabled = true;
      btn.innerText = 'Enviando...';
    }

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
    if (btn) {
      btn.disabled = false;
      btn.innerText = 'Enviar Comunicado';
    }
  }
}
