
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Iniciando LUMA SCANNER Engine...",
  "Calibrando sensores de visión IA...",
  "Analizando patrones de consumo...",
  "Calculando irradiación solar (4.5h)...",
  "Optimizando sistema Qcells...",
  "Configurando Tesla Powerwall...",
  "Generando reporte de independencia..."
];

export const LoadingOverlay: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-[#002E6E]/98 backdrop-blur-xl flex flex-col items-center justify-center text-white p-6">
      {/* Tech background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
        {/* Radar Effect - More dynamic */}
        <div className="absolute inset-0 border border-white/10 rounded-full animate-[ping_3s_infinite]"></div>
        <div className="absolute inset-4 border border-white/10 rounded-full animate-[ping_4s_infinite]"></div>
        <div className="absolute inset-8 border border-white/10 rounded-full"></div>
        <div className="absolute inset-16 border border-white/10 rounded-full"></div>
        
        {/* Rotating Scanner - More intense */}
        <div className="absolute inset-0 border-t-4 border-[#F89B24] rounded-full animate-[spin_1.5s_linear_infinite] shadow-[0_0_20px_rgba(248,155,36,0.5)]"></div>
        <div className="absolute inset-2 border-b-2 border-blue-400 rounded-full animate-[spin_3s_linear_infinite_reverse] opacity-30"></div>
        
        <div className="bg-white p-6 rounded-[2rem] shadow-[0_0_50px_rgba(255,255,255,0.2)] w-36 h-36 flex items-center justify-center relative z-10 border-4 border-white/20">
           <img 
            src="https://i.postimg.cc/44pJ0vXw/logo.png" 
            alt="Windmar AI" 
            className="w-full h-full object-contain animate-pulse"
          />
        </div>
      </div>

      <div className="text-center space-y-6 max-w-sm relative z-10">
        <div className="space-y-2">
          <div className="flex items-center justify-center">
            <img 
              src="https://lumapr.com/wp-content/uploads/2021/01/Luma-Blue-1.png" 
              alt="LUMA" 
              className="h-10 sm:h-12 mr-2 brightness-0 invert"
            />
            <h3 className="text-[39.5px] sm:text-[47.5px] font-black tracking-tighter text-[#F89B24] leading-none">SCANNER</h3>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="w-2 h-2 bg-[#F89B24] rounded-full animate-ping"></span>
            <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.5em]">Procesando Datos IA</p>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl">
          <p className="text-blue-200 font-mono text-xs h-4 flex items-center justify-center">
            <span className="text-[#F89B24] mr-2">⚡</span> {MESSAGES[msgIndex]}
          </p>
        </div>
        
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-8 border border-white/5 shadow-inner">
          <div className="h-full bg-gradient-to-r from-[#F89B24] via-yellow-400 to-blue-400 animate-[gradient_2s_linear_infinite] bg-[length:200%_auto] w-full origin-left"></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}} />
    </div>
  );
};
