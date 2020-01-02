import { Vector3, Shape, BoxGeometry, MeshLambertMaterial, Color, Mesh, TextureLoader, NearestFilter } from 'three';
import * as Dirt from '../assets/dirt.png';

const loader = new TextureLoader();
const geometry = new BoxGeometry(1, 1, 1);
const texture = loader.load(Dirt);
texture.magFilter = NearestFilter;

export class Block {
  position: Vector3;
  shape: Shape;
  geometry: BoxGeometry;
  material: MeshLambertMaterial;
  mesh: Mesh;

  constructor(position: Vector3) {
    this.material = new MeshLambertMaterial({ map: texture });
    this.mesh = new Mesh(geometry, this.material);
    this.setPosition(position);
  }

  setPosition(position: Vector3) {
    this.position = position;
    this.mesh.position.x = this.position.x;
    this.mesh.position.y = this.position.y;
    this.mesh.position.z = this.position.z;
  }

  setOriginalColor() {
    this.material.color.add(new Color(0x202020));
  }

  setHoveredColor() {
    this.material.color.sub(new Color(0x202020));
  }
}
