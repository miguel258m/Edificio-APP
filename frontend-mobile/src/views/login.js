// =====================================================
// LOGIN VIEW - Pantalla de inicio de sesión
// =====================================================

export function renderLogin(container) {
  container.innerHTML = `
    <div class="page" style="display: flex; align-items: center; justify-content: center; padding: 2rem; background: radial-gradient(circle at 100% 0%, var(--primary-dark), transparent 50%), radial-gradient(circle at 0% 100%, var(--secondary-dark), transparent 50%); background-color: var(--bg-primary); min-height: 100vh;">
      <div class="container" style="max-width: 400px; width: 100%; position: relative; z-index: 1;">
        
        <!-- Logo Elite -->
        <div class="text-center mb-5 fade-in">
          <div style="width: 100px; height: 100px; margin: 0 auto 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(16px); border-radius: 32px; display: flex; align-items: center; justify-content: center; font-size: 3.5rem; box-shadow: var(--shadow-glow); position: relative; overflow: hidden;">
            <div style="position: absolute; width: 100%; height: 100%; background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent); animation: sweep 3s infinite;"></div>
            🏢
          </div>
          <h1 style="font-size: 2.75rem; font-weight: 800; letter-spacing: -0.05em; margin-bottom: 0.5rem; background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.5) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Bienvenido
          </h1>
          <p style="color: var(--text-secondary); font-size: 1.1rem; font-weight: 500; opacity: 0.8;">Gestión Residencial Inteligente</p>
        </div>

        <!-- Login Card Elite -->
        <div class="card fade-in" style="background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(24px); padding: 3rem 2.5rem; box-shadow: var(--shadow-2xl); border-radius: 32px; position: relative; overflow: hidden;">
           <div style="position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);"></div>
           
           <form id="loginForm" novalidate>
            <div class="form-group mb-5">
              <label class="form-label" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem;">Correo Electrónico</label>
              <div style="position: relative;">
                <input type="email" class="form-input" id="email" placeholder="nombre@ejemplo.com" required style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 1.25rem; border-radius: 16px; font-size: 1rem; width: 100%;">
              </div>
            </div>

            <div class="form-group mb-4">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <label class="form-label" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0;">Contraseña</label>
                <a href="#" style="font-size: 0.75rem; color: var(--role-admin); text-decoration: none; font-weight: 700; opacity: 0.9;">¿Olvidaste tu contraseña?</a>
              </div>
              <input type="password" class="form-input" id="password" placeholder="••••••••" required style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 1.25rem; border-radius: 16px; font-size: 1rem; width: 100%;">
            </div>

            <div id="errorMessage" class="hidden" style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); border-radius: 16px; color: var(--danger); font-size: 0.85rem; margin-bottom: 1.5rem; text-align: center; font-weight: 600;">
            </div>

            <button type="submit" class="btn" style="width: 100%; padding: 1.5rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 20px; background: linear-gradient(135deg, var(--role-admin), var(--primary-dark)); color: white; border: none; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4); margin-top: 1rem;">
              <span id="btnText">Iniciar Sesión</span>
              <span id="spinner" class="hidden">
                <div class="loading-spinner" style="width: 24px; height: 24px; border-width: 3px;"></div>
              </span>
            </button>
          </form>

          <div class="mt-5 text-center">
            <p style="font-size: 1rem; color: var(--text-muted); font-weight: 500;">
              ¿No tienes una cuenta? 
              <a href="#" id="goToRegister" style="color: var(--role-residente); text-decoration: none; font-weight: 700; margin-left: 0.5rem; border-bottom: 2px solid rgba(59, 130, 246, 0.3);">Regístrate</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Manejar envío del formulario
  const form = document.getElementById('loginForm');
  if (form) form.addEventListener('submit', handleLogin);

  // Manejar navegación a registro
  const goToRegisterBtn = document.getElementById('goToRegister');
  if (goToRegisterBtn) {
    goToRegisterBtn.onclick = (e) => {
      e.preventDefault();
      window.navigateTo('/register');
    };
  }

  // Manejar recuperación de contraseña
  const recoverPasswordBtn = document.getElementById('recoverPassword');
  if (recoverPasswordBtn) {
    recoverPasswordBtn.onclick = (e) => {
      e.preventDefault();
      showRecoveryModal();
    };
  }
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
  // Se actualizaron los IDs en el HTML, debemos reflejarlo aquí
  const loginBtnText = document.getElementById('btnText');
  const loginSpinner = document.getElementById('spinner');

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
