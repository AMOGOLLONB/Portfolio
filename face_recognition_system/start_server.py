#!/usr/bin/env python3
"""
Iniciador del Sistema de Reconocimiento Facial
Maneja automáticamente las dependencias y inicia el servidor
"""

import sys
import subprocess
import os

def install_package(package):
    """Instalar paquete usando pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        return True
    except subprocess.CalledProcessError:
        return False

def check_and_install_dependencies():
    """Verificar e instalar dependencias necesarias"""
    required_packages = [
        'flask',
        'opencv-python',
        'face-recognition',
        'pandas',
        'openpyxl',
        'numpy',
        'pillow'
    ]
    
    print("🔍 Verificando dependencias...")
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package} - OK")
        except ImportError:
            print(f"⚠️  {package} - Instalando...")
            if install_package(package):
                print(f"✅ {package} - Instalado correctamente")
            else:
                print(f"❌ {package} - Error en la instalación")
                return False
    
    return True

def start_server():
    """Iniciar el servidor Flask"""
    print("\n🚀 Iniciando Sistema de Reconocimiento Facial...")
    
    # Verificar si tenemos todas las dependencias
    try:
        from flask import Flask, render_template, request, jsonify
        import cv2
        import face_recognition
        import numpy as np
        import pandas as pd
        from datetime import datetime
        import os
        import pickle
        import base64
        from io import BytesIO
        import json
        
        print("✅ Todas las dependencias están disponibles")
        print("🌐 Iniciando servidor completo...")
        
        # Importar y ejecutar la aplicación completa
        from app import app
        app.run(debug=True, host='0.0.0.0', port=5000)
        
    except ImportError as e:
        print(f"⚠️  Dependencia faltante: {e}")
        print("🔄 Iniciando versión simplificada...")
        
        # Ejecutar versión simplificada
        from app_simple import app
        app.run(debug=True, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    print("=" * 60)
    print("🤖 SISTEMA DE RECONOCIMIENTO FACIAL")
    print("👨‍💻 Desarrollado por: Andrés Mogollón")
    print("=" * 60)
    
    # Verificar e instalar dependencias
    if check_and_install_dependencies():
        print("\n✅ Todas las dependencias están listas")
    else:
        print("\n⚠️  Algunas dependencias no se pudieron instalar")
        print("🔄 Continuando con versión simplificada...")
    
    # Iniciar servidor
    try:
        start_server()
    except KeyboardInterrupt:
        print("\n\n🛑 Servidor detenido por el usuario")
    except Exception as e:
        print(f"\n❌ Error iniciando servidor: {e}")
        print("💡 Verifica que el puerto 5000 no esté en uso")
