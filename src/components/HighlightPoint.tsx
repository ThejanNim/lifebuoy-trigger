export const HighlightPoint = ({ position, visible }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current && visible) {
      const time = state.clock.getElapsedTime();
      meshRef.current.material.opacity = 0.6 + 0.4 * Math.sin(time * 4);
      meshRef.current.scale.setScalar(1 + 0.3 * Math.sin(time * 3));
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.8, 16, 16]} />
      <meshBasicMaterial color="#ffffffff" transparent opacity={0.8} />
    </mesh>
  );
};