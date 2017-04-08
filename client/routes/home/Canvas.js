import React from 'react';
import loadJS from 'fg-loadjs';

let loadthree = true;
let canvas = null;
let io = null;
let canvasInViewport = true;
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
  canvasInViewport = true;

  if (window.IntersectionObserver !== void 0) {
    io = new IntersectionObserver(entries => {
      canvasInViewport = entries[0].isIntersecting;
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
  for (let i = 0; i < 1000; i += 1) {
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

  if (!canvasInViewport) {
    return;
  }

  let time = Date.now() * 0.001;
  let rx = Math.sin(time * 0.7) * 0.25;
  let ry = Math.sin(time * 0.3) * 0.25;
  let rz = Math.sin(time * 0.2) * 0.25;
  group.rotation.x = rx;
  group.rotation.y = ry;
  group.rotation.z = rz;

  renderer.render(scene, camera);
}

function unload() {
  window.removeEventListener('resize', resizeCanvas);
  if (io !== null) {
    io.disconnect();
    io = null;
  }
  canvas = null;

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

    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
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
