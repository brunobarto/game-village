import React from 'react'
interface GameUIProps {
  poiText: string | null
}
export function GameUI({ poiText }: GameUIProps) {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 font-pixel text-xs sm:text-sm">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="bg-gb-light border-4 border-gb-dark text-gb-dark px-4 py-3 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
          LAVENDER TOWN
        </div>

        <div className="bg-gb-light border-4 border-gb-dark text-gb-dark px-4 py-3 shadow-[4px_4px_0_rgba(0,0,0,0.5)] text-right hidden sm:block">
          <p>CONTROLS</p>
          <p className="mt-2 text-[10px]">WASD / ARROWS</p>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="flex flex-col items-center mb-4">
        {/* Mobile Controls Hint */}
        <div className="bg-gb-light border-4 border-gb-dark text-gb-dark px-3 py-2 shadow-[4px_4px_0_rgba(0,0,0,0.5)] text-center sm:hidden mb-4 text-[10px]">
          USE WASD / ARROWS TO MOVE
        </div>

        {/* Dialogue Box */}
        {poiText && (
          <div className="w-full max-w-2xl bg-gb-light border-8 border-gb-dark text-gb-dark p-4 shadow-[8px_8px_0_rgba(0,0,0,0.5)] min-h-[100px] flex items-start relative">
            {/* Little arrow indicator */}
            <div className="absolute bottom-2 right-4 animate-bounce">▼</div>
            <p className="leading-loose whitespace-pre-line">{poiText}</p>
          </div>
        )}
      </div>

      {/* Scanlines Overlay (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-50 mix-blend-overlay"></div>
    </div>
  )
}
