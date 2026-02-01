// =====================================================
// DASHBOARD GERENTE - Panel del gerente general
// =====================================================

export function renderDashboardGerente(container) {
    const user = window.appState.user;

    container.innerHTML = `
    <div class="page">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #7c3aed, #6366f1); padding: 2rem 1rem; margin-bottom: 1rem;">
        <div class="container">
          <h1 class="greeting">📊 Panel de Gerencia</h1>
          <p style="opacity: 0.9; font-size: 0.875rem; margin-top: 0.5rem;">
            Bienvenido, ${user.nombre}
          </p>
        </div>
      </div>

      <div class="container">
        <!-- Estadísticas generales -->
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="card text-center">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📋</div>
            <div style="font-size: 1.5rem; font-weight: 700;" id="totalSolicitudes">0</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Total Solicitudes</div>
          </div>
          <div class="card text-center">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏳</div>
            <div style="font-size: 1.5rem; font-weight: 700;" id="pendientes">0</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Pendientes</div>
          </div>
        </div>

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

    loadSolicitudes();

    // Filtros
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.onclick = () => {
            currentFilter = btn.dataset.filter;
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadSolicitudes(currentFilter);
        };
    });

    async function loadSolicitudes(filter = 'todas') {
        try {
            const response = await fetch(`${window.API_URL}/solicitudes`, {
                headers: { 'Authorization': `Bearer ${window.appState.token}` }
            });

            let solicitudes = await response.json();

            // Aplicar filtro
            if (filter !== 'todas') {
                solicitudes = solicitudes.filter(s => s.estado === filter);
            }

            // Actualizar estadísticas
            document.getElementById('totalSolicitudes').textContent = solicitudes.length;
            document.getElementById('pendientes').textContent = solicitudes.filter(s => s.estado === 'pendiente').length;

            const container = document.getElementById('solicitudesList');

            if (solicitudes.length === 0) {
                container.innerHTML = `
          <div class="card text-center" style="padding: 3rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📋</div>
            <p style="color: var(--text-muted);">No hay solicitudes</p>
          </div>
        `;
                return;
            }

            container.innerHTML = solicitudes.map(s => `
        <div class="card mb-3 fade-in">
          <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span style="font-size: 1.25rem;">${getTipoIcon(s.tipo)}</span>
                <h3 style="font-weight: 600; font-size: 1rem; margin: 0;">
                  ${getTipoNombre(s.tipo)}
                </h3>
              </div>
              <p style="font-size: 0.875rem; color: var(--text-muted);">
                👤 ${s.nombre_usuario} - Apto ${s.apartamento || 'N/A'}
              </p>
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

          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
            ${s.descripcion}
          </p>

          ${s.estado === 'en_proceso' && s.tipo === 'limpieza' ? `
            <div style="padding: 0.75rem; background: var(--bg-secondary); border-radius: var(--radius-md); font-size: 0.875rem;">
              🧹 <strong>Personal asignado:</strong> Equipo de limpieza
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
}
