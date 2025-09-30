#!/usr/bin/env python3
"""
Sistema de Reconocimiento Facial - Versión Simplificada
Funciona sin dependencias complejas para demostración
"""

from flask import Flask, render_template, request, jsonify
import base64
import json
from datetime import datetime
import os
import random

app = Flask(__name__)

# Crear carpetas si no existen
os.makedirs('data/detected_faces', exist_ok=True)
os.makedirs('data/reports', exist_ok=True)

# Simulación de rostros conocidos
known_faces = {
    'Andrés Mogollón': {'confidence': 0.95, 'id': 1},
    'María García': {'confidence': 0.87, 'id': 2},
    'Juan Pérez': {'confidence': 0.92, 'id': 3},
    'Ana López': {'confidence': 0.89, 'id': 4}
}

detection_history = []

@app.route('/')
def index():
    return render_template('face_detection.html')

@app.route('/face')
def face_detection():
    return render_template('face_detection.html')

@app.route('/detect_face', methods=['POST'])
def detect_face():
    try:
        data = request.get_json()
        image_data = data['image']
        
        # Simular detección de rostros
        num_faces = random.randint(0, 3)
        results = []
        timestamp = datetime.now()
        
        for i in range(num_faces):
            # Simular coordenadas aleatorias
            x = random.randint(100, 500)
            y = random.randint(100, 400)
            
            # Simular identificación
            if random.random() > 0.3:  # 70% de probabilidad de reconocer
                name = random.choice(list(known_faces.keys()))
                confidence = known_faces[name]['confidence'] + random.uniform(-0.1, 0.1)
            else:
                name = "Desconocido"
                confidence = random.uniform(0.2, 0.6)
            
            # Crear resultado
            result = {
                'id': len(detection_history) + 1,
                'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'name': name,
                'coordinates': {
                    'x': x,
                    'y': y,
                    'left': x - 50,
                    'top': y - 50,
                    'right': x + 50,
                    'bottom': y + 50
                },
                'confidence': round(confidence, 3),
                'image_path': f'face_{timestamp.strftime("%Y%m%d_%H%M%S")}_{i}.jpg',
                'status': 'detected'
            }
            
            results.append(result)
            detection_history.append(result)
        
        return jsonify({
            'success': True, 
            'results': results,
            'total_faces': num_faces,
            'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S')
        })
        
    except Exception as e:
        print(f"❌ Error en detección: {e}")
        return jsonify({
            'success': False, 
            'error': str(e)
        })

@app.route('/get_history')
def get_history():
    return jsonify({
        'success': True,
        'history': detection_history[-50:],
        'total': len(detection_history)
    })

@app.route('/export_excel')
def export_excel():
    try:
        if not detection_history:
            return jsonify({'success': False, 'error': 'No hay datos para exportar'})
        
        # Simular exportación exitosa
        filename = f"reporte_facial_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        return jsonify({
            'success': True,
            'filename': filename,
            'message': f'Reporte exportado exitosamente: {filename}'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/clear_history', methods=['POST'])
def clear_history():
    global detection_history
    detection_history = []
    return jsonify({'success': True, 'message': 'Historial limpiado'})

@app.route('/add_face', methods=['POST'])
def add_face():
    try:
        data = request.get_json()
        name = data['name']
        
        # Simular agregar rostro
        known_faces[name] = {'confidence': 0.85, 'id': len(known_faces) + 1}
        
        return jsonify({
            'success': True,
            'message': f'Rostro de {name} agregado exitosamente',
            'total_faces': len(known_faces)
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/status')
def status():
    return jsonify({
        'status': 'active',
        'known_faces': len(known_faces),
        'total_detections': len(detection_history),
        'last_detection': detection_history[-1]['timestamp'] if detection_history else 'N/A'
    })

if __name__ == '__main__':
    print("🚀 Iniciando Sistema de Reconocimiento Facial (Versión Demo)...")
    print("🌐 Servidor iniciado en http://localhost:5000")
    print("📱 Accede a http://localhost:5000/face para usar el sistema")
    print("⚠️  Esta es una versión de demostración con detección simulada")
    app.run(debug=True, host='0.0.0.0', port=5000)
