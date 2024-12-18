import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { PreventDragClick } from "./PreventDragClick";
import { cm1, cm2, sounds } from "./common";
import { Pillar } from "./Pillar";
import { Floor } from "./Floor";
import { Bar } from "./Bar";
import { SideLight } from "./SideLight";
import { Glass } from "./Glass";
import { Player } from "./Player";

// The Bridge Game

// Renderer
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Scene은 common.js에서 생성
cm1.scene.background = new THREE.Color(cm2.backgroundColor);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const camera2 = camera.clone();

camera.position.set(-4, 19, 14);
camera2.position.y = 0;
camera2.lookAt(0, 1, 0);
cm1.scene.add(camera, camera2);

// Light
const ambientLight = new THREE.AmbientLight(cm2.lightColor, 0.8);
cm1.scene.add(ambientLight);

const spotLightDistance = 50;

const spotLight1 = new THREE.SpotLight(cm2.lightColor, 30000);
spotLight1.castShadow = true;
spotLight1.shadow.mapSize.width = 2048;
spotLight1.shadow.mapSize.height = 2048;
const spotLight2 = spotLight1.clone();
const spotLight3 = spotLight1.clone();
const spotLight4 = spotLight1.clone();

spotLight1.position.set(
  -spotLightDistance,
  spotLightDistance,
  spotLightDistance
);
spotLight2.position.set(
  spotLightDistance,
  spotLightDistance,
  spotLightDistance
);
spotLight3.position.set(
  -spotLightDistance,
  spotLightDistance,
  -spotLightDistance
);
spotLight4.position.set(
  spotLightDistance,
  spotLightDistance,
  -spotLightDistance
);

cm1.scene.add(spotLight1, spotLight2, spotLight3, spotLight4);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 물리 엔진
cm1.world.gravity.set(0, -9.8, 0);

const defaultContactMaterial = new CANNON.ContactMaterial(
  cm1.defaultMaterial,
  cm1.defaultMaterial,
  {
    friction: 0.3,
    restitution: 0.2,
  }
);

const playerDefaultContactMaterial = new CANNON.ContactMaterial(
  cm1.playerMaterial,
  cm1.defaultMaterial,
  {
    friction: 1,
    restitution: 0,
  }
);

const glassDefaultContactMaterial = new CANNON.ContactMaterial(
  cm1.glassMaterial,
  cm1.defaultMaterial,
  {
    friction: 1,
    restitution: 0,
  }
);

const playerGlassContactMaterial = new CANNON.ContactMaterial(
  cm1.playerMaterial,
  cm1.glassMaterial,
  {
    friction: 1,
    restitution: 0,
  }
);

cm1.world.defaultContactMaterial = defaultContactMaterial;
cm1.world.addContactMaterial(glassDefaultContactMaterial);
cm1.world.addContactMaterial(playerGlassContactMaterial);
cm1.world.addContactMaterial(playerDefaultContactMaterial);

// 물체 만들기
const glassUnitSize = 1.2;
const numberOfGlasses = 10;
const objects = [];

// 바닥
const floor = new Floor({
  name: "floor",
});

// 기둥
const pillar1 = new Pillar({
  name: "pillar",
  x: 0,
  y: 5.5,
  z: -glassUnitSize * 12 - glassUnitSize / 2,
});

const pillar2 = new Pillar({
  name: "pillar",
  x: 0,
  y: 5.5,
  z: glassUnitSize * 12 + glassUnitSize / 2,
});
objects.push(pillar1, pillar2);

// 바
const bar1 = new Bar({
  name: "bar",
  x: -1.6,
  y: 10.3,
  z: 0,
});
const bar2 = new Bar({
  name: "bar",
  x: -0.4,
  y: 10.3,
  z: 0,
});
const bar3 = new Bar({
  name: "bar",
  x: 0.4,
  y: 10.3,
  z: 0,
});
const bar4 = new Bar({
  name: "bar",
  x: 1.6,
  y: 10.3,
  z: 0,
});

const sideLights = [];
for (let i = 0; i < 49; i++) {
  sideLights.push(
    new SideLight({
      name: "sideLight",
      container: bar1.mesh,
      z: i * 0.5 - 1.2 * 10,
    })
  );
}

for (let i = 0; i < 49; i++) {
  sideLights.push(
    new SideLight({
      name: "sideLight",
      container: bar4.mesh,
      z: i * 0.5 - 1.2 * 10,
    })
  );
}

// 유리판
let glassTypeNumber = 0;
let glassTypes = [];
const glassZ = [];
for (let i = 0; i < numberOfGlasses; i++) {
  glassZ.push(-(i * glassUnitSize * 2 - glassUnitSize * 9));
}
for (let i = 0; i < numberOfGlasses; i++) {
  glassTypeNumber = Math.round(Math.random());

  switch (glassTypeNumber) {
    case 0:
      glassTypes = ["normal", "strong"];
      break;
    case 1:
      glassTypes = ["strong", "normal"];
      break;
  }

  const glass1 = new Glass({
    step: i + 1,
    name: `glass-${glassTypes[0]}`,
    x: -1,
    y: 10.5,
    z: glassZ[i],
    type: glassTypes[0],
    cannonMaterial: cm1.glassMaterial,
  });

  const glass2 = new Glass({
    step: i + 1,
    name: `glass-${glassTypes[1]}`,
    x: 1,
    y: 10.5,
    z: glassZ[i],
    type: glassTypes[1],
    cannonMaterial: cm1.glassMaterial,
  });

  objects.push(glass1, glass2);
}

// 플레이어
const player = new Player({
  name: "player",
  x: 0,
  y: 11,
  z: 13,
  cannonMaterial: cm1.playerMaterial,
  mass: 30,
});
objects.push(player);

// RayCaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
function checkIntersects() {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(cm1.scene.children);
  for (const item of intersects) {
    checkClickedObject(item.object);
    break;
  }
}

let fail = false;
let jumping = false;
let onReplay = false;
function checkClickedObject(mesh) {
  player.actions[2].stop();
  player.actions[2].play();
  if (mesh.name.indexOf("glass") >= 0) {
    // 유리판을 클릭했을 때
    if (jumping || fail) return;

    if (mesh.step - 1 === cm2.step) {
      jumping = true;
      cm2.step++;

      switch (mesh.type) {
        case "normal":
          setTimeout(() => {
            fail = true;
            player.actions[0].stop();
            player.actions[1].play();
            sideLights.forEach((item) => {
              item.turnOff();

              setTimeout(() => {
                onReplay = true;
                player.cannonBody.position.y = 9;

                setTimeout(() => {
                  onReplay = false;
                }, 3000);
              }, 2000);
            });
          }, 700);

          break;
        case "strong":
          break;
      }

      setTimeout(() => {
        jumping = false;
      }, 1000);

      // 유리판 위로 이동
      gsap.to(player.cannonBody.position, {
        duration: 1,
        x: mesh.position.x,
        z: glassZ[cm2.step - 1],
      });

      // 플레이어의 점프 동작
      gsap.to(player.cannonBody.position, {
        duration: 0.4,
        y: 12,
      });

      // clear
      if (cm2.step === numberOfGlasses && mesh.type === "strong") {
        setTimeout(() => {
          player.actions[2].stop();
          player.actions[2].play();

          gsap.to(player.cannonBody.position, {
            duration: 1,
            x: 0,
            z: -14,
          });

          gsap.to(player.cannonBody.position, {
            duration: 0.4,
            y: 12,
          });
        }, 1500);

        setTimeout(() => {
          sounds.clear.play();
          camera.position.set(0, 13, -18);
        }, 1000);
      }
    }
  }
}

// 그리기
const clock = new THREE.Clock();

function draw() {
  const delta = clock.getDelta();

  controls.update();

  if (cm1.mixer) cm1.mixer.update(delta);

  cm1.world.step(1 / 60, delta, 3);

  objects.forEach((item) => {
    if (item.cannonBody) {
      if (item.name === "player") {
        if (item.modelMesh) {
          item.modelMesh.position.copy(item.cannonBody.position);
          if (fail) item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
        }
        item.modelMesh.position.y += 0.15;
      } else {
        if (item.mesh) {
          item.mesh.position.copy(item.cannonBody.position);
          item.mesh.quaternion.copy(item.cannonBody.quaternion);
        }

        if (item.modelMesh) {
          item.modelMesh.position.copy(item.cannonBody.position);
          item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
        }
      }
    }
  });

  if (!onReplay) {
    renderer.render(cm1.scene, camera);
  } else {
    renderer.render(cm1.scene, camera2);
    camera2.position.x = player.cannonBody.position.x;
    camera2.position.z = player.cannonBody.position.z;
  }
  renderer.setAnimationLoop(draw);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(cm1.scene, camera);
}

// 이벤트
const preventDragClick = new PreventDragClick(canvas);
window.addEventListener("resize", setSize);
canvas.addEventListener("click", (e) => {
  if (preventDragClick.mouseMoved) return;
  mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
  mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);
  checkIntersects();
});

draw();
