// =====================================================
// REGISTER VIEW - Pantalla de registro rediseñada
// =====================================================

export function renderRegister(container) {
  container.innerHTML = `
    <div class="page" style="display: flex; align-items: center; justify-content: center; padding: 2rem; background: radial-gradient(circle at top left, var(--role-admin), transparent), radial-gradient(circle at bottom right, var(--role-residente), transparent); min-height: 100vh;">
      <div class="container" style="max-width: 400px; width: 100%; position: relative; z-index: 1;">
        
        <!-- Logo Premium -->
        <div class="text-center mb-5 fade-in">
          <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(10px); border-radius: var(--radius-2xl); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; box-shadow: var(--shadow-glow);">
            🏢
          </div>
          <h1 style="font-size: 2.25rem; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 0.5rem; background: linear-gradient(135deg, #fff, rgba(255,255,255,0.7)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Crear Cuenta
          </h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 0.95rem; font-weight: 500;">
            Únete a la gestión inteligente
          </p>
        </div>

        <!-- Selección de tipo de usuario -->
        <div id="userTypeSelection" class="card fade-in" style="background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(20px); padding: 2.5rem; box-shadow: var(--shadow-2xl); border-radius: var(--radius-2xl);">
          <h2 style="font-size: 1rem; font-weight: 700; color: white; text-align: center; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9;">¿Quién eres?</h2>
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <button id="btnResidente" class="btn btn-primary" style="width: 100%; padding: 1.5rem; font-size: 1.1rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-glow); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
              <span style="font-size: 1.5rem; margin-right: 0.75rem;">🏠</span> Residente
            </button>
            <button id="btnTrabajador" class="btn btn-secondary" style="width: 100%; padding: 1.5rem; font-size: 1.1rem; border-radius: var(--radius-xl); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
              <span style="font-size: 1.5rem; margin-right: 0.75rem;">👷</span> Personal
            </button>
          </div>
          
          <div class="mt-5 text-center">
            <p style="font-size: 0.9rem; color: rgba(255,255,255,0.5);">
              ¿Ya tienes una cuenta? 
              <br>
              <a href="#" id="backToLoginFromSelection" style="color: var(--role-residente); text-decoration: none; font-weight: 700; margin-top: 0.5rem; display: inline-block;">Iniciar sesión</a>
            </p>
          </div>
        </div>

        <!-- Formulario de Residente (Glassmorphism) -->
        <div id="formResidente" class="card fade-in" style="display: none; background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(20px); padding: 2rem; box-shadow: var(--shadow-2xl); border-radius: var(--radius-2xl);">
          <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
            <button id="backFromResidente" class="btn btn-ghost" style="padding: 0.5rem; color: rgba(255,255,255,0.6); font-weight: 600;">
              ← Volver
            </button>
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--role-residente); text-transform: uppercase; letter-spacing: 0.1em;">Registro</span>
          </div>
          
          <h2 style="font-size: 1.5rem; font-weight: 800; color: white; margin-bottom: 2rem; text-align: center;">🏠 Residente</h2>

          <form id="registerFormResidente" novalidate>
            <div class="form-group mb-4">
              <label class="form-label" style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase;">Nombre completo</label>
              <input type="text" class="form-input" id="nombreResidente" placeholder="Ej: Juan Pérez" required style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white;">
            </div>

            <div class="grid grid-2 gap-3 mb-4">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase;">Correo</label>
                <input type="email" class="form-input" id="emailResidente" placeholder="mail@ejemplo.com" required style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white;">
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase;">Teléfono</label>
                <input type="tel" class="form-input" id="telefonoResidente" placeholder="999 999 999" required style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white;">
              </div>
            </div>

            <div class="grid grid-2 gap-3 mb-4">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase;">Edificio</label>
                <select class="form-input" id="edificioResidente" required style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white;">
                  <option value="">Selección...</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase;">Dpto</label>
                <input type="text" class="form-input" id="apartamentoResidente" placeholder="101" required style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white;">
              </div>
            </div>

            <div class="grid grid-2 gap-3 mb-5">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase;">Contraseña</label>
                <input type="password" class="form-input" id="passwordResidente" placeholder="••••••••" minlength="6" required style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white;">
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase;">Confirmar</label>
                <input type="password" class="form-input" id="confirmPasswordResidente" placeholder="••••••••" required style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white;">
              </div>
            </div>

            <div id="errorMessageResidente" class="hidden" style="padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); border-radius: var(--radius-md); color: var(--danger); font-size: 0.8rem; margin-bottom: 1rem; text-align: center;">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1.25rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; border-radius: var(--radius-lg);">
              <span id="btnTextResidente">Finalizar Registro</span>
              <span id="spinnerResidente" class="hidden">
                <div class="loading-spinner" style="width: 20px; height: 20px; border-width: 3px;"></div>
              </span>
            </button>
          </form>
        </div>

        <!-- Formulario de Personal de Trabajo (Glassmorphism) -->
        <div id="formTrabajador" class="card fade-in" style="display: none; background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(20px); padding: 2rem; box-shadow: var(--shadow-2xl); border-radius: var(--radius-2xl);">
          <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
            <button id="backFromTrabajador" class="btn btn-ghost" style="padding: 0.5rem; color: rgba(255,255,255,0.6); font-weight: 600;">
              ← Volver
            </button>
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--role-vigilante); text-transform: uppercase; letter-spacing: 0.1em;">Staff</span>
          </div>

          <h2 style="font-size: 1.5rem; font-weight: 800; color: white; margin-bottom: 2rem; text-align: center;">👷 Personal</h2>

          <form id="registerFormTrabajador" novalidate>
            <div class="form-group mb-4">
              <label class="form-label" style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase;">Nombre completo</label>
              <input type="text" class="form-input" id="nombreTrabajador" placeholder="Ej: Juan Pérez" required style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white;">
            </div>

            <div class="form-group mb-4">
              <label class="form-label" style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase;">Correo electrónico</label>
              <input type="email" class="form-input" id="emailTrabajador" placeholder="mail@ejemplo.com" required style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white;">
            </div>

            <div class="grid grid-2 gap-3 mb-4">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase;">Celular</label>
                <input type="tel" class="form-input" id="telefonoTrabajador" placeholder="999 999 999" required style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white;">
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase;">Edificio</label>
                <select class="form-input" id="edificioTrabajador" required style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white;">
                  <option value="">Selección...</option>
                </select>
              </div>
            </div>

            <div class="grid grid-2 gap-3 mb-5">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase;">Contraseña</label>
                <input type="password" class="form-input" id="passwordTrabajador" placeholder="••••••••" minlength="6" required style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white;">
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase;">Confirmar</label>
                <input type="password" class="form-input" id="confirmPasswordTrabajador" placeholder="••••••••" required style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white;">
              </div>
            </div>

            <div id="errorMessageTrabajador" class="hidden" style="padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); border-radius: var(--radius-md); color: var(--danger); font-size: 0.8rem; margin-bottom: 1rem; text-align: center;">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1.25rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; border-radius: var(--radius-lg);">
              <span id="btnTextTrabajador">Finalizar Registro</span>
              <span id="spinnerTrabajador" class="hidden">
                <div class="loading-spinner" style="width: 20px; height: 20px; border-width: 3px;"></div>
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
  document.getElementById('registerFormResidente').addEventListener('submit', (e) => {
    e.preventDefault();
    handleRegisterResidente();
  });

  // Manejar formulario de Trabajador
  document.getElementById('registerFormTrabajador').addEventListener('submit', (e) => {
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
