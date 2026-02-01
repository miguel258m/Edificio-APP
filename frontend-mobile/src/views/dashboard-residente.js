// =====================================================
// DASHBOARD RESIDENTE - Vista principal para residentes
// =====================================================

import { initAnnouncements, renderAnnouncementsWidget } from '../utils/announcements.js';

export function renderDashboardResidente(container) {
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
      <!-- Header -->
      <div style="background: linear-gradient(135deg, var(--primary), var(--secondary)); padding: 2rem 0 3rem; margin-bottom: -2rem;">
        <div class="container">
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-3">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; overflow: hidden; color: white;">
                ${user.foto_perfil ? `<img src="${getFotoUrl(user.foto_perfil)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src=''; this.parentElement.innerHTML='👤'">` : '👤'}
              </div>
              <div>
                <p style="font-size: 0.875rem; opacity: 0.9;">${user.rol === 'admin' ? 'Administrador' : (user.rol.charAt(0).toUpperCase() + user.rol.slice(1))}</p>
                <h1 style="font-size: 1.25rem; font-weight: 700;">${user.nombre}</h1>
                <p style="font-size: 0.75rem; opacity: 0.8;">Dpto ${user.apartamento || 'N/A'}</p>
              </div>
            </div>
            <button onclick="logout()" class="btn" style="padding: 0.5rem 1rem; color: white; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: var(--radius-md); font-size: 0.875rem;">
              🚪 Salir
            </button>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="grid grid-2 gap-3" style="margin-top: 1.5rem; align-items: stretch;">
          <!-- Avisos Importantes -->
          <div id="announcementsWidget"></div>

          <!-- Acciones rápidas -->
          <div class="card fade-in" style="margin: 0; display: flex; flex-direction: column;">
            <h2 class="card-title">Acciones Rápidas</h2>
            <div class="grid grid-2 gap-2 mt-2" style="flex: 1;">
              <button class="btn btn-primary" onclick="showSolicitudModal('medica')" style="flex-direction: column; padding: 1rem; height: auto; font-size: 0.8rem;">
                <span style="font-size: 1.5rem;">🏥</span>
                <span>Médica</span>
              </button>
              <button class="btn btn-primary" onclick="showSolicitudModal('limpieza')" style="flex-direction: column; padding: 1rem; height: auto; font-size: 0.8rem;">
                <span style="font-size: 1.5rem;">🧹</span>
                <span>Limpieza</span>
              </button>
              <button class="btn btn-primary" onclick="showSolicitudModal('entretenimiento')" style="flex-direction: column; padding: 1rem; height: auto; font-size: 0.8rem;">
                <span style="font-size: 1.5rem;">🎉</span>
                <span>Eventos</span>
              </button>
              <button class="btn btn-secondary" onclick="showPagosModal()" style="flex-direction: column; padding: 1rem; height: auto; font-size: 0.8rem;">
                <span style="font-size: 1.5rem;">💰</span>
                <span>Pagos</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Chat con vigilante -->
        <div class="card mt-3 fade-in" style="animation-delay: 0.1s;">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title" style="margin: 0;">Chat con Vigilante</h2>
            <span class="badge badge-success">En línea</span>
          </div>
          <button class="btn btn-outline" style="width: 100%;" onclick="openChat()">
            💬 Abrir Chat
          </button>
        </div>

        <!-- Mis solicitudes recientes -->
        <div class="card mt-3 fade-in" style="animation-delay: 0.2s;">
          <h2 class="card-title">Mis Solicitudes</h2>
          <div id="solicitudesList">
            <div class="loading-spinner" style="margin: 2rem auto;"></div>
          </div>
        </div>

        <!-- Mis pagos -->
        <div class="card mt-3 fade-in" style="animation-delay: 0.3s;">
          <h2 class="card-title">Mis Pagos</h2>
          <div id="pagosList">
            <div class="loading-spinner" style="margin: 2rem auto;"></div>
          </div>
        </div>
      </div>

      <!-- Botón de emergencia flotante -->
      <button class="emergency-btn" onclick="activarEmergencia()">
        🚨
      </button>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <a href="#" class="nav-item active">
          <span class="nav-icon">🏠</span>
          <span>Inicio</span>
        </a>
        <a href="#" class="nav-item" onclick="openChat(); return false;">
          <span class="nav-icon">💬</span>
          <span>Chat</span>
        </a>
        <a href="#" class="nav-item" onclick="showSolicitudes(); return false;">
          <span class="nav-icon">📋</span>
          <span>Solicitudes</span>
        </a>
        <a href="#" class="nav-item" onclick="showPerfil(); return false;">
          <span class="nav-icon">👤</span>
          <span>Perfil</span>
        </a>
      </nav>
    </div>

    <!-- Modal para solicitudes -->
    <div id="solicitudModal" class="hidden" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div class="card" style="max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto;">
        <div class="flex justify-between items-center mb-3">
          <h2 class="card-title" style="margin: 0;" id="modalTitle">Nueva Solicitud</h2>
          <button onclick="closeSolicitudModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">×</button>
        </div>
        <form id="solicitudForm">
          <input type="hidden" id="tipoSolicitud">
          <div class="form-group">
            <label class="form-label">Descripción</label>
            <textarea class="form-textarea" id="descripcion" required placeholder="Describe tu solicitud..."></textarea>
          </div>
          <div id="camposAdicionales"></div>
          <div class="flex gap-2">
            <button type="button" class="btn btn-ghost" onclick="closeSolicitudModal()" style="flex: 1;">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" style="flex: 1;">
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para Pagos -->
    <div id="pagosModal" class="hidden" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div class="card" style="max-width: 450px; width: 100%; animation: slideUp 0.3s ease;">
        <div class="flex justify-between items-center mb-4">
          <h2 class="card-title" style="margin: 0;">💰 Cuentas de Pago</h2>
          <button onclick="closePagosModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">×</button>
        </div>
        
        <div style="background: var(--bg-secondary); padding: 1.25rem; border-radius: var(--radius-lg); border-left: 4px solid var(--primary); margin-bottom: 1.5rem;">
          <p style="font-size: 0.95rem; line-height: 1.5; color: var(--text-primary);">
            <strong>Estimados usuarios:</strong><br>
            A continuación, se detallan las cuentas para realizar sus pagos correspondientes del mes:
          </p>
        </div>

        <div class="space-y-3 mb-4">
          <div class="flex justify-between items-center p-3" style="background: var(--bg-secondary); border-radius: var(--radius-md);">
            <span style="font-weight: 600;">📱 Yape:</span>
            <span style="color: var(--primary); font-family: monospace;">987 654 321</span>
          </div>
          <div class="flex justify-between items-center p-3" style="background: var(--bg-secondary); border-radius: var(--radius-md);">
            <span style="font-weight: 600;">🏦 BBVA:</span>
            <span style="color: var(--primary); font-family: monospace;">0011-0123-4567890123</span>
          </div>
          <div class="flex justify-between items-center p-3" style="background: var(--bg-secondary); border-radius: var(--radius-md);">
            <span style="font-weight: 600;">🏦 BCP:</span>
            <span style="color: var(--primary); font-family: monospace;">191-12345678-0-91</span>
          </div>
        </div>

        <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: var(--radius-md); text-align: center; border: 1px dashed var(--success);">
          <p style="font-size: 0.875rem; color: var(--text-primary);">
            📸 Tomar captura a su pago y envíalo al número:<br>
            <strong style="font-size: 1.125rem; color: var(--success);">+51 987 654 321</strong>
          </p>
        </div>

        <button class="btn btn-primary mt-4" style="width: 100%;" onclick="closePagosModal()">
          Entendido
        </button>
      </div>
    </div>
  `;

  // Cargar datos
  loadSolicitudes();
  loadPagos();

  // Inicializar avisos
  if (typeof renderAnnouncementsWidget === 'function') {
    renderAnnouncementsWidget('announcementsWidget');
  }
}

// Funciones auxiliares
window.showSolicitudModal = (tipo) => {
  const modal = document.getElementById('solicitudModal');
  const title = document.getElementById('modalTitle');
  const tipoInput = document.getElementById('tipoSolicitud');
  const camposAdicionales = document.getElementById('camposAdicionales');

  tipoInput.value = tipo;

  const titulos = {
    'medica': '🏥 Atención Médica',
    'limpieza': '🧹 Solicitud de Limpieza',
    'entretenimiento': '🎉 Agendar Entretenimiento'
  };

  title.textContent = titulos[tipo];

  // Campos adicionales según tipo
  if (tipo === 'entretenimiento') {
    camposAdicionales.innerHTML = `
      <div class="form-group">
        <label class="form-label">Fecha del evento</label>
        <input type="date" class="form-input" id="fecha" required>
      </div>
      <div class="form-group">
        <label class="form-label">Hora</label>
        <input type="time" class="form-input" id="hora" required>
      </div>
      <div class="form-group">
        <label class="form-label">Número de invitados</label>
        <input type="number" class="form-input" id="invitados" min="1" required>
      </div>
      <div class="form-group">
        <label class="form-checkbox">
          <input type="checkbox" id="conAlcohol">
          <span>¿Con alcohol?</span>
        </label>
      </div>
    `;
  } else if (tipo === 'limpieza') {
    camposAdicionales.innerHTML = `
      <div class="form-group">
        <label class="form-label">Área a limpiar</label>
        <select class="form-select" id="area" required>
          <option value="">Seleccionar...</option>
          <option value="apartamento">Mi apartamento</option>
          <option value="salon">Salón de eventos</option>
          <option value="piscina">Área de piscina</option>
          <option value="gimnasio">Gimnasio</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Fecha preferida</label>
        <input type="date" class="form-input" id="fechaPreferida">
      </div>
    `;
  } else {
    camposAdicionales.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nivel de urgencia</label>
        <select class="form-select" id="urgencia" required>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>
    `;
  }

  modal.classList.remove('hidden');

  const form = document.getElementById('solicitudForm');
  form.onsubmit = async (e) => {
    e.preventDefault();
    await enviarSolicitud();
  };
};

window.closeSolicitudModal = () => {
  document.getElementById('solicitudModal').classList.add('hidden');
  document.getElementById('solicitudForm').reset();
};

async function enviarSolicitud() {
  const tipo = document.getElementById('tipoSolicitud').value;
  const descripcion = document.getElementById('descripcion').value;
  const detalles = {};

  if (tipo === 'entretenimiento') {
    detalles.fecha = document.getElementById('fecha').value;
    detalles.hora = document.getElementById('hora').value;
    detalles.invitados = document.getElementById('invitados').value;
    detalles.con_alcohol = document.getElementById('conAlcohol').checked;
  } else if (tipo === 'limpieza') {
    detalles.area = document.getElementById('area').value;
    detalles.fecha_preferida = document.getElementById('fechaPreferida')?.value;
  }

  try {
    const response = await fetch(`${window.API_URL}/solicitudes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.appState.token}`
      },
      body: JSON.stringify({ tipo, descripcion, detalles })
    });

    if (response.ok) {
      alert('✅ Solicitud enviada correctamente');
      closeSolicitudModal();
      loadSolicitudes();
    } else {
      alert('❌ Error al enviar solicitud');
    }
  } catch (error) {
    alert('❌ Error de conexión');
  }
}

async function loadSolicitudes() {
  try {
    const response = await fetch(`${window.API_URL}/solicitudes/mis-solicitudes`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const solicitudes = await response.json();
    const container = document.getElementById('solicitudesList');

    if (!solicitudes || solicitudes.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No tienes solicitudes</p>';
      return;
    }

    container.innerHTML = solicitudes.slice(0, 3).map(s => `
      <div style="padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); margin-bottom: 0.5rem;">
        <div class="flex justify-between items-center mb-1">
          <span style="font-weight: 600;">${getTipoIcon(s.tipo)} ${getTipoNombre(s.tipo)}</span>
          <span class="badge badge-${getEstadoColor(s.estado)}">${s.estado}</span>
        </div>
        <p style="font-size: 0.875rem; color: var(--text-secondary);">${s.descripcion}</p>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">
          ${new Date(s.fecha_solicitud).toLocaleDateString()}
        </p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error al cargar solicitudes:', error);
  }
}

async function loadPagos() {
  try {
    const response = await fetch(`${window.API_URL}/pagos/mis-pagos`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const pagos = await response.json();
    const container = document.getElementById('pagosList');

    if (!pagos || pagos.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No tienes pagos registrados</p>';
      return;
    }

    container.innerHTML = pagos.slice(0, 3).map(p => `
      <div style="padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); margin-bottom: 0.5rem;">
        <div class="flex justify-between items-center mb-1">
          <span style="font-weight: 600;">${p.concepto}</span>
          <span class="badge badge-${getEstadoColor(p.estado)}">${p.estado}</span>
        </div>
        <div class="flex justify-between" style="font-size: 0.875rem; color: var(--text-secondary);">
          <span>S/ ${p.monto}</span>
          <span>${new Date(p.fecha_pago).toLocaleDateString()}</span>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error al cargar pagos:', error);
  }
}

function getTipoIcon(tipo) {
  const icons = { medica: '🏥', limpieza: '🧹', entretenimiento: '🎉' };
  return icons[tipo] || '📋';
}

function getTipoNombre(tipo) {
  const nombres = { medica: 'Médica', limpieza: 'Limpieza', entretenimiento: 'Entretenimiento' };
  return nombres[tipo] || tipo;
}

function getEstadoColor(estado) {
  const colores = {
    pendiente: 'warning',
    en_proceso: 'info',
    completada: 'success',
    pagado: 'success',
    vencido: 'danger'
  };
  return colores[estado] || 'info';
}

window.activarEmergencia = () => {
  if (confirm('🚨 ¿Confirmas que deseas activar la EMERGENCIA? Se notificará al vigilante inmediatamente.')) {
    alert('✅ Emergencia activada. El vigilante ha sido notificado.');
  }
};

window.openChat = async () => {
  try {
    const response = await fetch(`${window.API_URL}/usuarios/vigilantes`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const vigilantes = await response.json();

    if (vigilantes && vigilantes.length > 0) {
      const v = vigilantes[0];
      window.navigateTo('/chat', { userId: v.id, userName: v.nombre });
    } else {
      alert('⚠️ No hay vigilantes disponibles en este momento');
    }
  } catch (error) {
    console.error('Error al abrir chat:', error);
    alert('❌ Error al conectar con el servicio de chat');
  }
};

window.showSolicitudes = () => {
  window.navigateTo('/solicitudes');
};

window.showPerfil = () => {
  window.navigateTo('/perfil');
};

window.showPagosModal = () => {
  document.getElementById('pagosModal').classList.remove('hidden');
};

window.closePagosModal = () => {
  document.getElementById('pagosModal').classList.add('hidden');
};
