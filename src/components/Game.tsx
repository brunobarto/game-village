import React, { useEffect, useState, useRef } from 'react'
import { GameEngine } from '../game/Engine'
import { GameUI } from './GameUI'
export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [poiText, setPoiText] = useState<string | null>(null)
  const engineRef = useRef<GameEngine | null>(null)
  useEffect(() => {
    if (!canvasRef.current) return
    // Initialize Engine
    engineRef.current = new GameEngine(canvasRef.current, (text) => {
      setPoiText(text)
    })
    return () => {
      if (engineRef.current) {
        engineRef.current.cleanup()
      }
    }
  }, [])
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block w-full h-full outline-none"
        tabIndex={0} // Make canvas focusable for keyboard events
        onClick={(e) => e.currentTarget.focus()} // Focus on click
      />
      <GameUI poiText={poiText} />

      {/* Click to start overlay (ensures focus) */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-pixel z-50 cursor-pointer transition-opacity duration-500"
        onClick={(e) => {
          e.currentTarget.style.opacity = '0'
          e.currentTarget.style.pointerEvents = 'none'
          canvasRef.current?.focus()
        }}
      >
        <div className="bg-gb-dark border-4 border-gb-light p-6 text-center animate-pulse">
          CLICK TO START
        </div>
      </div>
    </div>
  )
}
