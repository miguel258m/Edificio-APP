
export function renderDashboardMedico(container) {
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
      <div style="background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary)); padding: 3rem 0; border-bottom: 1px solid var(--glass-border); box-shadow: var(--shadow-md);">

        <div class="container">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <div style="width: 64px; height: 64px; border-radius: var(--radius-full); background: var(--glass-bg); border: 2px solid var(--glass-border); padding: 3px; box-shadow: var(--shadow-md);">
                <div style="width: 100%; height: 100%; border-radius: var(--radius-full); overflow: hidden; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-size: 1.75rem;">
                  ${user.foto_perfil ? `<img src="${getFotoUrl(user.foto_perfil)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src=''; this.parentElement.innerHTML='👨‍⚕️'">` : '👨‍⚕️'}
                </div>
              </div>
              <div>
                <p style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.7); margin-bottom: 0.25rem;">Servicio de Salud</p>
                <h1 style="font-size: 1.5rem; font-weight: 800; line-height: 1.1;">${user.nombre}</h1>
                <p style="font-size: 0.875rem; opacity: 0.8; margin-top: 0.25rem; font-weight: 500;">Médico de Guardia</p>
              </div>
            </div>
            <button onclick="logout()" class="btn btn-ghost" style="padding: 0.6rem; border-radius: var(--radius-md); background: rgba(255,255,255,0.05);">
               🚪
            </button>
          </div>
        </div>
      </div>

      <div class="container" style="position: relative; z-index: 10; padding-top: var(--spacing-lg);">
        <!-- Selector de Vista -->
        <div class="card" style="padding: 0.75rem; margin-bottom: 2rem; display: flex; gap: 0.75rem; background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--glass-border);">
          <button id="tabAlertas" class="btn btn-primary" style="flex: 1; font-size: 0.85rem;" onclick="switchMedicoView('alertas')">
            🏥 Alertas Activas
          </button>
          <button id="tabHistorial" class="btn btn-outline" style="flex: 1; font-size: 0.85rem;" onclick="switchMedicoView('historial')">
            📜 Mi Historial
          </button>
        </div>


        <!-- VISTA: ALERTAS ACTIVAS -->
        <div id="viewAlertas">
          <!-- Panel de Alertas Médicas -->
          <div class="card mt-3 fade-in" style="border: 2px solid var(--danger); background: rgba(244, 63, 94, 0.05);">

            <div class="flex justify-between items-center mb-3">
              <h2 class="card-title" style="margin: 0; color: #ef4444; display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem;">
                 <span>🚨 Emergencias Críticas</span>
              </h2>
              <span class="badge badge-danger" id="emergenciasCount">0</span>
            </div>
            <div id="emergenciasList">
              <div class="loading-spinner" style="margin: 2rem auto;"></div>
            </div>
          </div>

          <!-- Panel de Solicitudes Médicas -->
          <div class="card mt-3 fade-in" style="border: 1px solid var(--role-medico); background: rgba(34, 211, 238, 0.05);">

            <div class="flex justify-between items-center mb-3">
              <h2 class="card-title" style="margin: 0; color: #6366f1; display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem;">
                 <span>📋 Consultas y Pedidos</span>
              </h2>
              <span class="badge badge-info" id="solicitudesCount">0</span>
            </div>
            <div id="solicitudesList">
              <div class="loading-spinner" style="margin: 2rem auto;"></div>
            </div>
          </div>
        </div>

        <!-- VISTA: HISTORIAL PERSONAL -->
        <div id="viewHistorial" class="hidden">
          <div class="card mt-3 fade-in">
            <h2 class="card-title" style="color: var(--text-primary); font-size: 1.1rem; margin-bottom: 1rem;">
              ✅ Mis Atenciones Finalizadas
            </h2>
            <div id="historialList">
              <div class="loading-spinner" style="margin: 2rem auto;"></div>
            </div>
          </div>
        </div>
      </div>

      <div style="height: 100px;"></div>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <a href="#" class="nav-item active">
          <span class="nav-icon">🏠</span>
          <span>Alertas</span>
        </a>
        <a href="#" class="nav-item" onclick="window.navigateTo('/chats'); return false;">
          <span class="nav-icon">💬</span>
          <span>Mensajes</span>
        </a>
        <a href="#" class="nav-item" onclick="window.navigateTo('/perfil'); return false;">
          <span class="nav-icon">👤</span>
          <span>Mi Perfil</span>
        </a>
      </nav>
    </div>
  `;

  // Cargar datos iniciales
  loadEmergenciasMedicas();
  loadSolicitudesMedicas();

  // Socket listeners
  if (window.appState.socket) {
    window.appState.socket.off('nueva_emergencia');
    window.appState.socket.on('nueva_emergencia', (emergencia) => {
      if (emergencia.tipo === 'medica') {
        loadEmergenciasMedicas();
        try { new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play(); } catch (e) { }
      }
    });

    window.appState.socket.off('emergencia_actualizada');
    window.appState.socket.on('emergencia_actualizada', () => {
      loadEmergenciasMedicas();
    });

    window.appState.socket.off('nueva_solicitud');
    window.appState.socket.on('nueva_solicitud', (solicitud) => {
      if (solicitud.tipo === 'medica') loadSolicitudesMedicas();
    });
  }
}

window.switchMedicoView = (view) => {
  const viewAlertas = document.getElementById('viewAlertas');
  const viewHistorial = document.getElementById('viewHistorial');
  const tabAlertas = document.getElementById('tabAlertas');
  const tabHistorial = document.getElementById('tabHistorial');

  if (view === 'alertas') {
    viewAlertas.classList.remove('hidden');
    viewHistorial.classList.add('hidden');
    tabAlertas.className = 'btn btn-primary';
    tabHistorial.className = 'btn btn-outline';
    loadEmergenciasMedicas();
    loadSolicitudesMedicas();
  } else {
    viewAlertas.classList.add('hidden');
    viewHistorial.classList.remove('hidden');
    tabAlertas.className = 'btn btn-outline';
    tabHistorial.className = 'btn btn-primary';
    loadHistorialPersonal();
  }
};

async function loadHistorialPersonal() {
  const container = document.getElementById('historialList');
  if (!container) return;

  container.innerHTML = '<div class="loading-spinner" style="margin: 2rem auto;"></div>';

  try {
    // Cargar emergencias y solicitudes en paralelo
    const [resEmergencias, resSolicitudes] = await Promise.all([
      fetch(`${window.API_URL}/emergencias/medico/historial`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      }),
      fetch(`${window.API_URL}/solicitudes/medico/historial`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      })
    ]);

    const emergencias = await resEmergencias.json();
    const solicitudes = await resSolicitudes.json();

    // Combinar y ordenar por fecha (más reciente primero)
    const historial = [
      ...emergencias.map(e => ({ ...e, _tipoItem: 'emergencia' })),
      ...solicitudes.map(s => ({ ...s, _tipoItem: 'solicitud' }))
    ].sort((a, b) => {
      const dateA = new Date(a.created_at || a.fecha_solicitud);
      const dateB = new Date(b.created_at || b.fecha_solicitud);
      return dateB - dateA;
    });

    if (historial.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📑</div>
          <p>Aún no has finalizado ninguna atención médica.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = historial.map(item => `
      <div style="padding: 1rem; border-bottom: 1px solid #eee; margin-bottom: 0.5rem; animation: slideIn 0.3s ease-out;">
        <div class="flex justify-between items-start mb-1">
          <span class="badge ${item._tipoItem === 'emergencia' ? 'badge-danger' : 'badge-info'}" style="font-size: 0.6rem;">
            ${item._tipoItem === 'emergencia' ? '🚨 EMERGENCIA' : '🩺 CONSULTA'}
          </span>
          <span style="font-size: 0.7rem; color: var(--text-muted);">
            ${new Date(item.created_at || item.fecha_solicitud).toLocaleDateString()}
          </span>
        </div>
        <p style="font-weight: 600; font-size: 0.9rem; margin: 0.25rem 0;">${item.usuario_nombre}</p>
        <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">${item.descripcion}</p>
        <div style="margin-top: 0.5rem; font-size: 0.7rem; color: var(--success); font-weight: 600;">
          ✅ COMPLETADA
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error al cargar historial:', error);
    container.innerHTML = '<p style="color: var(--danger); text-align: center; padding: 1rem;">Error al cargar el historial</p>';
  }
}

async function loadEmergenciasMedicas() {
  const user = window.appState.user;
  try {
    const response = await fetch(`${window.API_URL}/emergencias/activas`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });

    const emergencias = await response.json();
    const container = document.getElementById('emergenciasList');
    const count = document.getElementById('emergenciasCount');
    if (!container) return;

    const emergenciasMedicas = Array.isArray(emergencias) ? emergencias.filter(e => e.tipo === 'medica') : [];
    count.textContent = emergenciasMedicas.length;

    if (emergenciasMedicas.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 1.5rem; color: var(--text-muted);">
           <p style="font-size: 0.875rem;">No hay emergencias pendientes.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = emergenciasMedicas.map(e => {
      const isAttending = e.estado === 'atendida';
      const isMine = e.atendido_por === user.id;

      return `
          <div style="padding: 1.1rem; background: ${isAttending ? '#f8fafc' : 'rgba(239, 68, 68, 0.05)'}; border: 1.5px solid ${isAttending ? '#cbd5e1' : '#ef4444'}; border-radius: var(--radius-lg); margin-bottom: 0.75rem;">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 style="font-weight: 700; color: ${isAttending ? '#64748b' : '#b91c1c'}; margin: 0; font-size: 0.95rem;">
                   ${isAttending ? '🩺 EN ATENCIÓN' : '🚨 EMERGENCIA NUEVA'}
                </h3>
                <p style="font-size: 0.7rem; color: var(--text-muted);">${new Date(e.created_at).toLocaleTimeString()}</p>
              </div>
              <span class="badge badge-${isAttending ? 'info' : 'danger'}" style="font-size: 0.65rem;">
                ${isAttending ? 'PROCESO' : 'PENDIENTE'}
              </span>
            </div>
            
            <div style="margin: 0.75rem 0;">
                <p style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.15rem;">${e.usuario_nombre}</p>
                <p style="font-size: 0.8rem; color: var(--text-secondary);">📍 Dpto ${e.usuario_apartamento} | ${e.ubicacion}</p>
            </div>

            ${isAttending ? `
                <div style="font-size: 0.75rem; color: #6366f1; margin: 0.5rem 0; font-weight: 600; padding: 0.4rem; background: #f0f1ff; border-radius: 4px; display: inline-block;">
                   👨‍⚕️ Atendido por: ${isMine ? 'Ti (Ahora)' : e.medico_nombre}
                </div>
            ` : ''}
            
            <div class="grid ${isMine || !isAttending ? 'grid-2' : ''} gap-2 mt-3">
              ${!isAttending ? `
                  <button class="btn btn-danger btn-sm" style="width: 100%;" onclick="tomarEmergencia(${e.id})">🚑 Tomar Alerta</button>
              ` : ''}

              ${isMine ? `
                  <button class="btn btn-primary btn-sm" onclick="abrirChat(${e.usuario_id}, '${e.usuario_nombre}')">💬 Chat</button>
                  <button class="btn btn-success btn-sm" onclick="resolverEmergencia(${e.id})">✅ Finalizar</button>
              ` : ''}

              ${isAttending && !isMine ? `
                  <p style="font-size: 0.75rem; color: var(--text-muted); text-align: center; width: 100%;">En atención...</p>
              ` : ''}
            </div>
          </div>
        `;
    }).join('');
  } catch (error) {
    console.error('Error loadEmergenciasMedicas:', error);
  }
}

async function loadSolicitudesMedicas() {
  try {
    const response = await fetch(`${window.API_URL}/solicitudes?tipo=medica`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });

    const solicitudes = await response.json();
    const container = document.getElementById('solicitudesList');
    const count = document.getElementById('solicitudesCount');
    if (!container) return;

    // Filtrar las que no están completadas ni rechazadas
    const pendientes = Array.isArray(solicitudes) ? solicitudes.filter(s => s.estado === 'pendiente' || s.estado === 'en_proceso') : [];
    count.textContent = pendientes.length;

    if (pendientes.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 1.5rem; color: var(--text-muted);"><p style="font-size: 0.875rem;">No hay solicitudes médicas.</p></div>`;
      return;
    }

    container.innerHTML = pendientes.map(s => `
      <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: var(--radius-md); margin-bottom: 0.75rem; background: #fff;">
        <div class="flex justify-between items-start mb-2">
          <h3 style="font-weight: 600; color: #6366f1; margin: 0; font-size: 0.9rem;">🩺 Consulta</h3>
          <span class="badge badge-${s.estado === 'pendiente' ? 'warning' : 'info'}" style="font-size: 0.6rem;">${s.estado === 'pendiente' ? 'NUEVA' : 'ATENDIENDO'}</span>
        </div>
        
        <p style="font-size: 0.85rem; margin-bottom: 0.5rem; color: var(--text-primary);"><strong>${s.usuario_nombre}</strong> (Dpto ${s.usuario_apartamento})</p>
        <p style="font-size: 0.8rem; line-height: 1.4; color: var(--text-secondary);">${s.descripcion}</p>
        
        <div class="grid grid-2 gap-2 mt-3">
          <button class="btn btn-primary btn-sm" onclick="abrirChat(${s.usuario_id}, '${s.usuario_nombre}')">💬 Chat</button>
          <button class="btn btn-${s.estado === 'pendiente' ? 'outline' : 'success'} btn-sm" 
            onclick="actualizarSolicitudMedica(${s.id}, '${s.estado === 'pendiente' ? 'en_proceso' : 'completada'}')">
            ${s.estado === 'pendiente' ? '🩺 Iniciar' : '✅ Finalizar'}
          </button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loadSolicitudesMedicas:', error);
  }
}

window.tomarEmergencia = async (id) => {
  try {
    const response = await fetch(`${window.API_URL}/emergencias/${id}/atender`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    if (response.ok) {
      if (window.appState.socket) window.appState.socket.emit('actualizar_emergencia', { id });
      loadEmergenciasMedicas();
    }
  } catch (error) { console.error(error); }
};

window.resolverEmergencia = async (id) => {
  if (confirm('¿Deseas dar por finalizada esta atención médica?')) {
    try {
      const response = await fetch(`${window.API_URL}/emergencias/${id}/resolver`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      if (response.ok) {
        if (window.appState.socket) window.appState.socket.emit('actualizar_emergencia', { id });
        loadEmergenciasMedicas();
      }
    } catch (error) { console.error(error); }
  }
};

window.actualizarSolicitudMedica = async (id, estado) => {
  try {
    const response = await fetch(`${window.API_URL}/solicitudes/${id}/estado`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${window.appState.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado })
    });
    if (response.ok) loadSolicitudesMedicas();
  } catch (error) { console.error(error); }
};

window.abrirChat = (userId, userName = 'Residente') => {
  window.navigateTo('/chat', { userId, userName });
};
