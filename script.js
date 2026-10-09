// Configuración principal
let scene, camera, renderer, controls;
let galaxyGroup;

// Planetas principales y sus Auroras
let purplePlanetMesh, purpleAtmosphereMesh, purpleAurora;
let flowerPlanetMesh, flowerAtmosphereMesh, flowerAurora;
let starPlanetMesh, starAtmosphereMesh, starAurora;

// Control de desaparición de planetas (El del medio 'purple' NO desvanece)
let planetFadeData = {
  purple: { isFading: false, opacity: 1.0, duration: 90 }, // Permanente, NO desvanece
  flower: { isFading: false, opacity: 1.0, duration: 90 },
  star: { isFading: false, opacity: 1.0, duration: 90 }
};

// Listas de explosiones activas
let activeExplosions = [];

// Raycaster para detección de clics 3D
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Fondo estelar
let starParticles;
let starCount = 4500;
let starAnimations = [];
let shootingStars = [];

let mainAuroraSystem;
const auroraParticleCount = 3000;

let isEnteringGalaxy = false;
let cameraTargetPosition = { x: 0, y: 22, z: 65 };

// Enlaces directos a las flores en Cloudinary
const flowerUrls = [
  'https://res.cloudinary.com/oixtro0v/image/upload/v1791582743/wee.png',
  'https://res.cloudinary.com/oixtro0v/image/upload/v1791582920/pele.png',
  'https://res.cloudinary.com/oixtro0v/image/upload/v1791582920/sofa.png',
  'https://res.cloudinary.com/oixtro0v/image/upload/v1791582920/para.png',
  'https://res.cloudinary.com/oixtro0v/image/upload/v1791582920/rosa.png',
  'https://res.cloudinary.com/oixtro0v/image/upload/v1791582920/flor.png'
];

let loadedFlowerTextures = [];
let animatedFlowers = [];

// Lista de mensajes dedicados para Karla de Jhampier
const phrases = [
  "Para mi persona favorita: Karla 💜",
  "Karla, iluminas mi universo entero ✨",
  "Cada estrella me recuerda a ti, Karla 🌸",
  "Karla, la flor más hermosa de mi galaxia 💜",
  "Gracias por existir en mi vida, Karla 💕",
  "Universo de amor y cariño solo para ti, Karla 🌌",
  "Karla, mi lugar feliz siempre es contigo 💐",
  "Eres mi deseo hecho estrella, Karla ✨",
  "Mi mundo es mucho más bonito contigo, Karla 💞",
  "Karla, te quiero de aquí al infinito 💫",
  "Siempre florecerás en mi corazón, Karla 💜",
  "Karla, gracias por tu hermosa magia y lealtad 🌸",
  "La galaxia entera celebra tu existencia, Karla ✨",
  "Tu sonrisa es mi constelación favorita 🌠",
  "Contigo la vida se siente en paz 💖",
  "Eres la luz dorada en mis días oscuros, Karla ⭐",
  "Nunca dejes de brillar, hermosa Karla 💜",
  "Karla, un pétalo de cariño en cada rincón 🌹",
  "Eres magia pura y amistad sincera 💫",
  "Mi estrella fugaz cumplida eres tú ✨",
  "Karla, un abrazo apretado que cruza galaxias 🤗",
  "Eres ternura, fuerza e inspiración infinita 🌸",
  "El cosmos es infinitamente más dulce contigo 💜",
  "Cariño e incondicionalidad para la mejor amiga 💞",
  "Karla, la alegría de mis días 🌷",
  "Un cielo estrellado diseñado especialmente para ti ✨",
  "Eres el regalo más bonito del destino 🎁",
  "Karla, donde estés tú, brilla el sol ☀️",
  "Un pensamiento constante de aprecio y cariño 💭",
  "Karla, siempre única, auténtica y especial 💜",
  "El morado te sienta tan bien, Karla 💜",
  "Gracias por cada risa y consejo compartido ✨",
  "Tu felicidad siempre será mi mayor deseo 🌟",
  "Un rinconcito estelar lleno de paz para Karla 🌸",
  "Flores moradas para la mejor mejor amiga 👑",
  "Que nunca te falten motivos para sonreír 💖",
  "Eres mi pensamiento favorito cuando busco paz 💭",
  "Karla, gracias por ser tan dulce y leal ✨",
  "El universo sonríe cuando tú sonríes 😊",
  "Un abrazo gigante hasta tu galaxia 🌌",
  "Karla, tu amistad es de las cosas más valiosas que tengo 🤝",
  "En las buenas y en las malas, siempre juntos Karla 🫂",
  "Contigo puedo ser 100% yo mismo, gracias Karla 💜",
  "Eres esa amiga que uno desea tener para toda la vida ✨",
  "Tu valentía y corazón bondadoso me inspiran Karla 🌟",
  "Gracias por escucharme siempre sin juzgar 💕",
  "Karla, celebro tu vida, tu risa y tu existencia 🥂",
  "Afortunado de cruzarme en esta vida contigo 🌌",
  "Si la vida se pone difícil, aquí estoy para ti Karla 🛡️",
  "Tu presencia llena cualquier lugar de paz 🕊️",
  "Karla, los mejores amigos son para siempre 💜",
  "Nunca olvides lo increíble y capaz que eres 💪",
  "Tu luz propia no se apaga con nada en este mundo ✨",
  "Karla, gracias por tu abrazo en los momentos clave 🤗",
  "El mundo necesita más personas con tu gran corazón ❤️",
  "Cuentas conmigo hoy, mañana y siempre Karla ♾️",
  "Eres mi refugio seguro de confianza y amistad 🏰",
  "Que la vida te devuelva multiplicado todo el amor que das 🌸",
  "Karla, nuestra amistad trasciende cualquier distancia 🚀",
  "Orgulloso de ser tu mejor amigo por siempre 🤝💜"
];

function init() {
  // 1. ESCENA OSCURA Y ARMONIOSA
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x010006, 0.0009);

  // 2. CÁMARA
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 110, 230);

  // 3. RENDERIZADOR
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  // 4. CONTROLES
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.03;
  controls.maxDistance = 260;
  controls.minDistance = 8;
  controls.enabled = false;

  galaxyGroup = new THREE.Group();
  scene.add(galaxyGroup);

  // Crear los planetas con sus auroras
  createRealisticPurplePlanet(); 
  createFlowerPlanet();         
  createStarPlanet();           

  // Elementos del cosmos
  createGoldGlowingStars();      
  createMainAuroraOfStars();     
  createPurpleParticles();       
  createTextMessages();
  loadFlowerImagesWithRules();

  // Luces ajustadas para ambiente oscuro
  const ambientLight = new THREE.AmbientLight(0x4c1d95, 0.8);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfef08a, 1.2);
  sunLight.position.set(60, 40, 60);
  scene.add(sunLight);

  const lilaLight = new THREE.PointLight(0x7e22ce, 2.5, 120);
  lilaLight.position.set(-20, 10, -30);
  scene.add(lilaLight);

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('pointerdown', onDocumentPointerDown, false);

  // Pantalla de inicio con reproducción de música
  const startScreen = document.getElementById('start-screen');
  startScreen.addEventListener('click', () => {
    startScreen.classList.add('fade-out-galaxy');
    isEnteringGalaxy = true;

    // Reproducción de música al entrar a la galaxia
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
      bgMusic.volume = 0.5; // Volumen suave
      bgMusic.play().catch(error => console.log("Error de reproducción de audio:", error));
    }

    setTimeout(() => {
      startScreen.style.display = 'none';
      controls.enabled = true;
    }, 1500);
  });

  // Modal de la Carta
  const letterBtn = document.getElementById('letter-btn');
  const letterModal = document.getElementById('letter-modal');
  const closeModal = document.getElementById('close-modal');

  if (letterBtn) letterBtn.addEventListener('click', () => letterModal.classList.add('active'));
  if (closeModal) closeModal.addEventListener('click', () => letterModal.classList.remove('active'));
  if (letterModal) {
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) letterModal.classList.remove('active');
    });
  }

  setInterval(createShootingStar, 1500);

  animate(0);
}

// TEXTURA BASE DE ESTRELLA BRILLANTE
function createGoldStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 245, 1)');
  gradient.addColorStop(0.25, 'rgba(254, 240, 138, 0.95)');
  gradient.addColorStop(0.55, 'rgba(234, 179, 8, 0.45)');
  gradient.addColorStop(0.85, 'rgba(180, 83, 9, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}

// CREADOR DE AURORAS INDIVIDUALES PARA PLANETAS
function createPlanetAurora(radius, color1, color2, count) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = radius * 1.25 + Math.random() * (radius * 0.45);
    const h = (Math.random() - 0.5) * (radius * 0.55);

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const y = h + Math.sin(theta * 3) * 0.4;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const blended = c1.clone().lerp(c2, Math.random());
    colors[i * 3] = blended.r;
    colors[i * 3 + 1] = blended.g;
    colors[i * 3 + 2] = blended.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.85,
    vertexColors: true,
    map: createGoldStarTexture(),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}

// 1. PLANETA CENTRAL MORADO (NO desvanece)
function generatePlanetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0c021a');
  gradient.addColorStop(0.45, '#1e043b');
  gradient.addColorStop(0.5, '#3b0d7a');
  gradient.addColorStop(0.7, '#15022e');
  gradient.addColorStop(1, '#05000c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 450; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const rx = 30 + Math.random() * 150;
    const ry = 4 + Math.random() * 30;

    ctx.fillStyle = Math.random() > 0.45 ? 'rgba(192, 132, 252, 0.1)' : 'rgba(126, 34, 206, 0.08)';
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

function generateRingTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.18, 'rgba(107, 33, 168, 0.8)');
  gradient.addColorStop(0.45, 'rgba(147, 51, 234, 0.45)');
  gradient.addColorStop(0.52, 'rgba(0, 0, 0, 0.15)');
  gradient.addColorStop(0.72, 'rgba(126, 34, 206, 0.8)');
  gradient.addColorStop(0.92, 'rgba(59, 7, 100, 0.25)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, 1);

  return new THREE.CanvasTexture(canvas);
}

function createRealisticPurplePlanet() {
  const planetRadius = 6.8;
  const planetGeo = new THREE.SphereGeometry(planetRadius, 64, 64);
  const planetTex = generatePlanetTexture();
  
  const planetMat = new THREE.MeshStandardMaterial({
    map: planetTex,
    roughness: 0.9,
    metalness: 0.1,
    transparent: true,
    opacity: 1.0
  });

  purplePlanetMesh = new THREE.Mesh(planetGeo, planetMat);
  purplePlanetMesh.userData = { type: 'purplePlanet' };
  galaxyGroup.add(purplePlanetMesh);

  const atmosGeo = new THREE.SphereGeometry(planetRadius * 1.15, 64, 64);
  const atmosMat = new THREE.MeshBasicMaterial({
    color: 0x9333ea,
    transparent: true,
    opacity: 0.16,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });

  purpleAtmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
  purplePlanetMesh.add(purpleAtmosphereMesh);

  purpleAurora = createPlanetAurora(planetRadius, 0x9333ea, 0x4a044e, 900);
  purplePlanetMesh.add(purpleAurora);

  const ringGeo = new THREE.RingGeometry(9.0, 16.5, 128);
  const uvs = ringGeo.attributes.uv;
  for (let i = 0; i < uvs.count; i++) {
    const vx = ringGeo.attributes.position.getX(i);
    const vy = ringGeo.attributes.position.getY(i);
    const distanceFromCenter = Math.sqrt(vx * vx + vy * vy);
    const normalizedDistance = (distanceFromCenter - 9.0) / (16.5 - 9.0);
    uvs.setX(i, normalizedDistance);
    uvs.setY(i, 0.5);
  }

  const ringTex = generateRingTexture();
  const ringMat = new THREE.MeshStandardMaterial({
    map: ringTex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75,
    roughness: 0.5
  });

  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2.35;
  ringMesh.rotation.y = -0.15;
  purplePlanetMesh.add(ringMesh);
}

// 2. PLANETA DE FLORES (Desvanece)
function createFlowerPlanet() {
  const radius = 4.2;
  const planetGeo = new THREE.SphereGeometry(radius, 48, 48);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#78350f'); 
  grad.addColorStop(0.5, '#451a03');
  grad.addColorStop(1, '#0c0400');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 180; i++) {
    ctx.fillStyle = 'rgba(217, 119, 6, 0.15)';
    ctx.beginPath();
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 8, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  const planetMat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.7,
    metalness: 0.3,
    emissive: 0x271300,
    emissiveIntensity: 0.1,
    transparent: true,
    opacity: 1.0
  });

  flowerPlanetMesh = new THREE.Mesh(planetGeo, planetMat);
  flowerPlanetMesh.position.set(34, 12, -20);
  flowerPlanetMesh.userData = { type: 'flowerPlanet' };
  galaxyGroup.add(flowerPlanetMesh);

  const atmosGeo = new THREE.SphereGeometry(radius * 1.25, 32, 32);
  const atmosMat = new THREE.MeshBasicMaterial({
    color: 0xd97706,
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });

  flowerAtmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
  flowerPlanetMesh.add(flowerAtmosphereMesh);

  flowerAurora = createPlanetAurora(radius, 0xd97706, 0x451a03, 700);
  flowerPlanetMesh.add(flowerAurora);
}

// 3. PLANETA DE ESTRELLAS (Desvanece)
function createStarPlanet() {
  const radius = 3.8;
  const planetGeo = new THREE.SphereGeometry(radius, 48, 48);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#0284c7'); 
  grad.addColorStop(0.5, '#075985');
  grad.addColorStop(1, '#042f2e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 220; i++) {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
    ctx.beginPath();
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 6, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  const planetMat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.6,
    metalness: 0.4,
    emissive: 0x073347,
    emissiveIntensity: 0.15,
    transparent: true,
    opacity: 1.0
  });

  starPlanetMesh = new THREE.Mesh(planetGeo, planetMat);
  starPlanetMesh.position.set(-36, -10, 18);
  starPlanetMesh.userData = { type: 'starPlanet' };
  galaxyGroup.add(starPlanetMesh);

  const atmosGeo = new THREE.SphereGeometry(radius * 1.25, 32, 32);
  const atmosMat = new THREE.MeshBasicMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });

  starAtmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
  starPlanetMesh.add(starAtmosphereMesh);

  starAurora = createPlanetAurora(radius, 0x0284c7, 0x073347, 700);
  starPlanetMesh.add(starAurora);
}

// INTERACCIÓN Y DETECCIÓN DE CLIC
function onDocumentPointerDown(event) {
  if (!controls || !controls.enabled) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(galaxyGroup.children, true);

  for (let i = 0; i < intersects.length; i++) {
    let obj = intersects[i].object;
    
    // El del medio (purplePlanet) es permanente
    if (obj.userData.type === 'purplePlanet' || (obj.parent && obj.parent.userData.type === 'purplePlanet')) {
      triggerFullscreenFlowerExplosion(purplePlanetMesh.position, 190); 
      break;
    }

    if (obj.userData.type === 'flowerPlanet' || (obj.parent && obj.parent.userData.type === 'flowerPlanet')) {
      if (!planetFadeData.flower.isFading) {
        planetFadeData.flower.isFading = true;
        triggerFullscreenFlowerExplosion(flowerPlanetMesh.position, 160); 
      }
      break;
    }

    if (obj.userData.type === 'starPlanet' || (obj.parent && obj.parent.userData.type === 'starPlanet')) {
      if (!planetFadeData.star.isFading) {
        planetFadeData.star.isFading = true;
        triggerFullscreenStarExplosion(starPlanetMesh.position, 550); 
      }
      break;
    }
  }
}

// EXPLOSIÓN MASIVA DE FLORES
function triggerFullscreenFlowerExplosion(originPosition, particleCount) {
  if (loadedFlowerTextures.length === 0) return;

  const explosionGroup = new THREE.Group();
  explosionGroup.position.copy(originPosition);

  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    const tex = loadedFlowerTextures[Math.floor(Math.random() * loadedFlowerTextures.length)];
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity: 1.0,
      depthWrite: false
    });

    const sprite = new THREE.Sprite(mat);
    const size = 9.0 + Math.random() * 11.0;
    sprite.scale.set(size, size, 1);

    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const speed = 1.6 + Math.random() * 2.8;

    const velocity = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta) * speed,
      Math.sin(phi) * Math.sin(theta) * speed,
      Math.cos(phi) * speed
    );

    explosionGroup.add(sprite);

    particles.push({
      sprite: sprite,
      velocity: velocity
    });
  }

  galaxyGroup.add(explosionGroup);

  activeExplosions.push({
    group: explosionGroup,
    particles: particles,
    life: 0,
    maxLife: 240
  });
}

// EXPLOSIÓN MASIVA DE ESTRELLAS
function triggerFullscreenStarExplosion(originPosition, particleCount) {
  const count = particleCount;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = [];

  const starTex = createGoldStarTexture();

  for (let i = 0; i < count; i++) {
    positions[i * 3] = originPosition.x;
    positions[i * 3 + 1] = originPosition.y;
    positions[i * 3 + 2] = originPosition.z;

    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const speed = 1.8 + Math.random() * 3.4;

    velocities.push(new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta) * speed,
      Math.sin(phi) * Math.sin(theta) * speed,
      Math.cos(phi) * speed
    ));
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 5.2,
    map: starTex,
    transparent: true,
    opacity: 1.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const pSystem = new THREE.Points(geometry, material);
  galaxyGroup.add(pSystem);

  activeExplosions.push({
    isParticleSystem: true,
    system: pSystem,
    velocities: velocities,
    life: 0,
    maxLife: 220
  });
}

// CARGA DE FLORES FLOTANTES
function loadFlowerImagesWithRules() {
  const textureLoader = new THREE.TextureLoader();
  const starTex = createGoldStarTexture();
  const UNIFORM_SIZE = 8.5;

  flowerUrls.forEach((url) => {
    textureLoader.load(url, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      loadedFlowerTextures.push(texture);

      for (let i = 0; i < 12; i++) {
        const flowerGroup = new THREE.Group();

        const flowerMaterial = new THREE.SpriteMaterial({ 
          map: texture, 
          transparent: true,
          opacity: 0,
          alphaTest: 0.02,
          depthWrite: false
        });

        const sprite = new THREE.Sprite(flowerMaterial);
        sprite.scale.set(UNIFORM_SIZE, UNIFORM_SIZE, 1);
        flowerGroup.add(sprite);

        const auraCount = 35;
        const auraGeo = new THREE.BufferGeometry();
        const auraPos = new Float32Array(auraCount * 3);
        const auraColors = new Float32Array(auraCount * 3);

        const c1 = new THREE.Color(0xfef08a);
        const c2 = new THREE.Color(0xc084fc);

        for (let k = 0; k < auraCount; k++) {
          const ang = (k / auraCount) * Math.PI * 2;
          const rad = (UNIFORM_SIZE * 0.48) + Math.random() * 1.5;
          auraPos[k * 3] = Math.cos(ang) * rad;
          auraPos[k * 3 + 1] = Math.sin(ang) * rad;
          auraPos[k * 3 + 2] = (Math.random() - 0.5) * 1.0;

          const blended = c1.clone().lerp(c2, Math.random());
          auraColors[k * 3] = blended.r;
          auraColors[k * 3 + 1] = blended.g;
          auraColors[k * 3 + 2] = blended.b;
        }

        auraGeo.setAttribute('position', new THREE.BufferAttribute(auraPos, 3));
        auraGeo.setAttribute('color', new THREE.BufferAttribute(auraColors, 3));

        const auraMat = new THREE.PointsMaterial({
          size: 0.75,
          vertexColors: true,
          map: starTex,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const auraPoints = new THREE.Points(auraGeo, auraMat);
        flowerGroup.add(auraPoints);

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 58 + 14;
        const height = (Math.random() - 0.5) * 38;

        flowerGroup.position.set(
          Math.cos(angle) * distance,
          height,
          Math.sin(angle) * distance
        );

        galaxyGroup.add(flowerGroup);

        animatedFlowers.push({
          group: flowerGroup,
          sprite: sprite,
          auraMat: auraMat,
          flowerMat: flowerMaterial,
          baseScale: UNIFORM_SIZE,
          pulseOffset: Math.random() * Math.PI * 2,
          pulseSpeed: 0.0008 + Math.random() * 0.0005,
          fadeOffset: Math.random() * Math.PI * 2,
          fadeSpeed: 0.0006 + Math.random() * 0.0004
        });
      }
    });
  });
}

// MENSAJES DEDICADOS
function createTextMessages() {
  phrases.forEach((text, index) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 256;

    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'Bold 38px "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 20;
    ctx.textAlign = 'center';
    ctx.fillText("💜 " + text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: texture, 
      transparent: true,
      depthWrite: false
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(18, 4.5, 1);

    const angle = (index / phrases.length) * Math.PI * 2 + (Math.random() * 0.12);
    const distance = Math.random() * 56 + 18;
    const height = (Math.random() - 0.5) * 42;

    sprite.position.set(
      Math.cos(angle) * distance,
      height,
      Math.sin(angle) * distance
    );

    galaxyGroup.add(sprite);
  });
}

// FONDO ESTELAR
function createGoldGlowingStars() {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const opacities = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 500;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 500;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 500;

    opacities[i] = Math.random() * 0.8 + 0.2;

    starAnimations.push({
      phase: Math.random() * Math.PI * 2,
      speed: 0.0003 + Math.random() * 0.0006
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('customOpacity', new THREE.BufferAttribute(opacities, 1));

  const starMaterial = new THREE.PointsMaterial({
    size: 2.6,
    map: createGoldStarTexture(),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  starParticles = new THREE.Points(geometry, starMaterial);
  scene.add(starParticles);
}

function createMainAuroraOfStars() {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(auroraParticleCount * 3);
  const colors = new Float32Array(auroraParticleCount * 3);

  const innerColor = new THREE.Color(0xfef08a);
  const outerColor = new THREE.Color(0xa855f7);

  for (let i = 0; i < auroraParticleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = 7.2 + Math.random() * 4.2;
    const h = (Math.random() - 0.5) * 4.8;

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const y = h + Math.sin(theta * 2) * 1.5;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const blendFactor = Math.random();
    const particleColor = innerColor.clone().lerp(outerColor, blendFactor);
    colors[i * 3] = particleColor.r;
    colors[i * 3 + 1] = particleColor.g;
    colors[i * 3 + 2] = particleColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const auroraMaterial = new THREE.PointsMaterial({
    size: 0.95,
    vertexColors: true,
    map: createGoldStarTexture(),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  mainAuroraSystem = new THREE.Points(geometry, auroraMaterial);
  galaxyGroup.add(mainAuroraSystem);
}

function createShootingStar() {
  const points = [];
  const length = 25 + Math.random() * 20;
  
  for (let i = 0; i < 20; i++) {
    points.push(new THREE.Vector3(0, 0, - (i / 20) * length));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending
  });

  const line = new THREE.Line(geometry, material);

  const startX = (Math.random() - 0.5) * 260;
  const startY = 30 + Math.random() * 70;
  const startZ = (Math.random() - 0.5) * 260;

  line.position.set(startX, startY, startZ);

  line.rotation.x = Math.PI / 4.5 + (Math.random() - 0.5) * 0.25;
  line.rotation.y = (Math.random() - 0.5) * Math.PI;

  scene.add(line);

  shootingStars.push({
    mesh: line,
    speed: 1.6 + Math.random() * 1.8,
    life: 0,
    maxLife: 75 + Math.random() * 40
  });
}

function createPurpleParticles() {
  const count = 4000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const color1 = new THREE.Color(0xc084fc);
  const color2 = new THREE.Color(0x3b0764);

  for (let i = 0; i < count; i++) {
    const radius = Math.random() * 58 + 12;
    const spinAngle = radius * 0.16;
    const branchAngle = ((i % 3) * 2 * Math.PI) / 3;

    const randomX = (Math.random() - 0.5) * 5;
    const randomY = (Math.random() - 0.5) * 5;
    const randomZ = (Math.random() - 0.5) * 5;

    const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
    const y = randomY;
    const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const mixedColor = color1.clone().lerp(color2, Math.random());
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 1.0,
    vertexColors: true,
    map: createGoldStarTexture(),
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(geometry, particleMaterial);
  galaxyGroup.add(particleSystem);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// BUCLE DE ANIMACIÓN
let lastTime = 0;
function animate(time) {
  requestAnimationFrame(animate);

  const delta = time - lastTime;
  lastTime = time;

  if (isEnteringGalaxy) {
    camera.position.x += (cameraTargetPosition.x - camera.position.x) * 0.035;
    camera.position.y += (cameraTargetPosition.y - camera.position.y) * 0.035;
    camera.position.z += (cameraTargetPosition.z - camera.position.z) * 0.035;

    if (Math.abs(camera.position.z - cameraTargetPosition.z) < 1.2) {
      isEnteringGalaxy = false;
    }
  }

  // Flores flotantes
  animatedFlowers.forEach((item) => {
    const tPulse = time * item.pulseSpeed + item.pulseOffset;
    const heartbeat = Math.sin(tPulse) + 0.25 * Math.sin(2 * tPulse);
    const scaleFactor = item.baseScale * (1 + 0.08 * heartbeat);
    item.sprite.scale.set(scaleFactor, scaleFactor, 1);

    const tFade = time * item.fadeSpeed + item.fadeOffset;
    const opacityWave = Math.sin(tFade);
    const currentOpacity = 0.55 + 0.4 * opacityWave;

    item.flowerMat.opacity = currentOpacity;
    item.auraMat.opacity = currentOpacity * 0.85;

    if (item.group.children[1]) {
      item.group.children[1].rotation.z += 0.008;
    }
  });

  // GESTIÓN DE DESVANECIMIENTO GRADUAL
  if (planetFadeData.flower.isFading) {
    planetFadeData.flower.opacity -= 1.0 / planetFadeData.flower.duration;
    if (flowerPlanetMesh) {
      flowerPlanetMesh.material.opacity = Math.max(0, planetFadeData.flower.opacity);
      if (flowerAtmosphereMesh) flowerAtmosphereMesh.material.opacity = Math.max(0, planetFadeData.flower.opacity * 0.18);
      if (flowerAurora) flowerAurora.material.opacity = Math.max(0, planetFadeData.flower.opacity * 0.8);
      if (planetFadeData.flower.opacity <= 0) {
        galaxyGroup.remove(flowerPlanetMesh);
        flowerPlanetMesh = null;
        planetFadeData.flower.isFading = false;
      }
    }
  }

  if (planetFadeData.star.isFading) {
    planetFadeData.star.opacity -= 1.0 / planetFadeData.star.duration;
    if (starPlanetMesh) {
      starPlanetMesh.material.opacity = Math.max(0, planetFadeData.star.opacity);
      if (starAtmosphereMesh) starAtmosphereMesh.material.opacity = Math.max(0, planetFadeData.star.opacity * 0.18);
      if (starAurora) starAurora.material.opacity = Math.max(0, planetFadeData.star.opacity * 0.8);
      if (planetFadeData.star.opacity <= 0) {
        galaxyGroup.remove(starPlanetMesh);
        starPlanetMesh = null;
        planetFadeData.star.isFading = false;
      }
    }
  }

  // Animación de explosiones activas
  for (let i = activeExplosions.length - 1; i >= 0; i--) {
    const exp = activeExplosions[i];
    exp.life++;

    const progress = exp.life / exp.maxLife;

    if (exp.isParticleSystem) {
      const posAttr = exp.system.geometry.attributes.position;
      const positions = posAttr.array;

      for (let k = 0; k < exp.velocities.length; k++) {
        positions[k * 3] += exp.velocities[k].x;
        positions[k * 3 + 1] += exp.velocities[k].y;
        positions[k * 3 + 2] += exp.velocities[k].z;
        exp.velocities[k].multiplyScalar(0.985); 
      }
      posAttr.needsUpdate = true;
      exp.system.material.opacity = 1.0 - progress;

      if (exp.life >= exp.maxLife) {
        galaxyGroup.remove(exp.system);
        exp.system.geometry.dispose();
        exp.system.material.dispose();
        activeExplosions.splice(i, 1);
      }
    } else {
      exp.particles.forEach((p) => {
        p.sprite.position.add(p.velocity);
        p.sprite.material.opacity = 1.0 - progress;
        p.velocity.multiplyScalar(0.985);
      });

      if (exp.life >= exp.maxLife) {
        galaxyGroup.remove(exp.group);
        exp.particles.forEach((p) => p.sprite.material.dispose());
        activeExplosions.splice(i, 1);
      }
    }
  }

  // Rotación de planetas y auroras
  if (purplePlanetMesh) purplePlanetMesh.rotation.y += 0.0012;
  if (flowerPlanetMesh) flowerPlanetMesh.rotation.y += 0.003;
  if (starPlanetMesh) starPlanetMesh.rotation.y += 0.0025;

  if (purpleAurora && purplePlanetMesh) purpleAurora.rotation.z += 0.005;
  if (flowerAurora && flowerPlanetMesh) flowerAurora.rotation.z += 0.008;
  if (starAurora && starPlanetMesh) starAurora.rotation.z += 0.006;

  if (mainAuroraSystem) {
    mainAuroraSystem.rotation.y += 0.004;
    mainAuroraSystem.material.opacity = 0.65 + Math.sin(time * 0.001) * 0.25;
  }

  // Parpadeo de estrellas
  if (starParticles && starParticles.geometry.attributes.customOpacity) {
    const customOpacities = starParticles.geometry.attributes.customOpacity.array;

    for (let i = 0; i < starCount; i++) {
      starAnimations[i].phase += starAnimations[i].speed * (delta || 16.6) * 0.038;
      const wave = Math.sin(starAnimations[i].phase);
      customOpacities[i] = 0.3 + (wave * 0.6); 
    }
    starParticles.geometry.attributes.customOpacity.needsUpdate = true;
    starParticles.material.size = 2.4 + Math.sin(time * 0.0003) * 0.4;
  }

  // Estrellas fugaces
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const sStar = shootingStars[i];
    sStar.life++;

    sStar.mesh.translateZ(sStar.speed);

    if (sStar.life > sStar.maxLife * 0.6) {
      sStar.mesh.material.opacity = 1 - (sStar.life - sStar.maxLife * 0.6) / (sStar.maxLife * 0.4);
    }

    if (sStar.life >= sStar.maxLife) {
      scene.remove(sStar.mesh);
      sStar.mesh.geometry.dispose();
      sStar.mesh.material.dispose();
      shootingStars.splice(i, 1);
    }
  }

  galaxyGroup.rotation.y += 0.0009;

  if (controls.enabled) {
    controls.update();
  } else {
    camera.lookAt(0, 0, 0);
  }

  renderer.render(scene, camera);
}

window.onload = init;