// =====================================================
// REGISTER VIEW - Pantalla de registro rediseñada
// =====================================================

export function renderRegister(container) {
  container.innerHTML = `
    <div class="page" style="display: flex; align-items: center; justify-content: center; padding: 2rem; background: radial-gradient(circle at 0% 0%, var(--bg-secondary), transparent 40%), radial-gradient(circle at 100% 100%, var(--bg-primary), transparent 40%); background-color: var(--bg-primary); min-height: 100vh;">

      <div class="container" style="max-width: 420px; width: 100%; position: relative; z-index: 1;">
        
        <!-- Logo Elite -->
        <div class="text-center mb-5 fade-in">
          <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(12px); border-radius: 24px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; box-shadow: var(--shadow-glow);">
            🏢
          </div>
          <h1 style="font-size: 2.5rem; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 0.5rem; background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.6) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Crear Cuenta
          </h1>
          <p style="color: var(--text-secondary); font-size: 1rem; font-weight: 500; opacity: 0.8;">
            Únete a la gestión inteligente
          </p>
        </div>

        <!-- Selección de tipo (Elite Glass) -->
        <div id="userTypeSelection" class="card fade-in" style="background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(24px); padding: 3rem 2rem; box-shadow: var(--shadow-2xl); border-radius: 28px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);"></div>
          
          <h2 style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-align: center; margin-bottom: 2.5rem; text-transform: uppercase; letter-spacing: 0.2em;">¿Cuál es tu rol?</h2>
          
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <button id="btnResidente" class="btn" style="width: 100%; padding: 1.5rem; font-size: 1.1rem; border-radius: 20px; background: linear-gradient(135deg, var(--role-residente), var(--secondary-dark)); color: white; border: none; font-weight: 700; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4); display: flex; align-items: center; justify-content: start;">
              <span style="font-size: 1.75rem; background: rgba(255,255,255,0.2); width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; margin-right: 1.25rem;">🏠</span>
              <div style="text-align: left;">
                <div style="display: block;">Residente</div>
                <div style="font-size: 0.75rem; opacity: 0.8; font-weight: 400;">Dueño o inquilino</div>
              </div>
            </button>

            <button id="btnTrabajador" class="btn" style="width: 100%; padding: 1.5rem; font-size: 1.1rem; border-radius: 20px; background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); font-weight: 700; display: flex; align-items: center; justify-content: start; transition: all 0.3s ease;">
              <span style="font-size: 1.75rem; background: rgba(255,255,255,0.05); width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; margin-right: 1.25rem;">👷</span>
              <div style="text-align: left;">
                <div style="display: block;">Personal</div>
                <div style="font-size: 0.75rem; opacity: 0.8; font-weight: 400;">Limpieza, Seguridad, etc.</div>
              </div>
            </button>
          </div>
          
          <div class="mt-5 text-center">
            <p style="font-size: 0.95rem; color: var(--text-muted);">
              ¿Ya tienes una cuenta? 
              <a href="#" id="backToLoginFromSelection" style="color: var(--role-residente); text-decoration: none; font-weight: 700; margin-left: 0.5rem; border-bottom: 2px solid rgba(59, 130, 246, 0.3);">Iniciar sesión</a>
            </p>
          </div>
        </div>

        <!-- Formulario (Elite Refined) -->
        <!-- Residente -->
        <div id="formResidente" class="card fade-in" style="display: none; background: var(--bg-secondary); border: 1px solid var(--glass-border); padding: 2.5rem 2rem; box-shadow: var(--shadow-2xl); border-radius: 28px;">
          <div style="margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between;">
            <button id="backFromResidente" class="btn btn-ghost" style="padding: 0.6rem 1rem; color: var(--text-secondary); background: rgba(255,255,255,0.05); border-radius: 12px; font-weight: 600; font-size: 0.8rem;">
              ← VOLVER
            </button>
            <span style="font-size: 0.7rem; font-weight: 800; color: var(--role-residente); text-transform: uppercase; letter-spacing: 0.15em; background: rgba(59, 130, 246, 0.1); padding: 0.4rem 0.8rem; border-radius: 8px;">RESIDENTE</span>
          </div>
          
          <form id="registerFormResidente" novalidate>
            <div class="form-group mb-4">
              <label class="form-label" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Nombre Completo</label>
              <input type="text" class="form-input" id="nombreResidente" placeholder="Juan Pérez" required style="background: var(--bg-primary); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 1rem; border-radius: 14px;">
            </div>

            <div class="grid grid-2 gap-3 mb-4">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Correo</label>
                <input type="email" class="form-input" id="emailResidente" placeholder="mail@ej.com" required style="background: var(--bg-primary); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 1rem; border-radius: 14px;">
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Teléfono</label>
                <input type="tel" class="form-input" id="telefonoResidente" placeholder="999..." required style="background: var(--bg-primary); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 1rem; border-radius: 14px;">
              </div>
            </div>

            <div class="grid grid-2 gap-3 mb-4">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Edificio</label>
                <select class="form-input" id="edificioResidente" required style="background: var(--bg-primary); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 1rem; border-radius: 14px; appearance: none; background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23cbd5e1%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 0.65rem auto;">
                  <option value="" disabled selected>Selecciona...</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Dpto</label>
                <input type="text" class="form-input" id="apartamentoResidente" placeholder="101" required style="background: var(--bg-primary); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 1rem; border-radius: 14px;">
              </div>
            </div>

            <div class="grid grid-2 gap-3 mb-5">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Contraseña</label>
                <input type="password" class="form-input" id="passwordResidente" placeholder="••••••••" minlength="6" required style="background: var(--bg-primary); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 1rem; border-radius: 14px;">
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Confirmar</label>
                <input type="password" class="form-input" id="confirmPasswordResidente" placeholder="••••••••" required style="background: var(--bg-primary); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 1rem; border-radius: 14px;">
              </div>
            </div>

            <div id="errorMessageResidente" class="hidden" style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); border-radius: 14px; color: var(--danger); font-size: 0.85rem; margin-bottom: 1.5rem; text-align: center; font-weight: 600;">
            </div>

            <button type="submit" class="btn" style="width: 100%; padding: 1.25rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 16px; background: linear-gradient(135deg, var(--role-residente), var(--secondary-dark)); color: white; border: none; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);">
              <span id="btnTextResidente">Finalizar Registro</span>
              <span id="spinnerResidente" class="hidden">
                <div class="loading-spinner" style="width: 22px; height: 22px; border-width: 3px;"></div>
              </span>
            </button>
          </form>
        </div>

        <!-- Personal -->
        <div id="formTrabajador" class="card fade-in" style="display: none; background: var(--bg-secondary); border: 1px solid var(--glass-border); padding: 2.5rem 2rem; box-shadow: var(--shadow-2xl); border-radius: 28px;">
          <div style="margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between;">
            <button id="backFromTrabajador" class="btn btn-ghost" style="padding: 0.6rem 1rem; color: var(--text-secondary); background: rgba(255,255,255,0.05); border-radius: 12px; font-weight: 600; font-size: 0.8rem;">
              ← VOLVER
            </button>
            <span style="font-size: 0.7rem; font-weight: 800; color: var(--role-vigilante); text-transform: uppercase; letter-spacing: 0.15em; background: rgba(71, 85, 105, 0.1); padding: 0.4rem 0.8rem; border-radius: 8px;">STAFF</span>
          </div>

          <form id="registerFormTrabajador" novalidate>
            <div class="form-group mb-4">
              <label class="form-label" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Nombre Completo</label>
              <input type="text" class="form-input" id="nombreTrabajador" placeholder="Ej: Juan Pérez" required style="background: var(--bg-primary); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 1rem; border-radius: 14px;">
            </div>

            <div class="form-group mb-4">
              <label class="form-label" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Correo Electrónico</label>
              <input type="email" class="form-input" id="emailTrabajador" placeholder="mail@ejemplo.com" required style="background: var(--bg-primary); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 1rem; border-radius: 14px;">
            </div>

            <div class="grid grid-2 gap-3 mb-4">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Celular</label>
                <input type="tel" class="form-input" id="telefonoTrabajador" placeholder="999..." required style="background: var(--bg-primary); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 1rem; border-radius: 14px;">
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Edificio</label>
                <select class="form-input" id="edificioTrabajador" required style="background: var(--bg-primary); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 1rem; border-radius: 14px; appearance: none; background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23cbd5e1%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 0.65rem auto;">
                  <option value="" disabled selected>Selecciona...</option>
                </select>
              </div>
            </div>

            <div class="grid grid-2 gap-3 mb-5">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Contraseña</label>
                <input type="password" class="form-input" id="passwordTrabajador" placeholder="••••••••" minlength="6" required style="background: var(--bg-primary); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 1rem; border-radius: 14px;">
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Confirmar</label>
                <input type="password" class="form-input" id="confirmPasswordTrabajador" placeholder="••••••••" required style="background: var(--bg-primary); border: 1px solid rgba(255,255,255,0.05); color: white; padding: 1rem; border-radius: 14px;">
              </div>
            </div>

            <div id="errorMessageTrabajador" class="hidden" style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); border-radius: 14px; color: var(--danger); font-size: 0.85rem; margin-bottom: 1.5rem; text-align: center; font-weight: 600;">
            </div>

            <button type="submit" class="btn" style="width: 100%; padding: 1.25rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 16px; background: linear-gradient(135deg, var(--role-admin), var(--primary-dark)); color: white; border: none; box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);">
              <span id="btnTextTrabajador">Finalizar Registro</span>
              <span id="spinnerTrabajador" class="hidden">
                <div class="loading-spinner" style="width: 22px; height: 22px; border-width: 3px;"></div>
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
