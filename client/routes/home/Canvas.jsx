// @flow
import * as React from 'react';
import loadJS from 'fg-loadjs';
import styled from 'styled-components';

declare var THREE: any;

let loadthree = true;
let canvas: HTMLCanvasElement | null = null;
let io = null;
let rafId: number | null = null;
let scene = null;
let camera = null;
let geometry = null;
let material = null;
let group = null;
let renderer = null;

function resizeCanvas() {
  if (camera !== null && canvas !== null) {
    /*::
    if ( renderer === null || !(canvas.parentNode instanceof HTMLElement) ) {
      return;
    }
    */
    const winW = canvas.parentNode.offsetWidth;
    const winH = canvas.parentNode.offsetHeight;
    camera.aspect = winW / winH;
    camera.updateProjectionMatrix();
    renderer.setSize(winW, winH, false);
  }
}

function init(el: HTMLCanvasElement) {
  canvas = el;
  window.addEventListener('resize', resizeCanvas);

  if (window.IntersectionObserver !== undefined) {
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

  /*::
  if ( !(canvas.parentNode instanceof HTMLElement) ) {
    return;
  }
  */

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
    antialias: window.devicePixelRatio === 1,
    alpha: true,
  });
  if (window.devicePixelRatio !== undefined) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  renderer.setSize(winW, winH, false);
  renderer.sortObjects = false;
  animate();
}

function animate() {
  rafId = requestAnimationFrame(animate);

  let time = Date.now() * 0.000015;
  let rx = time;
  let ry = time;

  /*::
  if ( group === null || !group.rotation || renderer === null ) {
    return;
  }
  */

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

    /*::
    if ( material === null || geometry === null ) {
      return;
    }
    */
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

const Canvas = styled.canvas`
  position: absolute;
  z-index: 0;
  opacity: 0.15;
  width: 100%;
  height: 100%;
`;

export default class HomeCanvas extends React.Component<{||}> {
  mounted = false;
  canvas: ?HTMLCanvasElement;

  componentDidMount() {
    this.mounted = true;
    if (loadthree) {
      loadthree = false;
      loadJS('https://unpkg.com/three@0.86.0/build/three.min.js', () => {
        if (this.mounted && this.canvas) {
          init(this.canvas);
        }
      });
    } else if (this.canvas) {
      init(this.canvas);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    unload();
  }

  getRef = (el: ?HTMLCanvasElement) => {
    this.canvas = el;
  };

  render() {
    return <Canvas innerRef={this.getRef} />;
  }
}
