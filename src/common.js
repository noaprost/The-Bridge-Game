import { Material, World } from "cannon-es";
import { BoxGeometry, MeshPhongMaterial, Scene, SphereGeometry } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Three.js, Cannon.js에서 생성되는 오브젝트를 담는 변수
export const cm1 = {
  scene: new Scene(),
  gltfLoader: new GLTFLoader(),
  mixer: undefined,

  // cannon
  world: new World(),
  defaultMaterial: new Material("default"),
  glassMaterial: new Material("glass"),
  playerMaterial: new Material("player"),
};

// 색상 또는 임의의 변수 등 직접 만든 값을 담는 변수
export const cm2 = {
  step: 0,
  backgroundColor: "#3e1322",
  lightColor: "#ffe9ac",
  lightOffColor: "#222",
  pillarColor: "#071d28",
  floorColor: "#111",
  barColor: "#441c1d",
  glassColor: "#9fdfff",
};

export const geo = {
  floor: new BoxGeometry(200, 1, 200),
  pillar: new BoxGeometry(5, 10, 5),
  bar: new BoxGeometry(0.1, 0.3, 1.2 * 21),
  sideLight: new SphereGeometry(0.1, 6, 6),
  glass: new BoxGeometry(1.2, 0.05, 1.2),
};

export const mat = {
  floor: new MeshPhongMaterial({
    color: cm2.floorColor,
  }),
  pillar: new MeshPhongMaterial({
    color: cm2.pillarColor,
  }),
  bar: new MeshPhongMaterial({
    color: cm2.barColor,
  }),
  sideLight: new MeshPhongMaterial({
    color: cm2.lightColor,
  }),
  glass1: new MeshPhongMaterial({
    color: cm2.glassColor,
    transparent: true,
    opacity: 0.1,
  }),
  glass2: new MeshPhongMaterial({
    color: cm2.glassColor,
    transparent: true,
    opacity: 0.3,
  }),
};

const nomarlSound = new Audio();
nomarlSound.src = "sounds/Crash .mp3";

const strongSound = new Audio();
strongSound.src = "sounds/Wood Hit Metal Crash.mp3";

const clearSound = new Audio();
clearSound.src = "sounds/success fanfare trumpets.mp3";

const backgroundSound = new Audio();
backgroundSound.src = "sounds/horror house.mp3";

export const sounds = {
  normal: nomarlSound,
  strong: strongSound,
  clear: clearSound,
  background: backgroundSound,
};
