import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import Galaxy from './objects/Galaxy';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let camera, stats;
let composer, renderer, mixer, clock;

// Create the scene, camera, and renderer
const params = {
    threshold: 0,
    strength: 0.381,
    radius: 0,
    exposure: 0.9
};

var scene = new THREE.Scene();
stats = new Stats();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.appendChild( stats.dom );


var controls = new TrackballControls(camera, renderer.domElement);

// Set up the initial position and rotation of the camera
camera.position.set( 100, 0, 0 );
scene.add(camera);
//  adding to scene
let axes = new THREE.AxesHelper(5.0);
scene.add(axes);
scene.background = new THREE.Color("#060a27");
const ambientLight = new THREE.AmbientLight(0x898989)
scene.add(ambientLight);
const pointLight = new THREE.PointLight( 0xffffff, 1 );
camera.add( pointLight );
const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;

const outputPass = new OutputPass( THREE.ReinhardToneMapping );

composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );
composer.addPass( outputPass );

function initGalaxy() {
    const galaxy = new Galaxy();
    const radius = 1;
    const color = "#fffff";
    galaxy.createGaussianStar(radius, color);
    galaxy.addToScene(scene);
}

function initServerObject() {
    // Create a GLTFLoader instance
    const loader = new GLTFLoader();

    // Load the glTF model
    loader.load('models/pc.glb', function (gltf) {
      const model = gltf.scene;

      // Traverse through the model's children to access the wireframe geometry
      model.traverse(function (node) {
        if (node.isMesh) {
          const wireframeGeometry = new THREE.WireframeGeometry(node.geometry);

          // Create an array of colors for each vertex
          const colors = [];

          // Define three colors for the wireframe
          const color1 = new THREE.Color(0xff0000); // Red
          const color2 = new THREE.Color(0x00ff00); // Green
          const color3 = new THREE.Color(0x0000ff); // Blue

          // Assign the colors to each vertex
          for (let i = 0; i < wireframeGeometry.attributes.position.count; i++) {
            const colorIndex = i % 3; // Alternate between the three colors
            let color;

            if (colorIndex === 0) {
              color = color1;
            } else if (colorIndex === 1) {
              color = color2;
            } else {
              color = color3;
            }

            colors.push(color.r, color.g, color.b);
          }

          const colorAttribute = new THREE.BufferAttribute(new Float32Array(colors), 3);
          wireframeGeometry.setAttribute('color', colorAttribute);
          // Create a square particle material
          const particleMaterial = new THREE.PointsMaterial({
            size: 0.02, // Size of each particle
            vertexColors: THREE.VertexColors,
          });

          // Create the particle system using the wireframe geometry and particle material
          const particles = new THREE.Points(wireframeGeometry, particleMaterial);

          // Add the particle system to the scene
          model.visible = false;
          scene.add(particles);
        }
      });

      // Add the model to the scene
      scene.add(model);
    });
}

const gui = new GUI();

const bloomFolder = gui.addFolder( 'bloom' );

bloomFolder.add( params, 'threshold', 0.0, 1.0 ).onChange( function ( value ) {

    bloomPass.threshold = Number( value );

} );

bloomFolder.add( params, 'strength', 0.0, 3.0 ).onChange( function ( value ) {

    bloomPass.strength = Number( value );

} );

gui.add( params, 'radius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {

    bloomPass.radius = Number( value );

} );

const toneMappingFolder = gui.addFolder( 'tone mapping' );

toneMappingFolder.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {

    outputPass.toneMappingExposure = Math.pow( value, 4.0 );

} );

function animate() {
  requestAnimationFrame(animate);

  // Rotate the galaxy
  scene.rotation.z += 0.0005;
  controls.update();

  stats.update();

  composer.render();
//   renderer.render(scene, camera);
}

// Start the animation
// initGalaxy();
initServerObject();
animate();


