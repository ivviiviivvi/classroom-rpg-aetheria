import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Text, Line } from '@react-three/drei'
import * as THREE from 'three'
import { Realm, Theme } from '@/lib/types'
import { SafeCanvasWrapper } from './SafeCanvas'

interface UniverseMapProps {
  realms: Realm[]
  theme: Theme
  onRealmClick: (realmId: string) => void
}

interface PlanetProps {
  realm: Realm
  position: [number, number, number]
  onClick: () => void
  theme: Theme
}

function Planet({ realm, position, onClick, theme }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      setHovered(false)
    }
  }, [])

  useFrame((state) => {
    if (!isMountedRef.current) return
    
    try {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.002
        
        const targetScale = hovered ? 1.2 : 1
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
      }
      
      if (groupRef.current) {
        const time = state.clock.getElapsedTime()
        groupRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.1
      }
    } catch (error) {
      return
    }
  })

  const handleClick = (e: any) => {
    if (e) e.stopPropagation()
    if (!isMountedRef.current) return
    onClick()
  }

  const handlePointerOver = (e: any) => {
    if (e) e.stopPropagation()
    if (isMountedRef.current) {
      setHovered(true)
    }
  }

  const handlePointerOut = (e: any) => {
    if (e) e.stopPropagation()
    if (isMountedRef.current) {
      setHovered(false)
    }
  }

  const color = useMemo(() => {
    try {
      return new THREE.Color(realm.color)
    } catch {
      return new THREE.Color(0x4a90e2)
    }
  }, [realm.color])

  return (
    <group ref={groupRef} position={position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.3}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.2}
        />
      </mesh>

      {hovered && (
        <mesh>
          <sphereGeometry args={[1.15, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      <pointLight
        color={color}
        intensity={hovered ? 2 : 1}
        distance={5}
        decay={2}
      />

      <Text
        position={[0, -1.5, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {realm.name}
      </Text>
    </group>
  )
}

function OrbitRing({ radius, color, segments = 128 }: { radius: number; color: string; segments?: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }
    return pts
  }, [radius, segments])
  
  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.3}
    />
  )
}

function Scene({ realms, onRealmClick, theme }: Omit<UniverseMapProps, 'theme'> & { theme: Theme }) {
  const isMountedRef = useRef(true)
  
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const positions: Array<[number, number, number]> = useMemo(() => 
    realms.map((_, index) => {
      const angle = (index / realms.length) * Math.PI * 2
      const radius = 3 + index * 1.5
      return [
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ] as [number, number, number]
    })
  , [realms])

  if (realms.length === 0) {
    return (
      <>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ff8800"
            emissiveIntensity={1}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={2} distance={50} color="#ffd700" />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </>
    )
  }

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ff8800"
          emissiveIntensity={1}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={2} distance={50} color="#ffd700" />

      {realms.map((realm, index) => {
        const radius = Math.sqrt(positions[index][0] ** 2 + positions[index][2] ** 2)
        return (
          <OrbitRing
            key={`orbit-${realm.id}`}
            radius={radius}
            color={realm.color}
          />
        )
      })}

      {realms.map((realm, index) => (
        <Planet
          key={realm.id}
          realm={realm}
          position={positions[index]}
          onClick={() => onRealmClick(realm.id)}
          theme={theme}
        />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={30}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  )
}

export function UniverseMap({ realms, theme, onRealmClick }: UniverseMapProps) {
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)
  const mountedRef = useRef(true)
  const canvasKey = useRef(`canvas-${Date.now()}`)

  useEffect(() => {
    mountedRef.current = true
    canvasKey.current = `canvas-${Date.now()}`
    setHasError(false)
    
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setIsReady(true)
      }
    }, 100)
    
    return () => {
      mountedRef.current = false
      setIsReady(false)
      clearTimeout(timer)
    }
  }, [])

  if (hasError) {
    return (
      <div className="w-full h-full relative flex items-center justify-center">
        <div className="glass-panel p-8 text-center space-y-4">
          <p className="text-muted-foreground">Unable to load 3D universe</p>
          <button 
            onClick={() => {
              mountedRef.current = true
              canvasKey.current = `canvas-${Date.now()}`
              setHasError(false)
              setIsReady(false)
              setTimeout(() => {
                if (mountedRef.current) {
                  setIsReady(true)
                }
              }, 100)
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!isReady) {
    return (
      <div className="w-full h-full relative flex items-center justify-center">
        <div className="text-muted-foreground">Loading universe...</div>
      </div>
    )
  }

  return (
    <SafeCanvasWrapper>
      <div className="w-full h-full relative">
        <Canvas
          key={canvasKey.current}
          camera={{ position: [0, 8, 15], fov: 60 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false
          }}
          frameloop="always"
          dpr={[1, 2]}
          onCreated={(state) => {
            try {
              if (mountedRef.current) {
                state.gl.setClearColor(0x000000, 0)
              }
            } catch (error) {
              console.error('Error setting up Canvas:', error)
            }
          }}
          onError={(error) => {
            console.error('Canvas error:', error)
            setHasError(true)
          }}
        >
          <Scene realms={realms} onRealmClick={onRealmClick} theme={theme} />
        </Canvas>
        
        <div className="absolute bottom-8 right-8 glass-panel px-4 py-2 text-xs text-muted-foreground pointer-events-none">
          Drag to rotate • Scroll to zoom • Click planets to explore
        </div>
      </div>
    </SafeCanvasWrapper>
  )
}
