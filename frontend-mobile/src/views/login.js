// =====================================================
// LOGIN VIEW - Pantalla de inicio de sesión
// =====================================================

import { initPWA } from '../utils/pwa.js';
import { initSocket } from '../socket/client.js';

export function renderLogin(container) {
  container.innerHTML = `
    <div class="page" style="display: flex; align-items: center; justify-content: center; padding: 2rem; background: radial-gradient(circle at 100% 0%, var(--bg-secondary), transparent 50%), radial-gradient(circle at 0% 100%, var(--bg-primary), transparent 50%); background-color: var(--bg-primary); min-height: 100vh;">

      <div class="container" style="max-width: 400px; width: 100%; position: relative; z-index: 1;">
        
        <!-- PWA Install Button (Hidden by default) -->
        <button id="btnInstallApp" class="hidden fade-in" style="position: absolute; top: -60px; right: 0; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem; display: flex; align-items: center; gap: 0.5rem; backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); cursor: pointer; z-index: 50;">
          <span>📲</span> Instalar App
        </button>

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
                <a href="#" id="recoverPassword" style="font-size: 0.75rem; color: var(--role-admin); text-decoration: none; font-weight: 700; opacity: 0.9;">¿Olvidaste tu contraseña?</a>
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

          <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 2.5rem; margin-bottom: 1.5rem; opacity: 0.5;">
             <div style="flex: 1; height: 1px; background: white;"></div>
             <span style="color: white; font-size: 0.8rem;">O inicia sesión con</span>
             <div style="flex: 1; height: 1px; background: white;"></div>
          </div>

          <!-- Google Login Button Container (Debug border added) -->
          <div id="googleBtnContainer" class="mb-4" style="display: flex; justify-content: center; min-height: 44px; width: 100%; border: 1px dashed rgba(255,255,255,0.2); border-radius: 12px; background: rgba(255,255,255,0.02);"></div>

          <div class="mt-4 text-center">
            <p style="font-size: 1rem; color: var(--text-muted); font-weight: 500;">
              ¿No tienes una cuenta? 
              <a href="#" id="goToRegister" style="color: var(--role-residente); text-decoration: none; font-weight: 700; margin-left: 0.5rem; border-bottom: 2px solid rgba(59, 130, 246, 0.3);">Regístrate</a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <style>
      @keyframes sweep {
        0% { transform: translateX(-100%) skewX(-15deg); }
        50%, 100% { transform: translateX(100%) skewX(-15deg); }
      }
    </style>
  `;

  // Manejar envío del formulario
  const form = document.getElementById('loginForm');
  if (form) form.addEventListener('submit', handleLogin);

  // Inicializar PWA logic
  initPWA();

  // Inicializar Google Sign-In con reintentos suaves
  let retryCount = 0;
  const initGoogleBtn = () => {
    const btnContainer = document.getElementById("googleBtnContainer");
    if (!btnContainer) {
      console.error("❌ googleBtnContainer no encontrado en el DOM");
      return;
    }

    retryCount++;
    console.log(`🔍 [Google Auth] Intento ${retryCount}. Revisando window.google...`);

    if (window.google && window.google.accounts) {
      console.log("✅ [Google Auth] API detectada.");
      btnContainer.innerHTML = '';
      try {
        google.accounts.id.initialize({
          client_id: "776968650110-n2idk31b0dj0g03me0fm2tvtu9fiogte.apps.googleusercontent.com",
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          itp_support: true
        });

        console.log("🛠️ [Google Auth] Renderizando botón...");
        const width = btnContainer.parentElement ? Math.min(btnContainer.parentElement.offsetWidth - 40, 320) : 300;

        google.accounts.id.renderButton(
          btnContainer,
          {
            theme: "filled_blue",
            size: "large",
            width: width > 0 ? width : 300,
            text: "signin_with",
            shape: "pill"
          }
        );
      } catch (err) {
        console.error("❌ [Google Auth] Error en initialize/render:", err);
        btnContainer.innerHTML = `
          <div style="color: #ffaaaa; font-size: 11px; text-align: center; padding: 10px;">
            <p>Error al cargar el botón de Google.</p>
            <p style="opacity: 0.7; font-size: 10px;">Asegúrate de que el dominio <b>${window.location.origin}</b> esté autorizado en Google Cloud Console.</p>
          </div>
        `;
      }
    } else {
      if (retryCount > 15) {
        console.error("❌ [Google Auth] Se agotaron los reintentos. El script no cargó.");
        btnContainer.innerHTML = `<span style="color: #ffaaaa; font-size: 10px;">No se pudo cargar Google. Revisa tu conexión.</span>`;
        return;
      }
      btnContainer.innerHTML = `<span style="color: gray; font-size: 10px; opacity: 0.5;">Cargando Google... (${retryCount})</span>`;
      setTimeout(initGoogleBtn, 1000);
    }
  };

  initGoogleBtn();

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

// =====================================================
// GOOGLE LOGIN LOGIC
// =====================================================

function handleGoogleResponse(response) {
  // El token JWT de Google viene en response.credential
  const googleToken = response.credential;

  // Llamar a nuestro backend para verificar y loguear
  loginWithGoogle(googleToken);
}

async function loginWithGoogle(token) {
  const errorMessage = document.getElementById('errorMessage');
  const loginSpinner = document.getElementById('spinner'); // Reutilizamos spinner si es posible o mostramos loading global

  // Mostrar feedback visual simple
  if (errorMessage) errorMessage.classList.add('hidden');

  try {
    const response = await fetch(`${window.API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión con Google');
    }

    // SI ES UN USUARIO NUEVO
    if (data.newUser) {
      showGoogleRegisterForm(data);
      return;
    }

    // Guardar token y usuario (igual que login normal)
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.appState.token = data.token;
    window.appState.user = data.user;

    // Inicializar socket con el nuevo token
    try {
      initSocket(data.token);
    } catch (e) {
      console.warn('⚠️ Error al inicializar socket tras login google:', e);
    }

    // Redireccionar
    if (data.user.rol === 'residente') window.navigateTo('/dashboard-residente');
    else if (data.user.rol === 'vigilante') window.navigateTo('/dashboard-vigilante');
    else if (data.user.rol === 'admin') window.navigateTo('/dashboard-admin');
    else if (data.user.rol === 'limpieza') window.navigateTo('/dashboard-limpieza');
    else if (data.user.rol === 'gerente') window.navigateTo('/dashboard-gerente');
    else if (data.user.rol === 'medico') window.navigateTo('/dashboard-medico');
    else window.navigateTo('/dashboard-residente');

  } catch (error) {
    console.error('Google Login Error:', error);
    if (errorMessage) {
      errorMessage.textContent = error.message;
      errorMessage.classList.remove('hidden');
    } else {
      alert(error.message);
    }
  }
}

// =====================================================
// GOOGLE REGISTER UI & LOGIC
// =====================================================

async function showGoogleRegisterForm(googleData) {
  const container = document.getElementById('app');
  if (!container) return;

  let selectedRol = 'residente'; // Valor por defecto

  const renderGoogleForm = () => {
    container.innerHTML = `
      <div class="page" style="display: flex; align-items: center; justify-content: center; padding: 2rem; background: radial-gradient(circle at 100% 0%, var(--primary-dark), transparent 50%), radial-gradient(circle at 0% 100%, var(--secondary-dark), transparent 50%); background-color: var(--bg-primary); min-height: 100vh;">
        <div class="card fade-in" style="max-width: 450px; width: 100%; background: var(--glass-bg); padding: 2.5rem; border-radius: 28px; border: 1px solid var(--glass-border); text-align: center; backdrop-filter: blur(24px);">
          <div style="position: relative; display: inline-block; margin-bottom: 1.5rem;">
            <img src="${googleData.foto}" style="width: 80px; height: 80px; border-radius: 24px; border: 2px solid var(--role-residente); box-shadow: var(--shadow-glow);">
          </div>
          
          <h2 style="color: white; margin-bottom: 0.5rem; font-size: 1.5rem; font-weight: 800;">¡Bienvenido, ${googleData.nombre.split(' ')[0]}!</h2>
          <p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.9rem;">Para terminar, dinos quién eres:</p>
          
          <!-- Botones de Rol Visuales -->
          <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
            <button id="setResidente" type="button" style="flex: 1; padding: 1.25rem 0.5rem; border-radius: 16px; border: 2px solid ${selectedRol === 'residente' ? 'var(--role-residente)' : 'rgba(255,255,255,0.1)'}; background: ${selectedRol === 'residente' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.2)'}; color: white; cursor: pointer; transition: all 0.3s ease;">
              <span style="display: block; font-size: 1.5rem; margin-bottom: 0.25rem;">🏠</span>
              <span style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase;">Residente</span>
            </button>
            <button id="setStaff" type="button" style="flex: 1; padding: 1.25rem 0.5rem; border-radius: 16px; border: 2px solid ${selectedRol === 'vigilante' ? 'var(--role-vigilante)' : 'rgba(255,255,255,0.1)'}; background: ${selectedRol === 'vigilante' ? 'rgba(71, 85, 105, 0.1)' : 'rgba(0,0,0,0.2)'}; color: white; cursor: pointer; transition: all 0.3s ease;">
              <span style="display: block; font-size: 1.5rem; margin-bottom: 0.25rem;">👷</span>
              <span style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase;">Personal</span>
            </button>
          </div>

          <form id="googleFinishForm">
            <div class="form-group mb-4" style="text-align: left;">
              <label class="form-label" style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Edificio</label>
              <select id="googleEdificio" class="form-input" required style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 1rem; color: white; width: 100%; border: 1px solid rgba(255,255,255,0.1);">
                  <option value="" disabled selected>Cargando edificios...</option>
              </select>
            </div>

            ${selectedRol === 'residente' ? `
            <div id="aptContainer" class="form-group mb-5" style="text-align: left;">
              <label class="form-label" style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Número de Departamento</label>
              <input type="text" id="googleApt" class="form-input" placeholder="Ej: 101-B" required style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 1rem; color: white; width: 100%; border: 1px solid rgba(255,255,255,0.1);">
            </div>
            ` : ''}

            <button type="submit" class="btn" id="finishBtn" style="width: 100%; padding: 1.25rem; background: linear-gradient(135deg, ${selectedRol === 'residente' ? 'var(--role-residente)' : 'var(--role-vigilante)'}, var(--primary-dark)); color: white; border: none; border-radius: 20px; font-weight: 800; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">
              FINALIZAR REGISTRO
            </button>
            
            <button type="button" onclick="window.location.reload()" class="btn btn-ghost" style="width: 100%; margin-top: 1rem; color: var(--text-muted);">Cancelar</button>
          </form>
        </div>
      </div>
    `;

    // Eventos de botones
    document.getElementById('setResidente').onclick = () => { selectedRol = 'residente'; renderGoogleForm(); };
    document.getElementById('setStaff').onclick = () => { selectedRol = 'vigilante'; renderGoogleForm(); };

    // Cargar edificios (solo si el select existe)
    loadEdificiosForGoogle();

    // Manejar envío
    const form = document.getElementById('googleFinishForm');
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const finishBtn = document.getElementById('finishBtn');
        finishBtn.disabled = true;
        finishBtn.innerText = "PROCESANDO...";

        try {
          const payload = {
            token_google: googleData.token_google,
            edificio_id: document.getElementById('googleEdificio').value,
            rol: selectedRol,
            apartamento: selectedRol === 'residente' ? document.getElementById('googleApt').value : null,
            telefono: ''
          };

          const response = await fetch(`${window.API_URL}/auth/google-register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Error al registrar");

          alert("✅ Registro exitoso. Un administrador debe aprobar tu cuenta.");
          window.navigateTo('/');
        } catch (err) {
          alert("❌ Error: " + err.message);
          finishBtn.disabled = false;
          finishBtn.innerText = "FINALIZAR REGISTRO";
        }
      };
    }
  };

  const loadEdificiosForGoogle = async () => {
    try {
      const res = await fetch(`${window.API_URL}/edificios/public`);
      const edificios = await res.json();
      const select = document.getElementById('googleEdificio');
      if (select) {
        select.innerHTML = '<option value="" disabled selected>Selecciona tu edificio...</option>';
        edificios.forEach(e => { select.innerHTML += `<option value="${e.id}">${e.nombre}</option>`; });
      }
    } catch (err) { console.error("Error edificios:", err); }
  };

  renderGoogleForm();
}
