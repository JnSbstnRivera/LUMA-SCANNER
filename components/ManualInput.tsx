
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';

interface ManualInputProps {
  onSubmit: (values: number[]) => void;
  isLoading: boolean;
}

const WH_ORANGE = '#F89B24';
const WH_ORANGE_LIGHT = '#FBD38D';

export const ManualInput: React.FC<ManualInputProps> = ({ onSubmit, isLoading }) => {
  const [values, setValues] = useState<string[]>(Array(13).fill(''));
  const [inputMode, setInputMode] = useState<'monthly' | 'total'>('monthly');
  const [totalKwh, setTotalKwh] = useState<string>('');

  const numericValues = useMemo(() => values.map(v => parseInt(v) || 0), [values]);

  const average = useMemo(() => {
    const filledValues = numericValues.filter(v => v > 0);
    if (filledValues.length === 0) return 0;
    return Math.round(filledValues.reduce((a, b) => a + b, 0) / filledValues.length);
  }, [numericValues]);

  const chartData = useMemo(() => {
    return numericValues.map((val, i) => ({
      name: `Mes ${i + 1}`,
      value: val,
    }));
  }, [numericValues]);

  const handleTotalChange = (val: string) => {
    if (val === '' || /^\d+$/.test(val)) {
      setTotalKwh(val);
      const total = parseInt(val) || 0;
      if (total > 0) {
        const weights = Array.from({ length: 13 }, () => 0.7 + Math.random() * 0.6);
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        const newValues = weights.map(w => Math.round((w / totalWeight) * total));
        const currentSum = newValues.reduce((a, b) => a + b, 0);
        const diff = total - currentSum;
        if (diff !== 0) newValues[0] += diff;
        setValues(newValues.map(v => v.toString()));
      } else {
        setValues(Array(13).fill(''));
      }
    }
  };

  const handleChange = (index: number, val: string) => {
    const newValues = [...values];
    if (val === '' || /^\d+$/.test(val)) {
      newValues[index] = val;
      setValues(newValues);
      const sum = newValues.reduce((acc, curr) => acc + (parseInt(curr) || 0), 0);
      setTotalKwh(sum > 0 ? sum.toString() : '');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericValues.some(v => v > 0)) {
      onSubmit(numericValues);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#161b22] rounded-xl shadow-sm p-4 border border-slate-100 dark:border-white/[0.08] font-sans"
    >
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-sm font-black text-[#231F20] dark:text-[#e8eaed] uppercase tracking-tighter">Historial de Consumo</h3>
          <p className="text-slate-400 dark:text-[#6b7280] text-[7px] font-bold uppercase tracking-widest leading-none">LUMA SCANNER Data Analysis</p>
        </div>
        <div className="flex items-center gap-2">
          {average > 0 && (
            <div className="bg-[#F89B24]/10 text-[#F89B24] px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter border border-[#F89B24]/20">
              Promedio: <span className="text-xs ml-1">{average} kWh</span>
            </div>
          )}
        </div>
      </div>

      {/* Input Mode Selector */}
      <div className="flex p-0.5 bg-slate-100 dark:bg-[#0f1215] rounded-lg mb-3 max-w-[200px] mx-auto">
        <button
          onClick={() => setInputMode('monthly')}
          className={`flex-1 py-1 px-2 rounded-md font-black text-[8px] uppercase tracking-widest transition-all ${
            inputMode === 'monthly'
              ? 'bg-white dark:bg-[#161b22] text-[#1D429B] dark:text-blue-400 shadow-sm'
              : 'text-slate-400 dark:text-[#6b7280] hover:text-slate-600'
          }`}
        >
          Mes
        </button>
        <button
          onClick={() => setInputMode('total')}
          className={`flex-1 py-1 px-2 rounded-md font-black text-[8px] uppercase tracking-widest transition-all ${
            inputMode === 'total'
              ? 'bg-white dark:bg-[#161b22] text-[#1D429B] dark:text-blue-400 shadow-sm'
              : 'text-slate-400 dark:text-[#6b7280] hover:text-slate-600'
          }`}
        >
          Total
        </button>
      </div>

      {/* Bar Chart */}
      <div className="h-32 sm:h-40 w-full mb-3 bg-slate-50/50 dark:bg-[#0f1215]/60 rounded-2xl p-1.5 border border-slate-100 dark:border-white/[0.06] shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -35, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={WH_ORANGE} stopOpacity={1} />
                <stop offset="100%" stopColor={WH_ORANGE_LIGHT} stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 7, fontWeight: 800, fill: '#64748b' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 7, fontWeight: 800, fill: '#64748b' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 4 }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)', fontWeight: 900, fontSize: '10px', padding: '4px 8px', background: '#161b22', color: '#e8eaed' }}
              itemStyle={{ color: WH_ORANGE, padding: 0 }}
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]} animationDuration={1000}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value > average * 1.5 && average > 0 ? WH_ORANGE : 'url(#barGradient)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-2">
        {inputMode === 'total' ? (
          <div className="max-w-[160px] mx-auto animate-fade-in">
            <label className="block text-[7px] font-black text-slate-400 dark:text-[#6b7280] uppercase mb-1 ml-1 tracking-widest text-center">Consumo Total (kWh)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Ej. 12000"
              value={totalKwh}
              onChange={(e) => handleTotalChange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0f1215] border border-slate-200 dark:border-white/[0.08] rounded-lg px-2 py-1.5 text-slate-800 dark:text-[#e8eaed] focus:bg-white dark:focus:bg-[#161b22] focus:border-[#F89B24] transition-all outline-none text-center font-black text-lg"
            />
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 animate-fade-in">
            {values.map((val, i) => (
              <div key={i} className="flex flex-col">
                <label className="text-[6px] font-black text-slate-400 dark:text-[#6b7280] uppercase mb-0.5 ml-0.5 tracking-tighter">Mes {i + 1}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={val}
                  onChange={(e) => handleChange(i, e.target.value)}
                  className="bg-slate-50 dark:bg-[#0f1215] border border-slate-200 dark:border-white/[0.08] rounded px-1 py-1 text-slate-800 dark:text-[#e8eaed] focus:bg-white dark:focus:bg-[#161b22] focus:border-[#F89B24] transition-all outline-none text-center font-black text-[11px]"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !values.some(v => v !== '')}
          className={`w-full py-2 rounded-lg font-black text-xs shadow-md transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 ${
            isLoading
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : 'bg-[#1D429B] hover:bg-[#1D429B]/90 text-white shadow-blue-900/20'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Analizando...</span>
            </>
          ) : (
            <span>Analizar Consumo</span>
          )}
        </button>
      </form>
    </motion.div>
  );
};
