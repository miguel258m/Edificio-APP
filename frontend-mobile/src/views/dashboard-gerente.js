// =====================================================
// DASHBOARD GERENTE - Panel del gerente general
// =====================================================

import { initAnnouncements, renderAnnouncementsWidget } from '../utils/announcements.js';

export function renderDashboardGerente(container) {
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
      <div style="background: linear-gradient(135deg, #7c3aed, #6366f1); padding: 2rem 1rem; margin-bottom: 1rem;">
        <div class="container">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; overflow: hidden; color: white;">
                ${user.foto_perfil ? `<img src="${getFotoUrl(user.foto_perfil)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src=''; this.parentElement.innerHTML='📊'">` : '📊'}
              </div>
              <div>
                <h1 class="greeting" style="margin: 0; font-size: 1.25rem;">${user.rol === 'admin' ? 'Administrador' : (user.rol.charAt(0).toUpperCase() + user.rol.slice(1))}</h1>
                <p style="opacity: 0.9; font-size: 0.875rem;">Bienvenido, ${user.nombre}</p>
              </div>
            </div>
            <button onclick="logout()" class="btn" style="padding: 0.5rem 1rem; color: white; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: var(--radius-md); font-size: 0.875rem;">
              🚪 Salir
            </button>
          </div>
        </div>
      </div>

      <div class="container">
        <!-- Emergencias Activas (Solo si existen) -->
        <div id="emergenciasAlert" class="hidden mb-4">
          <div style="background: rgba(239, 68, 68, 0.1); border: 2px solid var(--danger); border-radius: var(--radius-lg); padding: 1rem;">
            <div class="flex justify-between items-center mb-2">
              <h3 style="color: var(--danger); font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                🚨 EMERGENCIAS ACTIVAS
              </h3>
              <span class="badge badge-danger" id="emergenciasCount">0</span>
            </div>
            <div id="emergenciasList"></div>
          </div>
        </div>

        <!-- Grupo Principal de Acción (Avisos + Acciones Rápidas) -->
        <div class="grid grid-2 gap-3" style="margin-bottom: 2rem; align-items: stretch;">
          <div id="announcementsWidget"></div>

          <div class="card flex flex-col" style="background: var(--bg-secondary); margin: 0; justify-content: center;">
            <h3 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 1rem; color: var(--primary); text-transform: uppercase; letter-spacing: 0.05em;">Acciones</h3>
            <div class="flex flex-col gap-2">
              <button class="btn btn-primary" onclick="abrirNuevoAviso()" style="padding: 0.85rem; font-size: 0.85rem; white-space: nowrap;">
                📢 Publicar Aviso
              </button>
              <button class="btn btn-info" onclick="verResidentes()" style="padding: 0.85rem; font-size: 0.85rem; white-space: nowrap; background: #3b82f6;">
                👥 Residentes
              </button>
              <button class="btn btn-secondary" onclick="contactarVigilante()" style="padding: 0.85rem; font-size: 0.85rem; white-space: nowrap;">
                👮 Contactar Vigilante
              </button>
              <button class="btn btn-ghost" onclick="window.navigateTo('/perfil')" style="padding: 0.85rem; font-size: 0.85rem; border: 1px solid rgba(124, 58, 237, 0.1);">
                👤 Mi Perfil
              </button>
            </div>
          </div>
        </div>

        <!-- Estadísticas Operativas -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 2rem;">
          <div class="card text-center" style="padding: 1.25rem; background: var(--bg-secondary);">
            <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📋</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);" id="totalSolicitudes">0</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Total Reportes</div>
          </div>
          <div class="card text-center" style="padding: 1.25rem; background: var(--bg-secondary);">
            <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">⏳</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--warning);" id="pendientes">0</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Pendientes</div>
          </div>
        </div>

        <!-- Filtros -->
        <div class="mb-3">
          <div class="flex gap-2" style="overflow-x: auto; padding-bottom: 0.5rem;">
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

  // Inicializar sistema de avisos
  initAnnouncements(container);
  renderAnnouncementsWidget('announcementsWidget');

  // Cargar datos iniciales
  loadSolicitudes();
  loadEmergencias();

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
                👤 ${s.usuario_nombre} - Dpto ${s.usuario_apartamento || 'N/A'} ${s.usuario_telefono ? `| 📞 ${s.usuario_telefono}` : ''}
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

  async function loadMetricas() {
    try {
      const response = await fetch(`${window.API_URL}/solicitudes/metricas`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      const metricas = await response.json();

      const barsContainer = document.getElementById('metricasBars');
      if (metricas.length === 0) {
        barsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Sin datos de rendimiento</p>';
        return;
      }

      let totalInicios = 0;
      metricas.forEach(m => totalInicios += m.tiempo_inicio_minutos);
      const avgInicios = metricas.length > 0 ? Math.round(totalInicios / metricas.length) : 0;
      document.getElementById('avgResponseTime').textContent = `${avgInicios} min`;

      barsContainer.innerHTML = metricas.map(m => `
        <div>
          <div class="flex justify-between mb-1" style="font-size: 0.75rem;">
            <span>${getTipoIcon(m.tipo)} ${getTipoNombre(m.tipo)}</span>
            <span style="color: var(--text-muted);">${m.tiempo_inicio_minutos} min inicio / ${m.tiempo_resolucion_minutos} min resol.</span>
          </div>
          <div style="height: 6px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden; display: flex;">
            <div style="width: ${Math.min(100, m.tiempo_inicio_minutos)}%; background: var(--warning);"></div>
            <div style="width: ${Math.min(100, m.tiempo_resolucion_minutos)}%; background: var(--success);"></div>
          </div>
        </div>
      `).join('');

    } catch (e) { console.error(e); }
  }

  async function loadEmergencias() {
    try {
      const response = await fetch(`${window.API_URL}/emergencias/activas`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      const emergencies = await response.json();

      const alertBox = document.getElementById('emergenciasAlert');
      const list = document.getElementById('emergenciasList');
      const count = document.getElementById('emergenciasCount');

      if (emergencies.length > 0) {
        alertBox.classList.remove('hidden');
        count.textContent = emergencies.length;
        list.innerHTML = emergencies.map(e => `
          <div style="padding: 0.5rem; border-bottom: 1px solid rgba(239, 68, 68, 0.2); font-size: 0.875rem;">
            <strong>${e.tipo.toUpperCase()}</strong> - ${e.ubicacion}<br>
            <span style="color: var(--text-secondary); font-size: 0.75rem;">${e.usuario_nombre} (Dpto ${e.usuario_apartamento})</span>
          </div>
        `).join('');
      } else {
        alertBox.classList.add('hidden');
      }
    } catch (e) { console.error(e); }
  }

  // Función para contactar al vigilante
  window.contactarVigilante = async () => {
    try {
      const response = await fetch(`${window.API_URL}/usuarios/vigilantes`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      const vigilantes = await response.json();

      if (vigilantes.length === 0) {
        alert('⚠️ No hay vigilantes activos en este momento');
        return;
      }

      // Por ahora hablamos con el primero disponible
      const v = vigilantes[0];
      window.navigateTo('/chat', { userId: v.id, userName: v.nombre });
    } catch (error) {
      console.error('Error al contactar vigilante:', error);
      alert('❌ Error al conectar con el servicio de seguridad');
    }
  };



  window.abrirNuevoAviso = () => {
    let modal = document.getElementById('nuevoAvisoModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'nuevoAvisoModal';
      modal.className = 'modal-overlay';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;';
      modal.innerHTML = `
        <div class="card slide-up" style="max-width: 400px; width: 100%;">
          <h2 class="card-title">📢 Crear Nuevo Aviso</h2>
          <p class="mb-3" style="font-size: 0.875rem; color: var(--text-muted);">Este aviso será visible para todos los usuarios.</p>
          
          <div class="form-group">
            <label class="form-label">Título</label>
            <input type="text" id="avisoTitulo" class="form-input" placeholder="Ej: Corte de agua programado">
          </div>
          
          <div class="form-group">
            <label class="form-label">Mensaje</label>
            <textarea id="avisoMensaje" class="form-textarea" placeholder="Describe los detalles del aviso..."></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Prioridad</label>
            <select id="avisoTipo" class="form-select">
              <option value="informativa">ℹ️ Informativa</option>
              <option value="mantenimiento">🔧 Mantenimiento</option>
              <option value="emergencia">🚨 Crítica / Urgente</option>
            </select>
          </div>

          <div class="flex gap-2 mt-4">
            <button class="btn btn-ghost flex-1" onclick="document.getElementById('nuevoAvisoModal').remove()">Cancelar</button>
            <button class="btn btn-primary flex-1" onclick="guardarAviso()">Publicar Aviso</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
  };

  window.guardarAviso = async () => {
    const titulo = document.getElementById('avisoTitulo').value;
    const mensaje = document.getElementById('avisoMensaje').value;
    const tipo = document.getElementById('avisoTipo').value;

    if (!titulo || !mensaje) return alert('Por favor llena todos los campos');

    const btn = document.querySelector('#nuevoAvisoModal .btn-primary');
    const originalText = btn.textContent;
    btn.textContent = 'Publicando...';
    btn.disabled = true;

    try {
      const response = await fetch(`${window.API_URL}/alertas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${window.appState.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ titulo, mensaje, tipo })
      });

      if (response.ok) {
        document.getElementById('nuevoAvisoModal').remove();
        alert('✅ Aviso publicado correctamente');
        // Recargar el widget de avisos si existe
        if (typeof renderAnnouncementsWidget === 'function') {
          renderAnnouncementsWidget('announcementsWidget');
        }
      } else {
        const errorData = await response.json();
        alert(`❌ Error: ${errorData.error || 'No se pudo publicar el aviso'}`);
      }
    } catch (e) {
      console.error('Error al publicar aviso:', e);
      alert('❌ Error de conexión al publicar aviso');
    } finally {
      if (document.getElementById('nuevoAvisoModal')) {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    }
  };

  window.abrirChat = (userId, userName = 'Residente') => {
    window.navigateTo('/chat', { userId, userName });
  };



  window.verResidentes = async () => {
    let modal = document.getElementById('residentesModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'residentesModal';
      modal.className = 'modal-overlay';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;';
      modal.innerHTML = `
        <div class="card slide-up" style="max-width: 500px; width: 100%; max-height: 85vh; display: flex; flex-direction: column;">
          <div class="flex justify-between items-center mb-4">
            <h2 class="card-title" style="margin:0;">👥 Estado de Residentes</h2>
            <button onclick="document.getElementById('residentesModal').remove()" style="background:none; border:none; font-size:1.5rem; color:var(--text-muted); cursor:pointer;">×</button>
          </div>
          
          <div id="listaResidentesContent" style="flex: 1; overflow-y: auto; padding-right: 5px;">
            <div class="loading-spinner" style="margin: 2rem auto;"></div>
          </div>

          <div class="mt-4 pt-3" style="border-top: 1px solid var(--bg-tertiary);">
            <button class="btn btn-primary" style="width: 100%;" onclick="document.getElementById('residentesModal').remove()">Cerrar</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const content = document.getElementById('listaResidentesContent');

    try {
      const response = await fetch(`${window.API_URL}/pagos/estado-residentes`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      const residents = await response.json();

      if (residents.length === 0) {
        content.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No hay residentes registrados</p>';
        return;
      }

      content.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${residents.map(r => `
            <div style="padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; border: 1px solid ${r.esta_pagado ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};">
              <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 0.95rem;">${r.usuario_nombre}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">📍 Dpto ${r.usuario_apartamento || 'N/A'} | ${r.email}</div>
              </div>
              <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
                <span 
                  class="badge ${r.esta_pagado ? 'badge-success' : 'badge-danger'}" 
                  style="font-size: 0.7rem; padding: 0.4rem 0.8rem; border-radius: 20px; cursor: pointer; transition: transform 0.1s;"
                  onclick="togglePagoResidente(${r.id}, ${r.esta_pagado})"
                  onmouseover="this.style.transform='scale(1.05)'"
                  onmouseout="this.style.transform='scale(1)'"
                >
                  ${r.esta_pagado ? '✅ PAGADO' : '❌ NO PAGO'}
                </span>
                <p style="font-size: 0.65rem; color: var(--text-muted); margin: 0;">${new Date().toLocaleString('es-ES', { month: 'long' })}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } catch (error) {
      console.error('Error al cargar residentes:', error);
      content.innerHTML = '<p style="color: var(--danger); text-align: center; padding: 2rem;">❌ Error al cargar la lista</p>';
    }
  };

  window.togglePagoResidente = async (userId, currentlyPaid) => {
    try {
      const response = await fetch(`${window.API_URL}/pagos/toggle-estado`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${window.appState.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuario_id: userId,
          esta_pagado: !currentlyPaid
        })
      });

      if (response.ok) {
        // Recargar la lista para mostrar el cambio
        verResidentes();
      } else {
        alert('❌ Error al actualizar el estado de pago');
      }
    } catch (error) {
      console.error('Error al toggle pago:', error);
      alert('❌ Error de conexión al actualizar pago');
    }
  };

  function getTipoIcon(tipo) {
    const icons = { medica: '🏥', limpieza: '🧹', entretenimiento: '🎉', mantenimiento: '🔧', general: '📋' };
    return icons[tipo] || '📋';
  }

  function getTipoNombre(tipo) {
    const nombres = { medica: 'Médica', limpieza: 'Limpieza', entretenimiento: 'Entrega', mantenimiento: 'Mantenim.', general: 'General' };
    return nombres[tipo] || tipo;
  }

  function getEstadoColor(estado) {
    const colores = { pendiente: 'warning', en_proceso: 'info', completada: 'success', rechazada: 'danger' };
    return colores[estado] || 'info';
  }

  function getEstadoLabel(estado) {
    const labels = { pendiente: 'Pendiente', en_proceso: 'En Proceso', completada: 'Completada', rechazada: 'Rechazada' };
    return labels[estado] || estado;
  }
}

