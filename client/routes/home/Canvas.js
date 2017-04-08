import React from 'react';
import loadJS from 'fg-loadjs';

let loadthree = true;
let canvas = null;
let io = null;
let rafId = null;
let scene = null;
let camera = null;
let geometry = null;
let material = null;
let group = null;
let renderer = null;

function resizeCanvas() {
  if (camera !== null) {
    const winW = canvas.parentNode.offsetWidth;
    const winH = canvas.parentNode.offsetHeight;
    camera.aspect = winW / winH;
    camera.updateProjectionMatrix();
    renderer.setSize(winW, winH);
  }
}

function init(el) {
  canvas = el;
  window.addEventListener('resize', resizeCanvas);

  if (window.IntersectionObserver !== void 0) {
    io = new IntersectionObserver(entries => {
      if (entries[0].intersectionRatio > 0) {
        if (rafId === null) {
          animate();
        }
      } else if (rafId !== null) {
        stop();
      }
    });
    io.observe(canvas);
  }

  const winW = canvas.parentNode.offsetWidth;
  const winH = canvas.parentNode.offsetHeight;

  camera = new THREE.PerspectiveCamera(60, winW / winH, 100, 10000);
  camera.position.z = 1500;

  geometry = new THREE.BoxGeometry(60, 60, 60);
  material = new THREE.MeshNormalMaterial();

  group = new THREE.Group();
  for (let i = 0; i < 300; i += 1) {
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 2000 - 1000;
    mesh.position.y = Math.random() * 2000 - 1000;
    mesh.position.z = Math.random() * 2000 - 1000;
    mesh.rotation.x = Math.random() * 2 * Math.PI;
    mesh.rotation.y = Math.random() * 2 * Math.PI;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    group.add(mesh);
  }

  scene = new THREE.Scene();
  scene.add(group);

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: false,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(winW, winH);
  renderer.sortObjects = false;
  animate();
}

function animate() {
  rafId = requestAnimationFrame(animate);

  let time = Date.now() * 0.00001;
  let rx = time;
  let ry = time;
  group.rotation.x = rx;
  group.rotation.y = ry;

  renderer.render(scene, camera);
}

function unload() {
  stop();
  canvas = null;
  window.removeEventListener('resize', resizeCanvas);

  if (io !== null) {
    io.disconnect();
    io = null;
  }

  if (scene !== null) {
    scene.remove(group);
    geometry.dispose();
    material.dispose();

    scene = null;
    geometry = null;
    material = null;
    group = null;
    camera = null;
    renderer = null;
  }
}

function stop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

class HomeCanvas extends React.Component {
  mounted = false;

  componentDidMount() {
    this.mounted = true;
    if (loadthree) {
      loadthree = false;
      loadJS('https://unpkg.com/three@0.84.0/build/three.min.js', () => {
        if (this.mounted) {
          init(this.canvas);
        }
      });
    } else {
      init(this.canvas);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    unload();
  }

  render() {
    return (
      <canvas
        ref={el => {
          this.canvas = el;
        }}
      />
    );
  }
}

export default HomeCanvas;
