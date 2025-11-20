import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Realm } from '@/lib/types'
import { Theme } from '@/lib/types'

interface RealmMapProps {
  realms: Realm[]
  theme: Theme
  onRealmClick: (realmId: string) => void
}

export function RealmMap({ realms, theme, onRealmClick }: RealmMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const meshesRef = useRef<Map<string, THREE.Mesh>>(new Map())
  const [hoveredRealm, setHoveredRealm] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    const createGeometry = (type: string) => {
      switch (type) {
        case 'octahedron':
          return new THREE.OctahedronGeometry(0.5)
        case 'icosahedron':
          return new THREE.IcosahedronGeometry(0.5)
        case 'dodecahedron':
          return new THREE.DodecahedronGeometry(0.5)
        default:
          return new THREE.SphereGeometry(0.5, 32, 32)
      }
    }

    const geometryType = theme === 'fantasy' ? 'octahedron' : 
                         theme === 'scifi' ? 'icosahedron' :
                         theme === 'medieval' ? 'dodecahedron' : 'sphere'

    realms.forEach((realm) => {
      const geometry = createGeometry(geometryType)
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(realm.color),
        emissive: new THREE.Color(realm.color),
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8,
        shininess: 100
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(realm.position.x, realm.position.y, realm.position.z)
      mesh.userData = { realmId: realm.id }
      scene.add(mesh)
      meshesRef.current.set(realm.id, mesh)

      const edges = new THREE.EdgesGeometry(geometry)
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: new THREE.Color(realm.color),
        transparent: true,
        opacity: 0.5
      })
      const wireframe = new THREE.LineSegments(edges, lineMaterial)
      wireframe.position.copy(mesh.position)
      wireframe.userData = { realmId: realm.id }
      scene.add(wireframe)
    })

    const starGeometry = new THREE.BufferGeometry()
    const starVertices: number[] = []
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 100
      const y = (Math.random() - 0.5) * 100
      const z = (Math.random() - 0.5) * 100
      starVertices.push(x, y, z)
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(Array.from(meshesRef.current.values()))

      if (intersects.length > 0) {
        const intersectedMesh = intersects[0].object as THREE.Mesh
        const realmId = intersectedMesh.userData.realmId
        setHoveredRealm(realmId)
        document.body.style.cursor = 'pointer'
      } else {
        setHoveredRealm(null)
        document.body.style.cursor = 'default'
      }

      camera.position.x = mouse.x * 0.5
      camera.position.y = mouse.y * 0.5
      camera.lookAt(0, 0, 0)
    }

    const onClick = (event: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(Array.from(meshesRef.current.values()))

      if (intersects.length > 0) {
        const intersectedMesh = intersects[0].object as THREE.Mesh
        const realmId = intersectedMesh.userData.realmId
        onRealmClick(realmId)
      }
    }

    containerRef.current.addEventListener('mousemove', onMouseMove)
    containerRef.current.addEventListener('click', onClick)

    const animate = () => {
      requestAnimationFrame(animate)

      meshesRef.current.forEach((mesh, realmId) => {
        mesh.rotation.y += 0.005
        mesh.rotation.x += 0.003

        if (realmId === hoveredRealm) {
          mesh.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1)
          ;(mesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.6
        } else {
          mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
          ;(mesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.3
        }
      })

      stars.rotation.y += 0.0002

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', onMouseMove)
        containerRef.current.removeEventListener('click', onClick)
        if (rendererRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
      }
      renderer.dispose()
      meshesRef.current.clear()
    }
  }, [realms, theme, hoveredRealm, onRealmClick])

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {hoveredRealm && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 pointer-events-none">
          <p className="text-sm font-medium">
            {realms.find(r => r.id === hoveredRealm)?.name}
          </p>
        </div>
      )}
    </div>
  )
}
