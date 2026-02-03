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
      <!-- Header Premium -->
      <div style="background: linear-gradient(135deg, var(--bg-secondary), var(--role-residente)); padding: 2.5rem 0 3.5rem; margin-bottom: -2.5rem; border-bottom: 1px solid var(--glass-border); box-shadow: var(--shadow-lg);">
        <div class="container">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <div style="width: 64px; height: 64px; border-radius: var(--radius-full); background: var(--glass-bg); border: 2px solid var(--glass-border); padding: 3px; box-shadow: var(--shadow-md); position: relative;">
                <div style="width: 100%; height: 100%; border-radius: var(--radius-full); overflow: hidden; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-size: 1.75rem;">
                  ${user.foto_perfil ? `<img src="${getFotoUrl(user.foto_perfil)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src=''; this.parentElement.innerHTML='👤'">` : '👤'}
                </div>
              </div>
              <div>
                <p style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); margin-bottom: 0.25rem;">${user.rol === 'admin' ? 'Administrador' : 'Bienvenido Residente'}</p>
                <h1 style="font-size: 1.5rem; font-weight: 800; line-height: 1.1;">${user.nombre}</h1>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
                   <span class="badge" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.1); font-size: 0.65rem;">📍 Dpto ${user.apartamento || 'N/A'}</span>
                </div>
              </div>
            </div>
            <button onclick="logout()" class="btn btn-ghost" style="padding: 0.6rem; border-radius: var(--radius-md); background: rgba(255,255,255,0.05);">
               🚪
            </button>
          </div>
        </div>
      </div>

      <div class="container" style="position: relative; z-index: 10;">
        <!-- Widget de Estado de Pago -->
        <div id="paymentStatusWidget" class="fade-in"></div>

        <div class="grid grid-2 gap-3 mt-3" style="align-items: stretch;">
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
              <!-- MODIFICADO: Ahora llama a activarEmergencia() en vez de tel:911 -->
              <button class="btn btn-secondary" onclick="activarEmergencia()" style="flex-direction: column; padding: 1rem; height: auto; font-size: 0.8rem; background: var(--danger);">
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
        <div class="card mt-3 fade-in" style="animation-delay: 0.3s; background: rgba(255, 138, 0, 0.05); border: 1px solid rgba(255, 138, 0, 0.2);">
          <h2 class="card-title" style="color: #ff8a00; display: flex; align-items: center; gap: 0.5rem;">
            <span>🍕</span> Delivery y Restaurantes
          </h2>
          <div id="deliveryList" class="grid grid-1 gap-2">
            <div style="padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--bg-tertiary); display: flex; justify-content: space-between; align-items: center; transition: transform 0.2s;" onmouseover="this.style.transform='translateX(5px)'" onmouseout="this.style.transform='translateX(0)'">
              <div>
                <p style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">🍕 Pizza Express</p>
                <p style="font-size: 0.75rem; color: var(--text-muted);">Entrega en 30 min • Especialistas en artesanal</p>
              </div>
              <a href="tel:xxxxxxx" class="btn btn-sm" style="background: rgba(255, 138, 0, 0.1); color: #ff8a00; border: 1px solid rgba(255, 138, 0, 0.3); font-family: monospace; font-weight: 700;">
                📞 Llamar
              </a>
            </div>
            <div style="padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--bg-tertiary); display: flex; justify-content: space-between; align-items: center; transition: transform 0.2s;" onmouseover="this.style.transform='translateX(5px)'" onmouseout="this.style.transform='translateX(0)'">
              <div>
                <p style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">🍱 Chifa Central</p>
                <p style="font-size: 0.75rem; color: var(--text-muted);">Comida oriental • Menú del día disponible</p>
              </div>
              <a href="tel:xxxxxxx" class="btn btn-sm" style="background: rgba(255, 138, 0, 0.1); color: #ff8a00; border: 1px solid rgba(255, 138, 0, 0.3); font-family: monospace; font-weight: 700;">
                📞 Llamar
              </a>
            </div>
            <div style="padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--bg-tertiary); display: flex; justify-content: space-between; align-items: center; transition: transform 0.2s;" onmouseover="this.style.transform='translateX(5px)'" onmouseout="this.style.transform='translateX(0)'">
              <div>
                <p style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">🍗 Pollería El Sabor</p>
                <p style="font-size: 0.75rem; color: var(--text-muted);">Pollo a la brasa • Sabor tradicional</p>
              </div>
              <a href="tel:xxxxxxx" class="btn btn-sm" style="background: rgba(255, 138, 0, 0.1); color: #ff8a00; border: 1px solid rgba(255, 138, 0, 0.3); font-family: monospace; font-weight: 700;">
                📞 Llamar
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL DE SOLICITUDES (Corrigiendo error "no funciona ningun boton") -->
      <div id="solicitudModal" class="hidden" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem;">
        <div class="card" style="width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto;">
          <div class="flex justify-between items-center mb-4">
            <h2 id="modalTitle" class="card-title" style="margin: 0;">Solicitud</h2>
            <button onclick="closeSolicitudModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">×</button>
          </div>
          
          <form id="solicitudForm">
            <input type="hidden" id="tipoSolicitud">
            
            <div class="form-group">
              <label class="form-label">Descripción del problema o necesidad</label>
              <textarea class="form-input" id="descripcion" rows="4" placeholder="Escribe aquí los detalles..." required></textarea>
            </div>
            
            <div id="camposAdicionales"></div>
            
            <div class="flex gap-2 mt-4">
              <button type="button" class="btn btn-outline" style="flex: 1;" onclick="closeSolicitudModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary" style="flex: 1;">Enviar Solicitud</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Cargar datos
  loadSolicitudes();
  loadPaymentStatus(); // <-- NUEVO
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

  if (!modal) {
    console.error('❌ Error: El modal de solicitudes no se encontró en el DOM');
    return;
  }

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
  const modal = document.getElementById('solicitudModal');
  if (modal) {
    modal.classList.add('hidden');
    document.getElementById('solicitudForm').reset();
  }
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
      alert('✅ Solicitud enviada correctamente.');
      closeSolicitudModal();
      loadSolicitudes();

      // Notificar vía socket si es médica
      if (tipo === 'medica' && window.appState.socket) {
        window.appState.socket.emit('nueva_solicitud', data);
      }
    } else {
      const errorData = await response.json();
      alert('❌ Error: ' + (errorData.error || 'No se pudo enviar la solicitud'));
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    alert('❌ Error de conexión con el servidor');
  }
}

async function loadSolicitudes() {
  try {
    const response = await fetch(`${window.API_URL}/solicitudes/mis-solicitudes`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const solicitudes = await response.json();
    const container = document.getElementById('solicitudesList');

    if (!container) return;

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
  const user = window.appState.user;
  if (confirm('🚨 ¿Confirmas que deseas activar la EMERGENCIA MÉDICA? Se notificará al personal médico inmediatamente.')) {
    if (window.appState.socket && window.appState.socket.connected) {
      window.appState.socket.emit('nueva_emergencia', {
        tipo: 'medica',
        descripcion: 'EMERGENCIA CRÍTICA: El residente requiere atención inmediata.',
        ubicacion: `Dpto ${user.apartamento || 'Desconocida'}`
      });
      alert('✅ Emergencia médica activada. El personal médico ha sido notificado y acudirá a tu dpto.');
    } else {
      alert('⚠️ Error: No hay conexión en tiempo real con el servidor. Reintenta o contacta directo a vigilancia.');
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

async function loadPaymentStatus() {
  const widget = document.getElementById('paymentStatusWidget');
  if (!widget) return;

  try {
    // Endpoint correcto: /api/pagos/mis-pagos
    const response = await fetch(`${window.API_URL}/pagos/mis-pagos`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const pagos = await response.json();

    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anioActual = ahora.getFullYear();

    const pagadoEsteMes = pagos && Array.isArray(pagos) && pagos.some(p => {
      const fecha = new Date(p.fecha_pago);
      // Las fechas de la base de datos a veces vienen con desfase de zona horaria
      // Comparamos mes y año del objeto Date
      return fecha.getMonth() === mesActual &&
        fecha.getFullYear() === anioActual &&
        p.estado === 'pagado';
    });

    if (pagadoEsteMes) {
      widget.innerHTML = `
        <div class="card fade-in" style="background: var(--bg-secondary); border: 1px solid var(--success); padding: 1.25rem; box-shadow: var(--shadow-lg); border-left: 5px solid var(--success);">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="font-size: 2rem; filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.4));">🌟</div>
            <div>
              <h3 style="color: var(--success); font-weight: 700; margin-bottom: 0.25rem; font-size: 1.1rem;">¡Estás al día!</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">Usted está al día con sus pagos de <strong>${new Date().toLocaleString('es-ES', { month: 'long' })}</strong>. ¡Gracias por su puntualidad! 🎉</p>
            </div>
          </div>
        </div>
      `;
    } else {
      widget.innerHTML = `
        <div class="card fade-in" style="background: var(--bg-secondary); border: 1px solid var(--warning); padding: 1.25rem; box-shadow: var(--shadow-lg); border-left: 5px solid var(--warning);">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="font-size: 2rem; filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.4));">💳</div>
            <div>
              <h3 style="color: var(--warning); font-weight: 700; margin-bottom: 0.25rem; font-size: 1.1rem;">Aviso de Pago</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">Recuerda regularizar tu pago de <strong>${new Date().toLocaleString('es-ES', { month: 'long' })}</strong> para mantener el edificio en óptimas condiciones. 😊</p>
            </div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error al cargar estado de pago:', error);
  }
}
