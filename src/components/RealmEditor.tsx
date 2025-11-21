import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Realm, Theme } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FloppyDisk, X, ArrowsOutCardinal } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface RealmEditorProps {
  realms: Realm[]
  theme: Theme
  onUpdateRealms: (realms: Realm[]) => void
  onClose: () => void
}

export function RealmEditor({ realms, theme, onUpdateRealms, onClose }: RealmEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const meshesRef = useRef<Map<string, THREE.Mesh>>(new Map())
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2())
  const planeRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0))
  
  const [selectedRealm, setSelectedRealm] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [positions, setPositions] = useState<Map<string, { x: number; y: number; z: number }>>(
    new Map(realms.map(r => [r.id, r.position || { x: 0, y: 0, z: 0 }]))
  )

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
    camera.position.z = 8
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222)
    gridHelper.rotation.x = Math.PI / 2
    scene.add(gridHelper)

    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

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

    realms.forEach((realm, index) => {
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
      
      const position = realm.position || {
        x: Math.cos((index / realms.length) * Math.PI * 2) * 3,
        y: Math.sin((index / realms.length) * Math.PI * 2) * 3,
        z: 0
      }
      
      mesh.position.set(position.x, position.y, position.z)
      mesh.userData = { realmId: realm.id, isDraggable: true }
      scene.add(mesh)
      meshesRef.current.set(realm.id, mesh)

      const edges = new THREE.EdgesGeometry(geometry)
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: new THREE.Color(realm.color),
        transparent: true,
        opacity: 0.6
      })
      const wireframe = new THREE.LineSegments(edges, lineMaterial)
      wireframe.position.copy(mesh.position)
      mesh.add(wireframe)
    })

    const starGeometry = new THREE.BufferGeometry()
    const starVertices: number[] = []
    for (let i = 0; i < 500; i++) {
      const x = (Math.random() - 0.5) * 100
      const y = (Math.random() - 0.5) * 100
      const z = (Math.random() - 0.5) * 100 - 50
      starVertices.push(x, y, z)
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, opacity: 0.5, transparent: true })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    const animate = () => {
      requestAnimationFrame(animate)

      meshesRef.current.forEach((mesh, realmId) => {
        mesh.rotation.y += 0.005
        mesh.rotation.x += 0.003

        if (realmId === selectedRealm) {
          mesh.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1)
          ;(mesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.8
        } else {
          mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
          ;(mesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.3
        }
      })

      stars.rotation.y += 0.0001

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
      const camera = cameraRef.current
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      renderer.dispose()
      meshesRef.current.clear()
    }
  }, [realms, theme, selectedRealm])

  const updateMeshPosition = (realmId: string, x: number, y: number, z: number) => {
    const mesh = meshesRef.current.get(realmId)
    if (mesh) {
      mesh.position.set(x, y, z)
    }
    setPositions(prev => new Map(prev).set(realmId, { x, y, z }))
  }

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cameraRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
    const intersects = raycasterRef.current.intersectObjects(Array.from(meshesRef.current.values()))

    if (intersects.length > 0) {
      const intersectedMesh = intersects[0].object as THREE.Mesh
      const realmId = intersectedMesh.userData.realmId
      setSelectedRealm(realmId)
      setIsDragging(true)
    }
  }

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !selectedRealm || !containerRef.current || !cameraRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
    
    const intersectionPoint = new THREE.Vector3()
    raycasterRef.current.ray.intersectPlane(planeRef.current, intersectionPoint)

    if (intersectionPoint) {
      updateMeshPosition(selectedRealm, intersectionPoint.x, intersectionPoint.y, 0)
    }
  }

  const onMouseUp = () => {
    setIsDragging(false)
  }

  const handlePositionChange = (realmId: string, axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0
    const currentPos = positions.get(realmId) || { x: 0, y: 0, z: 0 }
    const newPos = { ...currentPos, [axis]: numValue }
    updateMeshPosition(realmId, newPos.x, newPos.y, newPos.z)
  }

  const handleSave = () => {
    const updatedRealms = realms.map(realm => ({
      ...realm,
      position: positions.get(realm.id) || realm.position || { x: 0, y: 0, z: 0 }
    }))
    onUpdateRealms(updatedRealms)
    toast.success('Realm positions saved!')
    onClose()
  }

  const handleReset = () => {
    realms.forEach((realm, index) => {
      const defaultPosition = {
        x: Math.cos((index / realms.length) * Math.PI * 2) * 3,
        y: Math.sin((index / realms.length) * Math.PI * 2) * 3,
        z: 0
      }
      updateMeshPosition(realm.id, defaultPosition.x, defaultPosition.y, defaultPosition.z)
    })
    toast.success('Positions reset to circle layout')
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border glass-panel">
          <div>
            <h2 className="text-2xl font-bold">Realm Position Editor</h2>
            <p className="text-sm text-muted-foreground">Drag realms to reposition or enter coordinates manually</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <ArrowsOutCardinal size={18} className="mr-2" />
              Reset Layout
            </Button>
            <Button onClick={handleSave}>
              <FloppyDisk size={18} className="mr-2" />
              Save Changes
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={24} />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex gap-4 p-4 overflow-hidden">
          <div 
            ref={containerRef} 
            className="flex-1 glass-panel rounded-xl overflow-hidden cursor-move"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          />

          <Card className="w-80 p-4 overflow-y-auto glass-panel">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ArrowsOutCardinal size={20} />
              Realm Positions
            </h3>
            <div className="space-y-4">
              {realms.map((realm) => {
                const pos = positions.get(realm.id) || realm.position || { x: 0, y: 0, z: 0 }
                const isSelected = selectedRealm === realm.id
                
                return (
                  <div
                    key={realm.id}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border bg-card/50'
                    }`}
                    onClick={() => setSelectedRealm(realm.id)}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: realm.color }}
                      />
                      <p className="font-medium text-sm">{realm.name}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs">X</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={pos.x.toFixed(2)}
                            onChange={(e) => handlePositionChange(realm.id, 'x', e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Y</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={pos.y.toFixed(2)}
                            onChange={(e) => handlePositionChange(realm.id, 'y', e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Z</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={pos.z.toFixed(2)}
                            onChange={(e) => handlePositionChange(realm.id, 'z', e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
