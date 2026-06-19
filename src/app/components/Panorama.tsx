import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import initialImageSrc from '../../imports/ChatGPT_Image_Jun_11__2026__09_28_54_AM.png';
import finalImageSrc   from '../../imports/Deepas_lit_up.png';

export interface PanoramaHandle {
  getLonLat:     () => { lon: number; lat: number };
  switchToFinal: () => void;
}

interface Props { dim?: boolean }

const START_LON  = 180;   // U=0.5 → horizontal centre of the equirectangular
const CROSSFADE  = 1.2;   // seconds for image → image blend

function loadTexture(src: string): Promise<THREE.Texture> {
  return new Promise(resolve => {
    const t = new THREE.TextureLoader().load(src, () => resolve(t));
    t.colorSpace      = THREE.SRGBColorSpace;
    t.minFilter       = THREE.LinearFilter;
    t.magFilter       = THREE.LinearFilter;
    t.generateMipmaps = false;
  });
}

type Phase = 'image' | 'fade-to-final' | 'final';

const Panorama = forwardRef<PanoramaHandle, Props>(({ dim = false }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const ctrl = useRef<{
    phase: Phase; blend: number;
    lon: number; lat: number; targetLon: number; targetLat: number;
    autoRotate: boolean;
    switchToFinal: () => void;
  }>({
    phase: 'image', blend: 0,
    lon: START_LON, lat: 0, targetLon: START_LON, targetLat: 0,
    autoRotate: true,
    switchToFinal: () => {},
  });

  useImperativeHandle(ref, () => ({
    getLonLat:     () => ({ lon: ctrl.current.lon, lat: ctrl.current.lat }),
    switchToFinal: () => ctrl.current.switchToFinal(),
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let unmounted = false;
    let cleanupFn: (() => void) | null = null;

    async function init() {
      // Both are images — load fast in parallel, no large blob download
      let initTex: THREE.Texture, finalTex: THREE.Texture;
      try {
        [initTex, finalTex] = await Promise.all([
          loadTexture(initialImageSrc),
          loadTexture(finalImageSrc),
        ]);
      } catch { return; }
      if (unmounted) return;

      // ── Three.js ────────────────────────────────────────────────
      const scene    = new THREE.Scene();
      const camera   = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      const geo  = new THREE.SphereGeometry(500, 64, 48);
      geo.scale(-1, 1, 1);

      const opts = { transparent: true, depthWrite: false };
      // matA = base layer (opacity always 1), matB = overlay (0 → 1 during crossfade)
      const matA = new THREE.MeshBasicMaterial({ ...opts, map: initTex,  opacity: 1 });
      const matB = new THREE.MeshBasicMaterial({ ...opts, map: initTex,  opacity: 0 });
      const sA   = new THREE.Mesh(geo, matA); sA.renderOrder = 0;
      const sB   = new THREE.Mesh(geo, matB); sB.renderOrder = 1;
      scene.add(sA, sB);

      // ── switchToFinal ────────────────────────────────────────────
      ctrl.current.switchToFinal = () => {
        const c = ctrl.current;
        if (c.phase === 'fade-to-final' || c.phase === 'final') return;
        matB.map     = finalTex;
        matB.opacity = 0;
        c.blend      = 0;
        c.phase      = 'fade-to-final';
      };

      // ── Camera drag ─────────────────────────────────────────────
      const c = ctrl.current;
      let isDown = false, sx = 0, sy = 0;
      let idleTimer: ReturnType<typeof setTimeout>;

      const resetIdle = () => {
        c.autoRotate = false;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => { c.autoRotate = true; }, 3000);
      };
      const onDown = (e: PointerEvent) => { isDown = true; sx = e.clientX; sy = e.clientY; resetIdle(); container.setPointerCapture(e.pointerId); };
      const onMove = (e: PointerEvent) => {
        if (!isDown) return;
        c.targetLon -= (e.clientX - sx) * 0.15;
        c.targetLat += (e.clientY - sy) * 0.15;
        c.targetLat  = Math.max(-85, Math.min(85, c.targetLat));
        sx = e.clientX; sy = e.clientY;
      };
      const onUp = () => { isDown = false; };
      container.addEventListener('pointerdown', onDown);
      container.addEventListener('pointermove', onMove);
      container.addEventListener('pointerup',   onUp);
      container.addEventListener('pointercancel', onUp);

      const onResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', onResize);

      // ── Render loop ─────────────────────────────────────────────
      const clock = new THREE.Timer();
      let animId: number;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        clock.update();
        const dt = Math.min(clock.getDelta(), 0.05);

        if (c.autoRotate && c.phase === 'image') c.targetLon += 0.02;
        const k = 1 - Math.pow(0.001, dt);
        c.lon += (c.targetLon - c.lon) * k;
        c.lat += (c.targetLat - c.lat) * k;

        if (c.phase === 'fade-to-final') {
          c.blend = Math.min(c.blend + dt / CROSSFADE, 1);
          matB.opacity = c.blend;
          if (c.blend >= 1) {
            matA.map     = finalTex;
            matB.opacity = 0;
            c.blend      = 0;
            c.phase      = 'final';
          }
        }

        const phi   = THREE.MathUtils.degToRad(90 - c.lat);
        const theta = THREE.MathUtils.degToRad(c.lon);
        camera.lookAt(
          500 * Math.sin(phi) * Math.cos(theta),
          500 * Math.cos(phi),
          500 * Math.sin(phi) * Math.sin(theta),
        );
        renderer.render(scene, camera);
      };
      animate();

      cleanupFn = () => {
        cancelAnimationFrame(animId);
        clearTimeout(idleTimer);
        window.removeEventListener('resize', onResize);
        container.removeEventListener('pointerdown', onDown);
        container.removeEventListener('pointermove', onMove);
        container.removeEventListener('pointerup',   onUp);
        container.removeEventListener('pointercancel', onUp);
        initTex.dispose();
        finalTex.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };
    }

    init();
    return () => { unmounted = true; cleanupFn?.(); };
  }, []);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="w-full h-full" style={{ cursor: 'grab' }}
        onMouseDown={e => { e.currentTarget.style.cursor = 'grabbing'; }}
        onMouseUp={e => { e.currentTarget.style.cursor = 'grab'; }} />
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{ backgroundColor: '#080A14', opacity: dim ? 0.72 : 0 }} />
    </div>
  );
});

Panorama.displayName = 'Panorama';
export default Panorama;
