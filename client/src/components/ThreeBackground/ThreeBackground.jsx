import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   Animated Particles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Particles = ({ count = 2000 }) => {
  const mesh = useRef();

  // Generate random positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, [count]);

  // Animate particles
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.05;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.075;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#6c63ff"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   Floating Sphere
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const FloatingSphere = ({ position, color, size }) => {
  const mesh = useRef();

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.2;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.4}
        wireframe
      />
    </mesh>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   Main Three Background
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ThreeBackground = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#6c63ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6584" />

        <Particles count={1500} />

        <FloatingSphere position={[-3, 0, -2]} color="#6c63ff" size={0.8} />
        <FloatingSphere position={[3, 1, -3]} color="#ff6584" size={0.6} />
        <FloatingSphere position={[0, -2, -2]} color="#43e97b" size={0.5} />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;