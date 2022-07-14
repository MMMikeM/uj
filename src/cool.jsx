import { Suspense } from "react"
import { useState, useMemo } from "react"
import { useThree, useFrame, Canvas } from "@react-three/fiber"
import { useGLTF, Float, Text, Text3D } from "@react-three/drei"
import {
  LayerMaterial,
  Depth,
  Fresnel,
  Noise,
  Color,
  Gradient,
} from "lamina/vanilla"
import * as THREE from "three"

function Fling() {
  const { viewport, camera } = useThree()

  const { nodes } = useGLTF("/worms-transformed.glb")

  const [geometry] = useState(
    () => nodes[`noodle_${Math.ceil(Math.random() * 4)}`].geometry,
  )
  const [speed] = useState(() => 0.1 + Math.random() / 10)
  const [Rotation] = useState(() => 0.1 + Math.random() * 120)
  const position = useMemo(() => {
    const z = Math.random() * -30
    const bounds = viewport.getCurrentViewport(camera, [0, 0, z])
    return [
      THREE.MathUtils.randFloatSpread(bounds.width),
      THREE.MathUtils.randFloatSpread(bounds.height * 0.75),
      z,
    ]
  }, [viewport])

  const colorA = "#2032A5"
  const colorB = "#0F1C4D"
  const fresnel = "#E7B473"

  const material = new LayerMaterial({
    color: "#0F1C4D",
    layers: [
      new Depth({
        colorA: colorA,
        colorB: "#000000",
        alpha: 0.5,
        mode: "normal",
        near: 0,
        far: 2,
        origin: [1, 1, 1],
      }),
      new Depth({
        colorA: "purple",
        colorB: colorB,
        alpha: 0.5,
        mode: "add",
        near: 3,
        far: 2,
        origin: [1, 1, 1],
      }),
      new Fresnel({
        mode: "add",
        color: fresnel,
        alpha: 0.5,
        intensity: 0.5,
        power: 2.5,
        bias: 0.0,
      }),
      new Noise({
        mapping: "local",
        type: "simplex",
        scale: 750,
        colorA: "#ffaf40",
        colorB: "#808080",
        mode: "overlay",
      }),
    ],
  })

  return (
    <Float
      position={position}
      speed={speed}
      rotationIntensity={Rotation}
      floatIntensity={50}
      dispose={null}
    >
      <mesh scale={5} geometry={geometry} material={material} />
    </Float>
  )
}

const Flings = () => Array.from({ length: 20 }, (_, i) => <Fling key={i} />)

function Caption({ children }) {
  const material = new LayerMaterial({
    color: "#fff",
  })

  return (
    <Text
      font={"/font.ttf"}
      text={children}
      material={material}
      position={[1, -0.65, 0]}
      fontSize={0.65}
      anchorX="center"
      anchorY="middle"
    />
  )
}

function Rig({ v = new THREE.Vector3() }) {
  return useFrame((state) => {
    state.camera.position.lerp(
      v.set(state.mouse.x / 2, -0.1 + state.mouse.y / 5, 10),
      0.05,
    )
  })
}

function Background() {
  const geometry = new THREE.SphereGeometry(1, 20, 20)
  const material = new LayerMaterial({
    side: THREE.DoubleSide,
    layers: [
      new Color({
        color: "#030310",
      }),
      new Gradient({
        colorA: "#f00",
        colorB: "#00f",
        alpha: 0.1,
      }),
      new Gradient({
        colorA: "#fff",
        colorB: "#000",
        alpha: 0.5,
        mapping: "world",
        axes: "y",
        start: 50,
        end: -25,
        mode: "overlay",
      }),
      new Noise({
        mapping: "local",
        type: "simplex",
        scale: 2500,
        colorA: "#388",
        colorB: "#333",
        mode: "screen",
        alpha: 0.025,
      }),
    ],
  })
  return <mesh scale={100} geometry={geometry} material={material} />
}

export default function Cool() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 22 }}>
      <Background />
      <Suspense fallback={null}>
        <Flings />
        <pointLight position={[0, 0, 10]} />
        <Caption>{`ThreeJS\nis\nCool!`}</Caption>
        <Rig />
      </Suspense>
    </Canvas>
  )
}
