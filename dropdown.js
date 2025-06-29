// Kamera-Positionen für jede Komponente
const componentCameraPositions = {
    'mecanum-info': [
        [0.4227505420384501, -0.1532568065994152, -0.04352390650136645], // ul
        [-0.000022849681043455115, -0.35786716691570847, -0.00010329167066451409], // ll
        [2.4078865186641126e-8, 0.4517742799228204, 4.511522501995478e-7], // ur
        [-0.3512126223891305, 0.28194998222723977, 0.03541047015494677] // lr
    ],
    'hc-sr04-back-info': [-0.2732457892896901, -0.11971781639553765, 0.028883146379215654],
    'hc-sr04-front-info': [0.22767587768799008, 0.11521654952389553, -0.14089847340020994],
    'display-info': [-0.05208156945891421, -0.07187811993347938, -0.23371145884942107],
    'ir-obstacle-info': [0.2615088455435465, 0.13483705068743013, 0.057113453198184415],
    'led-bar-info': [-0.05348366823214813, -0.0833350504727595, -0.22955340684715647],
    'servo-info': [0.15494518590357848, -0.1064653024710506, -0.164794201157241],
    'microphone-info': [-0.22386137791447525, -0.10864154187247038, -0.024147439984494593],
    'mpu6050-info': [0.17455782434918388, -0.011131222958740888, -0.17862156038374058],
    'buttons-info': [-0.1335988612501731, -0.023156013993548902, -0.21003605235432218],
    'camera-info': [0.21425891219144347, 0.11311784684508933, -0.061623625921153245]
};

// Animiert die Kamera zur Zielposition
function animateCameraTo(target, duration = 600) {
    if (typeof camera === 'undefined') return;
    const start = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const end = { x: target[0], y: target[1], z: target[2] };
    const startTime = performance.now();
    function animate(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        // Smoothstep Interpolation
        const smoothT = t * t * (3 - 2 * t);
        camera.position.set(
            start.x + (end.x - start.x) * smoothT,
            start.y + (end.y - start.y) * smoothT,
            start.z + (end.z - start.z) * smoothT
        );
        camera.updateProjectionMatrix();
        if (typeof controls !== 'undefined') controls.update();
        if (t < 1) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
}

function toggleDropdown(id, specificWheel = null) {
    // Andere Dropdowns schließen
    document.querySelectorAll('.dropdown-content.active').forEach(el => {
        if (el.id !== id) el.classList.remove('active');
    });

    // Aktuelles Dropdown öffnen/schließen
    const el = document.getElementById(id);
    const wasActive = el.classList.contains('active');
    el.classList.toggle('active');

    // Kamera-Position animiert setzen, wenn geöffnet
    if (!wasActive && componentCameraPositions[id] && typeof camera !== 'undefined') {
        let targetPosition = componentCameraPositions[id];
        
        // Spezielle Behandlung für Mecanum-Räder
        if (id === 'mecanum-info' && Array.isArray(targetPosition[0])) {
            if (specificWheel) {
                // Spezifisches Rad wurde bereits in handleSphereClick behandelt
                // Keine weitere Aktion nötig
                return;
            } else {
                // Zufällige Auswahl nur wenn vom Dropdown-Button geklickt
                const randomIndex = Math.floor(Math.random() * targetPosition.length);
                targetPosition = targetPosition[randomIndex];
                console.log(`Zufällig ausgewähltes Mecanum-Rad: ${['ul', 'll', 'ur', 'lr'][randomIndex]}`);
            }
        }
        
        animateCameraTo(targetPosition);
    }
    // Kamera zurück zur Standardposition, wenn geschlossen
    if (wasActive && typeof camera !== 'undefined') {
        animateCameraTo([0.04, -0.36, -0.27]);
    }
}
