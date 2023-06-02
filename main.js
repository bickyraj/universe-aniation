import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import Star from './objects/Star';
import Galaxy from './objects/Galaxy';

// Create the scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const galaxy = new Galaxy();

// Create stars in a spiral pattern
const totalStars = 1000;
const galaxyRadius = 20;
const galaxyRotationSpeed = 0.0005;

// Create particles and add them to the galaxy group
for (let i = 0; i < totalStars; i++) {
  const radius = Math.random() * 0.5 + 0.1;
  const color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const distance = Math.sqrt(Math.random()) * galaxyRadius;
  const angle = Math.random() * Math.PI * 2;

  galaxy.createStar(radius, color, distance, angle);
}

galaxy.addToScene(scene);

// Set up the initial position and rotation of the camera
camera.position.z = 50;
var controls = new TrackballControls(camera, renderer.domElement);
// Function to animate and render the scene
function animate() {
  requestAnimationFrame(animate);

  // Rotate the galaxy
  scene.rotation.y += galaxyRotationSpeed;
  controls.update();
  // Render the scene with the camera
  renderer.render(scene, camera);
}

// Start the animation
animate();


