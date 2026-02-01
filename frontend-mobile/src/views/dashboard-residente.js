// =====================================================
// DASHBOARD RESIDENTE - Vista principal para residentes
// =====================================================

export function renderDashboardResidente(container) {
  const user = window.appState.user;

  container.innerHTML = `
    <div class="page">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, var(--primary), var(--secondary)); padding: 2rem 0 3rem; margin-bottom: -2rem;">
        <div class="container">
          <div class="flex justify-between items-center mb-3">
            <div>
              <p style="font-size: 0.875rem; opacity: 0.9;">Bienvenido/a</p>
              <h1 style="font-size: 1.5rem; font-weight: 700;">${user.nombre}</h1>
              <p style="font-size: 0.875rem; opacity: 0.8;">Apartamento ${user.apartamento || 'N/A'}</p>
            </div>
            <button onclick="logout()" class="btn btn-ghost" style="padding: 0.5rem;">
              🚪
            </button>
          </div>
        </div>
      </div>

      <div class="container">
        <!-- Acciones rápidas -->
        <div class="card fade-in" style="margin-top: 2rem;">
          <h2 class="card-title">Acciones Rápidas</h2>
          <div class="grid grid-2 gap-2 mt-2">
            <button class="btn btn-primary" onclick="showSolicitudModal('medica')" style="flex-direction: column; padding: 1.5rem; height: auto;">
              <span style="font-size: 2rem;">🏥</span>
              <span>Atención Médica</span>
            </button>
            <button class="btn btn-primary" onclick="showSolicitudModal('limpieza')" style="flex-direction: column; padding: 1.5rem; height: auto;">
              <span style="font-size: 2rem;">🧹</span>
              <span>Limpieza</span>
            </button>
            <button class="btn btn-primary" onclick="showSolicitudModal('entretenimiento')" style="flex-direction: column; padding: 1.5rem; height: auto;">
              <span style="font-size: 2rem;">🎉</span>
              <span>Entretenimiento</span>
            </button>
            <button class="btn btn-secondary" onclick="showPagosModal()" style="flex-direction: column; padding: 1.5rem; height: auto;">
              <span style="font-size: 2rem;">💰</span>
              <span>Registrar Pago</span>
            </button>
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
  `;

  // Cargar datos
  loadSolicitudes();
  loadPagos();
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

  // Manejar envío
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
      body: JSON.stringify({
        tipo,
        descripcion,
        detalles
      })
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
      headers: {
        'Authorization': `Bearer ${window.appState.token}`
      }
    });

    const solicitudes = await response.json();
    const container = document.getElementById('solicitudesList');

    if (solicitudes.length === 0) {
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
      headers: {
        'Authorization': `Bearer ${window.appState.token}`
      }
    });

    const pagos = await response.json();
    const container = document.getElementById('pagosList');

    if (pagos.length === 0) {
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
    // Aquí se enviaría la emergencia
    alert('✅ Emergencia activada. El vigilante ha sido notificado.');
  }
};

window.openChat = async () => {
  try {
    // Buscar al vigilante del edificio
    const response = await fetch(`${window.API_URL}/usuarios/vigilantes`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const vigilantes = await response.json();

    if (vigilantes.length > 0) {
      const v = vigilantes[0]; // Tomamos el primero por ahora
      window.navigateTo('/chat', { userId: v.id, userName: v.nombre });
    } else {
      alert('⚠️ No hay vigilantes disponibles en este momento');
    }
  } catch (error) {
    console.error('Error al abrir chat:', error);
    alert('❌ Error al conectar con el servicio de chat');
  }
};

window.logout = () => {
  alert('💬 Función de chat en desarrollo');
};

window.showSolicitudes = () => {
  alert('📋 Vista de solicitudes en desarrollo');
};

window.showPerfil = () => {
  alert('👤 Perfil en desarrollo');
};

window.showPagosModal = () => {
  alert('💰 Registro de pagos en desarrollo');
};
