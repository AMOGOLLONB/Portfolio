document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM para el login
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.getElementById('close-modal');
    const captureBtn = document.getElementById('capture-btn');
    const webcamElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('canvas');
    let model, webcam, maxPredictions;

    // URL del modelo de Teachable Machine
    const URL = "https://teachablemachine.withgoogle.com/models/-5FK-qzsL/";

    // Función para iniciar la webcam
    async function initWebcam() {
        try {
            console.log('Iniciando webcam...');
            const flip = true;
            webcam = new tmImage.Webcam(200, 200, flip);
            await webcam.setup();
            await webcam.play();
            
            webcamElement.appendChild(webcam.canvas);
            console.log('✅ Webcam iniciada correctamente');
            return true;
        } catch (e) {
            console.error('❌ Error al iniciar la webcam:', e);
            let errorMessage = 'No se pudo acceder a la webcam. Por favor, verifica que:\n' +
                              '- Hayas permitido el acceso a la webcam en el navegador.\n' +
                              '- El sitio esté ejecutándose en HTTPS o localhost.\n' +
                              '- No haya otra aplicación usando la webcam.';
            if (e.name === 'NotAllowedError') {
                errorMessage += '\n- Error: Permiso denegado. Habilita la webcam en la configuración del navegador.';
            } else if (e.name === 'NotFoundError') {
                errorMessage += '\n- Error: No se encontró una webcam. Conecta una cámara.';
            }
            alert(errorMessage);
            return false;
        }
    }

    // Función para cargar el modelo
    async function loadModel() {
        try {
            console.log('Cargando modelo desde:', URL);
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";
            
            if (typeof tmImage === 'undefined') {
                throw new Error('La librería tmImage no está cargada. Verifica que hayas incluido el script de Teachable Machine.');
            }
            
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();
            console.log('✅ Modelo cargado correctamente');
            console.log('Número de clases:', maxPredictions);
            return true;
        } catch (e) {
            console.error('❌ Error al cargar el modelo:', e);
            alert('Error al cargar el modelo de reconocimiento facial.\n\nPosibles causas:\n- URL del modelo incorrecta\n- El modelo no existe o fue eliminado\n- Problemas de red\n\nVerifica la URL en Teachable Machine.');
            return false;
        }
    }

    // Función para predecir la imagen capturada
    async function predict() {
        try {
            console.log('Iniciando predicción...');
            
            if (!webcam) {
                alert('La webcam no está inicializada');
                return;
            }
            
            if (!model) {
                alert('El modelo no está cargado');
                return;
            }
            
            await webcam.update();
            const predictions = await model.predict(webcam.canvas);
            console.log('Predicciones recibidas:', predictions);
            
            const predictionsDisplay = document.getElementById('predictions-display');
            let displayHTML = '<strong>📊 Resultados de Predicción:</strong><br><br>';
            
            let maxProb = 0;
            let userClass = '';
            let secondMaxProb = 0;

            // Encontrar la clase con mayor probabilidad y la segunda
            for (let i = 0; i < predictions.length; i++) {
                const probability = predictions[i].probability;
                const percentage = (probability * 100).toFixed(2);
                
                const barWidth = probability * 100;
                const barColor = predictions[i].className.toLowerCase() === 'andres' ? '#4CAF50' : '#2196F3';
                
                displayHTML += `<div style="margin-bottom: 10px;">`;
                displayHTML += `<strong>${predictions[i].className}:</strong> ${percentage}%<br>`;
                displayHTML += `<div style="background: #ddd; height: 20px; border-radius: 10px; overflow: hidden; margin-top: 5px;">`;
                displayHTML += `<div style="background: ${barColor}; width: ${barWidth}%; height: 100%; transition: width 0.3s;"></div>`;
                displayHTML += `</div></div>`;
                
                console.log(`Clase: ${predictions[i].className}, Probabilidad: ${percentage}%`);
                
                if (probability > maxProb) {
                    secondMaxProb = maxProb;
                    maxProb = probability;
                    userClass = predictions[i].className;
                } else if (probability > secondMaxProb) {
                    secondMaxProb = probability;
                }
            }

            const confidenceDiff = maxProb - secondMaxProb;

            displayHTML += `<br><strong>🎯 Mejor predicción:</strong> ${userClass} (${(maxProb * 100).toFixed(2)}%)`;
            displayHTML += `<br><strong>📈 Diferencia con segunda opción:</strong> ${(confidenceDiff * 100).toFixed(2)}%`;
            
            // Mostrar estado de validación
            if (userClass.toLowerCase() === 'andres') {
                displayHTML += `<br><br><strong style="color: orange;">⚠️ Validando acceso...</strong>`;
                displayHTML += `<br>✓ Usuario: Andrés`;
                displayHTML += `<br>${maxProb > 0.95 ? '✓' : '✗'} Confianza > 95%: ${maxProb > 0.95 ? 'SÍ' : 'NO'} (${(maxProb * 100).toFixed(2)}%)`;
                displayHTML += `<br>${confidenceDiff > 0.95 ? '✓' : '✗'} Claridad > 95%: ${confidenceDiff > 0.95 ? 'SÍ' : 'NO'} (${(confidenceDiff * 100).toFixed(2)}%)`;
            } else {
                displayHTML += `<br><br><strong style="color: red;">❌ Usuario no autorizado</strong>`;
            }
            
            predictionsDisplay.innerHTML = displayHTML;

            console.log(`🎯 Mejor predicción: ${userClass} con ${(maxProb * 100).toFixed(2)}% de confianza`);
            console.log(`📊 Diferencia con segunda opción: ${(confidenceDiff * 100).toFixed(2)}%`);

            // 🔒 VALIDACIÓN ESTRICTA: AMBAS CONDICIONES DEBEN SER > 95%
            if (userClass.toLowerCase() === 'andres' && maxProb > 0.95 && confidenceDiff > 0.95) {
                console.log('✅ ACCESO AUTORIZADO - Todos los requisitos cumplidos');
                predictionsDisplay.innerHTML += `<br><br><strong style="color: green; font-size: 16px;">✅ ACCESO AUTORIZADO</strong>`;
                predictionsDisplay.innerHTML += `<br><button onclick="accessDashboard()" style="margin-top: 15px; background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">Acceder al Dashboard</button>`;
                
                // 🔐 GUARDAR AUTENTICACIÓN EN sessionStorage
                window.accessDashboard = function() {
                    sessionStorage.setItem('authenticated', 'true');
                    sessionStorage.setItem('userName', 'Andrés');
                    sessionStorage.setItem('loginTime', Date.now().toString());
                    window.location.href = 'dashboard.html';
                };
            } else if (userClass.toLowerCase() === 'andres') {
                console.log('⚠️ Usuario Andrés pero requisitos no cumplidos');
                console.log(`   - Confianza: ${(maxProb * 100).toFixed(2)}% (necesita >95%)`);
                console.log(`   - Claridad: ${(confidenceDiff * 100).toFixed(2)}% (necesita >95%)`);
                predictionsDisplay.innerHTML += `<br><br><strong style="color: red; font-size: 16px;">❌ REQUISITOS NO CUMPLIDOS</strong>`;
                predictionsDisplay.innerHTML += `<br><span style="color: #666;">Intenta de nuevo con mejor iluminación</span>`;
                predictionsDisplay.innerHTML += `<br><span style="color: #999; font-size: 12px;">Confianza: ${(maxProb * 100).toFixed(2)}% | Claridad: ${(confidenceDiff * 100).toFixed(2)}%</span>`;
            } else {
                console.log('❌ ACCESO DENEGADO - Usuario no autorizado');
                console.log(`   - Usuario detectado: ${userClass}`);
                console.log(`   - Confianza: ${(maxProb * 100).toFixed(2)}%`);
                predictionsDisplay.innerHTML += `<br><br><strong style="color: red; font-size: 16px;">❌ ACCESO DENEGADO</strong>`;
                predictionsDisplay.innerHTML += `<br><span style="color: #666;">Usuario no autorizado</span>`;
            }
        } catch (e) {
            console.error('❌ Error al realizar la predicción:', e);
            alert('Error al procesar la imagen. Detalles en la consola.');
        }
    }

    // Evento para abrir el modal
    loginBtn.addEventListener('click', async () => {
        try {
            console.log('=== Iniciando proceso de login facial ===');
            loginModal.style.display = 'block';
            
            captureBtn.disabled = true;
            captureBtn.textContent = '⏳ Cargando...';
            
            const modelLoaded = await loadModel();
            if (!modelLoaded) {
                loginModal.style.display = 'none';
                return;
            }
            
            const webcamReady = await initWebcam();
            if (!webcamReady) {
                loginModal.style.display = 'none';
                return;
            }
            
            captureBtn.disabled = false;
            captureBtn.textContent = '📸 Capturar y Verificar';
            console.log('=== Sistema listo para captura ===');
            
        } catch (e) {
            console.error('❌ Error al inicializar:', e);
            loginModal.style.display = 'none';
            alert('Error durante la inicialización. Revisa la consola para más detalles.');
        }
    });

    // Evento para cerrar el modal
    closeModal.addEventListener('click', () => {
        console.log('Cerrando modal...');
        loginModal.style.display = 'none';
        if (webcam) {
            webcam.stop();
            while (webcamElement.firstChild) {
                webcamElement.removeChild(webcamElement.firstChild);
            }
        }
    });

    // Evento para capturar la imagen
    captureBtn.addEventListener('click', () => {
        console.log('Botón de captura presionado');
        if (webcam && model) {
            predict();
        } else {
            console.error('Sistema no está listo:', { webcam: !!webcam, model: !!model });
            alert('La cámara o el modelo no están listos. Espera un momento e intenta de nuevo.');
        }
    });

    // Cerrar el modal al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
            if (webcam) {
                webcam.stop();
                while (webcamElement.firstChild) {
                    webcamElement.removeChild(webcamElement.firstChild);
                }
            }
        }
    });

    // Manejo del formulario de contacto
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    successMessage.style.display = 'flex';
                    successMessage.classList.add('show');
                    contactForm.reset();

                    setTimeout(() => {
                        successMessage.classList.remove('show');
                        successMessage.classList.add('hide');
                        setTimeout(() => {
                            successMessage.style.display = 'none';
                            successMessage.classList.remove('hide');
                        }, 500);
                    }, 3000);
                } else {
                    alert('Error al enviar el mensaje. Intenta de nuevo.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al enviar el mensaje. Intenta de nuevo.');
            }
        });
    }
});