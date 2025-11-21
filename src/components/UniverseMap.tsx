import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Stars, Text, Line } from '@react-three/drei'
import * as THREE from 'three'
import { Realm, Theme } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
      
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1)
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    }
    
    if (groupRef.current) {
      const time = state.clock.getElapsedTime()
      groupRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.1
    }
  })

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => {
      onClick()
    }, 300)
  }

  const color = new THREE.Color(realm.color)

  return (
    <group ref={groupRef} position={position}>
      <Sphere
        ref={meshRef}
        args={[1, 32, 32]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.3}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.2}
        />
      </Sphere>

      {hovered && (
        <Sphere args={[1.15, 32, 32]}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </Sphere>
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
  const positions: Array<[number, number, number]> = realms.map((_, index) => {
    const angle = (index / realms.length) * Math.PI * 2
    const radius = 3 + index * 1.5
    return [
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 2,
      Math.sin(angle) * radius
    ]
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ff8800"
          emissiveIntensity={1}
          roughness={0.5}
          metalness={0.3}
        />
      </Sphere>
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

  useEffect(() => {
    setIsReady(true)
    return () => {
      setIsReady(false)
    }
  }, [])

  if (!isReady) {
    return (
      <div className="w-full h-full relative flex items-center justify-center">
        <div className="text-muted-foreground">Loading universe...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 8, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        frameloop="always"
        dpr={[1, 2]}
      >
        <Scene realms={realms} onRealmClick={onRealmClick} theme={theme} />
      </Canvas>
      
      <div className="absolute bottom-8 right-8 glass-panel px-4 py-2 text-xs text-muted-foreground pointer-events-none">
        Drag to rotate • Scroll to zoom • Click planets to explore
      </div>
    </div>
  )
}
