import {
  PerspectiveCamera,
  Vector3,
  Quaternion,
  Camera,
  Raycaster,
  Vector2,
  Mesh,
  LineBasicMaterial,
  Geometry,
  Line
} from 'three';
import { World } from '../world/World';
import { Controls } from './Controls';
import { clamp } from '../utils/clamp';
import { Block } from '../world/Block';

export class Player {
  camera: PerspectiveCamera;
  speed: number;
  maxSpeed: number;
  jumpPower: number;
  position: Vector3;
  velocity: Vector3;
  isOnGround: boolean;
  cameraRotation: { yaw: number; pitch: number };
  hoveredBlock: Block | null;

  constructor(world: World) {
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.setPosition(new Vector3(25, 3, 25));
    this.setVelocity(new Vector3(0, 0, 0));
    this.jumpPower = 0.15;
    this.speed = 0.05;
    this.maxSpeed = 1;
    this.isOnGround = false;
    this.hoveredBlock = null;
  }

  update(world: World, controls: Controls) {
    const velocity = this.velocity.clone();

    if (controls.keysPressed['moveLeft']) {
      velocity.x = -this.speed;
    } else if (controls.keysPressed['moveRight']) {
      velocity.x = this.speed;
    } else {
      velocity.x = 0;
    }
    if (controls.keysPressed['moveForward']) {
      velocity.z = -this.speed;
    } else if (controls.keysPressed['moveBackward']) {
      velocity.z = this.speed;
    } else {
      velocity.z = 0;
    }

    if (controls.keysPressed['sprint']) {
      velocity.x *= 2;
      velocity.z *= 2;
    }

    if (!this.isOnGround) {
      velocity.y = Math.max(-this.maxSpeed, velocity.y - world.gravity);
    } else if (controls.keysPressed['jump']) {
      velocity.y = this.jumpPower;
      this.isOnGround = false;
    }

    this.setVelocity(velocity);
    this.updatePosition(world);
  }

  updatePosition(world: World) {
    const position = this.position.clone();
    position.x +=
      this.velocity.x * Math.cos(this.camera.rotation.y) + this.velocity.z * Math.sin(this.camera.rotation.y);
    position.z +=
      this.velocity.z * Math.cos(this.camera.rotation.y) - this.velocity.x * Math.sin(this.camera.rotation.y);
    position.y += this.velocity.y;
    if (world.getBlock(position) !== 'air') {
      position.y = Math.ceil(position.y);
      this.velocity.y = 0;
      this.isOnGround = true;
    }
    this.setPosition(position);
    this.getHoveredBlock(world);
  }

  setPosition(position: Vector3) {
    this.position = position;

    this.camera.position.z = position.z;
    this.camera.position.y = position.y;
    this.camera.position.x = position.x;
  }

  setVelocity(velocity: Vector3) {
    this.velocity = velocity;
  }

  rotateCamera(movX: number, movY: number) {
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y -= movX / 100;
    this.camera.rotation.x -= movY / 100;
    this.camera.rotation.x = clamp(this.camera.rotation.x, -Math.PI / 2, Math.PI / 2);
  }

  getHoveredBlock(world: World) {
    if (this.hoveredBlock) {
      this.hoveredBlock.setOriginalColor();
      this.hoveredBlock = null;
    }
    const raycaster = new Raycaster();
    raycaster.setFromCamera(new Vector2(0, 0), this.camera);
    const intersects = raycaster.intersectObjects(world.scene.children);
    if (intersects[0] && intersects[0].distance < 5) {
      this.hoveredBlock = world.findBlock(intersects[0].object);
      this.hoveredBlock.setHoveredColor();
    }
  }
}
