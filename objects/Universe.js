import * as THREE from 'three';

const starColor = [
    "#ffe4f2",
    "#e54ed0",
    "#9f45b0"
];

export default class Universe {
    constructor() {
      this.stars = [];
      this.starCount = 500;
    }

    createRandomStars() {
      for (let i = 0; i < this.starCount; i++) {
        const radius = Math.random() * 0.1 + 0.3; // Random radius between 0.2 and 0.7
        const segments = 65;
        const geometry = new THREE.SphereGeometry(radius, segments, segments);
        const material = new THREE.MeshBasicMaterial({ color: this.getRandomColor(), transparent: true, opacity: 0.09 });
        const circle = new THREE.Mesh(geometry, material);

        const position = new THREE.Vector3(
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100
        );

        circle.position.copy(position);
        this.stars.push(circle);
      }
    }

    addToScene(scene) {
      for (const star of this.stars) {
        scene.add(star);
      }
    }

    getRandomColor() {
        const randomIndex = Math.floor(Math.random() * starColor.length);
        return starColor[randomIndex];
    }
}