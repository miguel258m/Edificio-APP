// =====================================================
// ANNOUNCEMENTS UTILITY - Sistema de Avisos Importantes
// =====================================================

export async function initAnnouncements(container) {
    // Mantener compatibilidad pero redireccionar a la nueva vista si es necesario
    updateAvisosBadge();
}

export async function renderAnnouncementsWidget(targetElementId) {
    const container = document.getElementById(targetElementId);
    if (!container) return;

    container.innerHTML = `
        <div class="card mb-0 fade-in" style="background: var(--bg-secondary); border: 1px solid rgba(99, 102, 241, 0.1); width: 100%; box-shadow: var(--shadow-sm); height: 100%; display: flex; flex-direction: column;">
            <div class="flex justify-between items-center mb-3">
                <h3 style="font-size: 0.9rem; font-weight: 700; color: var(--primary); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                   <span style="font-size: 1.1rem;">📢</span> Avisos
                </h3>
                <button class="btn btn-ghost btn-sm" onclick="toggleAvisosModal()" style="font-size: 0.7rem; color: var(--primary); font-weight: 600; padding: 0.2rem 0.5rem;">Ver todos</button>
            </div>
            <div id="announcementsWidgetContent" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem;">
                <div class="loading-spinner" style="margin: 1rem auto; width: 25px; height: 25px;"></div>
            </div>
        </div>
    `;

    try {
        const response = await fetch(`${window.API_URL}/alertas?limit=5`, {
            headers: { 'Authorization': `Bearer ${window.appState.token}` }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const widgetContent = document.getElementById('announcementsWidgetContent');

        // Validar que la respuesta sea un array
        const avisos = Array.isArray(data) ? data : [];

        if (avisos.length === 0) {
            widgetContent.innerHTML = `<p style="font-size: 0.875rem; color: var(--text-muted); padding: 1rem; width: 100%; text-align: center;">No hay avisos hoy</p>`;
            return;
        }

        widgetContent.innerHTML = avisos.map(a => `
            <div style="background: var(--bg-primary); padding: 1rem; border-radius: var(--radius-md); border-left: 4px solid ${getAlertaColor(a.tipo)}; box-shadow: var(--shadow-sm); margin-bottom: 0.5rem;">
                <div class="flex justify-between items-start mb-1">
                    <span style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); line-height: 1.2;">${a.titulo}</span>
                    <span style="font-size: 0.65rem; color: var(--text-muted); white-space: nowrap; margin-left: 0.5rem;">${new Date(a.created_at).toLocaleDateString()}</span>
                </div>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${a.mensaje}
                </p>
            </div>
        `).join('');

    } catch (error) {
        console.error('❌ Error en renderAnnouncementsWidget:', error);
        const widgetContent = document.getElementById('announcementsWidgetContent');
        if (widgetContent) {
            widgetContent.innerHTML = `<p style="font-size: 0.8rem; color: var(--danger); text-align: center; padding: 1rem;">Error al cargar</p>`;
        }
    }
}

window.toggleAvisosModal = toggleAvisosModal;

async function toggleAvisosModal() {
    let modal = document.getElementById('avisosModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'avisosModal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;';
        modal.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); };

        modal.innerHTML = `
      <div class="card slide-up" style="max-width: 500px; width: 100%; max-height: 80vh; overflow-y: auto;">
        <div class="flex justify-between items-center mb-4">
          <h2 style="font-size: 1.25rem; font-weight: 700;">📢 Avisos Importantes</h2>
          <button onclick="document.getElementById('avisosModal').classList.add('hidden')" class="btn btn-ghost" style="padding: 0.5rem;">✕</button>
        </div>
        <div id="avisosListContent">
          <div class="loading-spinner" style="margin: 2rem auto;"></div>
        </div>
      </div>
    `;
        document.body.appendChild(modal);
    }

    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        loadAvisosList();
    } else {
        modal.classList.add('hidden');
    }
}

async function loadAvisosList() {
    const container = document.getElementById('avisosListContent');
    try {
        const response = await fetch(`${window.API_URL}/alertas`, {
            headers: { 'Authorization': `Bearer ${window.appState.token}` }
        });
        const avisos = await response.json();

        if (avisos.length === 0) {
            container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No hay avisos recientes</p>`;
            return;
        }

        container.innerHTML = avisos.map(a => `
      <div style="padding: 1rem; border-left: 4px solid ${getAlertaColor(a.tipo)}; background: var(--bg-secondary); border-radius: 0 var(--radius-md) var(--radius-md) 0; margin-bottom: 1rem;">
        <div class="flex justify-between items-start mb-1">
          <h4 style="font-weight: 600; color: var(--text-primary);">${a.titulo}</h4>
          <span style="font-size: 0.7rem; color: var(--text-muted);">${new Date(a.created_at).toLocaleDateString()}</span>
        </div>
        <p style="font-size: 0.875rem; color: var(--text-secondary);">${a.mensaje}</p>
        <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.5rem;">Por: ${a.creada_por_nombre}</p>
      </div>
    `).join('');

    } catch (error) {
        container.innerHTML = `<p style="color: var(--danger);">Error al cargar avisos</p>`;
    }
}

async function updateAvisosBadge() {
    try {
        const response = await fetch(`${window.API_URL}/alertas?limit=5`, {
            headers: { 'Authorization': `Bearer ${window.appState.token}` }
        });
        const avisos = await response.json();
        const badge = document.getElementById('avisosBadge');
        if (badge) {
            if (avisos.length > 0) {
                badge.textContent = avisos.length;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    } catch (e) { }
}

function getAlertaColor(tipo) {
    const colors = {
        informativa: '#3b82f6',
        mantenimiento: '#f59e0b',
        emergencia: '#ef4444',
        // Fallbacks para tipos antiguos
        informativo: '#3b82f6',
        importante: '#f59e0b',
        critico: '#ef4444'
    };
    return colors[tipo] || '#10b981';
}
