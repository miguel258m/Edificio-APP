// =====================================================
// DASHBOARD ADMINISTRADOR - Vista principal para administradores
// =====================================================

import { renderAnnouncementsWidget } from '../utils/announcements.js';

export function renderDashboardAdmin(container) {
  const user = window.appState.user;
  const baseUrl = window.API_URL.replace('/api', '');

  const getFotoUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
  };

  container.innerHTML = `
    <div class="page" style="background: #0a0f1e; min-height: 100vh;">

      <!-- ===== HEADER ===== -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1a1f35 100%); padding: 2rem 0 1.75rem; border-bottom: 1px solid rgba(255,255,255,0.07); position: relative; overflow: hidden;">
        <div style="position:absolute;top:-60px;right:-60px;width:240px;height:240px;background:radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%);border-radius:50%;"></div>
        <div style="position:absolute;bottom:-40px;left:-40px;width:180px;height:180px;background:radial-gradient(circle,rgba(245,158,11,0.08) 0%,transparent 70%);border-radius:50%;"></div>
        <div class="container">
          <div class="flex justify-between items-center">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:46px;height:46px;min-width:46px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#a855f7);padding:2px;box-shadow:0 0 18px rgba(99,102,241,0.45);">
                <div style="width:100%;height:100%;border-radius:50%;overflow:hidden;background:#1e293b;display:flex;align-items:center;justify-content:center;font-size:1.1rem;">
                  ${user.foto_perfil ? `<img src="${getFotoUrl(user.foto_perfil)}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='';this.parentElement.innerHTML='👑'">` : '👑'}
                </div>
              </div>
              <div style="line-height:1.3;">
                <p style="font-size:0.58rem;font-weight:900;text-transform:uppercase;letter-spacing:0.18em;color:#a5b4fc;margin:0 0 1px;">Panel de Control</p>
                <h1 style="font-size:1.1rem;font-weight:900;color:#f8fafc;margin:0;">${user.nombre}</h1>
                <div style="display:flex;align-items:center;gap:5px;margin-top:3px;">
                  <span style="width:6px;height:6px;border-radius:50%;background:#10b981;box-shadow:0 0 7px #10b981;display:inline-block;flex-shrink:0;"></span>
                  <span style="font-size:0.62rem;color:rgba(255,255,255,0.45);font-weight:500;">Administrador Global</span>
                </div>
              </div>
            </div>
            <button onclick="logout()" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:10px;width:38px;height:38px;min-width:38px;cursor:pointer;font-size:0.95rem;display:flex;align-items:center;justify-content:center;color:#fff;">🚪</button>
          </div>
        </div>
      </div>

      <div class="container" style="padding-top:1.5rem;padding-bottom:110px;">

        <!-- ===== KPI CARDS ===== -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.9rem;margin-bottom:2rem;">

          <div onclick="window.navigateTo('/gestion-usuarios')" style="
            background:linear-gradient(135deg,#b45309,#d97706,#f59e0b);
            border-radius:20px;padding:1.4rem;cursor:pointer;
            box-shadow:0 10px 36px rgba(217,119,6,0.4);
            position:relative;overflow:hidden;
            transition:transform 0.18s,box-shadow 0.18s;">
            <div style="position:absolute;top:-20px;right:-20px;font-size:6rem;opacity:0.1;line-height:1;transform:rotate(10deg);">⏳</div>
            <p style="font-size:0.6rem;font-weight:900;text-transform:uppercase;letter-spacing:.18em;color:rgba(255,255,255,0.85);margin:0 0 0.4rem;">Pendientes</p>
            <p style="font-size:3rem;font-weight:900;color:#fff;margin:0;line-height:1;" id="count-pending">–</p>
            <p style="font-size:0.65rem;color:rgba(255,255,255,0.7);margin:0.5rem 0 0;font-weight:700;">Aprobar →</p>
          </div>

          <div onclick="scrollToEmergencias()" id="card-emergencias" style="
            background:linear-gradient(135deg,#9f1239,#be123c,#f43f5e);
            border-radius:20px;padding:1.4rem;cursor:pointer;
            box-shadow:0 10px 36px rgba(244,63,94,0.4);
            position:relative;overflow:hidden;
            transition:transform 0.18s,box-shadow 0.18s;">
            <div style="position:absolute;top:-20px;right:-20px;font-size:6rem;opacity:0.1;line-height:1;transform:rotate(10deg);">🚨</div>
            <p style="font-size:0.6rem;font-weight:900;text-transform:uppercase;letter-spacing:.18em;color:rgba(255,255,255,0.85);margin:0 0 0.4rem;">Emergencias</p>
            <p style="font-size:3rem;font-weight:900;color:#fff;margin:0;line-height:1;" id="adminEmergenciasCount">–</p>
            <p style="font-size:0.65rem;color:rgba(255,255,255,0.7);margin:0.5rem 0 0;font-weight:700;">Activas ahora →</p>
          </div>
        </div>

        <!-- ===== SECTION LABEL ===== -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:1.1rem;">
          <div style="width:3px;height:20px;background:linear-gradient(to bottom,#6366f1,#a855f7);border-radius:2px;"></div>
          <p style="font-size:0.68rem;font-weight:900;text-transform:uppercase;letter-spacing:0.18em;color:#a5b4fc;margin:0;">Acciones Rápidas</p>
        </div>

        <!-- ===== ACTION CARDS GRID ===== -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.9rem;margin-bottom:2rem;">

          <!-- Gestión Usuarios -->
          <div onclick="window.navigateTo('/gestion-usuarios')" style="
            background:linear-gradient(155deg,#0f2e52 0%,#082040 100%);
            border-radius:20px;padding:1.5rem 1.25rem 1.25rem;
            border:1px solid rgba(96,165,250,0.2);
            box-shadow:0 8px 28px rgba(0,0,0,0.5);
            cursor:pointer;position:relative;overflow:hidden;
            transition:transform 0.18s;">
            <div style="position:absolute;bottom:-20px;right:-20px;width:90px;height:90px;background:rgba(96,165,250,0.1);border-radius:50%;"></div>
            <div style="font-size:2.4rem;margin-bottom:0.9rem;filter:drop-shadow(0 4px 12px rgba(96,165,250,0.6));">👥</div>
            <p style="font-size:0.95rem;font-weight:900;color:#f1f5f9;margin:0 0 0.3rem;line-height:1.25;">Gestión de<br>Usuarios</p>
            <p style="font-size:0.68rem;color:#60a5fa;margin:0;font-weight:700;">Aprobar y gestionar</p>
          </div>

          <!-- Nuevo Comunicado -->
          <div onclick="showAlertaModal()" style="
            background:linear-gradient(155deg,#1a1646 0%,#0d0b2a 100%);
            border-radius:20px;padding:1.5rem 1.25rem 1.25rem;
            border:1px solid rgba(129,140,248,0.2);
            box-shadow:0 8px 28px rgba(0,0,0,0.5);
            cursor:pointer;position:relative;overflow:hidden;
            transition:transform 0.18s;">
            <div style="position:absolute;bottom:-20px;right:-20px;width:90px;height:90px;background:rgba(129,140,248,0.1);border-radius:50%;"></div>
            <div style="font-size:2.4rem;margin-bottom:0.9rem;filter:drop-shadow(0 4px 12px rgba(129,140,248,0.6));">📢</div>
            <p style="font-size:0.95rem;font-weight:900;color:#f1f5f9;margin:0 0 0.3rem;line-height:1.25;">Nuevo<br>Comunicado</p>
            <p style="font-size:0.68rem;color:#818cf8;margin:0;font-weight:700;">Avisos a residentes</p>
          </div>

          <!-- Reportes -->
          <div onclick="window.navigateTo('/solicitudes')" style="
            background:linear-gradient(155deg,#052e1c 0%,#021a10 100%);
            border-radius:20px;padding:1.5rem 1.25rem 1.25rem;
            border:1px solid rgba(16,185,129,0.2);
            box-shadow:0 8px 28px rgba(0,0,0,0.5);
            cursor:pointer;position:relative;overflow:hidden;
            transition:transform 0.18s;">
            <div style="position:absolute;bottom:-20px;right:-20px;width:90px;height:90px;background:rgba(16,185,129,0.1);border-radius:50%;"></div>
            <div style="font-size:2.4rem;margin-bottom:0.9rem;filter:drop-shadow(0 4px 12px rgba(16,185,129,0.6));">📋</div>
            <p style="font-size:0.95rem;font-weight:900;color:#f1f5f9;margin:0 0 0.3rem;line-height:1.25;">Reportes y<br>Solicitudes</p>
            <p style="font-size:0.68rem;color:#10b981;margin:0;font-weight:700;">Ver incidencias</p>
          </div>

          <!-- Mi Perfil -->
          <div onclick="window.navigateTo('/perfil')" style="
            background:linear-gradient(155deg,#2d0f52 0%,#190830 100%);
            border-radius:20px;padding:1.5rem 1.25rem 1.25rem;
            border:1px solid rgba(192,132,252,0.2);
            box-shadow:0 8px 28px rgba(0,0,0,0.5);
            cursor:pointer;position:relative;overflow:hidden;
            transition:transform 0.18s;">
            <div style="position:absolute;bottom:-20px;right:-20px;width:90px;height:90px;background:rgba(192,132,252,0.1);border-radius:50%;"></div>
            <div style="font-size:2.4rem;margin-bottom:0.9rem;filter:drop-shadow(0 4px 12px rgba(192,132,252,0.6));">⚙️</div>
            <p style="font-size:0.95rem;font-weight:900;color:#f1f5f9;margin:0 0 0.3rem;line-height:1.25;">Mi Perfil y<br>Configuración</p>
            <p style="font-size:0.68rem;color:#c084fc;margin:0;font-weight:700;">Cuenta personal</p>
          </div>
        </div>

        <!-- ===== PERSONAL SECTION ===== -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:1.1rem;">
          <div style="width:3px;height:20px;background:linear-gradient(to bottom,#10b981,#06d6a0);border-radius:2px;"></div>
          <p style="font-size:0.68rem;font-weight:900;text-transform:uppercase;letter-spacing:0.18em;color:#6ee7b7;margin:0;">Personal del Edificio</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.7rem;margin-bottom:2rem;">

          <div class="admin-role-card" onclick="verListaUsuarios('residente')" style="background:linear-gradient(135deg,rgba(96,165,250,0.12),rgba(96,165,250,0.05));border:1px solid rgba(96,165,250,0.25);">
            <div style="font-size:1.75rem;filter:drop-shadow(0 2px 6px rgba(96,165,250,0.5));">👥</div>
            <div style="font-size:1.75rem;font-weight:900;color:#f8fafc;line-height:1;" id="count-residente">–</div>
            <div style="font-size:0.62rem;color:#60a5fa;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Residentes</div>
          </div>

          <div class="admin-role-card" onclick="verListaUsuarios('vigilante')" style="background:linear-gradient(135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.05));border:1px solid rgba(245,158,11,0.25);">
            <div style="font-size:1.75rem;filter:drop-shadow(0 2px 6px rgba(245,158,11,0.5));">🛡️</div>
            <div style="font-size:1.75rem;font-weight:900;color:#f8fafc;line-height:1;" id="count-vigilante">–</div>
            <div style="font-size:0.62rem;color:#f59e0b;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Vigilantes</div>
          </div>

          <div class="admin-role-card" onclick="verListaUsuarios('medico')" style="background:linear-gradient(135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.05));border:1px solid rgba(16,185,129,0.25);">
            <div style="font-size:1.75rem;filter:drop-shadow(0 2px 6px rgba(16,185,129,0.5));">🩺</div>
            <div style="font-size:1.75rem;font-weight:900;color:#f8fafc;line-height:1;" id="count-medico">–</div>
            <div style="font-size:0.62rem;color:#10b981;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Médicos</div>
          </div>

          <div class="admin-role-card" onclick="verListaUsuarios('limpieza')" style="background:linear-gradient(135deg,rgba(192,132,252,0.12),rgba(192,132,252,0.05));border:1px solid rgba(192,132,252,0.25);">
            <div style="font-size:1.75rem;filter:drop-shadow(0 2px 6px rgba(192,132,252,0.5));">🧹</div>
            <div style="font-size:1.75rem;font-weight:900;color:#f8fafc;line-height:1;" id="count-limpieza">–</div>
            <div style="font-size:0.62rem;color:#c084fc;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Limpieza</div>
          </div>

          <div class="admin-role-card" onclick="verListaUsuarios('entretenimiento')" style="background:linear-gradient(135deg,rgba(251,113,133,0.12),rgba(251,113,133,0.05));border:1px solid rgba(251,113,133,0.25);">
            <div style="font-size:1.75rem;filter:drop-shadow(0 2px 6px rgba(251,113,133,0.5));">🎭</div>
            <div style="font-size:1.75rem;font-weight:900;color:#f8fafc;line-height:1;" id="count-entretenimiento">–</div>
            <div style="font-size:0.62rem;color:#fb7185;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Recreación</div>
          </div>

          <div class="admin-role-card" onclick="verListaUsuarios('gerente')" style="background:linear-gradient(135deg,rgba(251,191,36,0.12),rgba(251,191,36,0.05));border:1px solid rgba(251,191,36,0.25);">
            <div style="font-size:1.75rem;filter:drop-shadow(0 2px 6px rgba(251,191,36,0.5));">📊</div>
            <div style="font-size:1.75rem;font-weight:900;color:#f8fafc;line-height:1;" id="count-gerente">–</div>
            <div style="font-size:0.62rem;color:#fbbf24;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Gerentes</div>
          </div>
        </div>

        <!-- ===== AVISOS ===== -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:1.1rem;">
          <div style="width:3px;height:20px;background:linear-gradient(to bottom,#f59e0b,#fbbf24);border-radius:2px;"></div>
          <p style="font-size:0.68rem;font-weight:900;text-transform:uppercase;letter-spacing:0.18em;color:#fcd34d;margin:0;">Avisos Recientes</p>
        </div>
        <div id="announcementsWidget" style="margin-bottom:2rem;"></div>

        <!-- ===== EDIFICIOS ===== -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:1.1rem;">
          <div style="width:3px;height:20px;background:linear-gradient(to bottom,#6366f1,#818cf8);border-radius:2px;"></div>
          <p style="font-size:0.68rem;font-weight:900;text-transform:uppercase;letter-spacing:0.18em;color:#a5b4fc;margin:0;">Desglose por Condominio</p>
        </div>
        <div id="edificiosStatsContainer" style="display:flex;flex-direction:column;gap:0.65rem;margin-bottom:2rem;">
          <div style="text-align:center;padding:2rem;color:rgba(255,255,255,0.3);">Cargando estadísticas...</div>
        </div>

        <!-- ===== EMERGENCIAS ===== -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:1.1rem;" id="section-emergencias">
          <div style="width:3px;height:20px;background:linear-gradient(to bottom,#f43f5e,#fb7185);border-radius:2px;"></div>
          <p style="font-size:0.68rem;font-weight:900;text-transform:uppercase;letter-spacing:0.18em;color:#fda4af;margin:0;">🚨 Emergencias Activas</p>
        </div>
        <div id="adminEmergenciasList">
          <p style="text-align:center;color:rgba(255,255,255,0.3);padding:1.5rem;background:rgba(244,63,94,0.05);border-radius:14px;border:1px solid rgba(244,63,94,0.1);">✅ Sin alertas críticas activas</p>
        </div>
      </div>

      <!-- ===== BOTTOM NAV ===== -->
      <nav class="bottom-nav">
        <a href="#" class="nav-item active">
          <span class="nav-icon">🏠</span>
          <span>Resumen</span>
        </a>
        <a href="#" class="nav-item" onclick="window.navigateTo('/gestion-usuarios'); return false;">
          <span class="nav-icon">👥</span>
          <span>Usuarios</span>
        </a>
        <a href="#" class="nav-item" onclick="window.navigateTo('/solicitudes'); return false;">
          <span class="nav-icon">📋</span>
          <span>Reportes</span>
        </a>
        <a href="#" class="nav-item" onclick="window.navigateTo('/perfil'); return false;">
          <span class="nav-icon">👤</span>
          <span>Perfil</span>
        </a>
      </nav>
    </div>

    <!-- ===== MODAL COMUNICADO ===== -->
    <div id="alertaModal" class="hidden" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.88);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(10px);">
      <div class="card" style="max-width:500px;width:100%;border:1px solid rgba(99,102,241,0.3);box-shadow:0 25px 60px rgba(0,0,0,0.7);">
        <div class="flex justify-between items-center mb-4">
          <h2 class="card-title" style="margin:0;display:flex;align-items:center;gap:0.5rem;"><span>📢</span> Nuevo Comunicado</h2>
          <button onclick="closeAlertaModal()" style="background:rgba(255,255,255,0.07);border:none;font-size:1.25rem;width:32px;height:32px;border-radius:50%;cursor:pointer;color:var(--text-muted);display:flex;align-items:center;justify-content:center;">×</button>
        </div>
        <form id="alertaForm">
          <div class="form-group">
            <label class="form-label">Edificio de destino</label>
            <select class="form-select" id="edificioAlerta" required>
              <option value="global">🌍 Todos los edificios (Global)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Tipo de prioridad</label>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;">
              <label style="cursor:pointer;"><input type="radio" name="tipoAlerta" value="informativa" checked style="display:none;"><div style="padding:0.5rem;text-align:center;border-radius:var(--radius-md);background:var(--bg-tertiary);font-size:0.75rem;border:2px solid transparent;" class="radio-tab">ℹ️ Info</div></label>
              <label style="cursor:pointer;"><input type="radio" name="tipoAlerta" value="mantenimiento" style="display:none;"><div style="padding:0.5rem;text-align:center;border-radius:var(--radius-md);background:var(--bg-tertiary);font-size:0.75rem;border:2px solid transparent;" class="radio-tab">🔧 Mant.</div></label>
              <label style="cursor:pointer;"><input type="radio" name="tipoAlerta" value="emergencia" style="display:none;"><div style="padding:0.5rem;text-align:center;border-radius:var(--radius-md);background:var(--bg-tertiary);font-size:0.75rem;border:2px solid transparent;" class="radio-tab">🚨 Crítica</div></label>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Título</label>
            <input type="text" class="form-input" id="tituloAlerta" required placeholder="Ej: Corte de agua programado">
          </div>
          <div class="form-group">
            <label class="form-label">Mensaje</label>
            <textarea class="form-textarea" id="mensajeAlerta" required placeholder="Describe el detalle del aviso..." style="min-height:120px;"></textarea>
          </div>
          <div class="flex gap-3" style="margin-top:1rem;">
            <button type="button" class="btn btn-ghost" onclick="closeAlertaModal()" style="flex:1;">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="btnEnviarAlerta" style="flex:1.5;">Enviar Comunicado</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ===== MODAL LISTA USUARIOS ===== -->
    <div id="modalListaUsuarios" class="hidden" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);z-index:10000;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(12px);">
      <div style="background:#0f172a;width:100%;max-width:600px;height:90vh;border-radius:24px 24px 0 0;padding:1.5rem;display:flex;flex-direction:column;box-shadow:0 -10px 50px rgba(0,0,0,0.7);border-top:1px solid rgba(99,102,241,0.3);">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 id="modalListaTitulo" style="font-size:1.25rem;font-weight:900;color:#f8fafc;margin:0;">Usuarios</h2>
            <p id="modalListaSubtitulo" style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin:0;">Gestionar cuentas</p>
          </div>
          <button onclick="cerrarListaUsuarios()" style="background:rgba(255,255,255,0.08);border:none;width:44px;height:44px;border-radius:50%;color:#fff;font-size:1.5rem;cursor:pointer;">×</button>
        </div>
        <div id="modalListaContenido" style="flex:1;overflow-y:auto;padding-bottom:2rem;">
          <div class="loading-spinner" style="margin:4rem auto;"></div>
        </div>
      </div>
    </div>

    <!-- ===== MODAL PASSWORD ===== -->
    <div id="modalPasswordAdmin" class="hidden" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:10001;display:flex;align-items:center;justify-content:center;padding:1.5rem;backdrop-filter:blur(10px);">
      <div class="card" style="width:100%;max-width:400px;border:1px solid rgba(99,102,241,0.35);">
        <h3 class="card-title">🔑 Nueva Contraseña</h3>
        <p id="passwordUsuarioNombre" style="color:rgba(255,255,255,0.5);margin-bottom:1.5rem;font-size:0.9rem;"></p>
        <div class="form-group">
          <input type="password" id="nuevaPassInput" class="form-input" placeholder="Mínimo 4 caracteres">
        </div>
        <div class="flex gap-3">
          <button class="btn btn-ghost flex-1" onclick="cerrarModalPass()">Cancelar</button>
          <button class="btn btn-primary flex-1" id="btnConfirmPass" onclick="confirmarCambioPass()">Guardar</button>
        </div>
      </div>
    </div>

    <style>
      .admin-role-card {
        border-radius: 16px; padding: 1rem 0.6rem; text-align: center;
        cursor: pointer; transition: transform 0.18s;
        display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
      }
      .admin-role-card:active { transform: scale(0.92); }
      .user-mgmt-card { background: rgba(255,255,255,0.05); border-radius: 14px; padding: 1.25rem; margin-bottom: 0.75rem; border: 1px solid rgba(255,255,255,0.08); }
      .pulse-icon { width:12px;height:12px;background:#f43f5e;border-radius:50%;display:inline-block;animation:pulse-red 2s infinite; }
      @keyframes pulse-red {
        0% { transform:scale(0.95);box-shadow:0 0 0 0 rgba(244,63,94,0.7); }
        70% { transform:scale(1);box-shadow:0 0 0 10px rgba(244,63,94,0); }
        100% { transform:scale(0.95);box-shadow:0 0 0 0 rgba(244,63,94,0); }
      }
      .radio-tab { transition: all 0.2s; }
      input[type="radio"]:checked + .radio-tab { background:var(--primary)!important;border-color:var(--primary-light)!important;color:white;font-weight:700; }
      .building-stat-row { display:grid;grid-template-columns:2fr repeat(5,1fr);gap:2px;background:rgba(255,255,255,0.04);padding:0.75rem;border-radius:12px;align-items:center; }
      .building-stat-header { font-size:0.6rem;font-weight:900;color:rgba(255,255,255,0.35);text-transform:uppercase;text-align:center; }
      .building-stat-value { font-size:0.9rem;font-weight:800;text-align:center;color:#f1f5f9; }
    </style>
  `;

  // --- LOGICA FRONTEND GESTION ---
  let usuariosCache = [];
  let userPassSelected = null;

  window.verListaUsuarios = async (rol) => {
    const modal = document.getElementById('modalListaUsuarios');
    const titulo = document.getElementById('modalListaTitulo');
    const content = document.getElementById('modalListaContenido');

    const labels = {
      residente: 'Residentes',
      medico: 'Médicos',
      limpieza: 'Personal Limpieza',
      entretenimiento: 'Recreación',
      vigilante: 'Vigilantes',
      gerente: 'Gerentes'
    };

    titulo.textContent = labels[rol] || 'Usuarios';
    modal.classList.remove('hidden');
    content.innerHTML = '<div class="loading-spinner" style="margin: 4rem auto;"></div>';

    try {
      const res = await fetch(`${window.API_URL}/usuarios?rol=${rol}`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });
      usuariosCache = await res.json();
      renderListaModal();
    } catch (e) {
      content.innerHTML = '<p class="text-center color-danger">Error al cargar usuarios</p>';
    }
  };

  const renderListaModal = () => {
    const content = document.getElementById('modalListaContenido');
    if (!usuariosCache || usuariosCache.length === 0) {
      content.innerHTML = '<p class="text-center" style="margin-top: 2rem;">No hay usuarios en esta categoría.</p>';
      return;
    }

    content.innerHTML = usuariosCache.map(u => `
        <div class="user-mgmt-card fade-in">
            <div class="flex justify-between items-start">
               <div>
                  <h4 style="font-weight: 700; color: #fff; margin: 0 0 0.25rem 0;">${u.nombre}</h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">📧 ${u.email}</p>
                  <p style="font-size: 0.75rem; color: var(--primary-light); margin: 0.25rem 0;">📍 ${u.apartamento ? `Depto ${u.apartamento}` : 'Personal'}</p>
               </div>
               <div class="flex flex-direction-column gap-2">
                  <button class="btn btn-sm btn-ghost" onclick="abrirModalPass(${u.id}, '${u.nombre}')" style="background: rgba(129,140,248,0.1); color: var(--primary-light); border: 1px solid rgba(129,140,248,0.2);">
                    🔑 Pwd
                  </button>
                  <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.id}, '${u.nombre}')">
                    🗑️
                  </button>
               </div>
            </div>
        </div>
    `).join('');
  };

  window.cerrarListaUsuarios = () => {
    document.getElementById('modalListaUsuarios').classList.add('hidden');
  };

  window.abrirModalPass = (id, nombre) => {
    userPassSelected = id;
    document.getElementById('passwordUsuarioNombre').textContent = `Usuario: ${nombre}`;
    document.getElementById('modalPasswordAdmin').classList.remove('hidden');
    document.getElementById('nuevaPassInput').value = '';
    document.getElementById('nuevaPassInput').focus();
  };

  window.cerrarModalPass = () => {
    document.getElementById('modalPasswordAdmin').classList.add('hidden');
    userPassSelected = null;
  };

  window.confirmarCambioPass = async () => {
    const pass = document.getElementById('nuevaPassInput').value;
    if (pass.length < 4) return alert('Mínimo 4 caracteres');

    const btn = document.getElementById('btnConfirmPass');
    btn.disabled = true;
    btn.textContent = 'Guardando...';

    try {
      const res = await fetch(`${window.API_URL}/usuarios/${userPassSelected}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.appState.token}`
        },
        body: JSON.stringify({ password: pass })
      });

      if (res.ok) {
        alert('✅ Contraseña actualizada');
        cerrarModalPass();
      } else {
        const data = await res.json();
        alert('❌ Error: ' + data.error);
      }
    } catch (e) {
      alert('❌ Error de conexión');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Guardar';
    }
  };

  window.eliminarUsuario = async (id, nombre) => {
    if (!confirm(`¿Seguro que quieres eliminar permanentemente a ${nombre}?`)) return;

    try {
      const res = await fetch(`${window.API_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      });

      if (res.ok) {
        alert('✅ Usuario eliminado');
        usuariosCache = usuariosCache.filter(u => u.id !== id);
        renderListaModal();
        loadAdminStats();
      } else {
        const data = await res.json();
        alert('❌ Error: ' + data.error);
      }
    } catch (e) {
      alert('❌ Error de conexión');
    }
  };

  // --- FIN LOGICA GESTION ---

  // Inicializar radio buttons
  setTimeout(() => {
    const radioTabs = document.querySelectorAll('.radio-tab');
    radioTabs.forEach(tab => {
      tab.parentElement.onclick = () => {
        tab.previousElementSibling.checked = true;
      };
    });
  }, 100);

  // Cargar datos
  loadAdminStats();
  loadAdminEmergencias();
  loadEdificiosParaAlertas();

  if (typeof renderAnnouncementsWidget === 'function') {
    renderAnnouncementsWidget('announcementsWidget');
  }

  setTimeout(() => {
    const form = document.getElementById('alertaForm');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        enviarAlertaAdmin();
      };
    }
  }, 100);
}

window.scrollToEmergencias = () => {
  const el = document.getElementById('section-emergencias');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

async function loadEdificiosParaAlertas() {
  try {
    const response = await fetch(`${window.API_URL}/edificios/public`);
    const edificios = await response.json();
    const select = document.getElementById('edificioAlerta');
    if (select && Array.isArray(edificios)) {
      edificios.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = `🏢 ${e.nombre}`;
        select.appendChild(opt);
      });
    }
  } catch (error) {
    console.warn('Error al cargar edificios para el modal de alertas:', error);
  }
}

let _loadingStats = false;
async function loadAdminStats() {
  if (_loadingStats) return;
  _loadingStats = true;
  try {
    const [resUsers, resEdificios] = await Promise.all([
      fetch(`${window.API_URL}/usuarios`, {
        headers: { 'Authorization': `Bearer ${window.appState.token}` }
      }),
      fetch(`${window.API_URL}/edificios/public`)
    ]);

    const users = await resUsers.json();
    const edificios = await resEdificios.json();

    const resPendientes = await fetch(`${window.API_URL}/usuarios/pendientes`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const pendientes = await resPendientes.json();
    const countPendingEl = document.getElementById('count-pending');
    if (countPendingEl) countPendingEl.textContent = Array.isArray(pendientes) ? pendientes.length : 0;

    const countsGlobal = { residente: 0, limpieza: 0, vigilante: 0, gerente: 0, medico: 0, entretenimiento: 0 };
    const statsPorEdificio = {};

    // Deduplicar edificios por nombre para mostrar una sola fila por condominio
    const edificiosUnicos = Array.isArray(edificios)
      ? edificios.filter((e, idx, arr) => arr.findIndex(x => x.nombre === e.nombre) === idx)
      : [];

    // Mapear TODOS los IDs (incluyendo duplicados) a su nombre de edificio
    const idToNombre = {};
    if (Array.isArray(edificios)) {
      edificios.forEach(e => { idToNombre[e.id] = e.nombre; });
    }

    // Conteo de personal por nombre de edificio
    const statsPorNombre = {};
    edificiosUnicos.forEach(e => {
      statsPorNombre[e.nombre] = { nombre: e.nombre, residente: 0, limpieza: 0, entretenimiento: 0, medico: 0, gerente: 0, vigilante: 0 };
    });

    if (Array.isArray(users)) {
      users.forEach(u => {
        if (countsGlobal.hasOwnProperty(u.rol)) countsGlobal[u.rol]++;

        // Buscar por nombre del edificio usando el mapa de IDs
        const nombreEdificio = idToNombre[u.edificio_id];
        if (nombreEdificio && statsPorNombre[nombreEdificio]) {
          if (statsPorNombre[nombreEdificio].hasOwnProperty(u.rol)) {
            statsPorNombre[nombreEdificio][u.rol]++;
          }
        }
      });
    }

    Object.keys(countsGlobal).forEach(rol => {
      const el = document.getElementById(`count-${rol}`);
      if (el) el.textContent = countsGlobal[rol];
    });

    const buildingsContainer = document.getElementById('edificiosStatsContainer');
    if (buildingsContainer) {

      if (edificiosUnicos.length === 0) {
        buildingsContainer.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.3);">No hay edificios registrados</p>';
      } else {
        const headerHtml = `
          <div class="building-stat-row" style="background:transparent;">
            <div style="font-size:0.6rem;font-weight:900;color:rgba(255,255,255,0.35);text-transform:uppercase;">Condominio</div>
            <div class="building-stat-header">Res</div>
            <div class="building-stat-header">Lim</div>
            <div class="building-stat-header">Rec</div>
            <div class="building-stat-header">Med</div>
            <div class="building-stat-header">Ger</div>
          </div>`;

        const rowsHtml = edificiosUnicos.map(e => {
          const stat = statsPorNombre[e.nombre] || { residente: 0, limpieza: 0, entretenimiento: 0, medico: 0, gerente: 0 };
          return `
          <div class="building-stat-row">
            <div style="font-size:0.8rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#e2e8f0;">🏢 ${e.nombre}</div>
            <div class="building-stat-value">${stat.residente}</div>
            <div class="building-stat-value" style="color:#c084fc;">${stat.limpieza}</div>
            <div class="building-stat-value" style="color:#fb7185;">${stat.entretenimiento}</div>
            <div class="building-stat-value" style="color:#10b981;">${stat.medico}</div>
            <div class="building-stat-value" style="color:#fbbf24;">${stat.gerente}</div>
          </div>`;
        }).join('');

        buildingsContainer.innerHTML = headerHtml + rowsHtml;
      }
    }
  } catch (error) {
    console.warn('Error al cargar stats de usuarios:', error);
  } finally {
    _loadingStats = false;
  }
}

async function loadAdminEmergencias() {
  try {
    const response = await fetch(`${window.API_URL}/emergencias/activas`, {
      headers: { 'Authorization': `Bearer ${window.appState.token}` }
    });
    const emergencias = await response.json();
    const container = document.getElementById('adminEmergenciasList');
    const count = document.getElementById('adminEmergenciasCount');

    if (count) count.textContent = Array.isArray(emergencias) ? emergencias.length : 0;
    if (!container) return;

    if (!Array.isArray(emergencias) || emergencias.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.3);padding:1.5rem;background:rgba(244,63,94,0.05);border-radius:14px;border:1px solid rgba(244,63,94,0.1);">✅ Sin alertas activas</p>';
      return;
    }

    container.innerHTML = emergencias.map(e => `
      <div class="fade-in" style="padding:1rem;background:rgba(244,63,94,0.07);border-radius:14px;border:1px solid rgba(244,63,94,0.2);margin-bottom:0.75rem;border-left:4px solid #f43f5e;">
        <div class="flex justify-between items-start mb-2">
          <span style="font-weight:800;font-size:0.95rem;color:#fff;">📍 Dpto. ${e.usuario_apartamento || 'N/A'}</span>
          <span style="font-size:0.7rem;color:rgba(255,255,255,0.4);background:rgba(244,63,94,0.1);padding:2px 8px;border-radius:6px;">${new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <p style="font-size:0.85rem;color:#fecdd3;margin-bottom:0.5rem;line-height:1.5;">${e.descripcion}</p>
        <p style="font-size:0.72rem;color:rgba(255,255,255,0.4);margin:0;">👤 ${e.usuario_nombre} ${e.usuario_telefono ? `· 📞 ${e.usuario_telefono}` : ''}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error al cargar emergencias:', error);
  }
}

window.showAlertaModal = () => {
  const modal = document.getElementById('alertaModal');
  if (modal) modal.classList.remove('hidden');
};

window.closeAlertaModal = () => {
  const modal = document.getElementById('alertaModal');
  const form = document.getElementById('alertaForm');
  if (modal) modal.classList.add('hidden');
  if (form) form.reset();
};

async function enviarAlertaAdmin() {
  const edificio_id_val = document.getElementById('edificioAlerta').value;
  const tipo = document.querySelector('input[name="tipoAlerta"]:checked').value;
  const titulo = document.getElementById('tituloAlerta').value;
  const mensaje = document.getElementById('mensajeAlerta').value;
  const btn = document.getElementById('btnEnviarAlerta');
  const edificio_id = edificio_id_val === 'global' ? null : edificio_id_val;

  try {
    if (btn) { btn.disabled = true; btn.innerText = 'Enviando...'; }

    const response = await fetch(`${window.API_URL}/alertas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${window.appState.token}` },
      body: JSON.stringify({ tipo, titulo, mensaje, edificio_id })
    });

    if (response.ok) {
      alert('✅ Comunicado enviado correctamente');
      closeAlertaModal();
      if (typeof renderAnnouncementsWidget === 'function') renderAnnouncementsWidget('announcementsWidget');
    } else {
      const data = await response.json();
      alert('❌ Error: ' + (data.error || 'No se pudo enviar'));
    }
  } catch (error) {
    alert('❌ Error de conexión al servidor');
  } finally {
    if (btn) { btn.disabled = false; btn.innerText = 'Enviar Comunicado'; }
  }
}
