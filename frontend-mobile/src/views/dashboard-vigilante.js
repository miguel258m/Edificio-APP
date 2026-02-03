import { initAnnouncements, renderAnnouncementsWidget } from '../utils/announcements.js';

export function renderDashboardVigilante(container) {
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
      <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 2rem 0 3rem; margin-bottom: -2rem;">
        <div class="container">
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-3">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; overflow: hidden; color: white;">
                ${user.foto_perfil ? `<img src="${getFotoUrl(user.foto_perfil)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src=''; this.parentElement.innerHTML='👮'">` : '👮'}
              </div>
              <div>
                <p style="font-size: 0.875rem; opacity: 0.9;">${user.rol === 'admin' ? 'Administrador' : (user.rol.charAt(0).toUpperCase() + user.rol.slice(1))}</p>
                <h1 style="font-size: 1.25rem; font-weight: 700;">${user.nombre}</h1>
                <p style="font-size: 0.875rem; opacity: 0.8;">En servicio</p>
              </div>
            </div>
            <button onclick="logout()" class="btn" style="padding: 0.5rem 1rem; color: white; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: var(--radius-md); font-size: 0.875rem;">
              🚪 Salir
            </button>
          </div>
        </div>
      </div>

      <div class="container">
        <!-- Alertas activas -->
        <div id="emergenciasAlert" class="card mt-3 fade-in" style="border: 2px solid var(--danger); display: none;">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title" style="margin: 0; color: var(--danger);">🚨 Emergencias Activas</h2>
            <span class="badge badge-danger" id="emergenciasCount">0</span>
          </div>
          <div id="emergenciasList">
            <p style="text-align: center; color: var(--text-muted); padding: 1rem;">No hay emergencias activas</p>
          </div>
        </div>

        <div class="grid grid-2 gap-3" style="margin-top: 1.5rem; align-items: stretch; margin-bottom: 1.5rem;">
          <!-- Avisos Importantes Visibles -->
          <div id="announcementsWidget"></div>

          <!-- Enviar alerta general (Quick Action) -->
          <div class="card flex flex-col" style="margin: 0; background: var(--bg-secondary);">
            <h2 class="card-title" style="font-size: 0.875rem;">Acción Rápida</h2>
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 0.75rem;">
               <button class="btn btn-danger" style="width: 100%; padding: 1rem;" onclick="showAlertaModal()">
                  📢 Crear Aviso
               </button>
               <p style="font-size: 0.7rem; color: var(--text-muted); text-align: center;">
                  Informa a todos los residentes
               </p>
            </div>
          </div>
        </div>

        <!-- Mensajes pendientes -->
        <div class="card mt-3 fade-in" style="animation-delay: 0.2s;">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title" style="margin: 0;">💬 Mensajes</h2>
            <span class="badge badge-warning" id="mensajesCount">0</span>
          </div>
          <div id="mensajesList">
            <div class="loading-spinner" style="margin: 2rem auto;"></div>
          </div>
        </div>

        <!-- Solicitudes pendientes -->
        <div class="card mt-3 fade-in" style="animation-delay: 0.3s;">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title" style="margin: 0;">📋 Solicitudes Pendientes</h2>
            <span class="badge badge-info" id="solicitudesCount">0</span>
          </div>
          <div id="solicitudesList">
            <div class="loading-spinner" style="margin: 2rem auto;"></div>
          </div>
        </div>

      </div>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <a href="#" class="nav-item active">
          <span class="nav-icon">🏠</span>
          <span>Inicio</span>
        </a>
        <a href="#" class="nav-item" onclick="window.navigateTo('/chats'); return false;">
          <span class="nav-icon">💬</span>
          <span>Chats</span>
        </a>
        <a href="#" class="nav-item" onclick="window.navigateTo('/solicitudes'); return false;">
          <span class="nav-icon">📋</span>
          <span>Solicitudes</span>
        </a>
        <a href="#" class="nav-item">
          <span class="nav-icon">👤</span>
          <span>Perfil</span>
        </a>
      </nav>
    </div>

    <!-- Modal para alerta general -->
    <div id="alertaModal" class="hidden" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div class="card" style="max-width: 500px; width: 100%;">
        <div class="flex justify-between items-center mb-3">
          <h2 class="card-title" style="margin: 0;">📢 Nueva Alerta General</h2>
          <button onclick="closeAlertaModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">×</button>
        </div>
        <form id="alertaForm">
          <div class="form-group">
            <label class="form-label">Tipo de alerta</label>
            <select class="form-select" id="tipoAlerta" required>
              <option value="emergencia">🚨 Emergencia</option>
              <option value="informativa">ℹ️ Informativa</option>
              <option value="mantenimiento">🔧 Mantenimiento</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Título</label>
            <input type="text" class="form-input" id="tituloAlerta" required placeholder="Ej: Corte de agua programado">
          </div>

          <div class="form-group">
            <label class="form-label">Mensaje</label>
            <textarea class="form-textarea" id="mensajeAlerta" required placeholder="Describe la alerta..."></textarea>
          </div>

          <div class="flex gap-2">
            <button type="button" class="btn btn-ghost" onclick="closeAlertaModal()" style="flex: 1;">
              Cancelar
            </button>
            <button type="submit" class="btn btn-danger" style="flex: 1;">
              Enviar Alerta
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Cargar datos
  loadEmergencias();
  loadMensajes();
  loadSolicitudesPendientes();

  if (typeof renderAnnouncementsWidget === 'function') {
    renderAnnouncementsWidget('announcementsWidget');
  }
}

window.showAlertaModal = () => {
  document.getElementById('alertaModal').classList.remove('hidden');

  const form = document.getElementById('alertaForm');
  form.onsubmit = async (e) => {
    e.preventDefault();
    await enviarAlerta();
  };
};

window.closeAlertaModal = () => {
  document.getElementById('alertaModal').classList.add('hidden');
  document.getElementById('alertaForm').reset();
};

async function enviarAlerta() {
  const tipo = document.getElementById('tipoAlerta').value;
  const titulo = document.getElementById('tituloAlerta').value;
  const mensaje = document.getElementById('mensajeAlerta').value;

  try {
    const response = await fetch(`${window.API_URL}/alertas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.appState.token}`
      },
      body: JSON.stringify({ tipo, titulo, mensaje })
    });

    if (response.ok) {
      alert('✅ Alerta enviada a todos los residentes');
      closeAlertaModal();
      // Recargar el widget de avisos si existe
      if (typeof renderAnnouncementsWidget === 'function') {
        renderAnnouncementsWidget('announcementsWidget');
      }
    } else {
      alert('❌ Error al enviar alerta');
    }
  } catch (error) {
    alert('❌ Error de conexión');
  }
}

async function loadEmergencias() {
  try {
    const response = await fetch(`${window.API_URL}/emergencias/activas`, {
      headers: {
        'Authorization': `Bearer ${window.appState.token}`
      }
    });

    const emergencias = await response.json();
    const container = document.getElementById('emergenciasList');
    const count = document.getElementById('emergenciasCount');

    count.textContent = emergencias.length;

    if (emergencias.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 1rem;">No hay emergencias activas</p>';
      return;
    }

    container.innerHTML = emergencias.map(e => `
      <div style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); border-radius: var(--radius-md); margin-bottom: 0.5rem;">
        <div class="flex justify-between items-center mb-1">
          <span style="font-weight: 600; color: var(--danger);">🚨 ${e.tipo || 'Emergencia'}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">
            ${new Date(e.created_at).toLocaleTimeString()}
          </span>
        </div>
        <p style="font-size: 0.875rem; margin-bottom: 0.5rem;">${e.descripcion}</p>
        <p style="font-size: 0.875rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem;">
          📍 ${e.ubicacion} - ${e.usuario_nombre}
          ${e.usuario_telefono ? `<a href="tel:${e.usuario_telefono}" style="color: var(--danger); text-decoration: none;">📞</a>` : ''}
        </p>
        <button class="btn btn-success mt-2" style="width: 100%; padding: 0.5rem;" onclick="atenderEmergencia(${e.id})">
          Marcar como Atendida
        </button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error al cargar emergencias:', error);
  }
}

async function loadMensajes() {
  try {
    const response = await fetch(`${window.API_URL}/mensajes/no-leidos`, {
      headers: {
        'Authorization': `Bearer ${window.appState.token}`
      }
    });

    const mensajes = await response.json();
    const container = document.getElementById('mensajesList');
    const count = document.getElementById('mensajesCount');

    count.textContent = mensajes.length;

    if (mensajes.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 1rem;">No hay mensajes nuevos</p>';
      return;
    }

    // Agrupar mensajes por remitente
    const grouped = mensajes.reduce((acc, current) => {
      if (!acc[current.remitente_id]) {
        acc[current.remitente_id] = {
          ...current,
          count: 0
        };
      }
      acc[current.remitente_id].count++;
      return acc;
    }, {});

    const chatList = Object.values(grouped);

    container.innerHTML = chatList.slice(0, 5).map(m => `
      <div style="padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); margin-bottom: 0.5rem; cursor: pointer; position: relative;" onclick="abrirChat(${m.remitente_id}, '${m.remitente_nombre}')">
        <div class="flex justify-between items-center mb-1">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-weight: 600;">${m.remitente_nombre}</span>
            <span class="badge badge-warning" style="font-size: 0.7rem; padding: 0.1rem 0.4rem;">${m.count}</span>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">
            ${new Date(m.created_at).toLocaleTimeString()}
          </span>
        </div>
        <p style="font-size: 0.875rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${m.contenido}
        </p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error al cargar mensajes:', error);
  }
}

async function loadSolicitudesPendientes() {
  try {
    const response = await fetch(`${window.API_URL}/solicitudes?estado=pendiente`, {
      headers: {
        'Authorization': `Bearer ${window.appState.token}`
      }
    });

    const solicitudes = await response.json();
    const container = document.getElementById('solicitudesList');
    const count = document.getElementById('solicitudesCount');

    count.textContent = solicitudes.length;

    if (solicitudes.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 1rem;">No hay solicitudes pendientes</p>';
      return;
    }

    container.innerHTML = solicitudes.slice(0, 5).map(s => {
      // Parsear detalles si vienen como string
      let detalles = s.detalles;
      if (typeof detalles === 'string') {
        try { detalles = JSON.parse(detalles); } catch (e) { detalles = {}; }
      }

      return `
      <div style="padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); margin-bottom: 0.5rem;">
        <div class="flex justify-between items-center mb-1">
          <span style="font-weight: 600;">${getTipoIcon(s.tipo)} ${getTipoNombre(s.tipo)}</span>
          <span class="badge badge-${getPrioridadColor(s.prioridad)}">${s.prioridad}</span>
        </div>
        <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${s.descripcion}</p>
        </p>
      </div>
      `;
    }).join('');
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

function getPrioridadColor(prioridad) {
  const colores = { baja: 'info', media: 'warning', alta: 'danger' };
  return colores[prioridad] || 'info';
}

function getAreaLabel(area) {
  const labels = {
    apartamento: 'Dpto',
    salon: 'Salón de Eventos',
    piscina: 'Área de Piscina',
    gimnasio: 'Gimnasio'
  };
  return labels[area] || area;
}

window.atenderEmergencia = async (id) => {
  if (confirm('¿Marcar esta emergencia como atendida?')) {
    try {
      const response = await fetch(`${window.API_URL}/emergencias/${id}/atender`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${window.appState.token}`
        }
      });

      if (response.ok) {
        alert('✅ Emergencia marcada como atendida');
        loadEmergencias();
      }
    } catch (error) {
      alert('❌ Error al actualizar emergencia');
    }
  }
};

window.abrirChat = (userId, userName = 'Residente') => {
  window.navigateTo('/chat', { userId, userName });
};
