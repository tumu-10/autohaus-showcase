import { useEffect, useRef } from "react";
import type { BufferGeometry, Material, NormalBufferAttributes } from "three";
import { PRELOADER_DURATION_MS, wheelProgress } from "@/lib/preloader";

/** Three is loaded only in the browser; the renderer is disposed with the opening screen. */
export function SportWheel({ reducedMotion }: { reducedMotion: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let dispose = () => {};
    void import("three").then((T) => {
      if (cancelled || !host.current) return;
      const container = host.current;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try { renderer = new T.WebGLRenderer({ alpha: true, antialias: true }); }
      catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, 88);
      renderer.setClearAlpha(0);
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);
      const scene = new T.Scene();
      const width = container.clientWidth / 36;
      const camera = new T.OrthographicCamera(-width / 2, width / 2, 1.22, -1.22, 0.1, 100);
      camera.position.set(0, 0, 12);
      scene.add(new T.AmbientLight(0xffffff, 0.7));
      for (const [x, y, z, intensity] of [[-3, 5, 8, 3], [5, 2, 5, 2], [0, -3, 4, 0.7]]) {
        const light = new T.DirectionalLight(0xffffff, intensity);
        light.position.set(x ?? 0, y ?? 0, z ?? 0);
        scene.add(light);
      }
      // Physical material colors describe the object, not the site's interface palette.
      const rubber = new T.MeshStandardMaterial({ color: 0x0c0d0f, roughness: 0.86, metalness: 0.05 });
      const tread = new T.MeshStandardMaterial({ color: 0x17181b, roughness: 0.9 });
      const alloy = new T.MeshStandardMaterial({ color: 0xd9dde1, roughness: 0.24, metalness: 0.75 });
      const gunmetal = new T.MeshStandardMaterial({ color: 0x41444a, roughness: 0.32, metalness: 0.65 });
      const red = new T.MeshStandardMaterial({ color: 0xb81420, roughness: 0.4, metalness: 0.25 });
      const assembly = new T.Group();
      assembly.rotation.y = -0.34;
      assembly.rotation.x = 0.06;
      scene.add(assembly);
      const wheel = new T.Group();
      assembly.add(wheel);
      const add = (geometry: BufferGeometry<NormalBufferAttributes>, material: Material, z = 0) => {
        const mesh = new T.Mesh(geometry, material);
        mesh.position.z = z;
        wheel.add(mesh);
        return mesh;
      };
      add(new T.TorusGeometry(0.75, 0.22, 24, 80), rubber);
      add(new T.TorusGeometry(0.83, 0.009, 8, 80), tread, 0.195);
      add(new T.TorusGeometry(0.88, 0.008, 8, 80), tread, 0.16);
      add(new T.TorusGeometry(0.56, 0.04, 12, 80), alloy, 0.21);
      add(new T.TorusGeometry(0.51, 0.025, 12, 80), gunmetal, 0.23);
      const disc = add(new T.CylinderGeometry(0.48, 0.48, 0.055, 64), gunmetal, 0.04);
      disc.rotation.x = Math.PI / 2;
      const caliper = new T.Mesh(new T.BoxGeometry(0.13, 0.34, 0.1), red);
      caliper.position.set(0.33, 0.03, 0.16);
      assembly.add(caliper);
      for (let i = 0; i < 5; i++) {
        for (const offset of [-0.075, 0.075]) {
          const angle = i * Math.PI * 2 / 5 + offset;
          const spoke = add(new T.BoxGeometry(0.045, 0.43, 0.085), alloy, 0.25);
          spoke.position.set(-Math.sin(angle) * 0.31, Math.cos(angle) * 0.31, 0.25);
          spoke.rotation.z = angle + offset;
        }
        const bolt = add(new T.SphereGeometry(0.025, 8, 8), alloy, 0.31);
        bolt.position.set(Math.sin(i * Math.PI * 2 / 5) * 0.09, Math.cos(i * Math.PI * 2 / 5) * 0.09, 0.31);
      }
      add(new T.TorusGeometry(0.13, 0.035, 12, 32), alloy, 0.27);
      const cap = add(new T.CylinderGeometry(0.1, 0.1, 0.06, 32), gunmetal, 0.28);
      cap.rotation.x = Math.PI / 2;
      for (let i = 0; i < 72; i++) {
        const angle = i * Math.PI * 2 / 72;
        for (const z of [-0.1, 0.1]) {
          const block = add(new T.BoxGeometry(0.045, 0.028, 0.16), tread);
          block.position.set(Math.cos(angle) * 0.967, Math.sin(angle) * 0.967, z);
          block.rotation.z = angle - Math.PI / 2;
        }
      }
      const start = performance.now();
      let frame = 0;
      const draw = (now: number) => {
        const progress = reducedMotion ? 0.5 : wheelProgress(now - start);
        const travel = width - 2.05;
        assembly.position.x = -travel / 2 + progress * travel;
        wheel.rotation.z = -progress * travel / 0.97;
        renderer.render(scene, camera);
        if (!cancelled && !reducedMotion && now - start < PRELOADER_DURATION_MS) frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);
      dispose = () => {
        cancelAnimationFrame(frame);
        scene.traverse((object) => { if (object instanceof T.Mesh) object.geometry.dispose(); });
        for (const material of [rubber, tread, alloy, gunmetal, red]) material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });
    return () => { cancelled = true; dispose(); };
  }, [reducedMotion]);
  return <div ref={host} className="absolute inset-x-0 bottom-0 h-[88px]" aria-hidden="true" />;
}