
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
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
          <div className="hidden md:block text-right">
            <p className="text-[8px] uppercase tracking-widest text-[#A6C3E6] font-black">Windmar Home Technology</p>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-2 sm:py-3">
        {children}
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 py-4 text-center text-slate-500 text-[10px] sm:text-xs">
        <div className="flex justify-center mb-2">
           <img 
            src="https://i.postimg.cc/44pJ0vXw/logo.png" 
            alt="Windmar Home" 
            className="h-6 grayscale opacity-40 hover:opacity-70 transition-opacity"
           />
        </div>
        <p className="font-semibold">&copy; {new Date().getFullYear()} Windmar Home x SolarCalc.</p>
        <p className="mt-0.5 opacity-75 italic">Transformando techos en fuentes de ahorro para Puerto Rico.</p>
      </footer>
    </div>
  );
};
