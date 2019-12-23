import { WebGLRenderer, PerspectiveCamera } from 'three';
import { World } from './world/World';
import { Player } from './player/Player';
import { Controls } from './player/Controls';

const renderer = new WebGLRenderer();
const world = new World();
const player = new Player(world);
const controls = new Controls(player, world);

let render = () => {
  update();
  renderer.render(world.scene, player.camera);
  requestAnimationFrame(render);
};

let update = () => {
  world.update(player);
  player.update(world, controls);
};

let resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  player.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
};

let init = () => {
  window.onresize = resize;
  document.body.appendChild(renderer.domElement);
  resize();

  render();
  renderer.domElement.onclick = () => {
    renderer.domElement.requestPointerLock();
  };
  controls.init();
};

init();
