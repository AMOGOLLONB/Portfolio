# 🤖 Sistema de Reconocimiento Facial

Sistema web en tiempo real que utiliza la cámara para identificar rostros, capturar coordenadas, hora, nombre de la persona y exportar toda la información a Excel.

## 🚀 Instalación Rápida

### 1. Instalar Dependencias
```bash
pip install -r requirements.txt
```

### 2. Ejecutar la Aplicación
```bash
python app.py
```

### 3. Acceder al Sistema
- Abrir navegador en: `http://localhost:5000/face`
- Permitir acceso a la cámara cuando se solicite

## ✨ Funcionalidades

- ✅ **Detección facial en tiempo real**
- ✅ **Identificación de personas conocidas**
- ✅ **Captura de coordenadas (X, Y)**
- ✅ **Registro de fecha y hora**
- ✅ **Exportación automática a Excel**
- ✅ **Interfaz web moderna y responsive**
- ✅ **Agregar nuevos rostros al sistema**
- ✅ **Historial de detecciones**

## 📊 Formato del Reporte Excel

| ID | Fecha | Hora | Nombre | Coordenada X | Coordenada Y | Confianza | Imagen | Estado |
|----|-------|------|--------|--------------|--------------|-----------|--------|--------|
| 1 | 2025-01-28 | 14:30:25 | Juan Pérez | 245 | 180 | 0.95 | face_001.jpg | detected |

## 🛠️ Tecnologías

- **Backend**: Python, Flask, OpenCV, Face Recognition
- **Frontend**: HTML5, CSS3, JavaScript, WebRTC
- **Exportación**: Pandas, OpenPyXL
- **Base de datos**: Archivos pickle para rostros conocidos

## 📁 Estructura del Proyecto

```
face_recognition_system/
├── app.py                 # Aplicación principal Flask
├── requirements.txt       # Dependencias Python
├── templates/
│   └── face_detection.html # Interfaz web
├── static/
│   ├── css/
│   │   └── style.css     # Estilos CSS
│   └── js/
│       └── camera.js     # JavaScript para cámara
├── models/
│   └── sample_faces.pkl  # Rostros conocidos
├── data/
│   ├── detected_faces/   # Fotos capturadas
│   └── reports/          # Reportes Excel
└── README.md
```

## 🎯 Uso del Sistema

1. **Iniciar Detección**: Hacer clic en "Iniciar Detección"
2. **Permitir Cámara**: Autorizar acceso a la cámara web
3. **Ver Resultados**: Los rostros detectados aparecen en tiempo real
4. **Agregar Rostros**: Hacer clic en "Agregar" para rostros desconocidos
5. **Exportar Datos**: Hacer clic en "Exportar Excel" para descargar reporte

## 🔧 Configuración Avanzada

### Agregar Rostros Conocidos
1. Tomar foto de la persona
2. Hacer clic en "Agregar" cuando aparezca como "Desconocido"
3. Ingresar nombre de la persona
4. El sistema aprenderá a reconocerla

### Personalizar Detección
- Modificar intervalo de detección en `camera.js` (línea 2 segundos)
- Ajustar umbral de confianza en `app.py` (línea 0.6)
- Cambiar resolución de cámara en `camera.js`

## 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Laptop, PC con cámara web
- **Sistemas**: Windows, macOS, Linux

## 🚨 Solución de Problemas

### Error: "No se pudo acceder a la cámara"
- Verificar permisos del navegador
- Asegurar que la cámara no esté en uso por otra aplicación
- Probar en modo incógnito

### Error: "face_recognition no se encuentra"
```bash
pip install face-recognition
```

### Error: "OpenCV no se encuentra"
```bash
pip install opencv-python
```

## 📈 Mejoras Futuras

- [ ] Reconocimiento de emociones
- [ ] Detección de edad y género
- [ ] Base de datos SQL
- [ ] Notificaciones en tiempo real
- [ ] API REST
- [ ] Dashboard de administración

## 👨‍💻 Desarrollado por

**Andrés Mogollón** - Ingeniero de Sistemas
- Especialista en Python, OpenCV, Flask
- Proyecto de portafolio profesional

## 📄 Licencia

© 2025 Andrés Mogollón - Todos los derechos reservados

---

**🌐 URL del Sistema**: http://localhost:5000/face  
**📧 Contacto**: A través del portafolio principal
