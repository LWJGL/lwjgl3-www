// @flow
import * as React from 'react';
import { css, keyframes } from 'emotion';
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

const Canvas = css`
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  animation: ${fadeIn} 2s ease-out forwards;
`;

class HomeCanvas extends React.Component<{||}> {
  //$FlowFixMe
  canvasRef = React.createRef();

  io: IntersectionObserver | null = null;
  rafId: AnimationFrameID | null = null;
  scene: Scene = null;
  camera: PerspectiveCamera | null = null;
  geometry: BoxGeometry | null = null;
  material: MeshNormalMaterial | null = null;
  group: Group | null = null;
  renderer: WebGLRenderer | null = null;

  resizeCanvas = this.resizeCanvas.bind(this);
  animate = this.animate.bind(this);
  ioCheck = this.ioCheck.bind(this);

  resizeCanvas() {
    const canvas: ?HTMLCanvasElement = this.canvasRef.current;
    /*::
    if ( canvas == null || !(canvas.parentNode instanceof HTMLElement) ) {
      return;
    }
    */

    if (this.camera !== null && canvas != null) {
      const winW = canvas.parentNode.offsetWidth;
      const winH = canvas.parentNode.offsetHeight;
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
    const canvas: ?HTMLCanvasElement = this.canvasRef.current;
    if (canvas == null) {
      return;
    }
    /*::
    if ( !(canvas.parentNode instanceof HTMLElement) ) {
      return;
    }
    */
    const winW = canvas.parentNode.offsetWidth;
    const winH = canvas.parentNode.offsetHeight;

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
      canvas: canvas,
      antialias: window.devicePixelRatio === 1,
      alpha: true,
      powerPreference: 'low-power',
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

  render() {
    return <canvas className={Canvas} ref={this.canvasRef} />;
  }
}

import { hot } from 'react-hot-loader';
export default hot(module)(HomeCanvas);
// export default HomeCanvas;
