"use client"

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw, Maximize2, ZoomIn, ZoomOut, Grid3x3 } from 'lucide-react'
import { StyleConfig } from '@/lib/style-config-types'
import * as THREE from 'three'

interface Window3DPreviewProps {
  config: StyleConfig
  windowData?: {
    width: number
    height: number
    sashes?: any[]
  }
}

// 窗框组件
function WindowFrame({ 
  width, 
  height, 
  depth = 0.08,
  color 
}: { 
  width: number
  height: number
  depth?: number
  color: string 
}) {
  const frameThickness = 0.08
  
  // 转换颜色名称为hex
  const getColorHex = (colorName: string) => {
    const colorMap: Record<string, string> = {
      'white': '#FFFFFF',
      'black': '#1A1A1A',
      'gray': '#9CA3AF',
      'champagne': '#F4E4C1',
      'wood-grain': '#8B4513',
      'silver': '#C0C0C0',
    }
    return colorMap[colorName] || '#FFFFFF'
  }

  return (
    <group>
      {/* 上框 */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, frameThickness, depth]} />
        <meshStandardMaterial color={getColorHex(color)} />
      </mesh>
      
      {/* 下框 */}
      <mesh position={[0, -height / 2, 0]}>
        <boxGeometry args={[width, frameThickness, depth]} />
        <meshStandardMaterial color={getColorHex(color)} />
      </mesh>
      
      {/* 左框 */}
      <mesh position={[-width / 2, 0, 0]}>
        <boxGeometry args={[frameThickness, height, depth]} />
        <meshStandardMaterial color={getColorHex(color)} />
      </mesh>
      
      {/* 右框 */}
      <mesh position={[width / 2, 0, 0]}>
        <boxGeometry args={[frameThickness, height, depth]} />
        <meshStandardMaterial color={getColorHex(color)} />
      </mesh>
    </group>
  )
}

// 玻璃组件
function Glass({ 
  width, 
  height, 
  transparency,
  position = [0, 0, 0]
}: { 
  width: number
  height: number
  transparency: number
  position?: [number, number, number]
}) {
  return (
    <mesh position={position}>
      <planeGeometry args={[width, height]} />
      <meshPhysicalMaterial
        color="#87CEEB"
        transparent
        opacity={transparency / 100 * 0.3 + 0.1}
        roughness={0.1}
        metalness={0.1}
        reflectivity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// 中梃组件
function Mullion({ 
  isVertical, 
  length, 
  position 
}: { 
  isVertical: boolean
  length: number
  position: [number, number, number]
}) {
  const thickness = 0.05
  
  return (
    <mesh position={position}>
      <boxGeometry 
        args={isVertical ? [thickness, length, 0.08] : [length, thickness, 0.08]} 
      />
      <meshStandardMaterial color="#9CA3AF" />
    </mesh>
  )
}

// 执手组件
function Handle({ 
  position,
  color 
}: { 
  position: [number, number, number]
  color: string 
}) {
  const getColorHex = (colorName: string) => {
    const colorMap: Record<string, string> = {
      'silver': '#C0C0C0',
      'black': '#1A1A1A',
      'white': '#FFFFFF',
      'gold': '#FFD700',
      'bronze': '#CD7F32',
      'champagne': '#F4E4C1',
    }
    return colorMap[colorName] || '#C0C0C0'
  }

  return (
    <group position={position}>
      {/* 执手主体 */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.15, 16]} />
        <meshStandardMaterial color={getColorHex(color)} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* 执手座 */}
      <mesh position={[0, 0, 0.02]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
        <meshStandardMaterial color={getColorHex(color)} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

// 完整窗户模型
function WindowModel({ config, windowData }: { config: StyleConfig, windowData: any }) {
  const groupRef = useRef<THREE.Group>(null)
  
  const width = (windowData?.width || 1500) / 1000 // 转换为米
  const height = (windowData?.height || 1500) / 1000
  
  const materialColor = config.unified?.material.outdoor.color || 'white'
  const glassTransparency = config.unified?.glass.transparency || 75
  const handleColor = config.unified?.handle.color || 'silver'
  
  return (
    <group ref={groupRef}>
      {/* 窗框 */}
      <WindowFrame width={width} height={height} color={materialColor} />
      
      {/* 玻璃 */}
      <Glass width={width - 0.16} height={height - 0.16} transparency={glassTransparency} />
      
      {/* 中梃（示例：一个竖梃） */}
      <Mullion isVertical={true} length={height - 0.16} position={[0, 0, 0]} />
      
      {/* 执手（左侧扇） */}
      <Handle position={[-width / 4, 0, 0.05]} color={handleColor} />
      
      {/* 执手（右侧扇） */}
      <Handle position={[width / 4, 0, 0.05]} color={handleColor} />
    </group>
  )
}

export function Window3DPreview({ config, windowData }: Window3DPreviewProps) {
  const [zoom, setZoom] = useState(100)
  const [wireframe, setWireframe] = useState(false)
  const controlsRef = useRef<any>(null)

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50))
  }

  const handleResetView = () => {
    setZoom(100)
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <div className="w-full h-full bg-gradient-to-b from-sky-100 to-white rounded-lg overflow-hidden">
        <Canvas shadows>
          {/* 相机 */}
          <PerspectiveCamera 
            makeDefault 
            position={[3, 2, 3]} 
            fov={50}
            zoom={zoom / 100}
          />
          
          {/* 灯光 */}
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={0.8} 
            castShadow 
          />
          <directionalLight 
            position={[-10, 5, -5]} 
            intensity={0.3} 
          />
          
          {/* 窗户模型 */}
          <WindowModel config={config} windowData={windowData} />
          
          {/* 控制器 */}
          <OrbitControls 
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
          />
          
          {/* 网格辅助线 */}
          <gridHelper args={[5, 10, '#cccccc', '#e0e0e0']} position={[0, -1, 0]} />
        </Canvas>
      </div>

      {/* 控制面板 */}
      <div className="absolute bottom-4 left-4 right-4">
        <Card className="p-2 sm:p-3 bg-white/95 backdrop-blur">
          <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4">
            {/* 视角控制 */}
            <Button variant="outline" size="sm" onClick={handleResetView} className="h-8">
              <Maximize2 className="w-4 h-4" />
              <span className="ml-1 hidden sm:inline">重置</span>
            </Button>
            
            {/* 缩放控制 */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut} className="h-8">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs sm:text-sm font-medium min-w-[50px] text-center">
                {zoom}%
              </span>
              <Button variant="outline" size="sm" onClick={handleZoomIn} className="h-8">
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            
            {/* 显示模式 */}
            <Button 
              variant={wireframe ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setWireframe(!wireframe)}
              className="h-8"
            >
              <Grid3x3 className="w-4 h-4" />
              <span className="ml-1 hidden sm:inline">线框</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* 提示信息 */}
      <div className="absolute top-4 left-4 hidden sm:block">
        <Card className="p-2 px-3 bg-white/90 backdrop-blur text-xs text-muted-foreground">
          拖拽旋转 | 滚轮缩放
        </Card>
      </div>
    </div>
  )
}

