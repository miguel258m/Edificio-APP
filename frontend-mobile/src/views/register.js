// =====================================================
// REGISTER VIEW - Pantalla de registro rediseñada
// =====================================================

export function renderRegister(container) {
  container.innerHTML = `
    <div class="page" style="display: flex; align-items: center; justify-content: center; padding: 2rem; min-height: 100vh;">
      <div class="container" style="max-width: 400px; width: 100%;">
        
        <!-- Logo y título -->
        <div class="text-center mb-4 fade-in">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🏢</div>
          <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; background: linear-gradient(135deg, var(--primary-light), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Crear Cuenta
          </h1>
          <p style="color: var(--text-muted); font-size: 0.875rem;">
            Selecciona tu tipo de usuario
          </p>
        </div>

        <!-- Selección de tipo de usuario -->
        <div id="userTypeSelection" class="card fade-in">
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <button id="btnResidente" class="btn btn-primary" style="width: 100%; padding: 1.25rem; font-size: 1.1rem;">
              🏠 Residente
            </button>
            <button id="btnTrabajador" class="btn btn-secondary" style="width: 100%; padding: 1.25rem; font-size: 1.1rem;">
              👷 Personal de Trabajo
            </button>
          </div>
          
          <div class="mt-3 text-center">
            <p style="font-size: 0.875rem; color: var(--text-muted);">
              ¿Ya tienes cuenta? 
              <a href="#" id="backToLoginFromSelection" style="color: var(--primary); text-decoration: none;">Iniciar sesión</a>
            </p>
          </div>
        </div>

        <!-- Formulario de Residente (oculto inicialmente) -->
        <div id="formResidente" class="card fade-in" style="display: none;">
          <div style="margin-bottom: 1rem;">
            <button id="backFromResidente" class="btn" style="padding: 0.5rem; background: transparent; color: var(--text-muted);">
              ← Volver
            </button>
            <h2 style="text-align: center; font-size: 1.25rem; color: var(--text-primary); margin-top: 0.5rem;">
              🏠 Registro de Residente
            </h2>
          </div>

          <form id="registerFormResidente" novalidate>
            <div class="form-group">
              <label class="form-label">Nombre completo</label>
              <input type="text" class="form-input" id="nombreResidente" placeholder="Juan Pérez" required>
            </div>

            <div class="form-group">
              <label class="form-label">Correo electrónico</label>
              <input type="email" class="form-input" id="emailResidente" placeholder="tu@email.com" required>
            </div>

            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <input type="tel" class="form-input" id="telefonoResidente" placeholder="+51 999 999 999" required>
            </div>

            <div class="form-group">
              <label class="form-label">Edificio</label>
              <select class="form-input" id="edificioResidente" required>
                <option value="">Selecciona tu edificio</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Número de Departamento</label>
              <input type="text" class="form-input" id="apartamentoResidente" placeholder="101" required>
            </div>

            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-input" id="passwordResidente" placeholder="••••••••" minlength="6" required>
              <small style="color: var(--text-muted); font-size: 0.75rem;">Mínimo 6 caracteres</small>
            </div>

            <div class="form-group">
              <label class="form-label">Confirmar contraseña</label>
              <input type="password" class="form-input" id="confirmPasswordResidente" placeholder="••••••••" required>
            </div>

            <div id="errorMessageResidente" class="hidden" style="padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); border-radius: var(--radius-md); color: var(--danger); font-size: 0.875rem; margin-bottom: 1rem;">
            </div>

            <button type="submit" id="btnSubmitResidente" class="btn btn-primary" style="width: 100%;">
              <span id="btnTextResidente">Registrarse</span>
              <span id="spinnerResidente" class="hidden">
                <div class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
              </span>
            </button>
          </form>
        </div>

        <!-- Formulario de Personal de Trabajo (oculto inicialmente) -->
        <div id="formTrabajador" class="card fade-in" style="display: none;">
          <div style="margin-bottom: 1rem;">
            <button id="backFromTrabajador" class="btn" style="padding: 0.5rem; background: transparent; color: var(--text-muted);">
              ← Volver
            </button>
            <h2 style="text-align: center; font-size: 1.25rem; color: var(--text-primary); margin-top: 0.5rem;">
              👷 Registro de Personal
            </h2>
          </div>

          <form id="registerFormTrabajador" novalidate>
            <div class="form-group">
              <label class="form-label">Nombre completo</label>
              <input type="text" class="form-input" id="nombreTrabajador" placeholder="Juan Pérez" required>
            </div>

            <div class="form-group">
              <label class="form-label">Correo electrónico</label>
              <input type="email" class="form-input" id="emailTrabajador" placeholder="tu@email.com" required>
            </div>

            <div class="form-group">
              <label class="form-label">Celular</label>
              <input type="tel" class="form-input" id="telefonoTrabajador" placeholder="+51 999 999 999" required>
            </div>

            <div class="form-group">
              <label class="form-label">Edificio</label>
              <select class="form-input" id="edificioTrabajador" required>
                <option value="">Selecciona el edificio</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-input" id="passwordTrabajador" placeholder="••••••••" minlength="6" required>
              <small style="color: var(--text-muted); font-size: 0.75rem;">Mínimo 6 caracteres</small>
            </div>

            <div class="form-group">
              <label class="form-label">Confirmar contraseña</label>
              <input type="password" class="form-input" id="confirmPasswordTrabajador" placeholder="••••••••" required>
            </div>

            <div id="errorMessageTrabajador" class="hidden" style="padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); border-radius: var(--radius-md); color: var(--danger); font-size: 0.875rem; margin-bottom: 1rem;">
            </div>

            <button type="submit" id="btnSubmitTrabajador" class="btn btn-primary" style="width: 100%;">
              <span id="btnTextTrabajador">Registrarse</span>
              <span id="spinnerTrabajador" class="hidden">
                <div class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
              </span>
            </button>
          </form>
        </div>

      </div>
    </div>
  `;

  // Referencias a las secciones
  const userTypeSelection = document.getElementById('userTypeSelection');
  const formResidente = document.getElementById('formResidente');
  const formTrabajador = document.getElementById('formTrabajador');

  // Botones de selección de tipo
  document.getElementById('btnResidente').addEventListener('click', () => {
    userTypeSelection.style.display = 'none';
    formResidente.style.display = 'block';
    loadEdificios('edificioResidente');
  });

  document.getElementById('btnTrabajador').addEventListener('click', () => {
    console.log('🖱️ Click en Personal de Trabajo');
    userTypeSelection.style.display = 'none';
    formTrabajador.style.display = 'block';
    console.log('📋 Formulario Trabajador mostrado');
    loadEdificios('edificioTrabajador');
  });

  // Botones de volver
  document.getElementById('backFromResidente').addEventListener('click', () => {
    formResidente.style.display = 'none';
    userTypeSelection.style.display = 'block';
  });

  document.getElementById('backFromTrabajador').addEventListener('click', () => {
    formTrabajador.style.display = 'none';
    userTypeSelection.style.display = 'block';
  });

  // Volver al login
  document.getElementById('backToLoginFromSelection').addEventListener('click', (e) => {
    e.preventDefault();
    window.navigateTo('/');
  });

  // Manejar formulario de Residente
  document.getElementById('btnSubmitResidente').addEventListener('click', (e) => {
    e.preventDefault();
    handleRegisterResidente();
  });

  // Manejar formulario de Trabajador
  document.getElementById('btnSubmitTrabajador').addEventListener('click', (e) => {
    e.preventDefault();
    handleRegisterTrabajador();
  });
}

// Cargar edificios en un select específico
async function loadEdificios(selectId) {
  try {
    const response = await fetch(`${window.API_URL}/edificios/public`);
    if (!response.ok) throw new Error('Error al cargar edificios');

    const edificios = await response.json();
    const select = document.getElementById(selectId);

    if (!select) return;

    select.innerHTML = '<option value="">Selecciona el edificio</option>';

    edificios.forEach(edificio => {
      const option = document.createElement('option');
      option.value = edificio.id;
      option.textContent = edificio.nombre;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar edificios:', error);
    const select = document.getElementById(selectId);
    if (select) {
      select.innerHTML = `<option value="">❌ Error: ${error.message} (URL: ${window.API_URL})</option>`;
    }
  }
}

// Registrar Residente
async function handleRegisterResidente() {
  const nombre = document.getElementById('nombreResidente').value.trim();
  const email = document.getElementById('emailResidente').value.trim();
  const telefono = document.getElementById('telefonoResidente').value.trim();
  const edificio_id = document.getElementById('edificioResidente').value;
  const apartamento = document.getElementById('apartamentoResidente').value.trim();
  const password = document.getElementById('passwordResidente').value;
  const confirmPassword = document.getElementById('confirmPasswordResidente').value;

  const errorMessage = document.getElementById('errorMessageResidente');
  const btnText = document.getElementById('btnTextResidente');
  const spinner = document.getElementById('spinnerResidente');

  // Validaciones
  if (!nombre || !email || !telefono || !edificio_id || !apartamento || !password) {
    showError(errorMessage, 'Por favor completa todos los campos');
    return;
  }

  if (password !== confirmPassword) {
    showError(errorMessage, 'Las contraseñas no coinciden');
    return;
  }

  if (password.length < 6) {
    showError(errorMessage, 'La contraseña debe tener al menos 6 caracteres');
    return;
  }

  // Mostrar loading
  btnText.classList.add('hidden');
  spinner.classList.remove('hidden');
  errorMessage.classList.add('hidden');

  try {
    const response = await fetch(`${window.API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        edificio_id: parseInt(edificio_id),
        nombre,
        email,
        password,
        rol: 'residente',
        apartamento,
        telefono
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al registrar');
    }

    // Mostrar mensaje de éxito
    alert('✅ Registro exitoso\n\nDebes esperar a que el administrador te dé los accesos.\n\nSerás redirigido al inicio de sesión.');
    window.navigateTo('/');

  } catch (error) {
    showError(errorMessage, error.message);
    btnText.classList.remove('hidden');
    spinner.classList.add('hidden');
  }
}

// Registrar Trabajador
async function handleRegisterTrabajador() {
  const nombre = document.getElementById('nombreTrabajador').value.trim();
  const email = document.getElementById('emailTrabajador').value.trim();
  const telefono = document.getElementById('telefonoTrabajador').value.trim();
  const edificio_id = document.getElementById('edificioTrabajador').value;
  const password = document.getElementById('passwordTrabajador').value;
  const confirmPassword = document.getElementById('confirmPasswordTrabajador').value;

  const errorMessage = document.getElementById('errorMessageTrabajador');
  const btnText = document.getElementById('btnTextTrabajador');
  const spinner = document.getElementById('spinnerTrabajador');

  // Validaciones
  if (!nombre || !email || !telefono || !edificio_id || !password) {
    showError(errorMessage, 'Por favor completa todos los campos');
    return;
  }

  if (password !== confirmPassword) {
    showError(errorMessage, 'Las contraseñas no coinciden');
    return;
  }

  if (password.length < 6) {
    showError(errorMessage, 'La contraseña debe tener al menos 6 caracteres');
    return;
  }

  // Mostrar loading
  btnText.classList.add('hidden');
  spinner.classList.remove('hidden');
  errorMessage.classList.add('hidden');

  try {
    const response = await fetch(`${window.API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        edificio_id: parseInt(edificio_id),
        nombre,
        email,
        password,
        rol: 'residente',  // Usamos 'residente' porque la DB no tiene 'trabajador' en el enum
        apartamento: null,
        telefono
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al registrar');
    }

    // Mostrar mensaje de éxito
    alert('✅ Registro exitoso\n\nDebes esperar a que el administrador te dé los accesos.\n\nSerás redirigido al inicio de sesión.');
    window.navigateTo('/');

  } catch (error) {
    showError(errorMessage, error.message);
    btnText.classList.remove('hidden');
    spinner.classList.add('hidden');
  }
}

// Función helper para mostrar errores
function showError(element, message) {
  element.textContent = message;
  element.classList.remove('hidden');
}
