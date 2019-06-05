import { Vector3, Shape, BoxGeometry, MeshBasicMaterial, Color, Mesh } from 'three';

const WIDTH = 1;
const LEN = 1;

export class Block {
  position: Vector3;
  shape: Shape;
  geometry: BoxGeometry;
  material: MeshBasicMaterial;
  mesh: Mesh;
  originalColor: Color;

  constructor(position: Vector3, color: Color) {
    this.geometry = new BoxGeometry(1, 1, 1);
    this.material = new MeshBasicMaterial({ color });
    this.mesh = new Mesh(this.geometry, this.material);
    this.setPosition(position);
    this.originalColor = color;
  }

  setPosition(position: Vector3) {
    this.position = position;
    this.mesh.position.x = this.position.x;
    this.mesh.position.y = this.position.y;
    this.mesh.position.z = this.position.z;
  }

  setOriginalColor() {
    this.material.color.set(this.originalColor);
  }

  setHoveredColor() {
    this.material.color.sub(new Color(0x202020));
  }
}
