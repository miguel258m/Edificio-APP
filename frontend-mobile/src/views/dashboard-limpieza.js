// =====================================================
// DASHBOARD LIMPIEZA - Panel del personal de limpieza
// =====================================================

import { renderAnnouncementsWidget } from '../utils/announcements.js';

export function renderDashboardLimpieza(container) {
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
      <!-- Header Premium -->
      <div style="background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary)); padding: 3rem 0; border-bottom: 1px solid var(--glass-border); box-shadow: var(--shadow-md);">

        <div class="container">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <div style="width: 64px; height: 64px; border-radius: var(--radius-full); background: var(--glass-bg); border: 2px solid var(--glass-border); padding: 3px; box-shadow: var(--shadow-md);">
                <div style="width: 100%; height: 100%; border-radius: var(--radius-full); overflow: hidden; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-size: 1.75rem;">
                  ${user.foto_perfil ? `<img src="${getFotoUrl(user.foto_perfil)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src=''; this.parentElement.innerHTML='🧹'">` : '🧹'}
                </div>
              </div>
              <div>
                <p style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.7); margin-bottom: 0.25rem;">Servicio de Mantenimiento</p>
                <h1 style="font-size: 1.5rem; font-weight: 800; line-height: 1.1;">${user.nombre}</h1>
                <p style="font-size: 0.875rem; opacity: 0.8; margin-top: 0.25rem; font-weight: 500;">Oficial de Limpieza</p>
              </div>
            </div>
            <button onclick="logout()" class="btn btn-ghost" style="padding: 0.6rem; border-radius: var(--radius-md); background: rgba(255,255,255,0.05);">
               🚪
            </button>
          </div>
        </div>
      </div>

      <div class="container" style="position: relative; z-index: 10; padding-top: var(--spacing-lg);">

        <div class="grid grid-2 gap-3" style="margin-top: 2rem; align-items: stretch; margin-bottom: 2.5rem;">
          <!-- Avisos Importantes Visibles -->
          <div id="announcementsWidget"></div>

          <!-- Acciones Rápidas -->
          <div class="card flex flex-col" style="background: var(--bg-secondary); margin: 0; justify-content: center; border-left: 4px solid var(--role-limpieza);">
            <h3 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 1.25rem; color: var(--primary-light); text-transform: uppercase; letter-spacing: 0.05em;">Estado</h3>

            <div class="flex flex-col gap-2">
              <button class="btn btn-primary" onclick="window.navigateTo('/perfil')" style="padding: 1rem; font-size: 0.85rem;">
                👤 Mi Perfil
              </button>
              <p style="font-size: 0.7rem; color: var(--text-muted); text-align: center;">
                Gestiona tus datos
              </p>
            </div>
          </div>
        </div>

        <!-- Filtros de estado -->
        <div class="card mb-3">
          <div class="flex gap-2" style="overflow-x: auto;">
            <button class="btn btn-sm filter-btn active" data-filter="todas">Todas</button>
            <button class="btn btn-sm filter-btn" data-filter="pendiente">Pendientes</button>
            <button class="btn btn-sm filter-btn" data-filter="en_proceso">En Proceso</button>
            <button class="btn btn-sm filter-btn" data-filter="completada">Completadas</button>
          </div>
        </div>

        <!-- Lista de tareas -->
        <div id="tareasLimpiezaList">
          <div class="loading-spinner" style="margin: 2rem auto;"></div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <a href="#" class="nav-item active">
          <span class="nav-icon">🏠</span>
          <span>Inicio</span>
        </a>
        <a href="#" class="nav-item" onclick="window.navigateTo('/perfil'); return false;">
          <span class="nav-icon">👤</span>
          <span>Perfil</span>
        </a>
      </nav>
    </div>
  `;

  let currentFilter = 'todas';

  // Cargar tareas
  loadTareas();

  // Inicializar avisos
  if (typeof renderAnnouncementsWidget === 'function') {
    renderAnnouncementsWidget('announcementsWidget');
  }

  // Filtros
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.onclick = () => {
      currentFilter = btn.dataset.filter;
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadTareas(currentFilter);
    };
  });

  async function loadTareas(filter = 'todas') {
    try {
      const response = await fetch(`${window.API_URL}/solicitudes`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });

      let solicitudes = await response.json();

      // Filtrar solo limpieza
      solicitudes = solicitudes.filter(s => s.tipo === 'limpieza');

      // Aplicar filtro de estado
      if (filter !== 'todas') {
        solicitudes = solicitudes.filter(s => s.estado === filter);
      }

      const container = document.getElementById('tareasLimpiezaList');

      if (solicitudes.length === 0) {
        container.innerHTML = `
          <div class="card text-center" style="padding: 3rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🧹</div>
            <p style="color: var(--text-muted);">No hay tareas de limpieza</p>
          </div>
        `;
        return;
      }

      container.innerHTML = solicitudes.map(s => {
        // Parsear detalles si vienen como string
        let detalles = s.detalles;
        if (typeof detalles === 'string') {
          try { detalles = JSON.parse(detalles); } catch (e) { detalles = {}; }
        }

        return `
        <div class="card mb-3 fade-in">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 style="font-weight: 600; font-size: 1.125rem; margin-bottom: 0.5rem;">
                🧹 ${detalles?.area === 'apartamento' || !detalles?.area
            ? `Limpieza - Dpto ${s.usuario_apartamento || 'N/A'}`
            : `Limpieza - ${getAreaLabel(detalles.area)}`}
              </h3>
              <p style="font-size: 0.875rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                👤 <strong>${s.usuario_nombre}</strong> ${detalles?.area && detalles.area !== 'apartamento' ? `(Dpto ${s.usuario_apartamento})` : ''}
              </p>
              ${s.usuario_telefono ? `
                <p style="font-size: 0.875rem; margin-bottom: 0.25rem;">
                  <a href="tel:${s.usuario_telefono}" style="color: var(--primary); text-decoration: none; display: flex; align-items: center; gap: 0.5rem;">
                    📞 ${s.usuario_telefono}
                  </a>
                </p>
              ` : ''}
              <p style="font-size: 0.75rem; color: var(--text-muted);">
                📅 ${new Date(s.fecha_solicitud).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
              </p>
            </div>
            <span class="badge badge-${getEstadoColor(s.estado)}">${getEstadoLabel(s.estado)}</span>
          </div>

          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.5;">
            ${s.descripcion}
          </p>

          <!-- Botones de acción -->
          <div class="flex gap-2">
            ${s.estado === 'pendiente' ? `
              <button 
                onclick="cambiarEstado(${s.id}, 'en_proceso')" 
                class="btn btn-primary btn-sm flex-1"
              >
                ▶️ Iniciar Tarea
              </button>
            ` : ''}
            
            ${s.estado === 'en_proceso' ? `
              <button 
                onclick="cambiarEstado(${s.id}, 'completada')" 
                class="btn btn-success btn-sm flex-1"
              >
                ✅ Marcar Completada
              </button>
            ` : ''}

            ${s.estado === 'completada' ? `
              <div style="text-align: center; width: 100%; padding: 0.5rem; color: var(--success);">
                ✅ Tarea completada
              </div>
            ` : ''}
          </div>
        </div>
      `;
      }).join('');

    } catch (error) {
      console.error('Error al cargar tareas:', error);
      document.getElementById('tareasLimpiezaList').innerHTML = `
        <div class="card" style="padding: 2rem; text-align: center; color: var(--danger);">
          <p>❌ Error al cargar tareas</p>
        </div>
      `;
    }
  }

  // Función global para cambiar estado
  window.cambiarEstado = async (solicitudId, nuevoEstado) => {
    try {
      const response = await fetch(`${window.API_URL}/solicitudes/${solicitudId}/estado`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${window.appState.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) throw new Error('Error al actualizar estado');

      // Recargar lista
      loadTareas(currentFilter);

      // Notificación
      const mensaje = nuevoEstado === 'en_proceso' ? '▶️ Tarea iniciada' : '✅ Tarea completada';
      showToast(mensaje);

    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al actualizar estado');
    }
  };

  function showToast(mensaje) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--success); color: white; padding: 1rem 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); z-index: 9999; animation: slideInRight 0.3s ease;';
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  function getEstadoColor(estado) {
    const colores = {
      pendiente: 'warning',
      en_proceso: 'info',
      completada: 'success'
    };
    return colores[estado] || 'info';
  }

  function getEstadoLabel(estado) {
    const labels = {
      pendiente: 'Pendiente',
      en_proceso: 'En Proceso',
      completada: 'Completada'
    };
    return labels[estado] || estado;
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
}
