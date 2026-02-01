// =====================================================
// LOGIN VIEW - Pantalla de inicio de sesión
// =====================================================

export function renderLogin(container) {
  container.innerHTML = `
    <div class="page" style="display: flex; align-items: center; justify-content: center; padding: 2rem;">
      <div class="container" style="max-width: 400px;">
        
        <!-- Logo y título -->
        <div class="text-center mb-4">
          <div style="width: 80px; height: 80px; margin: 0 auto 1rem; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; box-shadow: var(--shadow-glow);">
            🏢
          </div>
          <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; background: linear-gradient(135deg, var(--primary-light), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Edificio App
          </h1>
          <p style="color: var(--text-muted); font-size: 0.875rem;">
            Sistema de administración inteligente
          </p>
        </div>

        <!-- Formulario de login -->
        <div class="card fade-in">
          <form id="loginForm">
            <div class="form-group">
              <label class="form-label">Correo electrónico</label>
              <input 
                type="email" 
                class="form-input" 
                id="email" 
                placeholder="tu@email.com"
                required
                autocomplete="email"
              >
            </div>

            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <input 
                type="password" 
                class="form-input" 
                id="password" 
                placeholder="••••••••"
                required
                autocomplete="current-password"
              >
            </div>

            <div id="errorMessage" class="hidden" style="padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); border-radius: var(--radius-md); color: var(--danger); font-size: 0.875rem; margin-bottom: 1rem;">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%;">
              <span id="loginBtnText">Iniciar Sesión</span>
              <span id="loginSpinner" class="hidden">
                <div class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
              </span>
            </button>
          </form>

          <div class="mt-3 text-center">
            <p style="font-size: 0.875rem; color: var(--text-muted);">
              ¿Olvidaste tu contraseña? 
              <a href="#" id="recoverPassword" style="color: var(--primary); text-decoration: none;">Recuperar</a>
            </p>
            <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.5rem;">
              ¿No tienes cuenta? 
              <a href="#" id="goToRegister" style="color: var(--secondary); text-decoration: none; font-weight: 600;">Crear cuenta</a>
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    // Guardar token y usuario
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.appState.token = data.token;
    window.appState.user = data.user;

    // Redirigir según el rol
    if (data.user.rol === 'residente') {
      window.navigateTo('/dashboard-residente');
    } else if (data.user.rol === 'vigilante') {
      window.navigateTo('/dashboard-vigilante');
    } else {
      // Admin va al panel web
      window.location.href = 'http://localhost:5174';
    }

  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.classList.remove('hidden');
    loginBtnText.classList.remove('hidden');
    loginSpinner.classList.add('hidden');
  }
}
