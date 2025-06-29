// Kamera-Positionen für jede Komponente
const componentCameraPositions = {
    'raspberrypi4-info': [-0.011320557453378208, -0.20321804073726424, -0.14516980711515864],
    'baseplate-info': [-0.019769352885877493, 0.031328774912543, -0.3300229907762435],
    'mecanum-info': [
        [0.4227505420384501, -0.1532568065994152, -0.04352390650136645], // ul
        [0.00044081512372410393, -0.3679545774613874, -0.003653030705580139], // ll
        [0.1541746689267928, 0.42283908882604, 0.039208116788054234], // ur
        [-0.2958694351381632, 0.11926421203586299, 0.05122241414344111] // lr
    ],
    'hc-sr04-back-info': [-0.2732457892896901, -0.11971781639553765, 0.028883146379215654],
    'hc-sr04-front-info': [0.22767587768799008, 0.11521654952389553, -0.14089847340020994],
    'leds-info': [
        [-0.2732457892896901, -0.11971781639553765, 0.028883146379215654], // back
        [0.2615088455435465, 0.13483705068743013, 0.057113453198184415], // front
    ],
    'display-info': [-0.05208156945891421, -0.07187811993347938, -0.23371145884942107],
    'ir-obstacle-info': [0.2615088455435465, 0.13483705068743013, 0.057113453198184415],
    'led-bar-info': [-0.05348366823214813, -0.0833350504727595, -0.22955340684715647],
    'servo-info': [0.15494518590357848, -0.1064653024710506, -0.164794201157241],
    'microphone-info': [-0.22386137791447525, -0.10864154187247038, -0.024147439984494593],
    'mpu6050-info': [0.17455782434918388, -0.011131222958740888, -0.17862156038374058],
    'buttons-info': [-0.1335988612501731, -0.023156013993548902, -0.21003605235432218],
    'camera-info': [0.21425891219144347, 0.11311784684508933, -0.061623625921153245],
    'buzzer-info': [0.19412965944695657, 0.16836875236913582, -0.056724916139172334],
    'speaker-info': [-0.18898232602034365, -0.10564471369834245, -0.1249994996771419],
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
        let selectedPosition = null;
        
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
                selectedPosition = ['ul', 'll', 'ur', 'lr'][randomIndex];
                console.log(`Zufällig ausgewähltes Mecanum-Rad: ${selectedPosition}`);
            }
        }
        
        // Spezielle Behandlung für LEDs
        if (id === 'leds-info' && Array.isArray(targetPosition[0])) {
            const randomIndex = Math.floor(Math.random() * targetPosition.length);
            targetPosition = targetPosition[randomIndex];
            selectedPosition = ['back', 'front'][randomIndex];
            console.log(`Zufällig ausgewählte LED-Position: ${selectedPosition}`);
        }
        
        animateCameraTo(targetPosition);
        
        // Kugel temporär anzeigen nach kurzer Verzögerung
        if (typeof showSphereTemporarily === 'function') {
            setTimeout(() => {
                showSphereTemporarily(id, selectedPosition);
            }, 300);
        }
    }
    // Kamera zurück zur Standardposition, wenn geschlossen
    if (wasActive && typeof camera !== 'undefined') {
        animateCameraTo([0.04, -0.36, -0.27]);
    }
}
