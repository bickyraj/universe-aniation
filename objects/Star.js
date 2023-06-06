import * as THREE from 'three';

export default class Star {
  constructor(radius, color) {
    this.radius = radius;
    this.color = color;
  }

  setPosition(position) {
    this.mesh.position.copy(position);
  }

  addToScene(scene) {
    scene.add(this.mesh);
  }

  getStar() {
    const geometry = new THREE.SphereGeometry(this.radius, 64, 64);
    // const geometry = new THREE.CircleGeometry(this.radius, 64);
    const material = new THREE.MeshBasicMaterial({ 
        color: this.color,
        transparent: true, // Enable transparency
        opacity: 0.3, // Set opacity value (0.0 to 1.0)
        side: THREE.DoubleSide
    });
    this.mesh = new THREE.Mesh(geometry, material);
  }
}