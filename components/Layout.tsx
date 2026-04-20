
import React from 'react';
import { Sun, Moon, Zap, Home, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  onToggleDark: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, isDarkMode, onToggleDark }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1215] flex flex-col">
      <header className="bg-[#002E6E] text-white shadow-lg sticky top-0 z-50 border-b-2 border-[#F89B24]">
        <div className="max-w-4xl mx-auto px-4 py-1.5 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Logos Container */}
            <img
              src="https://i.postimg.cc/44pJ0vXw/logo.png"
              alt="Windmar Home"
              className="object-contain h-11 sm:h-[53px]"
            />

            <div className="flex items-center">
              <img
                src="https://lumapr.com/wp-content/uploads/2021/01/Luma-Blue-1.png"
                alt="LUMA Energy"
                className="object-contain h-7 sm:h-9 mr-1.5 brightness-0 invert"
              />
              <h1 className="text-[27.5px] sm:text-[35.5px] font-black tracking-tighter leading-none">
                <span className="text-[#F89B24]">SCANNER</span>
              </h1>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md p-1 pr-3 rounded-full border border-white/15 shadow-sm">
            <motion.button
              onClick={onToggleDark}
              animate={{ rotate: isDarkMode ? 360 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`p-1.5 rounded-full transition-colors duration-500 ${
                isDarkMode
                  ? 'bg-[#F89B24] text-white shadow-[0_0_10px_rgba(248,155,36,0.3)]'
                  : 'bg-white text-[#002E6E] shadow-[0_0_10px_rgba(255,255,255,0.2)]'
              }`}
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </motion.button>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[8px] font-black text-white/60 uppercase tracking-tighter">Tema</span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-[#F89B24]' : 'text-white'}`}>
                {isDarkMode ? 'Oscuro' : 'Claro'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-2 sm:py-3">
        {children}
      </main>

      <footer className="bg-slate-100 dark:bg-[#161b22] border-t border-slate-200 dark:border-white/[0.08] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex gap-4">
              <div className="bg-[#F89B24]/10 p-3 rounded-xl h-fit">
                <Zap className="text-[#F89B24]" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-[#e8eaed] text-sm mb-1">Análisis con IA</h4>
                <p className="text-slate-600 dark:text-[#a0a4ad] text-xs leading-relaxed">Escaneo de facturas LUMA mediante inteligencia artificial de última generación.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-[#1D429B]/10 p-3 rounded-xl h-fit">
                <Sun className="text-[#1D429B]" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-[#e8eaed] text-sm mb-1">Sistema Personalizado</h4>
                <p className="text-slate-600 dark:text-[#a0a4ad] text-xs leading-relaxed">Recomendación solar diseñada según tu consumo real de energía de los últimos meses.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-emerald-600/10 p-3 rounded-xl h-fit">
                <Home className="text-emerald-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-[#e8eaed] text-sm mb-1">Expansión de Sistema</h4>
                <p className="text-slate-600 dark:text-[#a0a4ad] text-xs leading-relaxed">Soluciones para clientes nuevos y para ampliar instalaciones solares existentes.</p>
              </div>
            </div>
          </div>
          <div className="text-center pt-4 border-t border-slate-200 dark:border-white/[0.08]">
            <p className="text-[10px] font-black text-slate-400 dark:text-[#6b7280] uppercase tracking-[0.3em]">
              © 2026 Equipo de Análisis y Desarrollo — Call Center Windmar Home
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
