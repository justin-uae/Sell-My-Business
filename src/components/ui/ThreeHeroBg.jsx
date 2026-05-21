import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeHeroBg({ className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;
    const isMobile = W < 768;

    //  Renderer 
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    //  Camera 
    const FOV = isMobile ? 65 : 45;
    const CAM_Z = isMobile ? 420 : 620;
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 1, 2000);
    camera.position.z = CAM_Z;

    //  Compute sphere radius to always fit the visible frustum 
    // This ensures the sphere is never clipped on any screen size.
    const halfH = CAM_Z * Math.tan((FOV * Math.PI) / 180 / 2);
    const halfW = halfH * (W / H);
    const SPHERE_R = Math.min(halfW, halfH) * 0.72;

    //  Scene 
    const scene = new THREE.Scene();

    //  Line geometry (drawRange style) 
    const MAX_SEGS = isMobile ? 300 : 600;
    const MAX_VERTS = MAX_SEGS * 2;
    const DRAW_SPEED = isMobile ? 5 : 5;

    const positions = new Float32Array(MAX_VERTS * 3);
    const colors = new Float32Array(MAX_VERTS * 3);

    const cBlue = new THREE.Color(0x197fe3);
    const cWhite = new THREE.Color(0xc8e6ff);
    const cGold = new THREE.Color(0xd4af37);

    for (let s = 0; s < MAX_SEGS; s++) {
      const phi1 = Math.acos(2 * Math.random() - 1);
      const theta1 = 2 * Math.PI * Math.random();
      const phi2 = phi1 + (Math.random() - 0.5) * 0.75;
      const theta2 = theta1 + (Math.random() - 0.5) * 0.75;
      const r1 = SPHERE_R * (0.82 + Math.random() * 0.18);
      const r2 = SPHERE_R * (0.82 + Math.random() * 0.18);

      const i = s * 2;
      positions[i * 3] = r1 * Math.sin(phi1) * Math.cos(theta1);
      positions[i * 3 + 1] = r1 * Math.sin(phi1) * Math.sin(theta1);
      positions[i * 3 + 2] = r1 * Math.cos(phi1);
      positions[(i + 1) * 3] = r2 * Math.sin(phi2) * Math.cos(theta2);
      positions[(i + 1) * 3 + 1] = r2 * Math.sin(phi2) * Math.sin(theta2);
      positions[(i + 1) * 3 + 2] = r2 * Math.cos(phi2);

      const t = s / MAX_SEGS;
      const isGold = s % 10 === 0;
      const c = isGold
        ? cBlue.clone().lerp(cGold, 0.6)
        : cBlue.clone().lerp(cWhite, t);

      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
      colors[(i + 1) * 3] = c.r; colors[(i + 1) * 3 + 1] = c.g; colors[(i + 1) * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setDrawRange(0, 0);

    const material = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.92 });
    const lineObj = new THREE.LineSegments(geometry, material);
    scene.add(lineObj);

    //  Dot cloud 
    const DOT_COUNT = isMobile ? 180 : 380;
    const dotGeo = new THREE.BufferGeometry();
    const dotPos = new Float32Array(DOT_COUNT * 3);
    const dotCol = new Float32Array(DOT_COUNT * 3);

    for (let i = 0; i < DOT_COUNT; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = SPHERE_R * (0.4 + Math.random() * 0.85);
      dotPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dotPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dotPos[i * 3 + 2] = r * Math.cos(phi);
      const dc = i % 7 === 0 ? cGold : cBlue;
      dotCol[i * 3] = dc.r; dotCol[i * 3 + 1] = dc.g; dotCol[i * 3 + 2] = dc.b;
    }
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3));
    dotGeo.setAttribute('color', new THREE.BufferAttribute(dotCol, 3));
    const dotMat = new THREE.PointsMaterial({ vertexColors: true, size: isMobile ? 2.0 : 2.2, transparent: true, opacity: 0.75 });
    const dots = new THREE.Points(dotGeo, dotMat);
    scene.add(dots);

    //  Animation 
    let drawCount = 0;
    let forward = true;
    let mouseX = 0;
    let mouseY = 0;
    let raf;

    const animate = () => {
      raf = requestAnimationFrame(animate);

      if (forward) {
        drawCount += DRAW_SPEED;
        if (drawCount >= MAX_VERTS) forward = false;
      } else {
        drawCount -= DRAW_SPEED;
        if (drawCount <= 0) forward = true;
      }
      geometry.setDrawRange(0, drawCount);

      lineObj.rotation.y += 0.0018;
      lineObj.rotation.x += 0.0006;
      lineObj.rotation.y += mouseX * 0.0003;
      lineObj.rotation.x += mouseY * 0.0002;
      dots.rotation.y = lineObj.rotation.y * 0.55;
      dots.rotation.x = lineObj.rotation.x * 0.55;

      renderer.render(scene, camera);
    };
    animate();

    //  Resize 
    const onResize = () => {
      const nW = mount.clientWidth;
      const nH = mount.clientHeight;
      const mobile = nW < 768;
      const nFOV = mobile ? 65 : 45;
      const nCamZ = mobile ? 420 : 620;
      camera.fov = nFOV;
      camera.aspect = nW / nH;
      camera.position.z = nCamZ;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener('resize', onResize);

    //  Mouse (desktop only) 
    const onMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!isMobile) window.addEventListener('mousemove', onMouse);

    //  Cleanup 
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      if (!isMobile) window.removeEventListener('mousemove', onMouse);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={`absolute inset-0 ${className}`} />;
}
