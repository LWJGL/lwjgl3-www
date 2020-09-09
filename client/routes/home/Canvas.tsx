import { useRef, useEffect } from 'react';
import { styled, css } from '~/theme/stitches.config';
import { SUPPORTS_INTERSECTION_OBSERVER } from '~/services/supports';
import { contextOptions } from './contextOptions';
// import { WebGLRenderer, Scene, PerspectiveCamera, BoxGeometry, MeshNormalMaterial, Group, Mesh } from 'three';
declare const THREE: any;

const fadeInCanvas = css.keyframes({
  to: {
    opacity: 0.175,
  },
});

const Canvas = styled('canvas', {
  position: 'absolute',
  zIndex: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  animation: `${fadeInCanvas} 2s ease 0.5s forwards`,
});

const HomeCanvas: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);

  useEffect(() => {
    if (cameraRef.current !== null && rendererRef.current !== null) {
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height, false);
    }
  }, [width, height]);

  useEffect(
    () => {
      const { WebGLRenderer, Scene, PerspectiveCamera, BoxGeometry, MeshNormalMaterial, Group, Mesh } = THREE;

      function animate() {
        rafId = requestAnimationFrame(animate);

        let time = Date.now() * 0.000015;
        let rx = time;
        let ry = time;

        group.rotation.x = rx;
        group.rotation.y = ry;
        rendererRef.current.render(scene, cameraRef.current);
      }

      function stop() {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }

      function ioCheck(entries: Array<IntersectionObserverEntry>) {
        if (entries[0].intersectionRatio > 0) {
          if (rafId === null) {
            animate();
          }
        } else if (rafId !== null) {
          stop();
        }
      }

      const canvas = canvasRef.current;
      if (canvas === null) {
        return;
      }

      let context =
        canvas.getContext('webgl', contextOptions) ||
        (canvas.getContext('experimental-webgl', contextOptions) as WebGLRenderingContext | null);

      if (context === null) {
        return;
      }

      let io: IntersectionObserver | null = null;
      let rafId: number | null = null;

      cameraRef.current = new PerspectiveCamera(60, width / height, 100, 10000);
      cameraRef.current.position.z = 1500;

      let geometry = new BoxGeometry(60, 60, 60);
      let material = new MeshNormalMaterial();

      let group = new Group();
      for (let i = 0; i < 300; i += 1) {
        let mesh = new Mesh(geometry, material);
        mesh.position.x = Math.random() * 2000 - 1000;
        mesh.position.y = Math.random() * 2000 - 1000;
        mesh.position.z = Math.random() * 2000 - 1000;
        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        group.add(mesh);
      }

      let scene = new Scene();
      scene.add(group);

      rendererRef.current = new WebGLRenderer({ canvas, context });
      if (window.devicePixelRatio !== undefined) {
        rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
      rendererRef.current.setSize(width, height, false);
      rendererRef.current.sortObjects = false;
      animate();

      if (SUPPORTS_INTERSECTION_OBSERVER) {
        io = new IntersectionObserver(ioCheck);
        io.observe(canvas);
      }

      return () => {
        stop();

        if (io !== null) {
          io.disconnect();
          io = null;
        }

        if (scene !== undefined) {
          scene.remove(group);
          geometry.dispose();
          material.dispose();
        }
      };
    },
    //eslint-disable-next-line
    []
  );

  return <Canvas ref={canvasRef} />;
};

export default HomeCanvas;
