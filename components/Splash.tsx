
import React, { useEffect, useState } from 'react';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 2000),
      setTimeout(() => onComplete(), 5000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#21274E] flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Tech Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Logos Container - 2 Circles joining to form an '8' shape without overlap */}
      <div className="flex flex-col items-center space-y-0 mb-6 sm:mb-12 relative z-10">
        
        {/* Circle 1: Windmar Home (Top) */}
        <div className={`transition-all duration-1000 transform ${step >= 1 ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-20 opacity-0 scale-90'}`}>
          <div className="relative">
            {/* Glow and Rings */}
            <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full animate-pulse"></div>
            <div className="bg-white/5 backdrop-blur-2xl p-4 sm:p-6 rounded-full shadow-[0_0_60px_rgba(255,255,255,0.05)] w-32 h-32 sm:w-48 sm:h-48 flex items-center justify-center border border-white/20 relative overflow-hidden">
              <img
                src="https://i.postimg.cc/44pJ0vXw/logo.png"
                alt="Windmar Home"
                className="w-20 h-20 sm:w-32 sm:h-32 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(248,155,36,0.3)]"
              />
              {/* Tech accents */}
              <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
            </div>
          </div>
        </div>

        {/* Circle 2: LUMA Energy (Bottom) */}
        <div className={`transition-all duration-1200 transform ${step >= 1 ? 'translate-y-0 opacity-100 scale-90 rotate-0' : 'translate-y-20 opacity-0 scale-50 rotate-180'}`}>
          <div className="relative">
            {/* Intense Glow Layers */}
            <div className="absolute inset-0 bg-[#F89B24] rounded-full blur-[40px] opacity-10 animate-pulse"></div>
            <div className="absolute inset-0 bg-[#1D429B] rounded-full blur-[30px] opacity-20 animate-ping"></div>
            
            <div className="bg-white/10 backdrop-blur-2xl p-2 sm:p-3 rounded-full shadow-[0_0_80px_rgba(248,155,36,0.15)] w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center relative overflow-hidden border border-white/30">
              <img
                src="https://lumapr.com/wp-content/uploads/2021/01/Luma-Blue-1.png"
                alt="LUMA Energy"
                className="w-10 h-10 sm:w-16 sm:h-16 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] brightness-0 invert"
              />
              {/* Rotating Tech Ring */}
              <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`transition-all duration-800 delay-500 text-center transform ${step >= 1 ? '-translate-y-4 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="flex items-center justify-center mb-8">
          <img 
            src="https://lumapr.com/wp-content/uploads/2021/01/Luma-Blue-1.png" 
            alt="LUMA" 
            className="h-12 sm:h-16 mr-2 brightness-0 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          />
          <h1 className="text-[32px] sm:text-[47.5px] md:text-[63.5px] font-black tracking-tighter text-[#F89B24] leading-none">
            SCANNER
          </h1>
        </div>
        
        {/* Loading Bar Section - Centered and Enlarged */}
        <div className="w-full max-w-[320px] sm:max-w-[400px] mx-auto space-y-4 px-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black text-[#A6C3E6] uppercase tracking-[0.3em] animate-pulse">
              Iniciando LUMA Scanner
            </span>
            <span className="text-[10px] font-mono text-[#A6C3E6]">
              {step >= 2 ? '100%' : 'Cargando...'}
            </span>
          </div>
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div className={`h-full transition-all duration-[4000ms] ease-out ${step >= 1 ? 'w-full' : 'w-0'} bg-gradient-to-r from-[#F89B24] via-[#FBBF24] to-[#1D429B] animate-[gradient_3s_linear_infinite] bg-[length:200%_auto]`}></div>
          </div>
        </div>
      </div>

      <div className={`absolute bottom-12 transition-all duration-700 delay-500 flex flex-col items-center ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-[#A6C3E6] uppercase tracking-[0.6em] font-black text-[10px]">Sistemas de Energía Inteligente</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />

      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
    </div>
  );
};
