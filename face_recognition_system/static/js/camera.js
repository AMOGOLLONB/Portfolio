/**
 * Sistema de Reconocimiento Facial - JavaScript
 * Manejo de cámara y detección facial
 */

class FaceRecognitionSystem {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.isDetecting = false;
        this.detectionInterval = null;
        this.stream = null;
        this.knownFaces = 0;
        this.totalDetections = 0;
        
        this.init();
    }
    
    init() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.loadSystemStatus();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.startDetection());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopDetection());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportToExcel());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearHistory());
        document.getElementById('refreshHistory').addEventListener('click', () => this.loadHistory());
    }
    
    async loadSystemStatus() {
        try {
            const response = await fetch('/status');
            const data = await response.json();
            
            this.updateStatusDisplay(data);
            this.knownFaces = data.known_faces;
            this.totalDetections = data.total_detections;
            
            this.updateStatus('Sistema activo', 'success');
        } catch (error) {
            console.error('Error cargando estado:', error);
            this.updateStatus('Error de conexión', 'error');
        }
    }
    
    updateStatusDisplay(data) {
        document.getElementById('knownFaces').textContent = data.known_faces;
        document.getElementById('totalDetections').textContent = data.total_detections;
        document.getElementById('lastDetection').textContent = data.last_detection;
    }
    
    async startDetection() {
        try {
            // Solicitar acceso a la cámara
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                } 
            });
            
            this.video.srcObject = this.stream;
            await this.video.play();
            
            // Configurar canvas
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            
            // Actualizar UI
            this.updateDetectionUI(true);
            this.isDetecting = true;
            
            // Iniciar detección cada 2 segundos
            this.detectionInterval = setInterval(() => this.processFrame(), 2000);
            
            this.updateStatus('Detección iniciada', 'success');
            this.showNotification('Cámara iniciada correctamente', 'success');
            
        } catch (error) {
            console.error('Error accediendo a la cámara:', error);
            this.updateStatus('Error accediendo a la cámara', 'error');
            this.showNotification('No se pudo acceder a la cámara. Verifica los permisos.', 'error');
        }
    }
    
    stopDetection() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        clearInterval(this.detectionInterval);
        this.isDetecting = false;
        
        // Actualizar UI
        this.updateDetectionUI(false);
        
        // Limpiar overlay
        this.clearDetectionOverlay();
        
        this.updateStatus('Detección detenida', 'warning');
        this.showNotification('Detección detenida', 'info');
    }
    
    updateDetectionUI(isActive) {
        document.getElementById('startBtn').disabled = isActive;
        document.getElementById('stopBtn').disabled = !isActive;
        document.getElementById('cameraStatus').textContent = isActive ? 'Cámara activa' : 'Cámara detenida';
        document.getElementById('detectionStatus').textContent = isActive ? 'Detección activa' : 'Detección inactiva';
    }
    
    async processFrame() {
        if (!this.isDetecting || this.video.readyState !== this.video.HAVE_ENOUGH_DATA) return;
        
        try {
            // Capturar frame
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            const imageData = this.canvas.toDataURL('image/jpeg', 0.8);
            
            // Enviar para detección
            const response = await fetch('/detect_face', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imageData })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.displayResults(result.results);
                this.updateDetectionCount(result.total_faces);
                this.updateDetectionOverlay(result.results);
            } else {
                console.error('Error en detección:', result.error);
            }
            
        } catch (error) {
            console.error('Error procesando frame:', error);
        }
    }
    
    displayResults(results) {
        const resultsContainer = document.getElementById('detectionResults');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No se detectaron rostros</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        results.forEach(result => {
            const confidencePercent = Math.round(result.confidence * 100);
            const confidenceClass = this.getConfidenceClass(result.confidence);
            
            html += `
                <div class="result-item">
                    <div class="result-header">
                        <span class="result-name ${result.name === 'Desconocido' ? 'unknown' : 'known'}">
                            ${result.name}
                        </span>
                        <span class="result-confidence ${confidenceClass}">
                            ${confidencePercent}%
                        </span>
                    </div>
                    <div class="result-details">
                        <div class="result-coords">
                            <i class="fas fa-crosshairs"></i>
                            X: ${result.coordinates.x}, Y: ${result.coordinates.y}
                        </div>
                        <div class="result-time">
                            <i class="fas fa-clock"></i>
                            ${result.timestamp}
                        </div>
                    </div>
                    ${result.name === 'Desconocido' ? `
                        <button class="btn btn-sm btn-outline" onclick="faceSystem.showAddFaceModal('${result.timestamp}')">
                            <i class="fas fa-user-plus"></i> Agregar
                        </button>
                    ` : ''}
                </div>
            `;
        });
        
        resultsContainer.innerHTML = html;
    }
    
    getConfidenceClass(confidence) {
        if (confidence > 0.7) return 'high';
        if (confidence > 0.4) return 'medium';
        return 'low';
    }
    
    updateDetectionCount(count) {
        this.totalDetections += count;
        document.getElementById('totalDetections').textContent = this.totalDetections;
        document.getElementById('lastDetection').textContent = new Date().toLocaleTimeString();
    }
    
    updateDetectionOverlay(results) {
        const detectionBox = document.getElementById('detectionBox');
        const faceInfo = document.getElementById('faceInfo');
        
        if (results.length === 0) {
            this.clearDetectionOverlay();
            return;
        }
        
        // Mostrar el primer rostro detectado
        const firstResult = results[0];
        const coords = firstResult.coordinates;
        
        // Calcular posición relativa en el video
        const videoRect = this.video.getBoundingClientRect();
        const scaleX = videoRect.width / this.video.videoWidth;
        const scaleY = videoRect.height / this.video.videoHeight;
        
        const left = coords.left * scaleX;
        const top = coords.top * scaleY;
        const width = (coords.right - coords.left) * scaleX;
        const height = (coords.bottom - coords.top) * scaleY;
        
        detectionBox.style.display = 'block';
        detectionBox.style.left = left + 'px';
        detectionBox.style.top = top + 'px';
        detectionBox.style.width = width + 'px';
        detectionBox.style.height = height + 'px';
        
        faceInfo.style.display = 'block';
        faceInfo.innerHTML = `
            <strong>${firstResult.name}</strong><br>
            Confianza: ${Math.round(firstResult.confidence * 100)}%
        `;
    }
    
    clearDetectionOverlay() {
        document.getElementById('detectionBox').style.display = 'none';
        document.getElementById('faceInfo').style.display = 'none';
    }
    
    async exportToExcel() {
        try {
            const response = await fetch('/export_excel');
            const result = await response.json();
            
            if (result.success) {
                this.showNotification(`Reporte exportado: ${result.filename}`, 'success');
                // Descargar archivo
                window.open(`/download_excel/${result.filename}`, '_blank');
            } else {
                this.showNotification(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            console.error('Error exportando:', error);
            this.showNotification('Error al exportar reporte', 'error');
        }
    }
    
    async clearHistory() {
        if (confirm('¿Estás seguro de que quieres limpiar todo el historial?')) {
            try {
                const response = await fetch('/clear_history', { method: 'POST' });
                const result = await response.json();
                
                if (result.success) {
                    this.totalDetections = 0;
                    document.getElementById('totalDetections').textContent = '0';
                    document.getElementById('lastDetection').textContent = 'N/A';
                    this.loadHistory();
                    this.showNotification('Historial limpiado', 'success');
                }
            } catch (error) {
                console.error('Error limpiando historial:', error);
                this.showNotification('Error al limpiar historial', 'error');
            }
        }
    }
    
    async loadHistory() {
        try {
            const response = await fetch('/get_history');
            const result = await response.json();
            
            if (result.success) {
                this.displayHistory(result.history);
            }
        } catch (error) {
            console.error('Error cargando historial:', error);
        }
    }
    
    displayHistory(history) {
        const historyContainer = document.getElementById('historyList');
        
        if (history.length === 0) {
            historyContainer.innerHTML = `
                <div class="no-history">
                    <i class="fas fa-clock"></i>
                    <p>No hay detecciones registradas</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        history.slice(-10).reverse().forEach(item => {
            const confidencePercent = Math.round(item.confidence * 100);
            const confidenceClass = this.getConfidenceClass(item.confidence);
            
            html += `
                <div class="history-item">
                    <div class="history-info">
                        <span class="history-name ${item.name === 'Desconocido' ? 'unknown' : 'known'}">
                            ${item.name}
                        </span>
                        <span class="history-time">${item.timestamp}</span>
                    </div>
                    <div class="history-details">
                        <span class="history-coords">(${item.coordinates.x}, ${item.coordinates.y})</span>
                        <span class="history-confidence ${confidenceClass}">${confidencePercent}%</span>
                    </div>
                </div>
            `;
        });
        
        historyContainer.innerHTML = html;
    }
    
    showAddFaceModal(timestamp) {
        // Capturar frame actual
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        const captureCanvas = document.getElementById('captureCanvas');
        const captureCtx = captureCanvas.getContext('2d');
        captureCanvas.width = 200;
        captureCanvas.height = 150;
        captureCtx.drawImage(this.video, 0, 0, 200, 150);
        
        document.getElementById('addFaceModal').style.display = 'block';
    }
    
    closeAddFaceModal() {
        document.getElementById('addFaceModal').style.display = 'none';
        document.getElementById('personName').value = '';
    }
    
    async addFace() {
        const name = document.getElementById('personName').value.trim();
        
        if (!name) {
            this.showNotification('Por favor ingresa un nombre', 'error');
            return;
        }
        
        try {
            const imageData = this.canvas.toDataURL('image/jpeg', 0.8);
            
            const response = await fetch('/add_face', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, image: imageData })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showNotification(`Rostro de ${name} agregado exitosamente`, 'success');
                this.closeAddFaceModal();
                this.loadSystemStatus();
            } else {
                this.showNotification(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            console.error('Error agregando rostro:', error);
            this.showNotification('Error al agregar rostro', 'error');
        }
    }
    
    updateStatus(message, type) {
        const statusText = document.getElementById('statusText');
        const statusDot = document.getElementById('statusDot');
        
        statusText.textContent = message;
        statusDot.className = `status-dot ${type}`;
    }
    
    showNotification(message, type) {
        const notifications = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notifications.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Funciones globales para compatibilidad con HTML
let faceSystem;

function closeAddFaceModal() {
    faceSystem.closeAddFaceModal();
}

function addFace() {
    faceSystem.addFace();
}

// Inicializar sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    faceSystem = new FaceRecognitionSystem();
    
    // Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
        const modal = document.getElementById('addFaceModal');
        if (event.target === modal) {
            faceSystem.closeAddFaceModal();
        }
    }
});
