import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Edificio App',
                short_name: 'Edificio',
                description: 'Sistema de administración de edificios',
                theme_color: '#6366f1',
                background_color: '#0f172a',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: '/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/api\./,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 300
                            }
                        }
                    }
                ]
            }
        })
    ],
    server: {
        host: '0.0.0.0', // Permite acceso desde otros dispositivos en la red
        port: 5173
    }
});
