// @jsx jsx
import * as React from 'react';
import { jsx, css, keyframes } from '@emotion/core';
jsx;
import { WebGLRenderer, Scene, PerspectiveCamera, BoxGeometry, MeshNormalMaterial, Group, Mesh } from 'three';
import { SUPPORTS_INTERSECTION_OBSERVER } from '~/services/supports';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 0.175;
  }
`;

const Canvas = css`
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  animation: ${fadeIn.name} 2s ease-out forwards;
`;

class HomeCanvas extends React.Component {
  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();

  io: IntersectionObserver | null = null;
  rafId: number | null = null;
  scene!: Scene;
  camera!: PerspectiveCamera;
  geometry!: BoxGeometry;
  material!: MeshNormalMaterial;
  group!: Group;
  renderer!: WebGLRenderer;

  resizeCanvas = () => {
    const canvas = this.canvasRef.current;
    if (canvas !== null && canvas.parentElement !== null) {
      const winW = canvas.parentElement.offsetWidth;
      const winH = canvas.parentElement.offsetHeight;
      this.camera.aspect = winW / winH;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(winW, winH, false);
    }
  };

  animate = () => {
    this.rafId = requestAnimationFrame(this.animate);

    let time = Date.now() * 0.000015;
    let rx = time;
    let ry = time;

    this.group.rotation.x = rx;
    this.group.rotation.y = ry;
    this.renderer.render(this.scene, this.camera);
  };

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  ioCheck = (entries: Array<IntersectionObserverEntry>) => {
    if (entries[0].intersectionRatio > 0) {
      if (this.rafId === null) {
        this.animate();
      }
    } else if (this.rafId !== null) {
      this.stop();
    }
  };

  componentDidMount() {
    const canvas = this.canvasRef.current;
    if (canvas === null || canvas.parentElement === null) {
      return;
    }

    const winW = canvas.parentElement.offsetWidth;
    const winH = canvas.parentElement.offsetHeight;

    this.camera = new PerspectiveCamera(60, winW / winH, 100, 10000);
    this.camera.position.z = 1500;

    this.geometry = new BoxGeometry(60, 60, 60);
    this.material = new MeshNormalMaterial();

    this.group = new Group();
    for (let i = 0; i < 300; i += 1) {
      let mesh = new Mesh(this.geometry, this.material);
      mesh.position.x = Math.random() * 2000 - 1000;
      mesh.position.y = Math.random() * 2000 - 1000;
      mesh.position.z = Math.random() * 2000 - 1000;
      mesh.rotation.x = Math.random() * 2 * Math.PI;
      mesh.rotation.y = Math.random() * 2 * Math.PI;
      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
      this.group.add(mesh);
    }

    this.scene = new Scene();
    this.scene.add(this.group);

    this.renderer = new WebGLRenderer({
      canvas: canvas,
      antialias: window.devicePixelRatio === 1,
      alpha: true,
      //@ts-ignore
      powerPreference: 'low-power',
    });
    if (window.devicePixelRatio !== undefined) {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    this.renderer.setSize(winW, winH, false);
    this.renderer.sortObjects = false;
    this.animate();

    if (SUPPORTS_INTERSECTION_OBSERVER) {
      this.io = new IntersectionObserver(this.ioCheck);
      this.io.observe(canvas);
    }

    window.addEventListener('resize', this.resizeCanvas);
  }

  componentWillUnmount() {
    this.stop();
    window.removeEventListener('resize', this.resizeCanvas);

    if (this.io !== null) {
      this.io.disconnect();
      this.io = null;
    }

    if (this.scene !== undefined) {
      this.scene.remove(this.group);
      this.geometry.dispose();
      this.material.dispose();
    }
  }

  render() {
    return <canvas css={[Canvas, fadeIn.styles]} ref={this.canvasRef} />;
  }
}

export default HomeCanvas;
