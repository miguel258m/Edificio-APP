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
              <button class="btn btn-secondary" onclick="window.location.href='tel:911'" style="flex-direction: column; padding: 1rem; height: auto; font-size: 0.8rem; background: var(--danger);">
                <span style="font-size: 1.5rem;">🚑</span>
                <span>Emergencia</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Centro de Mensajes -->
        <div class="card mt-3 fade-in" style="animation-delay: 0.1s;">
          <h2 class="card-title">Comunicación</h2>
          <div class="grid grid-1 gap-2" id="messageCenter">
            <button class="btn btn-outline" style="width: 100%; display: flex; justify-content: space-between; align-items: center;" onclick="openChatVigilante()">
              <span>💬 Chat con Vigilancia</span>
              <span class="badge badge-success" style="font-size: 0.6rem;">En línea</span>
            </button>
            <div id="medicChatContainer"></div>
          </div>
        </div>

        <!-- Mis solicitudes recientes -->
        <div class="card mt-3 fade-in" style="animation-delay: 0.2s;">
          <h2 class="card-title">Mis Solicitudes</h2>
          <div id="solicitudesList">
            <div class="loading-spinner" style="margin: 2rem auto;"></div>
          </div>
        </div>

        <!-- Delivery y Restaurantes -->
        <div class="card mt-3 fade-in" style="animation-delay: 0.3s; background: #fffaf0; border: 1px solid #fbd38d;">
          <h2 class="card-title" style="color: #c05621;">🍕 Delivery y Restaurantes</h2>
          <div id="deliveryList" class="grid grid-1 gap-2">
            <div style="padding: 0.75rem; background: white; border-radius: var(--radius-md); border: 1px solid #feebc8; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="font-weight: 600; font-size: 0.9rem;">🍕 Pizza Express</p>
                <p style="font-size: 0.75rem; color: var(--text-muted);">Entrega en 30 min</p>
              </div>
              <a href="tel:xxxxxxx" style="color: var(--primary); font-weight: 700; text-decoration: none; font-family: monospace;">xxxxxxx</a>
            </div>
            <div style="padding: 0.75rem; background: white; border-radius: var(--radius-md); border: 1px solid #feebc8; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="font-weight: 600; font-size: 0.9rem;">🍱 Chifa Central</p>
                <p style="font-size: 0.75rem; color: var(--text-muted);">Comida oriental</p>
              </div>
              <a href="tel:xxxxxxx" style="color: var(--primary); font-weight: 700; text-decoration: none; font-family: monospace;">xxxxxxx</a>
            </div>
            <div style="padding: 0.75rem; background: white; border-radius: var(--radius-md); border: 1px solid #feebc8; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="font-weight: 600; font-size: 0.9rem;">🍗 Pollería El Sabor</p>
                <p style="font-size: 0.75rem; color: var(--text-muted);">Pollo a la brasa</p>
              </div>
              <a href="tel:xxxxxxx" style="color: var(--primary); font-weight: 700; text-decoration: none; font-family: monospace;">xxxxxxx</a>
            </div>
          </div>
        </div>
      </div>
  `;

  // Cargar datos
  loadSolicitudes();
  checkMedicalChatContext();

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
    const prioridad = document.getElementById('urgencia')?.value || 'media';
    const body = { tipo, descripcion, detalles, prioridad };

    console.log('Enviando solicitud:', body);
    // Alert temporal para debug
    alert('DEBUG: Enviando ' + tipo + ' con descripcion: ' + descripcion);

    const response = await fetch(`${window.API_URL}/solicitudes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.appState.token}`
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Respuesta del servidor (éxito):', data);
      alert('✅ Solicitud enviada correctamente. ID: ' + data.id);
      closeSolicitudModal();
      if (typeof loadSolicitudes === 'function') loadSolicitudes();
    } else {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData);
      alert('❌ Error del servidor: ' + (errorData.error || 'Desconocido'));
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    alert('❌ Error de conexión: ' + error.message);
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
  if (confirm('🚨 ¿Confirmas que deseas activar la EMERGENCIA MÉDICA? Se notificará al personal médico inmediatamente.')) {
    if (window.appState.socket && window.appState.socket.connected) {
      window.appState.socket.emit('nueva_emergencia', {
        tipo: 'medica',
        descripcion: 'Solicitud de emergencia médica desde botón flotante',
        ubicacion: `Dpto ${user.apartamento || 'Desconocida'}`
      });
      alert('✅ Emergencia médica activada. El personal médico ha sido notificado.');
    } else {
      alert('⚠️ No hay conexión con el servidor. Por favor, intenta de nuevo.');
    }
  }
};

window.openChatVigilante = async () => {
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

window.openChatMedico = (userId, userName) => {
  window.navigateTo('/chat', { userId, userName });
};

async function checkMedicalChatContext() {
  const medicContainer = document.getElementById('medicChatContainer');
  if (!medicContainer) return;

  try {
    // 1. Buscar si hay una emergencia médica activa del usuario
    const resEmergencias = await fetch(`${window.API_URL}/emergencias/activas`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const emergencias = await resEmergencias.json();
    const miEmergencia = emergencias.find(e => e.usuario_id === window.appState.user.id && e.tipo === 'medica');

    // 2. Buscar si hay una solicitud médica pendiente o en proceso
    const resSolicitudes = await fetch(`${window.API_URL}/solicitudes/mis-solicitudes`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const solicitudes = await resSolicitudes.json();
    const miSolicitud = solicitudes.find(s => s.tipo === 'medica' && (s.estado === 'pendiente' || s.estado === 'en_proceso'));

    if (miEmergencia || miSolicitud) {
      // Buscar al médico del edificio
      const resMedicos = await fetch(`${window.API_URL}/usuarios/medicos`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      const medicos = await resMedicos.json();

      if (medicos && medicos.length > 0) {
        const medico = medicos[0];
        medicContainer.innerHTML = `
          <button class="btn btn-primary mt-2" style="width: 100%; display: flex; justify-content: space-between; align-items: center; background: #6366f1;" onclick="openChatMedico(${medico.id}, '${medico.nombre}')">
            <span>👨‍⚕️ Chat con Médico (${medico.nombre})</span>
            <span class="badge badge-success" style="font-size: 0.6rem; background: rgba(255,255,255,0.2);">ACTIVO</span>
          </button>
        `;
      }
    }
  } catch (error) {
    console.error('Error al verificar contexto médico:', error);
  }
}

window.showSolicitudes = () => {
  window.navigateTo('/solicitudes');
};

window.showPerfil = () => {
  window.navigateTo('/perfil');
};
