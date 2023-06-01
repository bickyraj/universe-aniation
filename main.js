import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1); // Set black background color
document.body.appendChild(renderer.domElement);

const spiralCount = 5;
const particleCount = 10000;
const particles = new THREE.BufferGeometry();

// Create arrays to store particle positions
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const particleSize = 0.02;
const radiusIncrement = 0.02;
const angleIncrement = 0.1;

let currentRadius = 0;
let currentAngle = 0;

// Set random positions for each particle
for (let i = 0; i < particleCount; i++) {
    const x = currentRadius * Math.cos(currentAngle);
    const y = currentRadius * Math.sin(currentAngle);
    const z = 0;
    
    const i3 = i * 3;
  positions[i3] = x;
  positions[i3 + 1] = y;
  positions[i3 + 2] = z;

  colors[i3] = Math.random();
  colors[i3 + 1] = Math.random();
  colors[i3 + 2] = Math.random();
  currentRadius += radiusIncrement;
  currentAngle += angleIncrement;
}

// Add the positions data to the geometry
particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Create a particle material
const particleMaterial = new THREE.PointsMaterial({
  vertexColors: true,
  size: particleSize,
});

// Create the particle system and add it to the scene
const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

const controls = new TrackballControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  // Rotate the particle system
  particleSystem.rotation.z += 0.001;

  // Update controls
  controls.update();

  // Render the scene with the camera
  renderer.render(scene, camera);
}

animate();

