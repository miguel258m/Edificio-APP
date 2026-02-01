// =====================================================
// SOLICITUDES VIEW - Vista de solicitudes del usuario
// =====================================================

export function renderSolicitudes(container) {
  const user = window.appState.user;

  container.innerHTML = `
    <div class="page">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, var(--primary), var(--secondary)); padding: 2rem 1rem; margin-bottom: 1rem;">
        <div class="container">
          <div class="flex justify-between items-center">
            <div>
              <h1 style="font-size: 1.5rem; font-weight: 700; color: white;">
                ${['residente'].includes(user.rol) ? '📋 Mis Solicitudes' : '📋 Gestión de Solicitudes'}
              </h1>
              <p style="font-size: 0.875rem; opacity: 0.9; color: white;">${user.nombre} (${user.rol.toUpperCase()})</p>
            </div>
            <button onclick="window.history.back()" class="btn btn-ghost" style="padding: 0.5rem; color: white;">
              ←
            </button>
          </div>
        </div>
      </div>

      <div class="container">
        <!-- Filtros -->
        <div class="card mb-3">
          <div class="flex gap-2" style="overflow-x: auto;">
            <button class="btn btn-sm filter-btn active" data-filter="todas">Todas</button>
            <button class="btn btn-sm filter-btn" data-filter="pendiente">Pendientes</button>
            <button class="btn btn-sm filter-btn" data-filter="en_proceso">En Proceso</button>
            <button class="btn btn-sm filter-btn" data-filter="completada">Completadas</button>
          </div>
        </div>

        <!-- Lista de solicitudes -->
        <div id="solicitudesList">
          <div class="loading-spinner" style="margin: 2rem auto;"></div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <a href="#" class="nav-item" onclick="window.navigateTo('/dashboard-${user.rol}'); return false;">
          <span class="nav-icon">🏠</span>
          <span>Inicio</span>
        </a>
        <a href="#" class="nav-item active">
          <span class="nav-icon">📋</span>
          <span>Solicitudes</span>
        </a>
        <a href="#" class="nav-item" onclick="showPerfil(); return false;">
          <span class="nav-icon">👤</span>
          <span>Perfil</span>
        </a>
      </nav>
    </div>
  `;

  let currentFilter = 'todas';

  // Cargar solicitudes inicialmente
  loadAllSolicitudes();

  // Manejar filtros
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.onclick = () => {
      currentFilter = btn.dataset.filter;
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadAllSolicitudes(currentFilter);
    };
  });

  async function actualizarEstado(id, nuevoEstado) {
    if (!confirm(`¿Seguro que quieres cambiar el estado a ${nuevoEstado}?`)) return;

    try {
      const response = await fetch(`${window.API_URL}/solicitudes/${id}/estado`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${window.appState.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (response.ok) {
        loadAllSolicitudes(currentFilter);
      } else {
        alert('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  }

  window.actualizarEstado = actualizarEstado;

  async function loadAllSolicitudes(filter = 'todas') {
    try {
      // Si es staff, ver todas las del edificio. Si es residente, solo las suyas.
      const isStaff = ['admin', 'vigilante', 'gerente', 'limpieza'].includes(user.rol);
      const endpoint = isStaff ? `${window.API_URL}/solicitudes` : `${window.API_URL}/solicitudes/mis-solicitudes`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${window.appState.token}`
        }
      });

      let solicitudes = await response.json();

      // Aplicar filtro
      if (filter !== 'todas') {
        solicitudes = solicitudes.filter(s => s.estado === filter);
      }

      const container = document.getElementById('solicitudesList');

      if (solicitudes.length === 0) {
        container.innerHTML = `
          <div class="card text-center" style="padding: 3rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📋</div>
            <p style="color: var(--text-muted);">${isStaff ? 'No hay solicitudes en el edificio' : 'No tienes solicitudes'}</p>
          </div>
        `;
        return;
      }

      container.innerHTML = solicitudes.map(s => `
        <div class="card mb-3 fade-in">
          <div class="flex justify-between items-start mb-2">
            <div>
              <div style="font-size: 1.25rem; margin-bottom: 0.25rem;">${getTipoIcon(s.tipo)}</div>
              <h3 style="font-weight: 600; font-size: 1rem; margin-bottom: 0.25rem;">${getTipoNombre(s.tipo)}</h3>
              <p style="font-size: 0.75rem; color: var(--text-muted);">
                ${new Date(s.fecha_solicitud).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
              </p>
            </div>
            <span class="badge badge-${getEstadoColor(s.estado)}">${getEstadoLabel(s.estado)}</span>
          </div>
          
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
            ${s.descripcion}
          </p>

          ${isStaff ? `
            <div style="background: rgba(99, 102, 241, 0.05); padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 1rem; border: 1px dashed rgba(99, 102, 241, 0.2);">
                <p style="font-size: 0.8rem; margin: 0; color: var(--text-primary);">
                    <strong>Solicitante:</strong> ${s.usuario_nombre}
                </p>
                <p style="font-size: 0.8rem; margin: 0; color: var(--text-secondary);">
                    <strong>Ubicación:</strong> Depto ${s.usuario_apartamento || 'N/A'}
                </p>
            </div>
          ` : ''}

          ${s.detalles ? renderDetalles(s.detalles) : ''}
          
          ${s.prioridad ? `
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">
              <strong>Prioridad:</strong> 
              <span class="badge badge-${getPrioridadColor(s.prioridad)}" style="font-size: 0.7rem;">
                ${s.prioridad}
              </span>
            </div>
          ` : ''}
          
          ${isStaff && s.estado !== 'completada' && s.estado !== 'rechazada' ? `
            <div class="flex gap-2 mt-3 pt-3" style="border-top: 1px solid rgba(0,0,0,0.05);">
                ${s.estado === 'pendiente' ? `
                    <button class="btn btn-sm btn-primary flex-1" onclick="actualizarEstado(${s.id}, 'en_proceso')">Atender</button>
                ` : ''}
                ${s.estado === 'en_proceso' ? `
                    <button class="btn btn-sm btn-success flex-1" onclick="actualizarEstado(${s.id}, 'completada')">Finalizar</button>
                ` : ''}
                <button class="btn btn-sm btn-ghost" style="color: var(--danger);" onclick="actualizarEstado(${s.id}, 'rechazada')">Rechazar</button>
            </div>
          ` : ''}
        </div>
      `).join('');

    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      document.getElementById('solicitudesList').innerHTML = `
        <div class="card" style="padding: 2rem; text-align: center; color: var(--danger);">
          <p>❌ Error al cargar solicitudes</p>
        </div>
      `;
    }
  }

  function renderDetalles(detalles) {
    if (typeof detalles === 'string') {
      try {
        detalles = JSON.parse(detalles);
      } catch {
        return '';
      }
    }

    const items = [];
    if (detalles.fecha) items.push(`📅 Fecha: ${detalles.fecha}`);
    if (detalles.hora) items.push(`🕐 Hora: ${detalles.hora}`);
    if (detalles.invitados) items.push(`👥 Invitados: ${detalles.invitados}`);
    if (detalles.area) items.push(`📍 Área: ${detalles.area}`);
    if (detalles.fecha_preferida) items.push(`📅 Fecha preferida: ${detalles.fecha_preferida}`);

    if (items.length === 0) return '';

    return `
      <div style="background: var(--bg-secondary); padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.75rem; margin-top: 0.75rem;">
        ${items.map(item => `<div style="margin-bottom: 0.25rem;">${item}</div>`).join('')}
      </div>
    `;
  }

  function getTipoIcon(tipo) {
    const icons = {
      medica: '🏥',
      limpieza: '🧹',
      entretenimiento: '🎉',
      mantenimiento: '🔧',
      general: '📋'
    };
    return icons[tipo] || '📋';
  }

  function getTipoNombre(tipo) {
    const nombres = {
      medica: 'Atención Médica',
      limpieza: 'Limpieza',
      entretenimiento: 'Entretenimiento',
      mantenimiento: 'Mantenimiento',
      general: 'General'
    };
    return nombres[tipo] || tipo;
  }

  function getEstadoColor(estado) {
    const colores = {
      pendiente: 'warning',
      en_proceso: 'info',
      completada: 'success',
      rechazada: 'danger'
    };
    return colores[estado] || 'info';
  }

  function getEstadoLabel(estado) {
    const labels = {
      pendiente: 'Pendiente',
      en_proceso: 'En Proceso',
      completada: 'Completada',
      rechazada: 'Rechazada'
    };
    return labels[estado] || estado;
  }

  function getPrioridadColor(prioridad) {
    const colores = {
      baja: 'info',
      media: 'warning',
      alta: 'danger'
    };
    return colores[prioridad] || 'info';
  }
}
