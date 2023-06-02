import * as THREE from 'three';

export default class Star {
  constructor(radius, color) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  setPosition(x, y, z) {
    this.mesh.position.set(x, y, z);
  }

  addToScene(scene) {
    scene.add(this.mesh);
  }
}