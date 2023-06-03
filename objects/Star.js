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
    const geometry = new THREE.SphereGeometry(this.radius);
    const material = new THREE.MeshBasicMaterial({ color: this.color });
    this.mesh = new THREE.Mesh(geometry, material);
  }
}