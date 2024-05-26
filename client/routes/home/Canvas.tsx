import { useRef, useEffect } from 'react';
import { styled, keyframes } from '~/theme/stitches.config';
import { contextOptions } from './contextOptions';
import { useIntersectionObserver } from '~/hooks/useIntersectionObserver';

declare const THREE: any;

const fadeInCanvas = keyframes({
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
  'use no memo';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const groupRef = useRef<any>(null);
  const onScreen = useIntersectionObserver(canvasRef, true);

  useEffect(() => {
    const { WebGLRenderer, Scene, PerspectiveCamera, BoxGeometry, MeshNormalMaterial, Group, Mesh } = THREE;

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

    cameraRef.current = new PerspectiveCamera(60, width / height, 100, 10000);
    cameraRef.current.position.z = 1500;

    let geometry = new BoxGeometry(60, 60, 60);
    let material = new MeshNormalMaterial();

    groupRef.current = new Group();
    for (let i = 0; i < 300; i += 1) {
      let mesh = new Mesh(geometry, material);
      mesh.position.x = Math.random() * 2000 - 1000;
      mesh.position.y = Math.random() * 2000 - 1000;
      mesh.position.z = Math.random() * 2000 - 1000;
      mesh.rotation.x = Math.random() * 2 * Math.PI;
      mesh.rotation.y = Math.random() * 2 * Math.PI;
      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
      groupRef.current.add(mesh);
    }

    sceneRef.current = new Scene();
    sceneRef.current.add(groupRef.current);

    rendererRef.current = new WebGLRenderer({ canvas, context });
    if (window.devicePixelRatio !== undefined) {
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    rendererRef.current.setSize(width, height, false);
    rendererRef.current.sortObjects = false;

    return () => {
      if (sceneRef.current !== undefined) {
        sceneRef.current.remove(groupRef.current);
        geometry.dispose();
        material.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (cameraRef.current !== null && rendererRef.current !== null) {
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height, false);
    }
  }, [width, height]);

  useEffect(() => {
    let rafId: number | null = null;

    function animate() {
      rafId = requestAnimationFrame(animate);

      let time = Date.now() * 0.000015;
      let rx = time;
      let ry = time;

      if (groupRef.current) {
        groupRef.current.rotation.x = rx;
        groupRef.current.rotation.y = ry;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }

    function stop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    if (onScreen) {
      if (rafId === null) {
        animate();
        return stop;
      }
    } else if (rafId !== null) {
      stop();
    }
  }, [onScreen]);

  return <Canvas ref={canvasRef} />;
};

export default HomeCanvas;
