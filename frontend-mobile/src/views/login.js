// =====================================================
// LOGIN VIEW - Pantalla de inicio de sesión
// =====================================================

export function renderLogin(container) {
  container.innerHTML = `
    <div class="page" style="display: flex; align-items: center; justify-content: center; padding: 2rem; background: radial-gradient(circle at top right, var(--role-admin), transparent), radial-gradient(circle at bottom left, var(--role-residente), transparent); min-height: 100vh;">
      <div class="container" style="max-width: 400px; position: relative; z-index: 1;">
        
        <!-- Logo Premium -->
        <div class="text-center mb-5 fade-in">
          <div style="width: 96px; height: 96px; margin: 0 auto 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(10px); border-radius: var(--radius-2xl); display: flex; align-items: center; justify-content: center; font-size: 3rem; box-shadow: var(--shadow-glow); position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent, var(--role-admin), transparent); animation: rotate 4s linear infinite; opacity: 0.1;"></div>
            🏢
          </div>
          <h1 style="font-size: 2.25rem; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 0.5rem; background: linear-gradient(135deg, #fff, rgba(255,255,255,0.7)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Edificio App
          </h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 0.95rem; font-weight: 500; letter-spacing: 0.02em;">
            GESTIÓN INTELIGENTE DE RESIDENCIAS
          </p>
        </div>

        <!-- Card de Login con Glassmorphism -->
        <div class="card fade-in" style="background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(20px); padding: 2.5rem; box-shadow: var(--shadow-2xl); border-radius: var(--radius-2xl);">
          <form id="loginForm">
            <div class="form-group mb-4">
              <label class="form-label" style="color: rgba(255,255,255,0.9); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Correo electrónico</label>
              <input 
                type="email" 
                class="form-input" 
                id="email" 
                placeholder="tu@email.com"
                required
                autocomplete="email"
                style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 1rem; border-radius: var(--radius-lg); font-size: 1rem;"
              >
            </div>

            <div class="form-group mb-5">
              <label class="form-label" style="color: rgba(255,255,255,0.9); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Contraseña</label>
              <input 
                type="password" 
                class="form-input" 
                id="password" 
                placeholder="••••••••"
                required
                autocomplete="current-password"
                style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 1rem; border-radius: var(--radius-lg); font-size: 1rem;"
              >
            </div>

            <div id="errorMessage" class="hidden" style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); border-radius: var(--radius-lg); color: var(--danger); font-size: 0.85rem; margin-bottom: 1.5rem; text-align: center; font-weight: 500;">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1.1rem; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-radius: var(--radius-lg); box-shadow: var(--shadow-glow);">
              <span id="loginBtnText">Iniciar Sesión</span>
              <span id="loginSpinner" class="hidden">
                <div class="loading-spinner" style="width: 20px; height: 20px; border-width: 3px;"></div>
              </span>
            </button>
          </form>

          <div class="mt-5 text-center">
            <p style="font-size: 0.9rem; color: rgba(255,255,255,0.5);">
              ¿Olvidaste tu contraseña? 
              <a href="#" id="recoverPassword" style="color: var(--role-admin); text-decoration: none; font-weight: 600; margin-left: 0.25rem;">Recuperar</a>
            </p>
            <div style="height: 1px; background: rgba(255,255,255,0.05); margin: 1.5rem 0;"></div>
            <p style="font-size: 0.9rem; color: rgba(255,255,255,0.5);">
              ¿No tienes una cuenta? 
              <a href="#" id="goToRegister" style="color: var(--role-residente); text-decoration: none; font-weight: 700; margin-left: 0.25rem;">Regístrate aquí</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  `;

  // Manejar envío del formulario
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', handleLogin);

  // Manejar navegación a registro
  document.getElementById('goToRegister').onclick = (e) => {
    e.preventDefault();
    window.navigateTo('/register');
  };

  // Manejar recuperación de contraseña
  document.getElementById('recoverPassword').onclick = (e) => {
    e.preventDefault();
    showRecoveryModal();
  };
}

// Modal de recuperación de contraseña
function showRecoveryModal() {
  const modal = document.createElement('div');
  modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;';

  modal.innerHTML = `
    <div class="card" style="max-width: 400px; width: 100%;">
      <div class="flex justify-between items-center mb-3">
        <h2 class="card-title" style="margin: 0;">🔑 Recuperar Contraseña</h2>
        <button id="closeRecoveryModal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">×</button>
      </div>
      <p style="color: var(--text-secondary); font-size: 0.875rem; line-height: 1.6;">
        Para resetear tu contraseña, por favor contacta al <strong>administrador del edificio</strong>.
      </p>
      <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 1rem;">
        📞 El administrador podrá ayudarte a recuperar el acceso a tu cuenta.
      </p>
      <button id="closeRecoveryBtn" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
        Entendido
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => modal.remove();
  document.getElementById('closeRecoveryModal').onclick = closeModal;
  document.getElementById('closeRecoveryBtn').onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('errorMessage');
  const loginBtnText = document.getElementById('loginBtnText');
  const loginSpinner = document.getElementById('loginSpinner');

  // Mostrar loading
  loginBtnText.classList.add('hidden');
  loginSpinner.classList.remove('hidden');
  errorMessage.classList.add('hidden');

  try {
    const response = await fetch(`${window.API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { error: 'Error de conexión o respuesta no válida del servidor' };
    }

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    // Guardar token y usuario
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.appState.token = data.token;
    window.appState.user = data.user;

    // Inicializar socket con el nuevo token
    try {
      initSocket(data.token);
    } catch (e) {
      console.warn('⚠️ Error al inicializar socket tras login:', e);
    }

    // Redirigir según el rol
    if (data.user.rol === 'residente') {
      window.navigateTo('/dashboard-residente');
    } else if (data.user.rol === 'vigilante') {
      window.navigateTo('/dashboard-vigilante');
    } else if (data.user.rol === 'admin') {
      window.navigateTo('/dashboard-admin');
    } else if (data.user.rol === 'limpieza') {
      window.navigateTo('/dashboard-limpieza');
    } else if (data.user.rol === 'gerente') {
      window.navigateTo('/dashboard-gerente');
    } else if (data.user.rol === 'medico') {
      window.navigateTo('/dashboard-medico');
    } else {
      // Fallback a dashboard de residente o login
      window.navigateTo('/dashboard-residente');
    }

  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.classList.remove('hidden');
    loginBtnText.classList.remove('hidden');
    loginSpinner.classList.add('hidden');
  }
}
