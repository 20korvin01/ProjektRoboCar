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
            // camera.position.z = size * 1.5; // Entfernt oder kommentiert
            controls.update();

            // // Roter Punkt auf dem Mecanum Wheel
            // const sphereGeometry = new THREE.SphereGeometry(0.01, 16, 16); // Radius ggf. anpassen
            // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            // const redDot = new THREE.Mesh(sphereGeometry, sphereMaterial);
            // redDot.position.set(
            //     -0.015510940679511014,-0.10297321741387686,0.03100083000307291
            // );
            // scene.add(redDot);
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

window.addEventListener('resize', () => {
    const viewer = document.getElementById('viewer-container');
    camera.aspect = viewer.clientWidth / viewer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
});

// Raycaster für Klick-Positionen
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

viewer.addEventListener('mousedown', (event) => {
    // Mausposition in Normalized Device Coordinates (-1 bis +1)
    const rect = viewer.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    // Prüfe Schnittpunkte mit allen Objekten in der Szene
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        const point = intersects[0].point;
        console.log('Geklickte 3D-Position:', point.x, point.y, point.z);
    }
});

// Animation
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    // // Kamera-Position immer loggen
    // console.log('Kamera-Position:', camera.position.x, camera.position.y, camera.position.z);
}
animate();