@echo off
echo ================================================
echo    SISTEMA DE RECONOCIMIENTO FACIAL
echo    Desarrollado por: Andres Mogollon
echo ================================================
echo.
echo Iniciando sistema...
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no esta instalado o no esta en el PATH
    echo Por favor instala Python desde https://python.org
    pause
    exit /b 1
)

REM Instalar dependencias básicas
echo Instalando dependencias...
pip install flask >nul 2>&1

REM Iniciar servidor
echo.
echo Iniciando servidor en http://localhost:5000
echo Presiona Ctrl+C para detener el servidor
echo.
python test_server.py

pause
