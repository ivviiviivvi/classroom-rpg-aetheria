import { useEffect, useRef, useState } from 'react'
import { ConstellationNode, Quest } from '@/lib/types'

interface ConstellationViewProps {
  quests: Quest[]
}

export function ConstellationView({ quests }: ConstellationViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [nodes, setNodes] = useState<ConstellationNode[]>([])

  useEffect(() => {
    const generatedNodes: ConstellationNode[] = quests.map((quest, index) => {
      const angle = (index / quests.length) * Math.PI * 2
      const radius = 150
      const x = 400 + Math.cos(angle) * radius
      const y = 300 + Math.sin(angle) * radius
      
      return {
        id: quest.id,
        questId: quest.id,
        x,
        y,
        status: quest.status === 'completed' ? 'lit' : 'unlit',
        connections: index > 0 ? [quests[index - 1].id] : []
      }
    })

    if (generatedNodes.length > 0) {
      generatedNodes[0].connections = [quests[quests.length - 1].id]
    }

    setNodes(generatedNodes)
  }, [quests])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 2
      nodes.forEach((node) => {
        node.connections.forEach((connId) => {
          const connNode = nodes.find(n => n.questId === connId)
          if (connNode) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(connNode.x, connNode.y)
            ctx.stroke()
          }
        })
      })

      nodes.forEach((node) => {
        const isHovered = hoveredNode === node.questId
        const isLit = node.status === 'lit'
        const radius = isHovered ? 12 : 8

        if (isLit) {
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 3)
          gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)')
          gradient.addColorStop(1, 'rgba(255, 215, 0, 0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = isLit ? '#FFD700' : '#555'
        ctx.strokeStyle = isLit ? '#FFF' : '#777'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        if (isLit) {
          for (let i = 0; i < 4; i++) {
            const angle = (Math.PI / 2) * i + Date.now() * 0.001
            const rayLength = 15
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(node.x + Math.cos(angle) * radius, node.y + Math.sin(angle) * radius)
            ctx.lineTo(node.x + Math.cos(angle) * (radius + rayLength), node.y + Math.sin(angle) * (radius + rayLength))
            ctx.stroke()
          }
        }
      })
    }

    const animationFrame = requestAnimationFrame(function animate() {
      draw()
      requestAnimationFrame(animate)
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [nodes, hoveredNode])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    let foundNode: string | null = null
    for (const node of nodes) {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
      if (distance < 12) {
        foundNode = node.questId
        break
      }
    }

    setHoveredNode(foundNode)
  }

  const hoveredQuest = hoveredNode ? quests.find(q => q.id === hoveredNode) : null

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
      />
      {hoveredQuest && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 pointer-events-none">
          <p className="font-semibold">{hoveredQuest.name}</p>
          <p className="text-xs text-muted-foreground">
            {hoveredQuest.status === 'completed' ? 'Completed' : 'Incomplete'} • {hoveredQuest.xpValue} XP
          </p>
        </div>
      )}
    </div>
  )
}
