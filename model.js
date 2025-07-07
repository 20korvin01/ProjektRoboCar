// Initialization of scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Set camera start position
camera.position.set(-0.18459426309019683, -1.2678479290429752, -4.833061823198169);
// Set initial zoom value
camera.zoom = 4;
camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(
    document.getElementById('viewer-container').clientWidth,
    document.getElementById('viewer-container').clientHeight
);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('viewer-container').appendChild(renderer.domElement);

// OrbitControls for mouse interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minDistance = 2; // Minimum distance to scene, adjust if needed
controls.maxDistance = 5; // Optional: maximum distance
controls.enablePan = false; // Allow panning
controls.enableZoom = true; // Allow zoom
controls.minAzimuthAngle = -Infinity; // 360° around Z
controls.maxAzimuthAngle = Infinity; // 360° around Z
controls.screenSpacePanning = false; // Prevents gimbal lock

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 3);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0);
directionalLight1.position.set(1, 1, 1);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-1, -1, -1);
scene.add(directionalLight2);

// Get loading bar elements from DOM (created in index.html and styled in viewer.css)
const viewer = document.getElementById('viewer-container');
const loadingBarContainer = document.getElementById('loading-bar-container');
const loadingBar = document.getElementById('loading-bar');

// Model switch logic
let currentModel = 'scaniverse1'; // Default model
let loadedObject = null;
const modelFiles = {
    scaniverse1: {
        mtl: 'model/Mesh_scaniverse1.mtl',
        obj: 'model/Mesh_scaniverse1.obj'
    },
    scaniverse2: {
        mtl: 'model/Mesh_scaniverse2.mtl',
        obj: 'model/Mesh_scaniverse2.obj'
    },
    agisoft: {
        mtl: 'model/Mesh_agisoft.mtl',
        obj: 'model/Mesh_agisoft.obj'
    }
};

function loadModel(modelKey) {
    // Reset and show loading bar
    loadingBar.style.width = '0%';
    loadingBarContainer.style.opacity = '1';
    if (!viewer.contains(loadingBarContainer)) {
        viewer.appendChild(loadingBarContainer);
    }

    // Remove previous model
    if (loadedObject) {
        scene.remove(loadedObject);
        loadedObject = null;
    }

    let loadStartTime = Date.now();
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load(modelFiles[modelKey].mtl, function (materials) {
        materials.preload();
        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
            modelFiles[modelKey].obj,
            function (object) {
                loadingBar.style.width = '100%';
                setTimeout(() => {
                    loadingBarContainer.style.opacity = '0';
                    setTimeout(() => loadingBarContainer.remove(), 500);
                }, 400);

                const loadTime = ((Date.now() - loadStartTime) / 1000).toFixed(2);
                const loadedText = document.createElement('div');
                loadedText.textContent = `Model loaded (${loadTime} seconds)`;
                loadedText.className = 'viewer-loaded-text';
                viewer.appendChild(loadedText);
                setTimeout(() => {
                    loadedText.style.transition = 'opacity 0.7s';
                    loadedText.style.opacity = '0';
                    setTimeout(() => loadedText.remove(), 800);
                }, 1700);

            object.rotation.x = -Math.PI / 2; // Adjust if needed
            scene.add(object);
            loadedObject = object;
            // Automatically position camera
            const box = new THREE.Box3().setFromObject(object);
            const size = box.getSize(new THREE.Vector3()).length();
            const center = box.getCenter(new THREE.Vector3());
            object.position.sub(center);
            controls.update();

            // Clickable spheres for each element in the object
            const sphereGeometry = new THREE.SphereGeometry(0.08, 50, 50);

            // Raspberry Pi
            const raspberryPiDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({
                color: 0x4791b8,
                transparent: true,
                opacity: 0
            }));
            raspberryPiDot.position.set(-0.008243365723607177, 0.3076110179482363, -0.0028005682972712664);
            raspberryPiDot.userData = { dropdownId: 'raspberrypi4-info', componentName: 'Raspberry Pi 4 Model B' };
            scene.add(raspberryPiDot);
            interactiveSpheres.push(raspberryPiDot);

            // Baseplate
            const baseplateDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({
                color: 0x4791b8,
                transparent: true,
                opacity: 0
            }));
            baseplateDot.position.set(-0.05243569246468227, 0.31861268584945046, -0.31749719506824325);
            baseplateDot.userData = { dropdownId: 'baseplate-info', componentName: 'Baseplate' };
            scene.add(baseplateDot);
            interactiveSpheres.push(baseplateDot);

            // Mecanum wheels
            const mecanumDot_ll = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            mecanumDot_ll.position.set(-0.1653560465695978, 0.3035109632565023, 0.47661844296516637);
            mecanumDot_ll.userData = { dropdownId: 'mecanum-info', componentName: 'Mecanum Wheels', wheelPosition: 'll' };
            scene.add(mecanumDot_ll);
            interactiveSpheres.push(mecanumDot_ll);

            const mecanumDot_lr = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            mecanumDot_lr.position.set(0.6481473917329756, -0.012611468301905404, -0.06932576206011459);
            mecanumDot_lr.userData = { dropdownId: 'mecanum-info', componentName: 'Mecanum Wheels', wheelPosition: 'lr' };
            scene.add(mecanumDot_lr);
            interactiveSpheres.push(mecanumDot_lr);

            const mecanumDot_ul = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            mecanumDot_ul.position.set(-0.7213581691959137, -0.07923908891037668, -0.09945753343695957);
            mecanumDot_ul.userData = { dropdownId: 'mecanum-info', componentName: 'Mecanum Wheels', wheelPosition: 'ul' };
            scene.add(mecanumDot_ul);
            interactiveSpheres.push(mecanumDot_ul);

            const mecanumDot_ur = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            mecanumDot_ur.position.set(0.06500199890376412, -0.4003725915965557, -0.670657920964932);
            mecanumDot_ur.userData = { dropdownId: 'mecanum-info', componentName: 'Mecanum Wheels', wheelPosition: 'ur' };
            scene.add(mecanumDot_ur);
            interactiveSpheres.push(mecanumDot_ur);

            // HC-SR04 sensor - back
            const hcSr04BackDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            hcSr04BackDot.position.set(0.3980710922222699, 0.2492549249916678, 0.35053568065768803);
            hcSr04BackDot.userData = { dropdownId: 'hc-sr04-back-info', componentName: 'HC-SR04 - back' };
            scene.add(hcSr04BackDot);
            interactiveSpheres.push(hcSr04BackDot);

            // HC-SR04 front
            const hcSr04FrontDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            hcSr04FrontDot.position.set(-0.3740203890963598, 0.14717203651566768, -0.7152895740304478);
            hcSr04FrontDot.userData = { dropdownId: 'hc-sr04-front-info', componentName: 'HC-SR04 - front' };
            scene.add(hcSr04FrontDot);
            interactiveSpheres.push(hcSr04FrontDot);

            // IR obstacle sensor
            const irObstacleDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            irObstacleDot.position.set(-0.42625548818964143, -0.3576001398934343, -0.489621879489366);
            irObstacleDot.userData = { dropdownId: 'ir-obstacle-info', componentName: 'IR Obstacle Avoidance Sensor' };
            scene.add(irObstacleDot);
            interactiveSpheres.push(irObstacleDot);

            // Display
            const displayDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            displayDot.position.set(0.17321272132306642, 0.5807053527995238, -0.16222941794806112);
            displayDot.userData = { dropdownId: 'display-info', componentName: 'LCD Display' };
            scene.add(displayDot);
            interactiveSpheres.push(displayDot);

            // LEDs
            const ledsBackDot_ll = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            ledsBackDot_ll.position.set(0.25782049320032296, 0.3227377820258295, 0.44592830210559836);
            ledsBackDot_ll.userData = { dropdownId: 'leds-info', componentName: 'LEDs', wheelPosition: 'back' };
            scene.add(ledsBackDot_ll);
            interactiveSpheres.push(ledsBackDot_ll);

            const ledsFrontDot_lr = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            ledsFrontDot_lr.position.set(0.5425550273194188, 0.20987451688933056, 0.2552960014032899);
            ledsFrontDot_lr.userData = { dropdownId: 'leds-info', componentName: 'LEDs', wheelPosition: 'back' };
            scene.add(ledsFrontDot_lr);
            interactiveSpheres.push(ledsFrontDot_lr);

            const ledsFrontDot_ul = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            ledsFrontDot_ul.position.set(-0.5544872742197239, -0.2671933605700181, -0.43626560707219697);
            ledsFrontDot_ul.userData = { dropdownId: 'leds-info', componentName: 'LEDs', wheelPosition: 'front' };
            scene.add(ledsFrontDot_ul);
            interactiveSpheres.push(ledsFrontDot_ul);

            const ledsBackDot_ur = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            ledsBackDot_ur.position.set(-0.31028564075007914, -0.3619665205231577, -0.6010845842143145);
            ledsBackDot_ur.userData = { dropdownId: 'leds-info', componentName: 'LEDs', wheelPosition: 'front' };
            scene.add(ledsBackDot_ur);
            interactiveSpheres.push(ledsBackDot_ur);

            // LED bar
            const ledBarDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            ledBarDot.position.set(0.1640813961897004, 0.7289624529092875, -0.024135065548005485);
            ledBarDot.userData = { dropdownId: 'led-bar-info', componentName: 'LED Bar' };
            scene.add(ledBarDot);
            interactiveSpheres.push(ledBarDot);

            // Servo motor
            const servoDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            servoDot.position.set(-0.2649312291829016, 0.17174265360127894, -0.4903360654059645);
            servoDot.userData = { dropdownId: 'servo-info', componentName: 'Servo Motor' };
            scene.add(servoDot);
            interactiveSpheres.push(servoDot);

            // Microphone
            const microphoneDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            microphoneDot.position.set(0.24011580582215353, 0.47172539909352773, 0.25078797776579936);
            microphoneDot.userData = { dropdownId: 'microphone-info', componentName: 'Microphone' };
            scene.add(microphoneDot);
            interactiveSpheres.push(microphoneDot);

            // MPU6050
            const mpu6050Dot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            mpu6050Dot.position.set(-0.150186541433023, 0.1382788098103731, -0.33242747510891624);
            mpu6050Dot.userData = { dropdownId: 'mpu6050-info', componentName: 'MPU6050' };
            scene.add(mpu6050Dot);
            interactiveSpheres.push(mpu6050Dot);

            // Buttons
            const buttonsDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            buttonsDot.position.set(0.3194947665032498, 0.6449316288457823, -0.11413253891006858);
            buttonsDot.userData = { dropdownId: 'buttons-info', componentName: 'Buttons' };
            scene.add(buttonsDot);
            interactiveSpheres.push(buttonsDot);

            // Camera
            const cameraDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            cameraDot.position.set(-0.3983826473855059, 0.008978440888747219, -0.6865440652348856);
            cameraDot.userData = { dropdownId: 'camera-info', componentName: 'Camera' };
            scene.add(cameraDot);
            interactiveSpheres.push(cameraDot);

            // Active buzzer
            const activeBuzzerDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial
                ({ color: 0x4791b8, transparent: true, opacity: 0 }));
            activeBuzzerDot.position.set(-0.25892377287770607, -0.19083610651709026, -0.6077220432256248);
            activeBuzzerDot.userData = { dropdownId: 'buzzer-info', componentName: 'Active Buzzer' };
            scene.add(activeBuzzerDot);
            interactiveSpheres.push(activeBuzzerDot);

            // Speaker
            const speakerDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            speakerDot.position.set(0.29230534113185436, 0.5538548209682075, 0.026455577072755254);
            speakerDot.userData = { dropdownId: 'speaker-info', componentName: 'Speaker' };
            scene.add(speakerDot);
            interactiveSpheres.push(speakerDot);
        },
            function (xhr) {
                if (xhr.lengthComputable) {
                    const percent = (xhr.loaded / xhr.total) * 100;
                    loadingBar.style.width = percent + '%';
                } else {
                    loadingBar.style.width = (parseFloat(loadingBar.style.width) + 5) + '%';
                }
            },
            function (error) {
                loadingBarContainer.style.background = '#ff0000';
                loadingBar.style.background = '#ff0000';
                console.error('Error loading OBJ file:', error);
            }
        );
    });
}



// Switch button event and label update for three models
const switchBtn = document.getElementById('model-switch-btn');
const modelSwitchLabel = document.getElementById('model-switch-label');
const modelOrder = ['scaniverse1', 'scaniverse2', 'agisoft'];
function getModelLabel(key) {
    if (key === 'scaniverse1') return 'Scaniverse 1';
    if (key === 'scaniverse2') return 'Scaniverse 2';
    if (key === 'agisoft') return 'Agisoft';
    return key;
}
function updateModelLabel() {
    if (modelSwitchLabel) {
        modelSwitchLabel.textContent = getModelLabel(currentModel);
    }
}
if (switchBtn) {
    switchBtn.addEventListener('click', () => {
        // Find current index and go to next
        const idx = modelOrder.indexOf(currentModel);
        const nextIdx = (idx + 1) % modelOrder.length;
        currentModel = modelOrder[nextIdx];
        loadModel(currentModel);
        updateModelLabel();
    });
}
// Load initial model and set label
loadModel(currentModel);
updateModelLabel();




// viewer is already declared above
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
camera.aspect = viewer.clientWidth / viewer.clientHeight;
camera.updateProjectionMatrix();

// Create tooltip for hover text
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
tooltip.style.color = 'white';
tooltip.style.padding = '8px 12px';
tooltip.style.borderRadius = '4px';
tooltip.style.fontSize = '14px';
tooltip.style.fontFamily = 'Arial, sans-serif';
tooltip.style.pointerEvents = 'none';
tooltip.style.zIndex = '1000';
tooltip.style.display = 'none';
tooltip.style.whiteSpace = 'nowrap';
document.body.appendChild(tooltip);

window.addEventListener('resize', () => {
    const viewer = document.getElementById('viewer-container');
    camera.aspect = viewer.clientWidth / viewer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
});

// Raycaster for click positions
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Array to store interactive spheres
const interactiveSpheres = [];
let hoveredSphere = null;
const originalColor = 0x4791b8;
const hoverColor = 0x4791b8;

viewer.addEventListener('mousemove', (event) => {
    // Mouse position in Normalized Device Coordinates (-1 to +1)
    const rect = viewer.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    // Check intersections only with interactive spheres
    const intersects = raycaster.intersectObjects(interactiveSpheres, false);

    if (intersects.length > 0) {
        const newHoveredSphere = intersects[0].object;

        // If a new sphere is hovered
        if (hoveredSphere !== newHoveredSphere) {
            // Make old sphere invisible
            if (hoveredSphere) {
                hoveredSphere.material.opacity = 0;
            }
            // Make new sphere visible and highlight
            hoveredSphere = newHoveredSphere;
            hoveredSphere.material.opacity = 0.5;
            hoveredSphere.material.color.setHex(hoverColor);
            viewer.style.cursor = 'pointer';

            // Show tooltip
            const componentName = hoveredSphere.userData.componentName;
            const wheelPosition = hoveredSphere.userData.wheelPosition;
            const displayText = wheelPosition ? `${componentName} (${wheelPosition})` : componentName;
            tooltip.textContent = displayText;
            tooltip.style.display = 'block';
        }

        // Update tooltip position (follows mouse)
        tooltip.style.left = (event.clientX + 10) + 'px';
        tooltip.style.top = (event.clientY - 10) + 'px';
    } else {
        // No sphere hovered - make all invisible
        if (hoveredSphere) {
            hoveredSphere.material.opacity = 0;
            hoveredSphere = null;
            viewer.style.cursor = 'default';

            // Hide tooltip
            tooltip.style.display = 'none';
        }
    }
});

viewer.addEventListener('mousedown', (event) => {
    // Mouse position in Normalized Device Coordinates (-1 to +1)
    const rect = viewer.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    // First check intersections with interactive spheres
    const sphereIntersects = raycaster.intersectObjects(interactiveSpheres, false);
    if (sphereIntersects.length > 0) {
        const clickedSphere = sphereIntersects[0].object;
        handleSphereClick(clickedSphere);
        return; // Verhindere weitere Klick-Behandlung
    }

    // Fallback: check intersections with all objects in the scene
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        const point = intersects[0].point;
        // console.log('Geklickte 3D-Position:', point.x, point.y, point.z);
    }
});

// Function to open the corresponding dropdown and align the camera
function handleSphereClick(sphere) {
    const dropdownId = sphere.userData.dropdownId;
    const componentName = sphere.userData.componentName;
    const wheelPosition = sphere.userData.wheelPosition;

    // Open dropdown (uses the existing toggleDropdown function)
    if (typeof toggleDropdown === 'function') {
        const dropdownContent = document.getElementById(dropdownId);
        if (dropdownContent && !dropdownContent.classList.contains('active')) {
            toggleDropdown(dropdownId);

            // Show sphere temporarily after short delay (so camera animation starts)
            setTimeout(() => {
                showSphereTemporarily(dropdownId, wheelPosition);
            }, 300);

            // Scroll to dropdown after short delay (so animation has time)
            setTimeout(() => {
                const dropdownButton = dropdownContent.previousElementSibling;
                if (dropdownButton) {
                    dropdownButton.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 100);
        }
    }

    // Special handling for mecanum wheels: move to specific wheel position
    if (dropdownId === 'mecanum-info' && wheelPosition && typeof animateCameraTo === 'function') {
        const wheelPositions = {
            'ul': [-3.2434069601386466, -0.016722713633769752, -0.6951247068454449],
            'll': [-0.24261811695252317, 1.6036004243494366, 2.1608627297498635],
            'ur': [0.3530278945591408, -1.413677842580443, -2.615154741745456],
            'lr': [3.109156371144225, 0.13735874093267916, -0.49460812520429426]
        };

        if (wheelPositions[wheelPosition]) {
            animateCameraTo(wheelPositions[wheelPosition]);
        }
    }

    // Special handling for LEDs: move to specific LED position
    if (dropdownId === 'leds-info' && wheelPosition && typeof animateCameraTo === 'function') {
        const ledPositions = {
            'back': [1.836944727516901, 1.3470064534296404, 1.4529051211060071],
            'front': [-1.5071554124371749, -1.1379055189520813, -1.9321954355522848]
        };

        if (ledPositions[wheelPosition]) {
            animateCameraTo(ledPositions[wheelPosition]);
        }
    }
}

// Function to briefly show a sphere with orange blinking
function showSphereTemporarily(dropdownId, wheelPosition = null) {
    // Finde die entsprechenden Kugeln
    let targetSpheres = [];

    // Find the corresponding spheres
    for (const sphere of interactiveSpheres) {
        if (sphere.userData.dropdownId === dropdownId) {
            // For LEDs: collect all spheres with the same wheelPosition
            if (dropdownId === 'leds-info' && wheelPosition && sphere.userData.wheelPosition === wheelPosition) {
                targetSpheres.push(sphere);
            }
            // For mecanum wheels: check specific position
            else if (dropdownId === 'mecanum-info' && wheelPosition && sphere.userData.wheelPosition === wheelPosition) {
                targetSpheres.push(sphere);
                break; // Only one sphere for mecanum wheels
            }
            // For other components without wheelPosition
            else if (!wheelPosition && !sphere.userData.wheelPosition) {
                targetSpheres.push(sphere);
                break; // Only one sphere for other components
            }
            // Fallback: first matching sphere if no specific position given
            else if (!wheelPosition && targetSpheres.length === 0) {
                targetSpheres.push(sphere);
            }
        }
    }

    if (targetSpheres.length === 0) return;

    // Blink animation for 1 second for all found spheres
    let blinkCount = 0;
    const maxBlinks = 6; // 3 full blink cycles in 1 second

    const blinkInterval = setInterval(() => {
        targetSpheres.forEach(sphere => {
            if (blinkCount % 2 === 0) {
                // Make sphere orange and visible
                sphere.material.opacity = 0.5;
                sphere.material.color.setHex(0xff6600); // Orange
            } else {
                // Make sphere invisible
                sphere.material.opacity = 0;
            }
        });

        blinkCount++;

        if (blinkCount >= maxBlinks) {
            clearInterval(blinkInterval);
            // Finally hide spheres
            targetSpheres.forEach(sphere => {
                sphere.material.opacity = 0;
                sphere.material.color.setHex(0x4791b8); // Back to original color
            });
        }
    }, 1000 / maxBlinks);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    // console.log('Camera position:', camera.position.x, camera.position.y, camera.position.z);
}
animate();