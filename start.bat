@echo off
echo ========================================
echo   Codex POS - Beauty Accessories System
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install

echo.
echo [2/3] Setting up environment...
if not exist .env (
    copy .env.example .env
    echo Environment file created from template
) else (
    echo Environment file already exists
)

echo.
echo [3/3] Starting the server...
echo.
echo Backend will be available at: http://localhost:4000
echo Login page: frontend/login.html
echo Main app: frontend/index.html
echo API Documentation: http://localhost:4000/api/docs
echo Health Check: http://localhost:4000/health
echo.
echo Default login credentials:
echo - Admin: admin / Admin@123
echo - Manager: manager / Admin@123
echo - Cashier: cashier / Admin@123
echo.

start "" "frontend/login.html"
call npm run dev

pause