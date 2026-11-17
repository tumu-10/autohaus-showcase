import { useEffect, useRef } from "react";
import type { BufferGeometry, Material, Texture } from "three";
import { PRELOADER_DURATION_MS, wheelChoreography, wheelProgress } from "@/lib/preloader";

const SMOKE_PARTICLES = 88;
const seeded = (index: number) => {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

/** Three loads only in the browser; every rendering resource leaves with the opening screen. */
export function SportWheel({ reducedMotion, onReady }: { reducedMotion: boolean; onReady: () => void }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let dispose = () => {};
    let animationStartedAt = 0;
    let announcedReady = false;

    void import("three")
      .then((T) => {
        if (cancelled || !host.current) return;
        const container = host.current;
        let renderer: InstanceType<typeof T.WebGLRenderer>;
        try {
          renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
        } catch {
          if (!cancelled) onReady();
          return;
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearAlpha(0);
        renderer.outputColorSpace = T.SRGBColorSpace;
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.18;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = T.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(32, 1, 0.1, 60);
        camera.position.set(0, 0.22, 5);
        camera.lookAt(0, -0.05, 0);

        scene.add(new T.HemisphereLight(0xdde7f0, 0x151515, 1.6));
        const key = new T.DirectionalLight(0xffffff, 4.2);
        key.position.set(-3.5, 5, 6);
        key.castShadow = true;
        key.shadow.mapSize.set(512, 512);
        key.shadow.camera.left = -5;
        key.shadow.camera.right = 5;
        key.shadow.camera.top = 4;
        key.shadow.camera.bottom = -3;
        key.shadow.bias = -0.0005;
        scene.add(key);
        const rimLight = new T.DirectionalLight(0xc9d9e8, 2.4);
        rimLight.position.set(4, 1.5, -2);
        scene.add(rimLight);
        const faceLight = new T.DirectionalLight(0xffffff, 1.1);
        faceLight.position.set(0, -1, 5);
        scene.add(faceLight);
        const brakeGlow = new T.PointLight(0xb81420, 0.75, 2.6);
        brakeGlow.position.set(0.4, 0, 0.8);
        scene.add(brakeGlow);

        const textures = new Set<Texture>();
        const noiseCanvas = document.createElement("canvas");
        noiseCanvas.width = 256;
        noiseCanvas.height = 256;
        const noiseContext = noiseCanvas.getContext("2d");
        if (noiseContext) {
          const image = noiseContext.createImageData(256, 256);
          for (let i = 0; i < image.data.length; i += 4) {
            const grain = 90 + Math.floor(seeded(i) * 110);
            image.data[i] = grain;
            image.data[i + 1] = grain;
            image.data[i + 2] = grain;
            image.data[i + 3] = 255;
          }
          noiseContext.putImageData(image, 0, 0);
        }
        const rubberGrain = new T.CanvasTexture(noiseCanvas);
        rubberGrain.wrapS = T.RepeatWrapping;
        rubberGrain.wrapT = T.RepeatWrapping;
        rubberGrain.repeat.set(5, 2);
        textures.add(rubberGrain);

        const labelCanvas = document.createElement("canvas");
        labelCanvas.width = 1024;
        labelCanvas.height = 1024;
        const labelContext = labelCanvas.getContext("2d");
        if (labelContext) {
          labelContext.translate(512, 512);
          labelContext.strokeStyle = "rgba(155,160,165,.34)";
          labelContext.lineWidth = 3;
          for (const radius of [350, 374, 458, 474]) {
            labelContext.beginPath();
            labelContext.arc(0, 0, radius, 0, Math.PI * 2);
            labelContext.stroke();
          }
          const circularText = (text: string, radius: number, start: number, end: number, flip = false) => {
            labelContext.font = "600 27px Arial";
            labelContext.fillStyle = "rgba(175,180,184,.68)";
            labelContext.textAlign = "center";
            labelContext.textBaseline = "middle";
            const letters = Array.from(text);
            letters.forEach((letter, index) => {
              const angle = start + (end - start) * (index / Math.max(1, letters.length - 1));
              labelContext.save();
              labelContext.rotate(angle);
              labelContext.translate(0, flip ? radius : -radius);
              if (flip) labelContext.rotate(Math.PI);
              labelContext.fillText(letter, 0, 0);
              labelContext.restore();
            });
          };
          circularText("HIGH PERFORMANCE", 413, -0.82, 0.82);
          circularText("295 / 30  ZR 21", 413, Math.PI - 0.72, Math.PI + 0.72, true);
          labelContext.font = "700 20px Arial";
          labelContext.fillStyle = "rgba(160,165,170,.5)";
          labelContext.fillText("SPORT", -315, 90);
          labelContext.fillText("RADIAL", 315, -90);
        }
        const sidewallLabels = new T.CanvasTexture(labelCanvas);
        sidewallLabels.colorSpace = T.SRGBColorSpace;
        sidewallLabels.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        textures.add(sidewallLabels);

        // Physical material values belong to the rendered object, not the interface palette.
        const rubber = new T.MeshPhysicalMaterial({
          color: 0x111214,
          roughness: 0.79,
          metalness: 0.02,
          bumpMap: rubberGrain,
          bumpScale: 0.025,
          roughnessMap: rubberGrain,
          clearcoat: 0.08,
          clearcoatRoughness: 0.7,
        });
        const tread = new T.MeshStandardMaterial({ color: 0x17181a, roughness: 0.92, bumpMap: rubberGrain, bumpScale: 0.018 });
        const alloy = new T.MeshPhysicalMaterial({ color: 0xdde2e7, roughness: 0.17, metalness: 0.94, clearcoat: 0.42, clearcoatRoughness: 0.15 });
        const gunmetal = new T.MeshStandardMaterial({ color: 0x3d4147, roughness: 0.29, metalness: 0.86 });
        const discMaterial = new T.MeshStandardMaterial({ color: 0x777b80, roughness: 0.36, metalness: 0.92 });
        const red = new T.MeshPhysicalMaterial({ color: 0xb81420, roughness: 0.3, metalness: 0.38, clearcoat: 0.55 });
        const black = new T.MeshBasicMaterial({ color: 0x090a0b });
        const labelMaterial = new T.MeshStandardMaterial({ map: sidewallLabels, transparent: true, roughness: 0.82, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
        const ghostMaterial = new T.MeshBasicMaterial({ color: 0xc9d1d8, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending });

        const assembly = new T.Group();
        scene.add(assembly);
        const wheel = new T.Group();
        assembly.add(wheel);

        const add = (geometry: BufferGeometry, material: Material, z = 0, parent: InstanceType<typeof T.Group> = wheel) => {
          const mesh = new T.Mesh(geometry, material);
          mesh.position.z = z;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
          parent.add(mesh);
          return mesh;
        };

        const tyreBody = add(new T.TorusGeometry(0.73, 0.27, 40, 112), rubber);
        tyreBody.castShadow = true;
        add(new T.RingGeometry(0.55, 0.965, 128), labelMaterial, 0.272);
        add(new T.TorusGeometry(0.9, 0.009, 8, 128), tread, 0.232);
        add(new T.TorusGeometry(0.81, 0.006, 8, 128), tread, 0.26);
        add(new T.TorusGeometry(0.59, 0.034, 16, 128), alloy, 0.25);
        add(new T.TorusGeometry(0.545, 0.018, 12, 128), gunmetal, 0.265);

        const barrel = add(new T.CylinderGeometry(0.565, 0.565, 0.32, 96, 1, true), gunmetal, 0.03);
        barrel.rotation.x = Math.PI / 2;
        const disc = add(new T.CylinderGeometry(0.455, 0.455, 0.048, 96), discMaterial, 0.08);
        disc.rotation.x = Math.PI / 2;
        add(new T.TorusGeometry(0.41, 0.008, 8, 96), alloy, 0.11);

        const holeGeometry = new T.CylinderGeometry(0.014, 0.014, 0.008, 8);
        const holes = new T.InstancedMesh(holeGeometry, black, 32);
        const dummy = new T.Object3D();
        for (let i = 0; i < 32; i++) {
          const angle = (i / 32) * Math.PI * 2;
          dummy.position.set(Math.sin(angle) * 0.375, Math.cos(angle) * 0.375, 0.11);
          dummy.rotation.set(Math.PI / 2, 0, 0);
          dummy.updateMatrix();
          holes.setMatrixAt(i, dummy.matrix);
        }
        wheel.add(holes);

        const caliper = add(new T.BoxGeometry(0.16, 0.39, 0.13, 3, 5, 2), red, 0.14, assembly);
        caliper.position.set(0.345, 0.015, 0.14);
        caliper.rotation.z = -0.12;
        const caliperStripe = add(new T.BoxGeometry(0.025, 0.25, 0.008), alloy, 0.211, assembly);
        caliperStripe.position.set(0.345, 0.015, 0.211);
        caliperStripe.rotation.z = -0.12;

        const spokeShape = new T.Shape();
        spokeShape.moveTo(-0.038, 0.1);
        spokeShape.lineTo(-0.055, 0.47);
        spokeShape.quadraticCurveTo(-0.055, 0.56, -0.015, 0.575);
        spokeShape.lineTo(0.052, 0.555);
        spokeShape.lineTo(0.055, 0.18);
        spokeShape.quadraticCurveTo(0.04, 0.11, -0.038, 0.1);
        const spokeGeometry = new T.ExtrudeGeometry(spokeShape, { depth: 0.065, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.012, bevelThickness: 0.012, curveSegments: 5 });
        const ghostA = new T.Group();
        const ghostB = new T.Group();
        wheel.add(ghostA, ghostB);
        for (let i = 0; i < 5; i++) {
          for (const branch of [-1, 1]) {
            const angle = (i / 5) * Math.PI * 2 + branch * 0.075;
            const spoke = add(spokeGeometry, alloy, 0.225);
            spoke.rotation.z = angle + branch * 0.045;
            spoke.scale.x = 0.72;
            for (const [ghost, offset] of [[ghostA, -0.055], [ghostB, 0.055]] as const) {
              const smear = add(spokeGeometry, ghostMaterial, 0.218, ghost);
              smear.rotation.z = angle + branch * 0.045 + offset;
              smear.scale.x = 0.72;
              smear.castShadow = false;
            }
          }
          const lug = add(new T.CylinderGeometry(0.025, 0.025, 0.035, 12), alloy, 0.31);
          lug.rotation.x = Math.PI / 2;
          lug.position.set(Math.sin((i / 5) * Math.PI * 2) * 0.105, Math.cos((i / 5) * Math.PI * 2) * 0.105, 0.31);
        }
        add(new T.TorusGeometry(0.14, 0.025, 16, 48), alloy, 0.29);
        const cap = add(new T.CylinderGeometry(0.092, 0.092, 0.055, 48), gunmetal, 0.3);
        cap.rotation.x = Math.PI / 2;

        const treadGeometry = new T.BoxGeometry(0.105, 0.032, 0.105);
        const treadBlocks = new T.InstancedMesh(treadGeometry, tread, 60 * 3);
        let treadIndex = 0;
        for (let row = 0; row < 3; row++) {
          const z = (row - 1) * 0.145;
          const radius = 0.73 + Math.sqrt(0.27 * 0.27 - z * z) + 0.003;
          for (let i = 0; i < 60; i++) {
            const angle = (i / 60) * Math.PI * 2 + (row % 2) * 0.042;
            dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, z);
            dummy.rotation.set(0, 0, angle - Math.PI / 2 + (row - 1) * 0.14);
            dummy.updateMatrix();
            treadBlocks.setMatrixAt(treadIndex++, dummy.matrix);
          }
        }
        treadBlocks.receiveShadow = true;
        wheel.add(treadBlocks);

        const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.ShadowMaterial({ opacity: 0.32 }));
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -1.025;
        floor.receiveShadow = true;
        scene.add(floor);

        const skidMaterial = new T.MeshBasicMaterial({ color: 0x555555, transparent: true, opacity: 0, depthWrite: false });
        const skids = [-0.13, 0.13].map((z) => {
          const mark = new T.Mesh(new T.PlaneGeometry(1, 0.055), skidMaterial);
          mark.rotation.x = -Math.PI / 2;
          mark.position.set(0, -1.018, z);
          scene.add(mark);
          return mark;
        });

        const smokeCanvas = document.createElement("canvas");
        smokeCanvas.width = 128;
        smokeCanvas.height = 128;
        const smokeContext = smokeCanvas.getContext("2d");
        if (smokeContext) {
          for (let i = 0; i < 22; i++) {
            const x = 34 + seeded(i * 3) * 60;
            const y = 34 + seeded(i * 3 + 1) * 60;
            const radius = 17 + seeded(i * 3 + 2) * 29;
            const gradient = smokeContext.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, "rgba(255,255,255,.16)");
            gradient.addColorStop(0.5, "rgba(255,255,255,.08)");
            gradient.addColorStop(1, "rgba(255,255,255,0)");
            smokeContext.fillStyle = gradient;
            smokeContext.fillRect(0, 0, 128, 128);
          }
        }
        const smokeTexture = new T.CanvasTexture(smokeCanvas);
        textures.add(smokeTexture);
        const smokeGeometry = new T.BufferGeometry();
        const smokePositions = new Float32Array(SMOKE_PARTICLES * 3);
        const smokeSizes = new Float32Array(SMOKE_PARTICLES);
        const smokeAlphas = new Float32Array(SMOKE_PARTICLES);
        const smokeColors = new Float32Array(SMOKE_PARTICLES * 3);
        for (let i = 0; i < SMOKE_PARTICLES; i++) {
          const dust = seeded(i * 11) > 0.78;
          smokeColors[i * 3] = dust ? 0.42 : 0.68;
          smokeColors[i * 3 + 1] = dust ? 0.39 : 0.7;
          smokeColors[i * 3 + 2] = dust ? 0.35 : 0.72;
        }
        smokeGeometry.setAttribute("position", new T.BufferAttribute(smokePositions, 3));
        smokeGeometry.setAttribute("aSize", new T.BufferAttribute(smokeSizes, 1));
        smokeGeometry.setAttribute("aAlpha", new T.BufferAttribute(smokeAlphas, 1));
        smokeGeometry.setAttribute("aColor", new T.BufferAttribute(smokeColors, 3));
        const smokeMaterial = new T.ShaderMaterial({
          uniforms: { uMap: { value: smokeTexture } },
          vertexShader: `
            attribute float aSize;
            attribute float aAlpha;
            attribute vec3 aColor;
            varying float vAlpha;
            varying vec3 vColor;
            void main() {
              vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * viewPosition;
              gl_PointSize = aSize * (250.0 / max(1.0, -viewPosition.z));
              vAlpha = aAlpha;
              vColor = aColor;
            }
          `,
          fragmentShader: `
            uniform sampler2D uMap;
            varying float vAlpha;
            varying vec3 vColor;
            void main() {
              float cloud = texture2D(uMap, gl_PointCoord).a;
              if (cloud * vAlpha < 0.003) discard;
              gl_FragColor = vec4(vColor, cloud * vAlpha);
            }
          `,
          transparent: true,
          depthWrite: false,
          toneMapped: false,
        });
        const smoke = new T.Points(smokeGeometry, smokeMaterial);
        smoke.frustumCulled = false;
        scene.add(smoke);

        let viewWidth = 6;
        let travel = 4;
        const resize = () => {
          const width = Math.max(1, container.clientWidth);
          const height = Math.max(1, container.clientHeight);
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          const viewHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
          viewWidth = viewHeight * camera.aspect;
          travel = Math.max(1.25, viewWidth - 2.15);
        };
        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(container);

        const xAt = (progress: number) => -travel / 2 + wheelChoreography(progress).travel * travel;
        let frame = 0;
        const draw = (now: number) => {
          if (!animationStartedAt) animationStartedAt = now;
          const progress = reducedMotion ? 0.56 : wheelProgress(now - animationStartedAt);
          const pose = wheelChoreography(progress);
          const x = xAt(progress);
          assembly.position.set(x, pose.bounce, 0);
          assembly.rotation.set(0.065 + pose.drift * 0.025, -0.48 + pose.drift * 0.4, pose.drift * -0.035);
          wheel.rotation.z = -pose.spin;
          ghostA.rotation.z = -0.055 * pose.speed;
          ghostB.rotation.z = 0.075 * pose.speed;
          ghostMaterial.opacity = reducedMotion ? 0 : 0.025 + pose.slip * 0.075;
          skidMaterial.opacity = reducedMotion ? 0.08 : pose.smoke * 0.15;
          for (const mark of skids) {
            const length = Math.max(0.001, wheelChoreography(progress).travel * travel);
            mark.scale.x = length;
            mark.position.x = -travel / 2 + length / 2;
          }

          for (let i = 0; i < SMOKE_PARTICLES; i++) {
            const birth = 0.035 + (i / SMOKE_PARTICLES) * 0.82;
            const lifetime = 0.17 + seeded(i * 7) * 0.17;
            const age = reducedMotion ? -1 : (progress - birth) / lifetime;
            if (age < 0 || age > 1) {
              smokeAlphas[i] = 0;
              smokeSizes[i] = 0;
              continue;
            }
            const spread = seeded(i * 13);
            const birthPose = wheelChoreography(birth);
            smokePositions[i * 3] = xAt(birth) - age * (0.55 + spread * 1.25) + Math.sin(age * 8 + i) * 0.08;
            smokePositions[i * 3 + 1] = -0.88 + age * (0.42 + spread * 0.75);
            smokePositions[i * 3 + 2] = -0.32 + (seeded(i * 17) - 0.5) * (0.35 + age * 0.75);
            smokeSizes[i] = 0.22 + age * (0.95 + spread * 0.65);
            smokeAlphas[i] = Math.sin(age * Math.PI) * birthPose.smoke * (0.5 + spread * 0.55);
          }
          smokeGeometry.getAttribute("position").needsUpdate = true;
          smokeGeometry.getAttribute("aSize").needsUpdate = true;
          smokeGeometry.getAttribute("aAlpha").needsUpdate = true;
          renderer.render(scene, camera);
          container.dataset["wheelReady"] = "true";
          container.dataset["wheelProgress"] = progress.toFixed(3);
          if (!announcedReady) {
            announcedReady = true;
            onReady();
          }
          if (!cancelled && !reducedMotion && now - animationStartedAt < PRELOADER_DURATION_MS) frame = requestAnimationFrame(draw);
        };
        frame = requestAnimationFrame(draw);

        dispose = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          const geometries = new Set<BufferGeometry>();
          const materials = new Set<Material>();
          scene.traverse((object) => {
            if (object instanceof T.Mesh || object instanceof T.Points) {
              geometries.add(object.geometry);
              const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
              objectMaterials.forEach((material) => materials.add(material));
            }
          });
          geometries.forEach((geometry) => geometry.dispose());
          materials.forEach((material) => material.dispose());
          textures.forEach((texture) => texture.dispose());
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch(() => {
        if (!cancelled) onReady();
        // The red loading line and original logo remain as a no-WebGL fallback.
      });

    return () => {
      cancelled = true;
      dispose();
    };
  }, [reducedMotion, onReady]);

  return <div ref={host} className="absolute inset-0" aria-hidden="true" />;
}
