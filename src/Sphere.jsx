import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  uniform float uBloom;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorld;
  float wave(vec3 p) {
    float t = uTime * .58;
    float a = sin(p.x*3.1+t) * cos(p.y*2.8-t*.7) * sin(p.z*2.6+t*.6);
    float b = sin(p.x*6.2-t*.5) * sin(p.y*5.1+t*.8) * cos(p.z*5.8+t);
    float c = sin(p.x*10.5+p.y*3.4+t) * cos(p.z*9.2-p.y*4.3-t*.6);
    // A wave travels from the front-facing core around the curved shell.
    float angle = acos(clamp(p.z, -1., 1.));
    float front = uBloom * 4.2;
    float pressure = exp(-pow((angle-front)*2.7, 2.));
    float envelope = sin(uBloom*3.14159265);
    float folds = sin(angle*12.-uBloom*21. + p.x*3.) * pressure;
    return a*.18 + b*.064 + c*.02 + envelope*(folds*.19 + pressure*.15);
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
  uniform float uBloom;
  uniform float uReveal;
  uniform float uOpeningExtent;
  uniform vec2 uResolution;
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
    float core = pow(max(n.z, 0.), 5.);
    color += core * sin(uBloom*3.14159265) * vec3(.11,.35,.29);
    color = pow(color, vec3(.85));
    // The shell unfolds from within, opening a liquid iris onto the next scene.
    vec2 uv = gl_FragCoord.xy / uResolution - .5;
    float radius = length(uv);
    float angle = atan(uv.y, uv.x);
    float opening = uReveal*uOpeningExtent;
    float rim = radius + sin(angle*5. + uReveal*4.)*.018*sin(uReveal*3.14159265);
    float alpha = uReveal > 0. ? smoothstep(opening-.018, opening+.018, rim) : 1.;
    float lip = exp(-pow((rim-opening)*70., 2.))*sin(uReveal*3.14159265);
    color += lip*vec3(.14,.4,.33);
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function Sphere({ expansion }) {
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
      uniforms: {
        uTime: { value: 0 },
        uBloom: { value: 0 },
        uReveal: { value: 0 },
        uOpeningExtent: { value: 0.32 },
        uResolution: { value: new THREE.Vector2(1, 1) },
      },
      transparent: true,
    });
    const geometry = new THREE.SphereGeometry(1, 192, 128);
    const sphere = new THREE.Mesh(geometry, material);
    sphere.rotation.set(0.12, 0, -0.2);
    scene.add(sphere);
    const resize = new ResizeObserver(() => {
      const width = element.clientWidth,
        height = element.clientHeight;
      renderer.setSize(width, height);
      renderer.getDrawingBufferSize(material.uniforms.uResolution.value);
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
        sphere.rotation.y += delta * 0.14;
        sphere.rotation.x +=
          (0.12 +
            Math.sin(elapsed * 0.65) * 0.075 +
            pointer.y -
            sphere.rotation.x) *
          0.035;
        sphere.rotation.z = -0.2 + Math.sin(elapsed * 0.48) * 0.065;
        sphere.position.x += (pointer.x - sphere.position.x) * 0.025;
        sphere.position.y = Math.sin(elapsed * 0.9) * 0.025;
        sphere.scale.setScalar(1 + Math.sin(elapsed * 1.3) * 0.024);
        const transition = expansion?.current;
        material.uniforms.uBloom.value = transition?.bloom ?? 0;
        material.uniforms.uOpeningExtent.value =
          transition?.openingExtent ?? 0.32;
        material.uniforms.uReveal.value = transition?.reveal ?? 0;
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
  }, [expansion]);
  return (
    <div className="sphere-host" ref={host} aria-hidden="true">
      <div className="sphere-fallback" />
    </div>
  );
}
