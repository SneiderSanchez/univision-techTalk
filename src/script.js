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
//gui.hide();
const debugObject = {};
debugObject.color = "#ffffff";
const cube = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  color: debugObject.color,
  wireframe: true,
  //map: colorTexture,
});

gui.add(material, "wireframe");

gui.addColor(debugObject, "color").onChange(() => {
  material.color.set(debugObject.color);
});

debugObject.spin = () => {
  gsap.to(mesh.rotation, { duration: 4, y: mesh.rotation.y + Math.PI * 2 });
};

gui.add(debugObject, "spin");
const mesh = new THREE.Mesh(cube, material);
scene.add(mesh);

debugObject.zoomIn = () => {
  gsap.to(mesh.position, { x: 2, duration: 1, delay: 0 });
  gsap.to(mesh.position, { x: 0, duration: 1, delay: 1.5 });
};

gui.add(debugObject, "zoomIn");
debugObject.subdivision = 2;

gui
  .add(debugObject, "subdivision")
  .min(1)
  .max(50)
  .step(1)
  .onChange((value) => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(1, 1, 1, value, value, value);
  });

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
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
//camera.position.z = 3;
camera.position.set(2, 1, 1);

scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

function tick() {
  renderer.render(scene, camera);
  controls.update();
  camera.lookAt(mesh.position);
  mesh.rotation.y += 0.01;
  window.requestAnimationFrame(tick);
}
tick();
