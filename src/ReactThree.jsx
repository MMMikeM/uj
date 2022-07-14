import { Canvas, useFrame } from "@react-three/fiber"
import { useRef } from "react"

export default function ReactThree() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Cube />
    </Canvas>
  )
}

function Cube() {
  const cubeRef = useRef()

  useFrame(() => {
    cubeRef.current.rotation.x += 0.01
    cubeRef.current.rotation.y += 0.01
  })

  return (
    <mesh ref={cubeRef}>
      <boxGeometry />
      <meshStandardMaterial color={0x808080} />
    </mesh>
  )
}
