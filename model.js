// Initialisierung der Szene, Kamera und Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Kamera-Startposition festlegen
camera.position.set(0.04, -0.36, -0.27);
// Zoom-Startwert festlegen
camera.zoom = 2; // Wert anpassen, um den Zoom zu erhöhen
camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(
    document.getElementById('viewer-container').clientWidth,
    document.getElementById('viewer-container').clientHeight
);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('viewer-container').appendChild(renderer.domElement);

// OrbitControls für Mausinteraktion
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minDistance = 0.25; // Mindestabstand zur Szene, Wert ggf. anpassen
controls.maxDistance = 1; // Optional: maximaler Abstand
controls.enablePan = false; // Verschieben erlauben
controls.enableZoom = true; // Zoomen erlauben
controls.minAzimuthAngle = -Infinity; // 360° um Z
controls.maxAzimuthAngle = Infinity; // 360° um Z
controls.screenSpacePanning = false; // verhindert Gimbal Lock

// Beleuchtung
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight1.position.set(1, 1, 1);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-1, -1, -1);
scene.add(directionalLight2);

// MTL + OBJ Loader
const mtlLoader = new THREE.MTLLoader();
mtlLoader.load('model/Mesh.mtl', function (materials) {
    materials.preload();
    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(
        'model/Mesh.obj',
        function (object) {
            object.rotation.x = -Math.PI / 2; // ggf. anpassen
            scene.add(object);
            loadedObject = object;
            // Kamera automatisch positionieren
            const box = new THREE.Box3().setFromObject(object);
            const size = box.getSize(new THREE.Vector3()).length();
            const center = box.getCenter(new THREE.Vector3());
            object.position.sub(center);
            controls.update();

            // klickbare Kugeln für jedes Element im Objekt
            const sphereGeometry = new THREE.SphereGeometry(0.01, 10, 10);

            // Raspberry Pi
            const raspberryPiDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({
                color: 0x4791b8,
                transparent: true,
                opacity: 0
            }));
            raspberryPiDot.position.set(-0.010734156239580723, -0.03809923081495445, -0.004882912287575869);
            raspberryPiDot.userData = { dropdownId: 'raspberrypi4-info', componentName: 'Raspberry Pi 4 Model B' };
            scene.add(raspberryPiDot);
            interactiveSpheres.push(raspberryPiDot);

            // Baseplate
            const baseplateDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({
                color: 0x4791b8,
                transparent: true,
                opacity: 0
            }));
            baseplateDot.position.set(-0.00627971555698543, -0.0031130993207701962, -0.05862825734146382);
            baseplateDot.userData = { dropdownId: 'baseplate-info', componentName: 'Baseplate' };
            scene.add(baseplateDot);
            interactiveSpheres.push(baseplateDot);

            // Mecanum-Räder
            const mecanumDot_ll = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            mecanumDot_ll.position.set(-0.015510940679511014, -0.10297321741387686, 0.03100083000307291);
            mecanumDot_ll.userData = { dropdownId: 'mecanum-info', componentName: 'Mecanum Wheels', wheelPosition: 'll' };
            scene.add(mecanumDot_ll);
            interactiveSpheres.push(mecanumDot_ll);

            const mecanumDot_lr = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            mecanumDot_lr.position.set(-0.09281576410307482, 0.044201298403639205, 0.032855134767170946);
            mecanumDot_lr.userData = { dropdownId: 'mecanum-info', componentName: 'Mecanum Wheels', wheelPosition: 'lr' };
            scene.add(mecanumDot_lr);
            interactiveSpheres.push(mecanumDot_lr);

            const mecanumDot_ul = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            mecanumDot_ul.position.set(0.10922889074971112, -0.038629609331275266, 0.030828732689508587);
            mecanumDot_ul.userData = { dropdownId: 'mecanum-info', componentName: 'Mecanum Wheels', wheelPosition: 'ul' };
            scene.add(mecanumDot_ul);
            interactiveSpheres.push(mecanumDot_ul);

            const mecanumDot_ur = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            mecanumDot_ur.position.set(0.036327421397384124, 0.10860399480186282, 0.031912950109006744);
            mecanumDot_ur.userData = { dropdownId: 'mecanum-info', componentName: 'Mecanum Wheels', wheelPosition: 'ur' };
            scene.add(mecanumDot_ur);
            interactiveSpheres.push(mecanumDot_ur);

            // HC-SR04 Sensor - back
            const hcSr04BackDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            hcSr04BackDot.position.set(-0.08408327186912476, -0.04434087965017944, 0.032742918984209224);
            hcSr04BackDot.userData = { dropdownId: 'hc-sr04-back-info', componentName: 'HC-SR04 - back' };
            scene.add(hcSr04BackDot);
            interactiveSpheres.push(hcSr04BackDot);

            // HC-SR04 Front
            const hcSr04FrontDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            hcSr04FrontDot.position.set(0.08627872359884009, 0.04360834730942198, -0.04898689576956572);
            hcSr04FrontDot.userData = { dropdownId: 'hc-sr04-front-info', componentName: 'HC-SR04 - front' };
            scene.add(hcSr04FrontDot);
            interactiveSpheres.push(hcSr04FrontDot);

            // IR Obstacle Sensor
            const irObstacleDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            irObstacleDot.position.set(0.10617668380222775, 0.05373581160977492, 0.038763302859598614);
            irObstacleDot.userData = { dropdownId: 'ir-obstacle-info', componentName: 'IR Obstacle Avoidance Sensor' };
            scene.add(irObstacleDot);
            interactiveSpheres.push(irObstacleDot);

            // Display
            const displayDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            displayDot.position.set(-0.03652331702478477, -0.01998073227694644, -0.05714205470418604);
            displayDot.userData = { dropdownId: 'display-info', componentName: 'LCD Display' };
            scene.add(displayDot);
            interactiveSpheres.push(displayDot);

            // LEDs
            const ledsBackDot_ll = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            ledsBackDot_ll.position.set(-0.07298370048506309, -0.06992052590144834, 0.030715559845855334);
            ledsBackDot_ll.userData = { dropdownId: 'leds-info', componentName: 'LEDs', wheelPosition: 'back' };
            scene.add(ledsBackDot_ll);
            interactiveSpheres.push(ledsBackDot_ll);

            const ledsFrontDot_lr = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            ledsFrontDot_lr.position.set(-0.0980164942191489, -0.021297564906544664, 0.03023354224838537);
            ledsFrontDot_lr.userData = { dropdownId: 'leds-info', componentName: 'LEDs', wheelPosition: 'back' };
            scene.add(ledsFrontDot_lr);
            interactiveSpheres.push(ledsFrontDot_lr);

            const ledsFrontDot_ul = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            ledsFrontDot_ul.position.set(0.11356559927320159, 0.02857011398872955, 0.030276758906499557);
            ledsFrontDot_ul.userData = { dropdownId: 'leds-info', componentName: 'LEDs', wheelPosition: 'front' };
            scene.add(ledsFrontDot_ul);
            interactiveSpheres.push(ledsFrontDot_ul);

            const ledsBackDot_ur = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            ledsBackDot_ur.position.set(0.09043808460852729, 0.07484803146147455, 0.030933930445268376);
            ledsBackDot_ur.userData = { dropdownId: 'leds-info', componentName: 'LEDs', wheelPosition: 'front' };
            scene.add(ledsBackDot_ur);
            interactiveSpheres.push(ledsBackDot_ur);

            // LED Bar
            const ledBarDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            ledBarDot.position.set(-0.04839659171761597, -0.050233757719243904, -0.06476286906591172);
            ledBarDot.userData = { dropdownId: 'led-bar-info', componentName: 'LED Bar' };
            scene.add(ledBarDot);
            interactiveSpheres.push(ledBarDot);

            // Servo Motor
            const servoDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            servoDot.position.set(0.05863274587011251, 0.02015297045515302, -0.014272814175250725);
            servoDot.userData = { dropdownId: 'servo-info', componentName: 'Servo Motor' };
            scene.add(servoDot);
            interactiveSpheres.push(servoDot);

            // Microphone
            const microphoneDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            microphoneDot.position.set(-0.06926247579627567, -0.056879734249250774, -0.004494233242338053);
            microphoneDot.userData = { dropdownId: 'microphone-info', componentName: 'Microphone' };
            scene.add(microphoneDot);
            interactiveSpheres.push(microphoneDot);

            // MPU6050
            const mpu6050Dot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            mpu6050Dot.position.set(0.03411151216795891, 0.012263533720713732, -0.01432096892688789);
            mpu6050Dot.userData = { dropdownId: 'mpu6050-info', componentName: 'MPU6050' };
            scene.add(mpu6050Dot);
            interactiveSpheres.push(mpu6050Dot);

            // Buttons
            const buttonsDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            buttonsDot.position.set(-0.06398159990069989, -0.021619054549798483, -0.06041103551292587);
            buttonsDot.userData = { dropdownId: 'buttons-info', componentName: 'Buttons' };
            scene.add(buttonsDot);
            interactiveSpheres.push(buttonsDot);

            // Camera
            const cameraDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            cameraDot.position.set(0.09465755796611061, 0.04749234476370712, -0.028778262220461315);
            cameraDot.userData = { dropdownId: 'camera-info', componentName: 'Camera' };
            scene.add(cameraDot);
            interactiveSpheres.push(cameraDot);

            // Active Buzzer
            const activeBuzzerDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial
            ({ color: 0x4791b8, transparent: true, opacity: 0 }));
            activeBuzzerDot.position.set(0.08130842160280202, 0.06172821476678886, 0.006984059074721882);
            activeBuzzerDot.userData = { dropdownId: 'buzzer-info', componentName: 'Active Buzzer' };
            scene.add(activeBuzzerDot);
            interactiveSpheres.push(activeBuzzerDot);

            // Speaker
            const speakerDot = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x4791b8, transparent: true, opacity: 0 }));
            speakerDot.position.set(-0.0634963513656609, -0.033334108668362505, -0.03680819816629827);
            speakerDot.userData = { dropdownId: 'speaker-info', componentName: 'Speaker' };
            scene.add(speakerDot);
            interactiveSpheres.push(speakerDot);
        },
        undefined,
        function (error) {
            console.error('Fehler beim Laden der OBJ-Datei:', error);
        }
    );
});

const viewer = document.getElementById('viewer-container');
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
camera.aspect = viewer.clientWidth / viewer.clientHeight;
camera.updateProjectionMatrix();

// Tooltip für Hover-Text erstellen
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

// Raycaster für Klick-Positionen
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Array zum Speichern der interaktiven Kugeln
const interactiveSpheres = [];
let hoveredSphere = null;
const originalColor = 0x4791b8;
const hoverColor = 0x4791b8;

viewer.addEventListener('mousemove', (event) => {
    // Mausposition in Normalized Device Coordinates (-1 bis +1)
    const rect = viewer.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    // Prüfe Schnittpunkte nur mit den interaktiven Kugeln
    const intersects = raycaster.intersectObjects(interactiveSpheres, false);

    if (intersects.length > 0) {
        const newHoveredSphere = intersects[0].object;

        // Wenn eine neue Kugel gehovered wird
        if (hoveredSphere !== newHoveredSphere) {
            // Alte Kugel unsichtbar machen
            if (hoveredSphere) {
                hoveredSphere.material.opacity = 0;
            }
            // Neue Kugel sichtbar machen und highlighten
            hoveredSphere = newHoveredSphere;
            hoveredSphere.material.opacity = 0.5; // Transparenter für bessere Sichtbarkeit
            hoveredSphere.material.color.setHex(hoverColor);
            viewer.style.cursor = 'pointer';
            
            // Tooltip anzeigen
            const componentName = hoveredSphere.userData.componentName;
            const wheelPosition = hoveredSphere.userData.wheelPosition;
            const displayText = wheelPosition ? `${componentName} (${wheelPosition})` : componentName;
            tooltip.textContent = displayText;
            tooltip.style.display = 'block';
        }
        
        // Tooltip-Position aktualisieren (folgt der Maus)
        tooltip.style.left = (event.clientX + 10) + 'px';
        tooltip.style.top = (event.clientY - 10) + 'px';
    } else {
        // Keine Kugel gehovered - alle unsichtbar machen
        if (hoveredSphere) {
            hoveredSphere.material.opacity = 0;
            hoveredSphere = null;
            viewer.style.cursor = 'default';
            
            // Tooltip verstecken
            tooltip.style.display = 'none';
        }
    }
});

viewer.addEventListener('mousedown', (event) => {
    // Mausposition in Normalized Device Coordinates (-1 bis +1)
    const rect = viewer.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    // Prüfe zuerst Schnittpunkte mit interaktiven Kugeln
    const sphereIntersects = raycaster.intersectObjects(interactiveSpheres, false);
    if (sphereIntersects.length > 0) {
        const clickedSphere = sphereIntersects[0].object;
        handleSphereClick(clickedSphere);
        return; // Verhindere weitere Klick-Behandlung
    }

    // Fallback: Prüfe Schnittpunkte mit allen Objekten in der Szene
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        const point = intersects[0].point;
        // console.log('Geklickte 3D-Position:', point.x, point.y, point.z);
    }
});

// Funktion zum Öffnen des entsprechenden Dropdowns und Ausrichten der Kamera
function handleSphereClick(sphere) {
    const dropdownId = sphere.userData.dropdownId;
    const componentName = sphere.userData.componentName;
    const wheelPosition = sphere.userData.wheelPosition;

    // Dropdown öffnen (nutzt die vorhandene toggleDropdown Funktion)
    if (typeof toggleDropdown === 'function') {
        const dropdownContent = document.getElementById(dropdownId);
        if (dropdownContent && !dropdownContent.classList.contains('active')) {
            toggleDropdown(dropdownId);
            
            // Kugel temporär anzeigen nach kurzer Verzögerung (damit Kamera-Animation startet)
            setTimeout(() => {
                showSphereTemporarily(dropdownId, wheelPosition);
            }, 300);
            
            // Zum Dropdown scrollen nach kurzer Verzögerung (damit Animation Zeit hat)
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
    
    // Spezielle Behandlung für Mecanum-Räder: zur spezifischen Rad-Position fahren
    if (dropdownId === 'mecanum-info' && wheelPosition && typeof animateCameraTo === 'function') {
        const wheelPositions = {
            'ul': [0.4227505420384501, -0.1532568065994152, -0.04352390650136645],
            'll': [-0.000022849681043455115, -0.35786716691570847, -0.00010329167066451409],
            'ur': [2.4078865186641126e-8, 0.4517742799228204, 4.511522501995478e-7],
            'lr': [-0.3512126223891305, 0.28194998222723977, 0.03541047015494677]
        };
        
        if (wheelPositions[wheelPosition]) {
            animateCameraTo(wheelPositions[wheelPosition]);
        }
    }
    
    // Spezielle Behandlung für LEDs: zur spezifischen LED-Position fahren
    if (dropdownId === 'leds-info' && wheelPosition && typeof animateCameraTo === 'function') {
        const ledPositions = {
            'back': [-0.2732457892896901, -0.11971781639553765, 0.028883146379215654],
            'front': [0.2615088455435465, 0.13483705068743013, 0.057113453198184415]
        };
        
        if (ledPositions[wheelPosition]) {
            animateCameraTo(ledPositions[wheelPosition]);
        }
    }
    
    // console.log(`Clicked on ${componentName}${wheelPosition ? ` (${wheelPosition})` : ''} - Opening dropdown ${dropdownId}`);
}

// Funktion zum kurzen Anzeigen einer Kugel mit orangem Blinken
function showSphereTemporarily(dropdownId, wheelPosition = null) {
    // Finde die entsprechenden Kugeln
    let targetSpheres = [];
    
    for (const sphere of interactiveSpheres) {
        if (sphere.userData.dropdownId === dropdownId) {
            // Für LEDs: alle Kugeln mit der gleichen wheelPosition sammeln
            if (dropdownId === 'leds-info' && wheelPosition && sphere.userData.wheelPosition === wheelPosition) {
                targetSpheres.push(sphere);
            }
            // Für Mecanum-Räder: spezifische Position prüfen
            else if (dropdownId === 'mecanum-info' && wheelPosition && sphere.userData.wheelPosition === wheelPosition) {
                targetSpheres.push(sphere);
                break; // Bei Mecanum-Rädern nur eine Kugel
            }
            // Für andere Komponenten ohne wheelPosition
            else if (!wheelPosition && !sphere.userData.wheelPosition) {
                targetSpheres.push(sphere);
                break; // Bei anderen Komponenten nur eine Kugel
            }
            // Fallback: erste passende Kugel wenn keine spezifische Position angegeben
            else if (!wheelPosition && targetSpheres.length === 0) {
                targetSpheres.push(sphere);
            }
        }
    }
    
    if (targetSpheres.length === 0) return;
    
    // Blink-Animation für 1 Sekunde für alle gefundenen Kugeln
    let blinkCount = 0;
    const maxBlinks = 6; // 3 vollständige Blink-Zyklen in 1 Sekunde
    
    const blinkInterval = setInterval(() => {
        targetSpheres.forEach(sphere => {
            if (blinkCount % 2 === 0) {
                // Kugel orange und sichtbar machen
                sphere.material.opacity = 0.5;
                sphere.material.color.setHex(0xff6600); // Orange
            } else {
                // Kugel unsichtbar machen
                sphere.material.opacity = 0;
            }
        });
        
        blinkCount++;
        
        if (blinkCount >= maxBlinks) {
            clearInterval(blinkInterval);
            // Kugeln endgültig ausblenden
            targetSpheres.forEach(sphere => {
                sphere.material.opacity = 0;
                sphere.material.color.setHex(0x4791b8); // Zurück zur ursprünglichen Farbe
            });
        }
    }, 1000 / maxBlinks); // Alle ~167ms blinken
}

// Animation
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    // console.log('Kamera-Position:', camera.position.x, camera.position.y, camera.position.z);
}
animate();