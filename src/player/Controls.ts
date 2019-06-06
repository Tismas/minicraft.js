import { Vector3 } from 'three';
import { Player } from './Player';
import { World } from '../world/World';

interface Keys {
  [key: string]: Array<number>;
}

const keys: Keys = {
  jump: [32],
  moveForward: [38, 87],
  moveBackward: [40, 83],
  moveLeft: [37, 65],
  moveRight: [39, 68],
  sprint: [17]
};

export class Controls {
  player: Player;
  world: World;
  keysPressed: { [key: string]: boolean };

  constructor(player: Player, world: World) {
    this.player = player;
    this.world = world;
    this.keysPressed = {};
  }
  init() {
    window.onkeydown = e => {
      for (let key in keys) {
        if (keys[key].includes(e.keyCode)) {
          this.keysPressed[key] = true;
        }
      }
    };
    window.onkeyup = e => {
      for (let key in keys) {
        if (keys[key].includes(e.keyCode)) {
          this.keysPressed[key] = false;
        }
      }
    };

    window.onmousemove = e => {
      if (document.pointerLockElement) {
        this.player.rotateCamera(e.movementX, e.movementY);
      }
    };

    window.onmousedown = e => {
      this.player.placeBlock(this.world);
    };
    window.onmouseup = e => {};
  }
}
