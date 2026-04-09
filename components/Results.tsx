
import React from 'react';
import { ConsumptionData, SolarSystemRecommendation } from '../types';
import { SOLAR_CONFIG } from '../constants';

interface ResultsProps {
  data: ConsumptionData;
  recommendation: SolarSystemRecommendation;
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ data, recommendation, onReset }) => {
  return (
    <div className="space-y-3 animate-fade-in pb-4">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
        <div className="bg-[#002E6E] px-4 py-2 flex justify-between items-center">
          <h3 className="text-white font-black text-sm uppercase tracking-tight">Resumen de Análisis</h3>
          <button 
            onClick={onReset}
            className="text-[9px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white transition-colors font-black uppercase"
          >
            Nueva Consulta
          </button>
        </div>
        
        <div className="p-3 grid grid-cols-3 gap-2">
          <div className="text-center border-r border-slate-100">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Consumo Promedio</p>
            <p className="text-xl font-black text-slate-800">{data.monthlyAverageKwh} <span className="text-[10px] font-normal text-slate-400">kWh</span></p>
          </div>
          <div className="text-center border-r border-slate-100">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Pico Histórico</p>
            <p className="text-xl font-black text-slate-800">{data.highestMonthKwh} <span className="text-[10px] font-normal text-slate-400">kWh</span></p>
          </div>
          <div className="text-center">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Estado Cliente</p>
            <p className={`text-xs font-black uppercase ${data.isExistingCustomer ? 'text-blue-600' : 'text-green-600'}`}>
              {data.isExistingCustomer ? 'Existente' : 'Nuevo'}
            </p>
            {data.isExistingCustomer && (
              <p className="text-[8px] font-bold text-slate-400">({data.existingPanelCount} placas)</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Main Result Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 border-t-4 border-[#F89B24]">
          <h4 className="text-slate-500 text-[8px] font-black uppercase mb-3 tracking-[0.2em]">Dimensionamiento Sugerido</h4>
          
          <div className="mb-4">
            <div className="flex items-end space-x-2">
              <span className="text-5xl font-black text-[#002E6E] leading-none">
                {data.isExistingCustomer ? recommendation.additionalPanelsNeeded : recommendation.totalPanelCountTarget}
              </span>
              <div className="flex flex-col mb-0.5">
                <span className="text-xs font-black text-slate-400 uppercase leading-none">Placas</span>
                <span className="text-[10px] font-bold text-[#F89B24] uppercase leading-none mt-0.5">
                  {data.isExistingCustomer ? 'Adicionales' : 'Totales'}
                </span>
              </div>
            </div>
            {data.isExistingCustomer && (
              <div className="mt-2 p-1.5 bg-blue-50 rounded border border-blue-100">
                <p className="text-[9px] text-[#002E6E] font-medium text-center">
                  Total final: <strong>{recommendation.totalPanelCountTarget}</strong> placas.
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
              <span className="text-[10px] text-slate-500 font-medium">Módulo</span>
              <div className="flex items-center space-x-1.5 bg-blue-50 px-2 py-1 rounded">
                <span className="text-[10px] font-black text-blue-900 tracking-tighter">Q.PEAK DUO {SOLAR_CONFIG.panelWattage}W</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
              <span className="text-[10px] text-slate-500 font-medium">Capacidad</span>
              <span className="text-[10px] font-bold text-slate-800">{recommendation.totalSystemSizeKw.toFixed(2)} kW DC</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-[10px] text-slate-500 font-medium">Producción</span>
              <span className="text-[10px] font-bold text-green-600">{recommendation.estimatedMonthlyGeneration.toFixed(0)} kWh/mes</span>
            </div>
          </div>
        </div>

        {/* Calculation Logic Box */}
        <div className="bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-800 text-slate-300">
          <h4 className="font-black text-white text-[9px] uppercase tracking-widest mb-3 flex items-center">
            <svg className="w-3 h-3 mr-1.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Metodología Windmar
          </h4>
          
          <div className="space-y-2">
            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
              <p className="text-[8px] font-black text-yellow-400 uppercase mb-0.5">Fórmula de Cálculo</p>
              <p className="text-[10px] leading-tight font-mono">
                Placas = (Consumo Diario / (4.5 HSP * 0.82 Eficiencia)) / Watts Panel
              </p>
            </div>
            
            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
              <p className="text-[8px] font-black text-yellow-400 uppercase mb-0.5">Horas de Sol Pico (HSP)</p>
              <p className="text-[10px] leading-tight">
                Basado en el estándar de <strong>4.5 horas de sol al día</strong> en Puerto Rico para máxima precisión.
              </p>
            </div>

            <div className={`p-2 rounded-lg border ${data.isExistingCustomer ? 'bg-blue-600/20 border-blue-500/30' : 'bg-green-600/20 border-green-500/30'}`}>
              <p className="text-[8px] font-black uppercase mb-0.5 text-white">
                Resultado Final
              </p>
              <p className="text-[10px] text-white/90 leading-tight">
                {data.isExistingCustomer 
                  ? `Necesitas añadir ${recommendation.additionalPanelsNeeded} placas para cubrir tu déficit.`
                  : `Sistema de ${recommendation.totalPanelCountTarget} placas para independencia total.`}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Battery Section */}
      <div className="bg-gradient-to-br from-[#002E6E] to-[#004A99] rounded-xl shadow-sm p-4 text-white relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-blue-200 text-[8px] font-black uppercase tracking-widest">Almacenamiento</h4>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1200px-Tesla_Motors.svg.png" 
              alt="Tesla" 
              className="h-8 invert opacity-90 object-contain" 
            />
          </div>
          <div className="flex items-end space-x-2 mb-2">
            <span className="text-4xl font-black">{recommendation.batteryRecommendationKwh.toFixed(1)}</span>
            <span className="text-xs font-bold text-blue-200 pb-1 uppercase leading-none">kWh Batería</span>
          </div>
          <p className="text-blue-100 text-[10px] opacity-90 leading-tight">
            Respaldo de <strong>Tesla Powerwall</strong> para uso nocturno y emergencias.
          </p>
        </div>
      </div>
    </div>
  );
};
