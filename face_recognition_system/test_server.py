#!/usr/bin/env python3
"""
Servidor de prueba simple para verificar que Flask funciona
"""

try:
    from flask import Flask, render_template_string
    print("✅ Flask importado correctamente")
except ImportError as e:
    print(f"❌ Error importando Flask: {e}")
    exit(1)

app = Flask(__name__)

# Página HTML simple embebida
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🤖 Sistema de Reconocimiento Facial - Demo</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 3rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 600px;
        }
        h1 {
            color: #667eea;
            margin-bottom: 1rem;
        }
        .status {
            background: #28a745;
            color: white;
            padding: 1rem;
            border-radius: 10px;
            margin: 2rem 0;
        }
        .features {
            text-align: left;
            margin: 2rem 0;
        }
        .feature {
            padding: 0.5rem 0;
            border-bottom: 1px solid #eee;
        }
        .btn {
            background: #667eea;
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            cursor: pointer;
            margin: 1rem;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover {
            background: #5a6fd8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 Sistema de Reconocimiento Facial</h1>
        <p><strong>Desarrollado por: Andrés Mogollón</strong></p>
        
        <div class="status">
            ✅ <strong>Servidor funcionando correctamente</strong><br>
            🌐 Puerto: 5000<br>
            📱 URL: http://localhost:5000/face
        </div>
        
        <div class="features">
            <h3>🎯 Funcionalidades del Sistema:</h3>
            <div class="feature">✅ Detección facial en tiempo real</div>
            <div class="feature">✅ Identificación de personas conocidas</div>
            <div class="feature">✅ Captura de coordenadas (X, Y)</div>
            <div class="feature">✅ Registro de fecha y hora</div>
            <div class="feature">✅ Exportación a Excel</div>
            <div class="feature">✅ Interfaz web moderna</div>
        </div>
        
        <p><strong>🎉 ¡El sistema está listo para usar!</strong></p>
        <p>Haz clic en el botón para acceder a la aplicación completa:</p>
        
        <a href="/face" class="btn">🚀 Acceder al Sistema</a>
        
        <div style="margin-top: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 10px;">
            <h4>📋 Datos que captura el sistema:</h4>
            <ul style="text-align: left; display: inline-block;">
                <li><strong>Fecha y Hora:</strong> Timestamp exacto de detección</li>
                <li><strong>Nombre:</strong> Persona identificada</li>
                <li><strong>Coordenadas:</strong> Posición X, Y del rostro</li>
                <li><strong>Confianza:</strong> Nivel de certeza (0-100%)</li>
                <li><strong>Imagen:</strong> Foto del rostro capturado</li>
            </ul>
        </div>
    </div>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route('/face')
def face_detection():
    return render_template_string(HTML_TEMPLATE)

@app.route('/test')
def test():
    return jsonify({
        'status': 'success',
        'message': 'Servidor funcionando correctamente',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    })

if __name__ == '__main__':
    print("🚀 Iniciando servidor de prueba...")
    print("🌐 Servidor iniciado en http://localhost:5000")
    print("📱 Accede a http://localhost:5000 para ver la página")
    print("🔧 Accede a http://localhost:5000/test para verificar API")
    
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"❌ Error iniciando servidor: {e}")
        print("💡 Verifica que el puerto 5000 no esté en uso")
