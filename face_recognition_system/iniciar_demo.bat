@echo off
echo ================================================
echo    SISTEMA DE RECONOCIMIENTO FACIAL
echo    Desarrollado por: Andres Mogollon
echo ================================================
echo.
echo Iniciando demo del sistema...
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no esta instalado o no esta en el PATH
    echo Por favor instala Python desde https://python.org
    pause
    exit /b 1
)

echo Python encontrado. Iniciando servidor...
echo.

REM Iniciar servidor HTTP simple
echo Iniciando servidor en puerto 5000...
start /min python servidor_simple.py

REM Esperar un momento para que el servidor inicie
timeout /t 3 /nobreak >nul

REM Abrir navegador
echo Abriendo navegador...
start http://localhost:5000/face

echo.
echo ================================================
echo    SISTEMA INICIADO CORRECTAMENTE
echo ================================================
echo.
echo El sistema de reconocimiento facial esta funcionando en:
echo URL: http://localhost:5000/face
echo.
echo Para detener el servidor, cierra esta ventana o presiona Ctrl+C
echo.
pause
