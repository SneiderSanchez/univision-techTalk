import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import GUI from "lil-gui";

// Texture

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const colorTexture = textureLoader.load("/textures/minecraft.png");
colorTexture.colorSpace = THREE.SRGBColorSpace;

const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

/* colorTexture.repeat.x = 2;
colorTexture.repeat.y = 3;

colorTexture.wrapS = THREE.MirroredRepeatWrapping;
colorTexture.wrapT = THREE.RepeatWrapping;

colorTexture.offset.x = 0.5;
colorTexture.offset.y = 0.5; 

colorTexture.rotation = Math.PI / 4;

colorTexture.center.x = 0.5;
colorTexture.center.y = 0.5;
*/

//colorTexture.minFilter = THREE.NearestFilter;
colorTexture.generateMipmaps = false;
colorTexture.magFilter = THREE.NearestFilter;
//! Nearest better performance and frame rate

loadingManager.onStart = () => {
  console.log("Loading Started");
};

loadingManager.onLoad = () => {
  console.log("Loading finished");
};

loadingManager.onProgress = () => {
  console.log("Loading progressing");
};

loadingManager.onError = () => {
  console.log("Loading error");
};

// Debug
const gui = new GUI({
  width: 500,
  title: "First GUI :')",
  closeFolders: false,
});
//gui.close();
//gui.hide();
const debugObject = {};
// Cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
/* 
Triange 
const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3); */

// Cube with random lines
/* const geometry = new THREE.BufferGeometry();

const count = 100;
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < positionsArray.length; i++) {
  positionsArray[i] = Math.random() - 0.5;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

geometry.setAttribute("position", positionsAttribute);
*/

// Cube
const cube = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);

debugObject.color = "#9900ff";
// Mesh setup
/* const material = new THREE.MeshBasicMaterial({
  color: debugObject.color,
  wireframe: true,
}); */

const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
  //wireframe: true,
});

const mesh = new THREE.Mesh(cube, material);
//scene.add(mesh);

// Debug stuff

const cubeTweaks = gui.addFolder("Cubitos ");
// cubeTweaks.close();
cubeTweaks.add(mesh.position, "y").min(-3).max(3).step(0.01).name("Elevation");

cubeTweaks.add(mesh, "visible");
cubeTweaks.add(material, "wireframe");
cubeTweaks.addColor(debugObject, "color").onChange((value) => {
  material.color.set(value);
});

debugObject.spinx = () => {
  gsap.to(mesh.rotation, { duration: 5, y: mesh.rotation.y + Math.PI * 2 });
};
debugObject.spinall = () => {
  gsap.to(mesh.rotation, { duration: 6, y: mesh.rotation.y + Math.PI * 2 });
  gsap.to(mesh.rotation, { duration: 6, x: mesh.rotation.y + Math.PI * 2 });
  gsap.to(mesh.rotation, { duration: 6, z: mesh.rotation.y + Math.PI * 2 });
};

cubeTweaks.add(debugObject, "spinx").name("Spin x axis");
cubeTweaks.add(debugObject, "spinall").name("Spin all");
debugObject.subdivision = 2;

cubeTweaks
  .add(debugObject, "subdivision")
  .min(1)
  .max(50)
  .step(1)
  .onChange((value) => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(1, 1, 1, value, value, value);
  });

window.addEventListener("keydown", () => {
  if (event.key === "h") {
    gui.show(gui._hidden);
  }
});

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;

  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  //renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setPixelRatio(2);
});

// Go on full screen mode with double click
/* window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (document.webkitRequestFullscreen) {
      canvas.webkitRequestFullScreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}); */

/* 
// OrthographicCamera
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(
  -aspectRatio,
  aspectRatio,
  1,
  -1,
  0.1,
  100
); */

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.set(2, 1, 1);
// camera.position.z = 2;

camera.lookAt(mesh.position);

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
/* controls.target.y = 1;
controls.update(); */

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//Clock
const clock = new THREE.Clock();

/* gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });
gsap.to(mesh.position, { x: 0, duration: 1, delay: 2 }); */
// Animations

function tick() {
  const elapsedTime = clock.getElapsedTime();
  /*
  // Update objects
  mesh.position.y = Math.sin(elapsedTime);
  mesh.position.x = Math.cos(elapsedTime);
*/

  //mesh.rotation.y = elapsedTime;
  /*   // Update Camera
  camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  camera.position.y = cursor.y * 5; */

  camera.lookAt(mesh.position);
  // Render
  renderer.render(scene, camera);
  controls.update();
  window.requestAnimationFrame(tick);
}
tick();
