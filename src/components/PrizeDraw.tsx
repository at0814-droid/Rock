import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PrizeDrawProps {
  names: string[];
}

export default function PrizeDraw({ names }: PrizeDrawProps) {
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [drawnNames, setDrawnNames] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState<string>('Ready to Draw!');
  const [winner, setWinner] = useState<string | null>(null);
  
  const drawIntervalRef = useRef<number | null>(null);

  // Reset when names list changes
  useEffect(() => {
    setDrawnNames([]);
    setWinner(null);
    setCurrentDisplay('Ready to Draw!');
  }, [names]);

  const availableNames = allowRepeat 
    ? names 
    : names.filter(name => !drawnNames.includes(name));

  const startDraw = () => {
    if (availableNames.length === 0) {
      alert('No more names available to draw!');
      return;
    }

    setIsDrawing(true);
    setWinner(null);
    
    let ticks = 0;
    const maxTicks = 30; // Number of flashes before stopping
    const speed = 50; // ms per flash

    drawIntervalRef.current = window.setInterval(() => {
      const randomIdx = Math.floor(Math.random() * availableNames.length);
      setCurrentDisplay(availableNames[randomIdx]);
      ticks++;

      if (ticks >= maxTicks) {
        stopDraw();
      }
    }, speed);
  };

  const stopDraw = () => {
    if (drawIntervalRef.current) {
      clearInterval(drawIntervalRef.current);
      drawIntervalRef.current = null;
    }

    // Need to recalculate available names in case state is stale in the closure, 
    // but here we can just use the latest availableNames from the render scope
    // since we're not inside a useEffect.
    const finalWinnerIdx = Math.floor(Math.random() * availableNames.length);
    const finalWinner = availableNames[finalWinnerIdx];
    
    setWinner(finalWinner);
    setCurrentDisplay(finalWinner);
    setDrawnNames(prev => [...prev, finalWinner]);
    setIsDrawing(false);

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
    });
  };

  const resetDraw = () => {
    setDrawnNames([]);
    setWinner(null);
    setCurrentDisplay('Ready to Draw!');
  };

  return (
    <div className="space-y-8">
      {/* Settings Panel */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Settings2 className="w-5 h-5 text-gray-400" />
          Draw Settings
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm text-gray-600">Allow Repeat Winners</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={allowRepeat}
              onChange={(e) => setAllowRepeat(e.target.checked)}
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${allowRepeat ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${allowRepeat ? 'transform translate-x-4' : ''}`}></div>
          </div>
        </label>
      </div>

      {/* Main Draw Area */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <Trophy className={`w-16 h-16 mx-auto mb-6 ${winner ? 'text-yellow-400' : 'text-gray-300'} transition-colors duration-500`} />
        
        <div className="h-32 flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDisplay}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: winner ? 1.2 : 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: isDrawing ? 0.05 : 0.4 }}
              className={`text-4xl md:text-6xl font-bold ${winner ? 'text-blue-600' : 'text-gray-800'}`}
            >
              {currentDisplay}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={startDraw}
            disabled={isDrawing || availableNames.length === 0}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
          >
            {isDrawing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Drawing...
              </>
            ) : (
              'Draw Winner'
            )}
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          {availableNames.length} names available in pool
        </div>
      </div>

      {/* History */}
      {drawnNames.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Winners History</h3>
            <button 
              onClick={resetDraw}
              className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
            >
              Reset History
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {drawnNames.map((name, idx) => (
              <div 
                key={idx} 
                className="px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg font-medium flex items-center gap-2"
              >
                <span className="w-6 h-6 bg-yellow-200 text-yellow-800 rounded-full flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
                {name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
