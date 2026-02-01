// =====================================================
// REGISTER VIEW - Pantalla de registro
// =====================================================

export function renderRegister(container) {
  container.innerHTML = `
    <div class="page" style="display: flex; align-items: center; justify-content: center; padding: 2rem;">
      <div class="container" style="max-width: 400px;">
        
        <!-- Logo y título -->
        <div class="text-center mb-4">
          <div style="width: 80px; height: 80px; margin: 0 auto 1rem; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; box-shadow: var(--shadow-glow);">
            🏢
          </div>
          <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; background: linear-gradient(135deg, var(--primary-light), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Crear Cuenta
          </h1>
          <p style="color: var(--text-muted); font-size: 0.875rem;">
            Regístrate para acceder al sistema
          </p>
        </div>

        <!-- Formulario de registro -->
        <div class="card fade-in">
          <form id="registerForm">
            <div class="form-group">
              <label class="form-label">Nombre completo</label>
              <input 
                type="text" 
                class="form-input" 
                id="nombre" 
                placeholder="Juan Pérez"
                required
                autocomplete="name"
              >
            </div>

            <div class="form-group">
              <label class="form-label">Correo electrónico</label>
              <input 
                type="email" 
                class="form-input" 
                id="email" 
                placeholder="tu@gmail.com"
                required
                autocomplete="email"
              >
            </div>

            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <input 
                type="tel" 
                class="form-input" 
                id="telefono" 
                placeholder="+51 999 999 999"
                required
                autocomplete="tel"
              >
            </div>

            <div class="form-group">
              <label class="form-label">Edificio</label>
              <select class="form-input" id="edificio_id" required>
                <option value="">Selecciona tu edificio</option>
              </select>
            </div>

              <label class="form-label">Tipo de usuario</label>
              <select class="form-input" id="rol" required>
                <option value="residente">Residente</option>
                <option value="vigilante">Vigilante</option>
                <option value="limpieza">Personal de Limpieza</option>
                <option value="gerente">Gerente</option>
              </select>
            </div>

            <div class="form-group" id="apartamentoGroup">
              <label class="form-label">Apartamento</label>
              <input 
                type="text" 
                class="form-input" 
                id="apartamento" 
                placeholder="101"
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
                autocomplete="new-password"
                minlength="6"
              >
              <small style="color: var(--text-muted); font-size: 0.75rem;">Mínimo 6 caracteres</small>
            </div>

            <div class="form-group">
              <label class="form-label">Confirmar contraseña</label>
              <input 
                type="password" 
                class="form-input" 
                id="confirmPassword" 
                placeholder="••••••••"
                required
                autocomplete="new-password"
              >
            </div>

            <div id="errorMessage" class="hidden" style="padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); border-radius: var(--radius-md); color: var(--danger); font-size: 0.875rem; margin-bottom: 1rem;">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%;">
              <span id="registerBtnText">Crear Cuenta</span>
              <span id="registerSpinner" class="hidden">
                <div class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
              </span>
            </button>
          </form>

          <div class="mt-3 text-center">
            <p style="font-size: 0.875rem; color: var(--text-muted);">
              ¿Ya tienes cuenta? 
              <a href="#" id="backToLogin" style="color: var(--primary); text-decoration: none;">Iniciar sesión</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  `;

  // Cargar edificios con un pequeño delay para asegurar que API_URL esté listo
  setTimeout(() => {
    loadEdificios();
  }, 100);

  // Manejar cambio de rol
  const rolSelect = document.getElementById('rol');
  const apartamentoGroup = document.getElementById('apartamentoGroup');

  rolSelect.addEventListener('change', (e) => {
    if (e.target.value === 'vigilante') {
      apartamentoGroup.style.display = 'none';
      document.getElementById('apartamento').required = false;
    } else {
      apartamentoGroup.style.display = 'block';
      document.getElementById('apartamento').required = true;
    }
  });

  // Manejar envío del formulario
  const form = document.getElementById('registerForm');
  form.addEventListener('submit', handleRegister);

  // Botón volver al login
  document.getElementById('backToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    window.navigateTo('/');
  });
}

async function loadEdificios() {
  try {
    const response = await fetch(`${window.API_URL}/edificios/public`);
    const edificios = await response.json();

    const select = document.getElementById('edificio_id');
    edificios.forEach(edificio => {
      const option = document.createElement('option');
      option.value = edificio.id;
      option.textContent = edificio.nombre;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar edificios:', error);
    const select = document.getElementById('edificio_id');
    if (select) {
      select.innerHTML = '<option value="">❌ Error al cargar edificios</option>';
    }
  }
}

async function handleRegister(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const telefono = document.getElementById('telefono').value;
  const edificio_id = document.getElementById('edificio_id').value;
  const rol = document.getElementById('rol').value;
  const apartamento = document.getElementById('apartamento').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  const errorMessage = document.getElementById('errorMessage');
  const registerBtnText = document.getElementById('registerBtnText');
  const registerSpinner = document.getElementById('registerSpinner');

  // Validar contraseñas
  if (password !== confirmPassword) {
    errorMessage.textContent = 'Las contraseñas no coinciden';
    errorMessage.classList.remove('hidden');
    return;
  }

  // Mostrar loading
  registerBtnText.classList.add('hidden');
  registerSpinner.classList.remove('hidden');
  errorMessage.classList.add('hidden');

  try {
    const response = await fetch(`${window.API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        edificio_id: parseInt(edificio_id),
        nombre,
        email,
        password,
        rol,
        apartamento: rol === 'residente' ? apartamento : 'Caseta',
        telefono
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al registrar usuario');
    }

    if (data.needsApproval) {
      alert('✅ Registro exitoso\n\n' + data.message + '\n\nSerás redirigido al inicio de sesión.');
      window.navigateTo('/');
      return;
    }

    // Usuario aprobado automáticamente (vigilante/admin)
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    window.appState.token = data.token;
    window.appState.user = data.user;

    // Redirigir según el rol
    if (data.user.rol === 'residente') {
      window.navigateTo('/dashboard-residente');
    } else if (data.user.rol === 'vigilante') {
      window.navigateTo('/dashboard-vigilante');
    }

  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.classList.remove('hidden');
    registerBtnText.classList.remove('hidden');
    registerSpinner.classList.add('hidden');
  }
}
