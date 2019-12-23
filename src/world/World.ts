import { Scene, Fog, DirectionalLight, Color, Vector3, Light, Object3D, AmbientLight } from 'three';
import { Block } from './Block';
import { Player } from '../player/Player';

const DAY_DURATION = 24000;

export class World {
  scene: Scene;
  blocks: Map<string, Block>;
  gravity: number;
  light: Light;
  daytime: number;

  constructor() {
    this.daytime = 0;
    this.scene = new Scene();
    this.blocks = new Map<string, Block>();
    this.gravity = 0.01;

    this.scene.fog = new Fog(0x000000, 10, 40);
    this.light = new DirectionalLight(0xffffff, 1);
    this.light.position.set(25, 25, 25);
    this.scene.add(this.light);

    this.generateBlocks();
  }

  update(player: Player) {
    this.daytime += 1;
    if (this.daytime === DAY_DURATION) this.daytime = 0;
    const y = Math.cos((this.daytime / DAY_DURATION) * Math.PI * 2) * 100;
    const z = Math.sin((this.daytime / DAY_DURATION) * Math.PI * 2) * 100;
    this.light.position.set(player.position.x, y, z);
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
