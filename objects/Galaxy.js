import { gaussianRandom } from "../utils/Util";
import { Vector3 } from "three";
import Star from "./Star";
import { ARMS, ARM_X_DIST, ARM_X_MEAN, ARM_Y_DIST, ARM_Y_MEAN, GALAXY_THICKNESS, NUM_STARS, SPIRAL } from "../config/constants";

export default class Galaxy {
  constructor() {
    this.stars = [];
  }

  createGaussianStar(radius) {
    const galaxyColor = [
        "#011307",
        "#001736",
        "#00481a",
        "#155e89",
        "#9aeadd",
    ];
    for (let j = 0; j < ARMS; j++) {
        for (let i = 0; i < NUM_STARS/ARMS; i++) {
            let pos = this.spiral(gaussianRandom(ARM_X_MEAN, ARM_X_DIST), gaussianRandom(ARM_Y_MEAN, ARM_Y_DIST), gaussianRandom(0, GALAXY_THICKNESS), j);
            const star = new Star(radius, galaxyColor[j]);
            star.getStar();
            star.setPosition(pos);
            this.stars.push(star);
        }
    }
  }

  addToScene(scene) {
    for (const star of this.stars) {
      star.addToScene(scene);
    }
  }

  spiral(x, y, z, offset) {
    let r = Math.sqrt(x**2 + y**2)
    let theta = offset
    theta += x > 0 ? Math.atan(y/x) : Math.atan(y/x) + Math.PI
    theta += (r/ARM_X_DIST) * SPIRAL
    return new Vector3(r*Math.cos(theta), r*Math.sin(theta), z);
  }
}