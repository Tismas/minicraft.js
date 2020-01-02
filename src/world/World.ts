import { Scene, Fog, DirectionalLight, Vector3, Object3D, HemisphereLight } from 'three';
import { Block } from './Block';
import { Player } from '../player/Player';

const DAY_DURATION = 2400;

export class World {
  scene: Scene;
  blocks: Map<string, Block>;
  gravity: number;
  sun: DirectionalLight;
  hemiLight: HemisphereLight;
  daytime: number;

  constructor() {
    this.daytime = 0;
    this.scene = new Scene();
    this.blocks = new Map<string, Block>();
    this.gravity = 0.01;

    this.scene.fog = new Fog(0x000000, 10, 40);

    this.sun = new DirectionalLight(0xffffff, 1);
    this.sun.position.set(-1, 0.75, 1);
    this.sun.position.multiplyScalar(50);
    this.sun.name = 'dirlight';
    this.scene.add(this.sun);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.height = this.sun.shadowMapHeight = 1024 * 2;

    const d = 300;
    this.sun.shadowCameraLeft = -d;
    this.sun.shadowCameraRight = d;
    this.sun.shadowCameraTop = d;
    this.sun.shadowCameraBottom = -d;

    this.sun.shadowCameraFar = 3500;
    this.sun.shadowBias = -0.0001;

    this.hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.6);
    this.hemiLight.color.setHSL(0.6, 0.75, 0.5);
    this.hemiLight.groundColor.setHSL(0.095, 0.5, 0.5);
    this.hemiLight.position.set(0, 500, 0);
    this.scene.add(this.hemiLight);

    this.generateBlocks();
  }

  update(player: Player) {
    this.daytime += 1;
    if (this.daytime === DAY_DURATION) this.daytime = 0;
  }

  getBlock(position: Vector3) {
    return this.blocks.get(`${Math.round(position.x)} ${Math.ceil(position.y) - 2} ${Math.round(position.z)}`) || 'air';
  }

  addBlock(position: Vector3) {
    const block = new Block(position);
    this.blocks.set(`${position.x} ${position.y} ${position.z}`, block);
    this.scene.add(block.mesh);
  }

  generateBlocks() {
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        this.addBlock(new Vector3(i, 0, j));
      }
    }
  }

  findBlock(object: Object3D): Block {
    return this.blocks.get(`${object.position.x} ${object.position.y} ${object.position.z}`);
  }
}
