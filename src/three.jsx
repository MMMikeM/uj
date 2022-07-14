import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function Three() {
  const mountRef = useRef(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )

    camera.position.setZ(5)

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    scene.add(cube)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight()
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.outputEncoding = THREE.sRGBEncoding

    mountRef.current.appendChild(renderer.domElement)

    const animate = function () {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }

    animate()

    const onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", onWindowResize, false)
    return () => {
      window.removeEventListener("resize", onWindowResize, false)
      mountRef.current.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="min-h-screen" ref={mountRef} />
}
