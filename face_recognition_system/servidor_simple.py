#!/usr/bin/env python3
"""
Servidor HTTP simple para el Sistema de Reconocimiento Facial
No requiere Flask, solo usa la librería estándar de Python
"""

import http.server
import socketserver
import webbrowser
import os
import json
from datetime import datetime
import threading
import time

class FaceRecognitionHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/face' or self.path == '/':
            # Servir la página principal
            self.path = '/demo_estatico.html'
        elif self.path == '/api/status':
            # API de estado
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                'status': 'active',
                'message': 'Sistema de Reconocimiento Facial funcionando',
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'features': [
                    'Detección facial en tiempo real',
                    'Captura de coordenadas',
                    'Registro de fecha y hora',
                    'Identificación de personas',
                    'Exportación a Excel'
                ],
                'developer': 'Andrés Mogollón',
                'version': '1.0.0'
            }
            
            self.wfile.write(json.dumps(response, indent=2).encode())
            return
        
        # Servir archivos estáticos normalmente
        super().do_GET()
    
    def do_POST(self):
        if self.path == '/detect_face':
            # Simular detección facial
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            # Simular datos de detección
            import random
            known_faces = ['Andrés Mogollón', 'María García', 'Juan Pérez', 'Ana López']
            
            num_faces = random.randint(0, 3)
            results = []
            timestamp = datetime.now()
            
            for i in range(num_faces):
                is_known = random.random() > 0.3
                name = random.choice(known_faces) if is_known else 'Desconocido'
                confidence = (0.8 + random.random() * 0.2) if is_known else (0.2 + random.random() * 0.4)
                
                result = {
                    'id': i + 1,
                    'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                    'name': name,
                    'coordinates': {
                        'x': random.randint(100, 500),
                        'y': random.randint(100, 400)
                    },
                    'confidence': round(confidence, 3),
                    'image_path': f'face_{timestamp.strftime("%Y%m%d_%H%M%S")}_{i}.jpg',
                    'status': 'detected'
                }
                results.append(result)
            
            response = {
                'success': True,
                'results': results,
                'total_faces': num_faces,
                'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S')
            }
            
            self.wfile.write(json.dumps(response, indent=2).encode())
            return
        
        # Para otras rutas POST
        self.send_response(404)
        self.end_headers()
    
    def log_message(self, format, *args):
        # Personalizar mensajes de log
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {format % args}")

def start_server(port=5000):
    """Iniciar el servidor HTTP"""
    try:
        # Cambiar al directorio del script
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        
        with socketserver.TCPServer(("", port), FaceRecognitionHandler) as httpd:
            print("=" * 60)
            print("🤖 SISTEMA DE RECONOCIMIENTO FACIAL")
            print("👨‍💻 Desarrollado por: Andrés Mogollón")
            print("=" * 60)
            print(f"🚀 Servidor iniciado en puerto {port}")
            print(f"🌐 URL: http://localhost:{port}")
            print(f"📱 Página principal: http://localhost:{port}/face")
            print(f"🔧 API Status: http://localhost:{port}/api/status")
            print("=" * 60)
            print("💡 Presiona Ctrl+C para detener el servidor")
            print("=" * 60)
            
            # Abrir navegador automáticamente
            def open_browser():
                time.sleep(1)
                webbrowser.open(f'http://localhost:{port}/face')
            
            browser_thread = threading.Thread(target=open_browser)
            browser_thread.daemon = True
            browser_thread.start()
            
            # Iniciar servidor
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 10048:  # Puerto en uso en Windows
            print(f"❌ Error: El puerto {port} ya está en uso")
            print("💡 Intenta con otro puerto o cierra la aplicación que lo esté usando")
        else:
            print(f"❌ Error iniciando servidor: {e}")
    except KeyboardInterrupt:
        print("\n\n🛑 Servidor detenido por el usuario")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

if __name__ == '__main__':
    # Intentar puerto 5000, si no está disponible usar 8000
    try:
        start_server(5000)
    except:
        print("⚠️  Puerto 5000 no disponible, intentando puerto 8000...")
        start_server(8000)
