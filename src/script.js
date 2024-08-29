import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import gsap from "gsap";
import GUI from "lil-gui";

// Texture
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load("/textures/minecraft.png");
colorTexture.colorSpace = THREE.SRGBColorSpace;
colorTexture.generateMipmaps = false;
colorTexture.magFilter = THREE.NearestFilter;

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Debug
const gui = new GUI({
  width: 500,
  title: "Tech talk univision :')",
  closeFolders: true,
});
gui.hide();
const debugObject = {};
debugObject.color = "#9900ff";

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;

  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(2);
});

window.addEventListener("keydown", () => {
  if (event.key === "h") {
    gui.show(gui._hidden);
  }
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.z = 3;

scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

function tick() {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}
tick();
