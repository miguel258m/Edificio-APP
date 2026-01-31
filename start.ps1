# Iniciar backend en segundo plano
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

# Esperar 3 segundos
Start-Sleep -Seconds 3

# Iniciar frontend móvil
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend-mobile; npm run dev"

Write-Host ""
Write-Host "✅ ========================================" -ForegroundColor Green
Write-Host "🏢 Aplicación iniciada correctamente" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📱 App móvil: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔌 Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para acceder desde tu celular:" -ForegroundColor Yellow
Write-Host "1. Encuentra tu IP con: ipconfig" -ForegroundColor Yellow
Write-Host "2. Abre en tu celular: http://TU_IP:5173" -ForegroundColor Yellow
Write-Host ""
