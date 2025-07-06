// Camera positions for each component
const componentCameraPositions = {
    'raspberrypi4-info': [-1.2308502431833541, 2.160183823012054, 0.6376644033471448],
    'baseplate-info': [-0.5264604983245855, 3.4502584891422297, -2.4891470361211483],
    'mecanum-info': [
        [-3.2434069601386466, -0.016722713633769752, -0.6951247068454449],  // ul
        [-0.24261811695252317, 1.6036004243494366, 2.1608627297498635],     // ll
        [0.3530278945591408, -1.413677842580443, -2.615154741745456],       // ur
        [3.109156371144225, 0.13735874093267916, -0.49460812520429426]      // lr
    ],
    'hc-sr04-back-info': [1.836944727516901, 1.3470064534296404, 1.4529051211060071],
    'hc-sr04-front-info': [-1.3337773226629548, 0.0739870504158508, -2.3484653666575945],
    'leds-info': [
        [1.836944727516901, 1.3470064534296404, 1.4529051211060071],    // Back 
        [-1.5071554124371749, -1.1379055189520813, -1.9321954355522848] // Front
    ],
    'display-info': [0.7264806318961446, 2.414766785161373, -0.9699757075465827],
    'ir-obstacle-info': [-1.5071554124371749, -1.1379055189520813, -1.9321954355522848],
    'led-bar-info': [0.9554688763365399, 2.4882346119121186, -0.4421463003396579],
    'servo-info': [-0.9440332645491734, 3.2850144977283993, -2.214270021331031],
    'microphone-info': [1.042400288985872, 1.8972648462073578, 0.8244736741954694],
    'mpu6050-info': [-0.17144357645664973, 0.8534391271309951, -1.800624546198801],
    'buttons-info': [0.9554688763365399, 2.4882346119121186, -0.4421463003396579],
    'camera-info': [-1.3337773226629548, 0.0739870504158508, -2.3484653666575945],
    'buzzer-info': [-0.8432651810192563, -0.4039867754561855, -2.119355472380819],
    'speaker-info': [1.197213346917675, 2.1235680830365777, -0.05301820492836016],
};

// Animates the camera to the target position
function animateCameraTo(target, duration = 800) {
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
    // Close other dropdowns
    document.querySelectorAll('.dropdown-content.active').forEach(el => {
        if (el.id !== id) el.classList.remove('active');
    });

    // Open/close current dropdown
    const el = document.getElementById(id);
    const wasActive = el.classList.contains('active');
    el.classList.toggle('active');

    // Animate camera to position when opening
    if (!wasActive && componentCameraPositions[id] && typeof camera !== 'undefined') {
        let targetPosition = componentCameraPositions[id];
        let selectedPosition = null;

        // Special handling for mecanum wheels
        if (id === 'mecanum-info' && Array.isArray(targetPosition[0])) {
            if (specificWheel) {
                // Specific wheel was already handled in handleSphereClick
                // No further action needed
                return;
            } else {
                // Random selection only when clicked from dropdown button
                const randomIndex = Math.floor(Math.random() * targetPosition.length);
                targetPosition = targetPosition[randomIndex];
                selectedPosition = ['ul', 'll', 'ur', 'lr'][randomIndex];
                console.log(`Randomly selected mecanum wheel: ${selectedPosition}`);
            }
        }

        // Special handling for LEDs
        if (id === 'leds-info' && Array.isArray(targetPosition[0])) {
            const randomIndex = Math.floor(Math.random() * targetPosition.length);
            targetPosition = targetPosition[randomIndex];
            selectedPosition = ['back', 'front'][randomIndex];
            console.log(`Randomly selected LED position: ${selectedPosition}`);
        }

        animateCameraTo(targetPosition);

        // Show sphere temporarily after short delay
        if (typeof showSphereTemporarily === 'function') {
            setTimeout(() => {
                showSphereTemporarily(id, selectedPosition);
            }, 300);
        }
    }
    // Animate camera back to default position when closing
    if (wasActive && typeof camera !== 'undefined') {
        animateCameraTo([-0.18459426309019683, -1.2678479290429752, -4.833061823198169]);
    }
}
