import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import Galaxy from './objects/Galaxy';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Create the scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var controls = new TrackballControls(camera, renderer.domElement);

// Set up the initial position and rotation of the camera
camera.position.x = 20;
camera.position.y = 0;
camera.position.z = 0;
let axes = new THREE.AxesHelper(5.0);
scene.add(axes);
// Create the loader
const loader = new GLTFLoader();
// const gridHelper = new THREE.GridHelper(100, 50);
// gridHelper.rotateX(Math.PI / 2);
// scene.add(gridHelper);
// Function to animate and render the scene

function initGalaxy() {
    const galaxy = new Galaxy();
    const radius = 0.5;
    const color = "#fffff";
    galaxy.createGaussianStar(radius, color);
    galaxy.addToScene(scene);
}

// Create the effect composer
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// Create the bloom pass
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5, 0.4, 0.85
);
composer.addPass(bloomPass);

loader.load(
  'models/server.glb',
  function (gltf) {
    // Called when the model is loaded

    // Access the root object of the loaded glTF/GLB file
    const model = gltf.scene;

    // Create a buffer geometry for the particles
    const geometry = new THREE.BufferGeometry();

    // Extract the vertices from the loaded model
    const vertices = [];
    model.traverse(function (child) {
      if (child.isMesh) {
        const positions = child.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          vertices.push(positions[i], positions[i + 1], positions[i + 2]);
        }
      }
    });

    // Set the positions of the particles
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // Create the shader material
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute vec3 position;
        uniform float pointSize;
        void main() {
          gl_PointSize = pointSize;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        void main() {
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
      `,
      uniforms: {
        pointSize: { value: 5 } // Adjust the size of the particles
      },
      transparent: true
    });

    // Create the particle system
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Render the scene
    animate();
  },
  function (xhr) {
    // Called while the model is being loaded
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  function (error) {
    // Called if there is an error loading the model
    console.error('Error loading model:', error);
  }
);

function animate() {
  requestAnimationFrame(animate);

  // Rotate the galaxy
  scene.rotation.z += 0.0005;
  controls.update();
  // Render the scene with the camera
  composer.render();
}

// Start the animation
initGalaxy();
animate();


