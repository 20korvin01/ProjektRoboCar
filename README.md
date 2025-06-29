# ProjektRoboCar

Ein interaktives 3D-Dashboard zur Visualisierung und Erkundung von Roboterkomponenten und Sensoren.

**🌐 Live Demo**: [https://20korvin01.github.io/ProjektRoboCar/](https://20korvin01.github.io/ProjektRoboCar/)

## 📋 Projektübersicht

Das RoboCar Info-Dashboard ist eine webbasierte 3D-Anwendung, die es Benutzern ermöglicht, verschiedene Roboterkomponenten zu erkunden und detaillierte Informationen über deren Funktionsweise zu erhalten. Das Projekt kombiniert Three.js für die 3D-Visualisierung mit einem informativen Dropdown-System.

**Erstellt für**: Veranstaltung "Visualization of Geodata in 2D, 3D and 4D"  
**Autor**: Korvin Brecht

## ✨ Features

- **Interaktive 3D-Visualisierung**: Vollständig navigierbares 3D-Modell eines Roboter-Cars
- **Hover-Effekte**: Unsichtbare Hotspots werden beim Überfahren mit der Maus sichtbar
- **Klickbare Komponenten**: Direkte Interaktion mit spezifischen Roboterteilen
- **Automatische Kamera-Navigation**: Smooth camera transitions zu fokussierten Komponenten
- **Detaillierte Komponenteninformationen**: Umfassende technische Spezifikationen für jeden Sensor
- **Responsive Design**: Funktioniert auf verschiedenen Bildschirmgrößen

## 🎯 Verfügbare Komponenten

### Antriebssystem
- **Mecanum Wheels (4x)**: Omnidirektionale Räder für erweiterte Manövrierfähigkeit
  - Upper Left (ul), Lower Left (ll), Upper Right (ur), Lower Right (lr)
  - Individuelle Kamera-Positionen für jedes Rad

### Sensoren
- **HC-SR04 Ultraschallsensoren**: 
  - Front-Sensor für Hinderniserkennung
  - Back-Sensor für Rückwärtsfahrt
- **IR Obstacle Avoidance Sensor**: Infrarot-Hindernissensor
- **MPU6050**: 6-Achsen-Bewegungssensor (Accelerometer + Gyroscope)
- **Camera**: Visueller Sensor für Computer Vision
- **Microphone**: Audio-Eingabegerät

### Anzeige & Steuerung
- **LCD Display**: Informationsanzeige
- **LED Bar**: Status- und Batterieanzeige
- **Buttons**: Manuelle Steuerungselemente
- **Servo Motor**: Präzise Bewegungssteuerung

## 🚀 Installation & Setup

### Live Demo
**Direkt ausprobieren**: [https://20korvin01.github.io/ProjektRoboCar/](https://20korvin01.github.io/ProjektRoboCar/)

### Lokale Installation
#### Voraussetzungen
- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)
- Lokaler Webserver (empfohlen) oder Live Server Extension

### Dateien
```
ProjektRoboCar/
├── index.html          # Haupt-HTML-Datei
├── model.js            # 3D-Szene und Interaktionslogik
├── dropdown.js         # Dropdown-Funktionalität und Kamera-Steuerung
├── style.css           # Styling
├── model/
│   ├── Mesh.obj        # 3D-Modell
│   ├── Mesh.mtl        # Material-Definitionen
│   └── Mesh.jpg        # Texturen
└── img/                # Komponentenbilder
    ├── hc-sr04.png
    ├── meccanum.png
    ├── camera.png
    └── ...
```

### Starten der Anwendung
**Option 1 - Live Demo** (empfohlen):
- Einfach den Link öffnen: [https://20korvin01.github.io/ProjektRoboCar/](https://20korvin01.github.io/ProjektRoboCar/)

**Option 2 - Lokale Installation**:
1. Repository klonen oder Dateien herunterladen
2. Lokalen Webserver starten oder Live Server Extension verwenden
3. `index.html` im Browser öffnen

## 🎮 Bedienung

### Maus-Steuerung
- **Linke Maustaste + Ziehen**: 3D-Modell rotieren
- **Mausrad**: Zoomen
- **Hover über Komponenten**: Hotspots werden sichtbar
- **Klick auf Komponenten**: Öffnet entsprechendes Info-Panel und positioniert Kamera

### Dropdown-Navigation
- **Direkte Auswahl**: Klick auf Dropdown-Buttons in der Seitenleiste
- **Mecanum Wheels**: 
  - Dropdown-Button → Zufällige Rad-Auswahl
  - Direkter Klick auf Rad → Spezifische Kamera-Position

## 🔧 Technische Details

### Verwendete Technologien
- **Three.js**: 3D-Grafik-Engine
- **HTML5 + CSS3**: Frontend-Struktur und Styling
- **JavaScript ES6+**: Interaktionslogik
- **Bootstrap Icons**: Icon-Set für UI-Elemente

## 🎨 Anpassung

### Neue Komponenten hinzufügen
1. **3D-Position ermitteln**: Koordinaten im 3D-Modell bestimmen
2. **Hotspot erstellen** in `model.js`:
```javascript
const newComponentDot = new THREE.Mesh(sphereGeometry, material);
newComponentDot.position.set(x, y, z);
newComponentDot.userData = { 
    dropdownId: 'new-component-info', 
    componentName: 'New Component' 
};
```
3. **Dropdown hinzufügen** in `index.html`
4. **Kamera-Position definieren** in `dropdown.js`

### Styling anpassen
- CSS-Variablen in `style.css` für Farben und Abstände
- Bootstrap Icons für neue Symbole
- Responsive Breakpoints anpassen

## 📱 Browser-Kompatibilität

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Vollständig unterstützt |
| Firefox | 88+     | ✅ Vollständig unterstützt |
| Safari  | 14+     | ✅ Vollständig unterstützt |
| Edge    | 90+     | ✅ Vollständig unterstützt |

## 🐛 Bekannte Probleme

- **Performance**: Komplexe 3D-Modelle können auf älteren Geräten langsam sein
- **Touch-Geräte**: Hover-Effekte funktionieren anders auf Touch-Screens
- **Lokale Dateien**: Einige Browser blockieren lokale Datei-Zugriffe (CORS)

## 📄 Lizenz

Dieses Projekt wurde für die universitäre Veranstaltung "Visualization of Geodata in 2D, 3D and 4D" erstellt. Es dient Bildungs- und Demonstrationszwecken. Verwendete Bibliotheken (Three.js, Bootstrap Icons) unterliegen ihren jeweiligen Open-Source-Lizenzen.

## 👥 Mitwirkende

- **Entwicklung**: Korvin Brecht
- **Projekt für**: Veranstaltung "Visualization of Geodata in 2D, 3D and 4D"
- **3D-Modell**: RoboCar-Modell mit Sensoren und Komponenten
- **Framework**: Three.js für 3D-Visualisierung

## 📞 Support

Bei Fragen oder Problemen:
1. README.md durchlesen
2. Browser-Konsole auf Fehler prüfen
3. Lokalen Webserver verwenden statt direkten Datei-Aufruf

---

**Hinweis**: Dieses Projekt dient der Visualisierung von Roboterkomponenten und ist für Lehr- und Demonstrationszwecke optimiert.