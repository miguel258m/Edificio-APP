// =====================================================
// DASHBOARD LIMPIEZA - Panel del personal de limpieza
// =====================================================

export function renderDashboardLimpieza(container) {
    const user = window.appState.user;

    container.innerHTML = `
    <div class="page">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 2rem 1rem; margin-bottom: 1rem;">
        <div class="container">
          <h1 class="greeting">🧹 Panel de Limpieza</h1>
          <p style="opacity: 0.9; font-size: 0.875rem; margin-top: 0.5rem;">
            Bienvenido, ${user.nombre}
          </p>
        </div>
      </div>

      <div class="container">
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
        <a href="#" class="nav-item" onclick="showPerfil(); return false;">
          <span class="nav-icon">👤</span>
          <span>Perfil</span>
        </a>
      </nav>
    </div>
  `;

    let currentFilter = 'todas';

    // Cargar tareas
    loadTareas();

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

            container.innerHTML = solicitudes.map(s => `
        <div class="card mb-3 fade-in">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 style="font-weight: 600; font-size: 1.125rem; margin-bottom: 0.5rem;">
                🧹 Limpieza - Apto ${s.apartamento || 'N/A'}
              </h3>
              <p style="font-size: 0.875rem; color: var(--text-muted);">
                👤 ${s.nombre_usuario}
              </p>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
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
      `).join('');

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
}
