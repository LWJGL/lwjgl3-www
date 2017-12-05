// @flow
import * as React from 'react';
import { keyframes } from 'emotion';
import styled from 'react-emotion';
// $FlowFixMe
import { WebGLRenderer, Scene, PerspectiveCamera, BoxGeometry, MeshNormalMaterial, Group, Mesh } from 'three';
import { SupportsIntersectionObserver } from '~/services/supports';

const fadeIn = keyframes`
from {
  opacity: 0;
}
to {
  opacity: 0.175;
}
`;

const Canvas = styled('canvas')`
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  animation: ${fadeIn} 2s ease-out forwards;
`;

export default class HomeCanvas extends React.Component<{||}> {
  canvas: ?HTMLCanvasElement;

  io: IntersectionObserver | null = null;
  rafId: number | null = null;
  scene: Scene = null;
  camera: PerspectiveCamera | null = null;
  geometry: BoxGeometry | null = null;
  material: MeshNormalMaterial | null = null;
  group: Group | null = null;
  renderer: WebGLRenderer | null = null;

  constructor() {
    super();
    (this: any).getRef = this.getRef.bind(this);
    (this: any).resizeCanvas = this.resizeCanvas.bind(this);
    (this: any).animate = this.animate.bind(this);
    (this: any).ioCheck = this.ioCheck.bind(this);
  }

  resizeCanvas() {
    if (this.camera !== null && this.canvas != null) {
      /*::
      if ( !(this.canvas.parentNode instanceof HTMLElement) ) {
        return;
      }
      */
      const winW = this.canvas.parentNode.offsetWidth;
      const winH = this.canvas.parentNode.offsetHeight;
      this.camera.aspect = winW / winH;
      this.camera.updateProjectionMatrix();
      /*:: if ( this.renderer !== null ) */
      this.renderer.setSize(winW, winH, false);
    }
  }

  animate() {
    this.rafId = requestAnimationFrame(this.animate);

    let time = Date.now() * 0.000015;
    let rx = time;
    let ry = time;

    /*:: if ( this.group !== null ) */
    this.group.rotation.x = rx;
    /*:: if ( this.group !== null ) */
    this.group.rotation.y = ry;
    /*:: if ( this.renderer !== null ) */
    this.renderer.render(this.scene, this.camera);
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  ioCheck(entries: Array<IntersectionObserverEntry>) {
    if (entries[0].intersectionRatio > 0) {
      if (this.rafId === null) {
        this.animate();
      }
    } else if (this.rafId !== null) {
      this.stop();
    }
  }

  componentDidMount() {
    if (this.canvas == null) {
      return;
    }
    /*::
      if ( !(this.canvas.parentNode instanceof HTMLElement) ) {
        return;
      }
    */
    const winW = this.canvas.parentNode.offsetWidth;
    const winH = this.canvas.parentNode.offsetHeight;

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
      /*:: if ( this.group !== null ) */
      this.group.add(mesh);
    }

    this.scene = new Scene();
    this.scene.add(this.group);

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: window.devicePixelRatio === 1,
      alpha: true,
    });
    if (window.devicePixelRatio !== undefined) {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    this.renderer.setSize(winW, winH, false);
    /*:: if ( this.renderer !== null ) */
    this.renderer.sortObjects = false;
    this.animate();

    if (SupportsIntersectionObserver) {
      this.io = new IntersectionObserver(this.ioCheck);
      /*:: if ( this.canvas != null ) */
      this.io.observe(this.canvas);
    }

    window.addEventListener('resize', this.resizeCanvas);
  }

  componentWillUnmount() {
    this.stop();
    this.canvas = null;
    window.removeEventListener('resize', this.resizeCanvas);

    if (this.io !== null) {
      this.io.disconnect();
      this.io = null;
    }

    if (this.scene !== null) {
      this.scene.remove(this.group);

      if (this.geometry !== null) {
        this.geometry.dispose();
      }
      if (this.material !== null) {
        this.material.dispose();
      }

      this.scene = null;
      this.geometry = null;
      this.material = null;
      this.group = null;
      this.camera = null;
      this.renderer = null;
    }
  }

  getRef(el: ?HTMLCanvasElement) {
    this.canvas = el;
  }

  render() {
    return <Canvas innerRef={this.getRef} />;
  }
}
