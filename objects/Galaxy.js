import Star from "./Star";

export default class Galaxy {
  constructor() {
    this.stars = [];
  }

  createStar(radius, color, distance, angle) {
    const star = new Star(radius, color);
    const x = distance * Math.cos(angle);
    const z = distance * Math.sin(angle);
    star.setPosition(x, 0, z);
    this.stars.push(star);
  }

  addToScene(scene) {
    for (const star of this.stars) {
      star.addToScene(scene);
    }
  }
}