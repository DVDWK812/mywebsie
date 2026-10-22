import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorld;
  float wave(vec3 p) {
    float t = uTime * .28;
    float a = sin(p.x*3.1+t) * cos(p.y*2.8-t*.7) * sin(p.z*2.6+t*.6);
    float b = sin(p.x*6.2-t*.5) * sin(p.y*5.1+t*.8) * cos(p.z*5.8+t);
    float c = sin(p.x*10.5+p.y*3.4+t) * cos(p.z*9.2-p.y*4.3-t*.6);
    return a*.155 + b*.052 + c*.014;
  }
  void main() {
    vec3 n = normalize(position);
    vec3 displaced = position + n * wave(n);
    vec3 tangent = normalize(cross(n, vec3(.001, 1., .001)));
    vec3 bitangent = normalize(cross(n, tangent));
    vec3 p1 = normalize(n + tangent*.008);
    vec3 p2 = normalize(n + bitangent*.008);
    vec3 d1 = p1 * (1. + wave(p1));
    vec3 d2 = p2 * (1. + wave(p2));
    vec3 calculatedNormal = normalize(cross(d1-displaced, d2-displaced));
    vNormal = normalize(normalMatrix * calculatedNormal);
    vec4 viewPosition = modelViewMatrix * vec4(displaced, 1.);
    vPosition = viewPosition.xyz;
    vWorld = displaced;
    gl_Position = projectionMatrix * viewPosition;
  }
`;
const fragmentShader = `
  uniform float uTime;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 eye = normalize(-vPosition);
    float fresnel = pow(1.-max(dot(n, eye), 0.), 2.7);
    vec3 reflection = reflect(-eye, n);
    float softbox = pow(max(dot(reflection, normalize(vec3(-.7, 1.1, 1.5))), 0.), 12.);
    float strip = pow(max(dot(reflection, normalize(vec3(.8, .5, .7))), 0.), 35.);
    float bottom = pow(max(dot(reflection, normalize(vec3(-.6, -.8, .3))), 0.), 9.);
    float diffuse = max(dot(n, normalize(vec3(-.5, .8, 1.))), 0.);
    float bands = sin(vWorld.y*10. + vWorld.x*5. + sin(vWorld.z*5.+uTime*.15)*1.7)*.5+.5;
    vec3 color = vec3(.034, .078, .077) + diffuse*vec3(.065, .13, .125);
    color += softbox*vec3(.73,.88,.85) + strip*vec3(.63,.82,.78);
    color += bottom*vec3(.08,.34,.3);
    color += fresnel*vec3(.15,.43,.39);
    color += pow(bands, 6.) * diffuse * vec3(.028,.065,.06);
    color = pow(color, vec3(.85));
    gl_FragColor = vec4(color, 1.);
  }
`;

export default function Sphere() {
  const host = useRef(null);
  useEffect(() => {
    const element = host.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20);
    camera.position.z = 4.1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    element.appendChild(renderer.domElement);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { uTime: { value: 0 } },
    });
    const geometry = new THREE.SphereGeometry(1, 192, 128);
    const sphere = new THREE.Mesh(geometry, material);
    sphere.rotation.set(0.12, 0, -0.2);
    scene.add(sphere);
    const resize = new ResizeObserver(() => {
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
    resize.observe(element);
    let visible = true,
      frame = 0,
      elapsed = 0,
      previous = 0;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0, y: 0 };
    const move = (e) => {
      pointer.x = (e.clientX / innerWidth - 0.5) * 0.18;
      pointer.y = (e.clientY / innerHeight - 0.5) * 0.12;
    };
    window.addEventListener("pointermove", move, { passive: true });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(element);
    function render(now) {
      frame = requestAnimationFrame(render);
      const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;
      if (!visible || document.hidden) return;
      if (!media.matches) {
        elapsed += delta;
        material.uniforms.uTime.value = elapsed;
        sphere.rotation.y += delta * 0.075;
        sphere.rotation.x += (0.12 + pointer.y - sphere.rotation.x) * 0.025;
        sphere.position.x += (pointer.x - sphere.position.x) * 0.025;
      }
      renderer.render(scene, camera);
      element.classList.add("is-rendered");
    }
    frame = requestAnimationFrame(render);
    const contextLost = (e) => {
      e.preventDefault();
      element.classList.remove("is-rendered");
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return (
    <div className="sphere-host" ref={host} aria-hidden="true">
      <div className="sphere-fallback" />
    </div>
  );
}
