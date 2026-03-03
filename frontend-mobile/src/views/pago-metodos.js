// =====================================================
// PAGO METODOS VIEW - Ver métodos de pago configurados
// =====================================================
import { renderSidebarLayout } from '../utils/sidebar-layout.js';

export function renderPagoMetodos(container) {
    const user = window.appState.user;

    const navItems = [
        { key: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/dashboard-residente' },
        { key: 'chat', icon: '💬', label: 'Chat', path: '/chats' },
        { key: 'medica', icon: '🏥', label: 'Atención Médica', onClick: "window.navigateTo('/solicitudes',{tipo:'medica'})" },
        { key: 'limpieza', icon: '🧹', label: 'Limpieza', onClick: "window.navigateTo('/solicitudes',{tipo:'limpieza'})" },
        { key: 'eventos', icon: '🎉', label: 'Eventos', onClick: "window.navigateTo('/solicitudes',{tipo:'entretenimiento'})" },
        { key: 'solicitudes', icon: '📋', label: 'Mis Solicitudes', path: '/solicitudes' },
        { key: 'perfil', icon: '⚙️', label: 'Perfil', path: '/perfil' },
    ];

    const main = renderSidebarLayout(container, {
        role: 'residente',
        activeNav: 'pagos',
        pageTitle: '💳 Métodos de Pago',
        pageSubtitle: 'Información para realizar tus pagos de mantenimiento',
        breadcrumb: 'Métodos de Pago',
        navItems,
    });

    main.innerHTML = `
        <div class="ds-card" style="margin-bottom: 20px;">
            <div class="ds-card-header">
                <p class="ds-card-title">Cuentas y Métodos Disponibles</p>
            </div>
            <div id="metodosList" class="ds-grid-2" style="gap: 16px; padding: 10px 0;">
                <div class="loading-spinner" style="grid-column: 1/-1; margin: 2rem auto;"></div>
            </div>
        </div>

        <div style="background: rgba(88, 166, 255, 0.05); border: 1px dashed rgba(88, 166, 255, 0.2); border-radius: 12px; padding: 20px; text-align: center;">
            <p style="font-size: 0.85rem; color: #7d8590; margin: 0;">
                <strong style="color: #58a6ff;">💡 Nota:</strong> Una vez realizado tu pago, por favor repórtalo a la administración enviando una captura del comprobante por el chat o entregándolo físicamente.
            </p>
        </div>
    `;

    loadMetodos();

    async function loadMetodos() {
        try {
            const response = await fetch(`${window.API_URL}/pagos/metodos?solo_activos=true`, {
                headers: { 'Authorization': `Bearer ${window.appState.token}` }
            });
            const metodos = await response.json();
            const listEl = document.getElementById('metodosList');

            if (metodos.length === 0) {
                listEl.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--sb-muted);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">💳</div>
                        <p>No hay métodos de pago configurados aún.</p>
                        <p style="font-size: 0.75rem;">Por favor consulta con la administración.</p>
                    </div>
                `;
                return;
            }

            listEl.innerHTML = metodos.map(m => {
                let d = m.detalles || {};
                if (typeof d === 'string') {
                    try { d = JSON.parse(d); } catch (e) { d = {}; }
                }

                // Formatear detalles según el tipo
                const t = m.tipo.toLowerCase();
                if (t.includes('yape') || t.includes('plin')) {
                    detalleHtml = `
                        <p style="margin: 4px 0;"><strong>Número:</strong> ${d.telefono || d.numero || 'N/A'}</p>
                        <p style="margin: 4px 0;"><strong>A nombre de:</strong> ${d.nombre || d.titular || 'N/A'}</p>
                    `;
                } else if (t.includes('bcp') || t.includes('interbank') || t.includes('bbva') || t.includes('scotiabank') || t.includes('banco')) {
                    detalleHtml = `
                        <p style="margin: 4px 0;"><strong>Banco:</strong> ${d.banco || m.tipo}</p>
                        <p style="margin: 4px 0;"><strong>Cuenta:</strong> ${d.cuenta || 'N/A'}</p>
                        <p style="margin: 4px 0;"><strong>CCI:</strong> ${d.cci || 'N/A'}</p>
                        <p style="margin: 4px 0;"><strong>Titular:</strong> ${d.nombre || d.titular || 'N/A'}</p>
                    `;
                } else {
                    // Otros
                    detalleHtml = `
                        <p style="margin: 4px 0;"><strong>Detalles:</strong> ${d.instrucciones || d.detalle || 'N/A'}</p>
                        ${d.nombre ? `<p style="margin: 4px 0;"><strong>A nombre de:</strong> ${d.nombre}</p>` : ''}
                    `;
                }

                return `
                    <div class="ds-card" style="margin: 0; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); transition: transform 0.2s;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                            <span style="font-size: 1.25rem;">${getIcon(m.tipo)}</span>
                            <span style="font-weight: 700; color: #e6edf3; font-size: 0.9rem;">${m.tipo}</span>
                        </div>
                        <div style="font-size: 0.8rem; color: #7d8590; line-height: 1.6;">
                            ${detalleHtml}
                        </div>
                    </div>
                `;
            }).join('');

        } catch (error) {
            console.error('Error al cargar métodos:', error);
            document.getElementById('metodosList').innerHTML = '<p style="color:#f87171; text-align:center; grid-column: 1/-1; padding: 2rem;">❌ Error al cargar métodos</p>';
        }
    }

    function getIcon(tipo) {
        const t = tipo.toLowerCase();
        if (t.includes('yape')) return '🟣';
        if (t.includes('plin')) return '🟢';
        if (t.includes('bcp') || t.includes('banco') || t.includes('interbank')) return '🏦';
        if (t.includes('efectivo')) return '💵';
        return '💳';
    }
}
