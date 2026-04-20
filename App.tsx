
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Scanner } from './components/Scanner';
import { Results } from './components/Results';
import { ManualInput } from './components/ManualInput';
import { Splash } from './components/Splash';
import { LoadingOverlay } from './components/LoadingOverlay';
import { AppState, ConsumptionData, SolarSystemRecommendation } from './types';
import { analyzeBillFile } from './services/geminiService';
import { SOLAR_CONFIG } from './constants';

import { Home, Zap, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type InputMethod = 'SCAN' | 'MANUAL';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try { return localStorage.getItem('wh-theme') === 'dark'; } catch { return false; }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      try { localStorage.setItem('wh-theme', 'dark'); } catch {}
    } else {
      root.classList.remove('dark');
      try { localStorage.setItem('wh-theme', 'light'); } catch {}
    }
  }, [isDarkMode]);
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [inputMethod, setInputMethod] = useState<InputMethod>('SCAN');
  const [isExisting, setIsExisting] = useState<boolean>(false);
  const [existingPanels, setExistingPanels] = useState<string>('0');
  const [existingWattage, setExistingWattage] = useState<string>('330');
  
  const [consumption, setConsumption] = useState<ConsumptionData | null>(null);
  const [recommendation, setRecommendation] = useState<SolarSystemRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const calculateSolar = (data: ConsumptionData): SolarSystemRecommendation => {
    // 1. Determinar el consumo objetivo (kWh/mes)
    const targetKwhPerMonth = Math.max(data.monthlyAverageKwh * SOLAR_CONFIG.defaultOffset, data.highestMonthKwh);
    const dailyKwhGoal = targetKwhPerMonth / 30;
    
    // 2. Determinar la capacidad total requerida en kW DC
    const totalRequiredKw = dailyKwhGoal / (SOLAR_CONFIG.peakSunHours * SOLAR_CONFIG.systemEfficiency);
    
    // 3. Calcular capacidad actual instalada
    const currentInstalledKw = data.isExistingCustomer 
      ? (data.existingPanelCount * data.existingPanelWattage) / 1000 
      : 0;
    
    // 4. Calcular déficit de potencia
    const missingKw = Math.max(0, totalRequiredKw - currentInstalledKw);
    
    // 5. Calcular placas adicionales de 410W necesarias
    const additionalPanelsNeeded = Math.ceil((missingKw * 1000) / SOLAR_CONFIG.panelWattage);
    
    // 6. El sistema final será la suma de lo viejo + lo nuevo
    const finalSystemSizeKw = currentInstalledKw + (additionalPanelsNeeded * SOLAR_CONFIG.panelWattage / 1000);
    const estimatedMonthlyGen = finalSystemSizeKw * SOLAR_CONFIG.peakSunHours * SOLAR_CONFIG.systemEfficiency * 30;
    
    // Recomendación de batería: cubre ~50% del consumo diario (uso nocturno)
    // Powerwall 2/3 = 13.5 kWh cada una — siempre mínimo 1 unidad
    const powerwallCount = Math.max(1, Math.ceil((dailyKwhGoal * 0.5) / 13.5));
    const recommendedBattery = powerwallCount * 13.5;

    return {
      totalPanelCountTarget: data.existingPanelCount + additionalPanelsNeeded,
      additionalPanelsNeeded: additionalPanelsNeeded,
      totalSystemSizeKw: finalSystemSizeKw,
      estimatedMonthlyGeneration: estimatedMonthlyGen,
      offsetPercentage: (estimatedMonthlyGen / (data.monthlyAverageKwh || 1)) * 100,
      batteryRecommendationKwh: recommendedBattery,
      powerwallCount: powerwallCount
    };
  };

  const handleFileUploaded = async (base64: string, mimeType: string) => {
    setState(AppState.ANALYZING);
    setError(null);
    try {
      const data = await analyzeBillFile(base64, mimeType);
      const enhancedData: ConsumptionData = {
        ...data,
        existingPanelCount: parseInt(existingPanels) || 0,
        existingPanelWattage: parseInt(existingWattage) || 330,
        isExistingCustomer: isExisting
      };
      
      const rec = calculateSolar(enhancedData);
      await new Promise(r => setTimeout(r, 2000));
      
      setConsumption(enhancedData);
      setRecommendation(rec);
      setState(AppState.RESULTS);
    } catch (err: unknown) {
      console.error(err);
      const code = err instanceof Error ? err.message : '';
      if (code === 'UNREADABLE_IMAGE') {
        setError('No pudimos leer el archivo. Asegúrate de subir una foto clara del historial de consumo o el PDF oficial de la app de LUMA.');
      } else if (code === 'NO_DATA_FOUND') {
        setError('Encontramos la factura pero no logramos extraer los datos de consumo. Intenta con el PDF oficial de LUMA para mejores resultados.');
      } else {
        setError('Ocurrió un error inesperado. Por favor intenta de nuevo.');
      }
      setState(AppState.ERROR);
    }
  };

  const handleManualSubmit = (values: number[]) => {
    setState(AppState.ANALYZING);
    
    setTimeout(() => {
      const activeValues = values.filter(v => v > 0);
      const average = activeValues.length > 0 
        ? activeValues.reduce((a, b) => a + b, 0) / activeValues.length 
        : 0;
      const max = activeValues.length > 0 ? Math.max(...activeValues) : 0;
      const last = values[values.length - 1] || average;

      const data: ConsumptionData = {
        monthlyAverageKwh: Math.round(average),
        highestMonthKwh: Math.round(max),
        lastMonthKwh: Math.round(last),
        existingPanelCount: parseInt(existingPanels) || 0,
        existingPanelWattage: parseInt(existingWattage) || 330,
        isExistingCustomer: isExisting
      };

      const rec = calculateSolar(data);
      setConsumption(data);
      setRecommendation(rec);
      setState(AppState.RESULTS);
    }, 1500);
  };

  const handleReset = () => {
    setConsumption(null);
    setRecommendation(null);
    setState(AppState.IDLE);
    setError(null);
  };

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <Layout isDarkMode={isDarkMode} onToggleDark={() => setIsDarkMode(!isDarkMode)}>
      {state === AppState.ANALYZING && <LoadingOverlay />}

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-4 px-2">
        {/* Sidebar Left: Configuración */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-[#161b22] p-3 rounded-xl shadow-sm border border-slate-100 dark:border-white/[0.08] sticky top-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-[#6b7280] uppercase tracking-widest">Configuración</h3>
              <div className="lg:hidden">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 text-slate-500">
                  {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </div>

            <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block space-y-3`}>
              <div className="space-y-2">
                <button 
                  onClick={() => { setIsExisting(false); setIsSidebarOpen(false); }}
                  className={`w-full p-2 rounded-lg border-2 transition-all flex items-center gap-3 ${!isExisting ? 'border-[#F89B24] bg-orange-50 text-[#F89B24]' : 'border-slate-50 text-slate-400 hover:border-slate-100'}`}
                >
                  <div className={`p-1.5 rounded-md ${!isExisting ? 'bg-[#F89B24] text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Home size={14} />
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-tighter">Cliente Nuevo</span>
                </button>
                
                <button 
                  onClick={() => { setIsExisting(true); setIsSidebarOpen(false); }}
                  className={`w-full p-2 rounded-lg border-2 transition-all flex items-center gap-3 ${isExisting ? 'border-[#F89B24] bg-orange-50 text-[#F89B24]' : 'border-slate-50 text-slate-400 hover:border-slate-100'}`}
                >
                  <div className={`p-1.5 rounded-md ${isExisting ? 'bg-[#F89B24] text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Zap size={14} />
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-tighter">Expandir Sistema</span>
                </button>
              </div>

              <AnimatePresence>
                {isExisting && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 bg-slate-50 dark:bg-[#0f1215] rounded-lg border border-slate-100 dark:border-white/[0.08] space-y-3 mt-2">
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Placas Actuales</label>
                          <span className="text-[10px] font-black text-[#F89B24] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">{existingPanels}</span>
                        </div>
                        
                        <div className="px-1 mb-3">
                          <input 
                            type="range" 
                            min="0" 
                            max="60" 
                            step="1"
                            value={existingPanels}
                            onChange={(e) => setExistingPanels(e.target.value)}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#F89B24]"
                          />
                          <div className="flex justify-between mt-1 px-0.5">
                            <span className="text-[7px] font-bold text-slate-400">0</span>
                            <span className="text-[7px] font-bold text-slate-400">30</span>
                            <span className="text-[7px] font-bold text-slate-400">60</span>
                          </div>
                        </div>

                        <div className="relative">
                          <input 
                            type="text" 
                            inputMode="numeric"
                            value={existingPanels}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || /^\d+$/.test(val)) {
                                setExistingPanels(val);
                              }
                            }}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-[10px] font-bold outline-none focus:border-[#F89B24] transition-colors text-center"
                            placeholder="Confirmar cantidad..."
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <label className="text-[8px] font-black text-slate-500 uppercase mb-1.5">Potencia Panel (W)</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {['300', '330', '350', '370', '400', '410', '450'].map(watt => (
                            <button
                              key={watt}
                              onClick={() => setExistingWattage(watt)}
                              className={`py-1 rounded text-[9px] font-bold border transition-colors ${existingWattage === watt ? 'bg-[#F89B24] text-white border-[#F89B24]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#F89B24]/30'}`}
                            >
                              {watt}W
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow space-y-2 animate-fade-in">
          {(state === AppState.IDLE || state === AppState.ANALYZING || state === AppState.ERROR) ? (
            <>
              <div className="text-center mb-2">
                <h2 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-[#e8eaed] tracking-tight leading-none">
                  Independencia con <span className="text-[#1D429B] dark:text-blue-400">Windmar Home</span>
                </h2>
                <p className="text-slate-500 dark:text-[#a0a4ad] mt-0.5 text-[10px] sm:text-xs max-w-md mx-auto font-medium">
                  Calcula tu ahorro con precisión IA o ingreso manual.
                </p>
              </div>

              <div className="flex p-0.5 bg-slate-200 rounded-lg mb-2 max-w-[280px] mx-auto">
                <button
                  onClick={() => setInputMethod('SCAN')}
                  className={`flex-1 py-1.5 px-3 rounded-md font-black text-[10px] transition-all ${
                    inputMethod === 'SCAN' ? 'bg-white text-[#1D429B] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Cargar Factura
                </button>
                <button
                  onClick={() => setInputMethod('MANUAL')}
                  className={`flex-1 py-1.5 px-3 rounded-md font-black text-[10px] transition-all ${
                    inputMethod === 'MANUAL' ? 'bg-white text-[#1D429B] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Ingreso Manual
                </button>
              </div>

              {state === AppState.ERROR && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 flex gap-2 items-start">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-red-700 font-medium leading-snug">{error}</p>
                </div>
              )}

              <div className="bg-white dark:bg-[#161b22] rounded-2xl shadow-xl border border-slate-100 dark:border-white/[0.08] overflow-hidden">
                {inputMethod === 'SCAN' ? (
                  <Scanner 
                    onFileUploaded={handleFileUploaded} 
                    isLoading={state === AppState.ANALYZING} 
                  />
                ) : (
                  <ManualInput 
                    onSubmit={handleManualSubmit}
                    isLoading={state === AppState.ANALYZING}
                  />
                )}
              </div>
            </>
          ) : (
            consumption && recommendation && (
              <Results 
                data={consumption} 
                recommendation={recommendation} 
                onReset={handleReset} 
              />
            )
          )}
        </main>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}} />
    </Layout>
  );
};

export default App;
