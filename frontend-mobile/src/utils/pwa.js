
// Gestiona la instalación de la PWA
let deferredPrompt;

export function initPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevenir que el navegador muestre el banner nativo de inmediato
        e.preventDefault();
        // Guardar el evento para dispararlo después
        deferredPrompt = e;

        // Mostrar botón de instalar si existe en el DOM
        const installBtn = document.getElementById('btnInstallApp');
        if (installBtn) {
            installBtn.classList.remove('hidden');
            installBtn.addEventListener('click', async () => {
                if (!deferredPrompt) return;

                // Mostrar prompt nativo
                deferredPrompt.prompt();

                // Esperar respuesta del usuario
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to install prompt: ${outcome}`);

                deferredPrompt = null;
                installBtn.classList.add('hidden');
            });
        }
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        const installBtn = document.getElementById('btnInstallApp');
        if (installBtn) installBtn.classList.add('hidden');
    });
}
