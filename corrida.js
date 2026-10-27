import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. Tela de Capa / Menu Inicial (Start Screen)
let startScreen = document.getElementById('start-screen');
if (!startScreen) {
    startScreen = document.createElement('div');
    startScreen.id = 'start-screen';
    startScreen.style.position = 'absolute';
    startScreen.style.top = '0';
    startScreen.style.left = '0';
    startScreen.style.width = '100%';
    startScreen.style.height = '100%';
    startScreen.style.background = 'linear-gradient(135deg, #0a0a0c 0%, #1a1a2e 100%)';
    startScreen.style.display = 'flex';
    startScreen.style.flexDirection = 'column';
    startScreen.style.justifyContent = 'center';
    startScreen.style.alignItems = 'center';
    startScreen.style.zIndex = '2000';
    startScreen.style.fontFamily = 'Arial, sans-serif';

    startScreen.innerHTML = `
        <h1 style="color: #00e5ff; font-size: 64px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 4px; text-shadow: 0 0 20px rgba(0, 229, 255, 0.6);">F1 SAKHIR GP</h1>
        <p style="color: #aaaaaa; font-size: 20px; margin-bottom: 40px; letter-spacing: 2px;">2026 SEASON CHAMPIONSHIP</p>
        <button id="start-btn" style="
            padding: 16px 48px;
            font-size: 24px;
            font-weight: bold;
            color: #ffffff;
            background: linear-gradient(90deg, #ff1100, #d32f2f);
            border: none;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(255, 17, 0, 0.4);
            transition: all 0.2s ease;
            text-transform: uppercase;
            letter-spacing: 2px;">
            INICIAR CORRIDA
        </button>
    `;
    document.body.appendChild(startScreen);
}

// 2. Interface de Usuário (HUD)
let hudContainer = document.getElementById('hud-laps');
if (!hudContainer) {
    hudContainer = document.createElement('div');
    hudContainer.id = 'hud-laps';
    hudContainer.style.position = 'absolute';
    hudContainer.style.top = '20px';
    hudContainer.style.right = '20px';
    hudContainer.style.color = '#ffffff';
    hudContainer.style.fontFamily = 'Arial, sans-serif';
    hudContainer.style.fontSize = '22px';
    hudContainer.style.fontWeight = 'bold';
    hudContainer.style.background = 'rgba(15, 23, 42, 0.85)';
    hudContainer.style.padding = '12px 24px';
    hudContainer.style.borderRadius = '10px';
    hudContainer.style.border = '2px solid rgba(0, 229, 255, 0.4)';
    hudContainer.style.zIndex = '1000';
    document.body.appendChild(hudContainer);
}

let posContainer = document.getElementById('hud-pos');
if (!posContainer) {
    posContainer = document.createElement('div');
    posContainer.id = 'hud-pos';
    posContainer.style.position = 'absolute';
    posContainer.style.top = '20px';
    posContainer.style.left = '20px';
    posContainer.style.color = '#ffffff';
    posContainer.style.fontFamily = 'Arial, sans-serif';
    posContainer.style.fontSize = '28px';
    posContainer.style.fontWeight = 'bold';
    posContainer.style.background = 'rgba(15, 23, 42, 0.85)';
    posContainer.style.padding = '12px 24px';
    posContainer.style.borderRadius = '10px';
    posContainer.style.border = '2px solid rgba(255, 215, 0, 0.6)';
    posContainer.style.zIndex = '1000';
    document.body.appendChild(posContainer);
}

// Semáforo de Largada F1
let lightsContainer = document.getElementById('f1-lights');
if (!lightsContainer) {
    lightsContainer = document.createElement('div');
    lightsContainer.id = 'f1-lights';
    lightsContainer.style.position = 'absolute';
    lightsContainer.style.top = '15%';
    lightsContainer.style.left = '50%';
    lightsContainer.style.transform = 'translate(-50%, -50%)';
    lightsContainer.style.display = 'none'; // Exibe apenas após iniciar pela capa
    lightsContainer.style.gap = '15px';
    lightsContainer.style.background = '#111';
    lightsContainer.style.padding = '15px 25px';
    lightsContainer.style.borderRadius = '12px';
    lightsContainer.style.border = '3px solid #333';
    lightsContainer.style.zIndex = '1000';

    for (let i = 0; i < 5; i++) {
        const light = document.createElement('div');
        light.className = 'f1-light';
        light.style.width = '35px';
        light.style.height = '35px';
        light.style.borderRadius = '50%';
        light.style.background = '#222';
        light.style.border = '2px solid #000';
        lightsContainer.appendChild(light);
    }
    document.body.appendChild(lightsContainer);
}

// 3. Cena e Renderizador
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight, 
    0.1, 
    1500
);

const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(1.0);

document.getElementById('canvas-container').appendChild(renderer.domElement);

// 4. Iluminação
const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfffaed, 1.5);
dirLight.position.set(200, 300, 150);
scene.add(dirLight);

// 5. Traçado do Circuito de Sakhir (Barrein)
const trackCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),         // Reta Principal
    new THREE.Vector3(0, 0, -500),      // T1
    new THREE.Vector3(-80, 0, -580),    // T1 / T2
    new THREE.Vector3(-60, 0, -450),    // T3
    new THREE.Vector3(150, 0, -420),    // Reta oposta T4
    new THREE.Vector3(260, 0, -450),    // T4
    new THREE.Vector3(280, 0, -350),    // T5 / T6
    new THREE.Vector3(220, 0, -280),    // T7
    new THREE.Vector3(280, 0, -200),    // T8
    new THREE.Vector3(500, 0, -500),    // T9 / T10
    new THREE.Vector3(650, 0, -650),    // T9
    new THREE.Vector3(580, 0, -450),    // T10
    new THREE.Vector3(380, 0, -100),    // T11 / T12
    new THREE.Vector3(280, 0, 150),     // T13
    new THREE.Vector3(100, 0, 180),     // T14
    new THREE.Vector3(20, 0, 100)       // T15
], true);

const TRACK_WIDTH = 26;

// Asfalto
const trackGeometry = new THREE.TubeGeometry(trackCurve, 500, TRACK_WIDTH / 2, 8, true);
const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x2e2e2e, roughness: 0.8 });
const trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
trackMesh.scale.set(1, 0.012, 1);
scene.add(trackMesh);

// Terreno
const grassGeometry = new THREE.PlaneGeometry(8000, 8000);
const grassMaterial = new THREE.MeshBasicMaterial({ color: 0x1e6838 });
const grassMesh = new THREE.Mesh(grassGeometry, grassMaterial);
grassMesh.rotation.x = -Math.PI / 2;
grassMesh.position.y = -0.05;
scene.add(grassMesh);

// Zebras e Guardrails (Totalmente recuados para fora do asfalto)
function buildTrackDetails() {
    const pointsCount = 600;
    const points = trackCurve.getSpacedPoints(pointsCount);

    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const redMat = new THREE.MeshBasicMaterial({ color: 0xd32f2f });
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xf5f5f5 });
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0x607d8b, roughness: 0.4 });

    for (let i = 0; i < pointsCount; i++) {
        const point = points[i];
        const tangent = trackCurve.getTangentAt(i / pointsCount);
        const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        const rotY = Math.atan2(tangent.x, tangent.z);

        // A. Linha Central Tracejada
        if (i % 4 === 0) {
            const centerGeo = new THREE.PlaneGeometry(0.3, 2.5);
            const centerMesh = new THREE.Mesh(centerGeo, lineMat);
            centerMesh.rotation.x = -Math.PI / 2;
            centerMesh.rotation.z = rotY;
            centerMesh.position.set(point.x, 0.02, point.z);
            scene.add(centerMesh);
        }

        // B. Zebras Vermelhas/Brancas nas Bordas
        const curbLeftPos = point.clone().add(normal.clone().multiplyScalar((TRACK_WIDTH / 2)));
        const curbRightPos = point.clone().add(normal.clone().multiplyScalar(-(TRACK_WIDTH / 2)));

        const curbMat = (i % 2 === 0) ? redMat : whiteMat;
        const curbGeo = new THREE.BoxGeometry(1.2, 0.1, 2.0);

        const curbLeft = new THREE.Mesh(curbGeo, curbMat);
        curbLeft.position.set(curbLeftPos.x, 0.04, curbLeftPos.z);
        curbLeft.rotation.y = rotY;
        scene.add(curbLeft);

        const curbRight = new THREE.Mesh(curbGeo, curbMat);
        curbRight.position.set(curbRightPos.x, 0.04, curbRightPos.z);
        curbRight.rotation.y = rotY;
        scene.add(curbRight);

        // C. Muretas Recuadas (Afastadas 4 metros para fora da borda do asfalto)
        if (i % 2 === 0) {
            const wallOffset = (TRACK_WIDTH / 2) + 4.0;
            const leftWallPos = point.clone().add(normal.clone().multiplyScalar(wallOffset));
            const rightWallPos = point.clone().add(normal.clone().multiplyScalar(-wallOffset));

            const wallGeo = new THREE.BoxGeometry(0.6, 1.2, 3.2);

            const leftWall = new THREE.Mesh(wallGeo, barrierMat);
            leftWall.position.set(leftWallPos.x, 0.6, leftWallPos.z);
            leftWall.rotation.y = rotY;
            scene.add(leftWall);

            const rightWall = new THREE.Mesh(wallGeo, barrierMat);
            rightWall.position.set(rightWallPos.x, 0.6, rightWallPos.z);
            rightWall.rotation.y = rotY;
            scene.add(rightWall);
        }
    }
}
buildTrackDetails();

// Pórtico da Linha de Chegada
function buildFinishGantry() {
    const startLineGeo = new THREE.PlaneGeometry(TRACK_WIDTH, 4);
    const startLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const startLine = new THREE.Mesh(startLineGeo, startLineMat);
    startLine.rotation.x = -Math.PI / 2;
    startLine.position.set(0, 0.03, -20);
    scene.add(startLine);

    const pillarGeo = new THREE.CylinderGeometry(0.4, 0.4, 9, 12);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8 });

    const leftPillar = new THREE.Mesh(pillarGeo, metalMat);
    leftPillar.position.set(-(TRACK_WIDTH / 2) - 1, 4.5, -20);
    scene.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, metalMat);
    rightPillar.position.set((TRACK_WIDTH / 2) + 1, 4.5, -20);
    scene.add(rightPillar);

    const beamGeo = new THREE.BoxGeometry(TRACK_WIDTH + 3, 1.2, 1.2);
    const beam = new THREE.Mesh(beamGeo, metalMat);
    beam.position.set(0, 8.5, -20);
    scene.add(beam);
}
buildFinishGantry();

// 6. Estado do Veículo, Física e Corrida
let playerCar = null;
const opponents = [];
const GROUND_Y = 0.35;

let currentLap = 1;
const TOTAL_LAPS = 5;
let canCountLap = false;
let raceFinished = false;
let raceStarted = false;

function updateHUD(position) {
    if (raceFinished) {
        hudContainer.innerHTML = `CORRIDA FINALIZADA!`;
    } else {
        hudContainer.innerHTML = `VOLTA: ${currentLap} / ${TOTAL_LAPS}`;
    }
    posContainer.innerHTML = `POS: P${position} / 16`;
}

const carStats = {
    speed: 0,
    maxSpeed: 2.8,
    acceleration: 0.05,
    deceleration: 0.08,
    friction: 0.985,
    turnSpeed: 0.065,
    angle: Math.PI,
    progress: 0
};

// Controles
const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, s: false, a: false, d: false };

window.addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (keys.hasOwnProperty(k) || keys.hasOwnProperty(e.key)) keys[e.key] = true;
    if (keys.hasOwnProperty(k)) keys[k] = true;
});

window.addEventListener('keyup', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (keys.hasOwnProperty(k) || keys.hasOwnProperty(e.key)) keys[e.key] = false;
    if (keys.hasOwnProperty(k)) keys[k] = false;
});

function triggerF1StartSequence() {
    lightsContainer.style.display = 'flex';
    const lights = document.querySelectorAll('.f1-light');
    let step = 0;

    const interval = setInterval(() => {
        if (step < 5) {
            lights[step].style.background = '#ff1100';
            lights[step].style.boxShadow = '0 0 20px #ff1100';
            step++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                lights.forEach(l => {
                    l.style.background = '#222';
                    l.style.boxShadow = 'none';
                });
                raceStarted = true;
                setTimeout(() => {
                    lightsContainer.style.display = 'none';
                }, 800);
            }, 1000 + Math.random() * 1000);
        }
    }, 800);
}

// Botão de Início na Capa
document.getElementById('start-btn').addEventListener('click', () => {
    startScreen.style.display = 'none';
    triggerF1StartSequence();
});

// 7. Carregamento dos Modelos GLB
const loader = new GLTFLoader();
let baseAudi = null;
let baseRedbull = null;

loader.load('2026_audi_r26.glb', (gltf) => {
    baseAudi = gltf.scene;
    checkAndSetupGrid();
});

loader.load('2026_redbull_rb22.glb', (gltf) => {
    baseRedbull = gltf.scene;
    checkAndSetupGrid();
});

function checkAndSetupGrid() {
    if (!baseAudi || !baseRedbull || playerCar) return;

    const totalCars = 16;
    const rowSpacing = 12.0;
    const colSpacing = 3.5;

    for (let i = 0; i < totalCars; i++) {
        const isAudi = (i % 2 === 0);
        const carMesh = isAudi ? baseAudi.clone() : baseRedbull.clone();
        
        carMesh.scale.set(0.7, 0.7, 0.7);

        const row = Math.floor(i / 2);
        const isLeft = (i % 2 === 0);
        const col = isLeft ? -colSpacing / 2 : colSpacing / 2;

        const posX = col;
        const posZ = row * rowSpacing;

        carMesh.position.set(posX, GROUND_Y, posZ);
        carMesh.rotation.y = Math.PI;

        if (i === 0) {
            playerCar = carMesh;
            scene.add(playerCar);
        } else {
            opponents.push({
                mesh: carMesh,
                progress: Math.max(0, 1.0 - (i * 0.008)),
                speed: 0.00065 + (Math.random() * 0.00015),
                laneOffset: col,
                lap: 1
            });
            scene.add(carMesh);
        }
    }
}

function calculatePositions() {
    if (!playerCar) return 1;

    let closestDist = Infinity;
    let closestIndex = 0;
    const samplePoints = 200;

    for (let i = 0; i < samplePoints; i++) {
        const pt = trackCurve.getPointAt(i / samplePoints);
        const dist = playerCar.position.distanceTo(pt);
        if (dist < closestDist) {
            closestDist = dist;
            closestIndex = i;
        }
    }

    carStats.progress = closestIndex / samplePoints;
    const playerTotalScore = (currentLap * 10) + carStats.progress;

    let position = 1;
    for (let i = 0; i < opponents.length; i++) {
        const op = opponents[i];
        const opScore = (op.lap * 10) + op.progress;
        if (opScore > playerTotalScore) {
            position++;
        }
    }

    return position;
}

function checkLaps() {
    if (!playerCar || raceFinished) return;

    const carZ = playerCar.position.z;

    if (carZ < -200) {
        canCountLap = true;
    }

    if (canCountLap && carZ > -25 && carZ < -15 && Math.abs(playerCar.position.x) < TRACK_WIDTH / 2) {
        canCountLap = false;
        currentLap++;

        if (currentLap > TOTAL_LAPS) {
            raceFinished = true;
            currentLap = TOTAL_LAPS;
        }
    }
}

// 8. Loop de Atualização
function updateGame() {
    if (!playerCar) return;

    const accelerating = keys.ArrowUp || keys.w;
    const braking = keys.ArrowDown || keys.s;
    const turningLeft = keys.ArrowLeft || keys.a;
    const turningRight = keys.ArrowRight || keys.d;

    if (raceStarted && !raceFinished) {
        if (accelerating) {
            if (carStats.speed < carStats.maxSpeed) carStats.speed += carStats.acceleration;
        } else if (braking) {
            if (carStats.speed > -carStats.maxSpeed / 2) carStats.speed -= carStats.deceleration;
        } else {
            carStats.speed *= carStats.friction;
            if (Math.abs(carStats.speed) < 0.001) carStats.speed = 0;
        }
    } else {
        carStats.speed = 0;
    }

    if (Math.abs(carStats.speed) > 0.05) {
        const dir = carStats.speed > 0 ? 1 : -1;
        if (turningLeft) carStats.angle += carStats.turnSpeed * dir;
        if (turningRight) carStats.angle -= carStats.turnSpeed * dir;
    }

    playerCar.rotation.y = carStats.angle;
    playerCar.translateZ(carStats.speed);
    playerCar.position.y = GROUND_Y;

    checkLaps();
    const playerPos = calculatePositions();
    updateHUD(playerPos);

    // Câmera em Primeira Pessoa (Cockpit)
    const cockpitOffset = new THREE.Vector3(0, 0.75, 0.2); 
    cockpitOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), carStats.angle);
    camera.position.copy(playerCar.position).add(cockpitOffset);

    const lookAtOffset = new THREE.Vector3(0, 0.7, 10.0);
    lookAtOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), carStats.angle);
    camera.lookAt(playerCar.position.clone().add(lookAtOffset));

    // Movimentação da IA
    if (raceStarted) {
        for (let i = 0; i < opponents.length; i++) {
            const op = opponents[i];
            const oldProgress = op.progress;
            op.progress = (op.progress + op.speed) % 1;

            if (oldProgress > 0.9 && op.progress < 0.1) {
                op.lap++;
            }

            const point = trackCurve.getPointAt(op.progress);
            const tangent = trackCurve.getTangentAt(op.progress);

            const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
            const posWithOffset = point.clone().add(normal.multiplyScalar(op.laneOffset));

            op.mesh.position.set(posWithOffset.x, GROUND_Y, posWithOffset.z);

            const angle = Math.atan2(tangent.x, tangent.z);
            op.mesh.rotation.y = angle;
        }
    }
}

// 9. Renderização
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    updateGame();
    renderer.render(scene, camera);
}

animate();