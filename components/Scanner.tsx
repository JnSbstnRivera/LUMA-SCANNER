
import React, { useRef } from 'react';

interface ScannerProps {
  onFileUploaded: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

export const Scanner: React.FC<ScannerProps> = ({ onFileUploaded, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        const mimeType = file.type || 'application/pdf';
        onFileUploaded(base64Data, mimeType);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="bg-white dark:bg-[#161b22] rounded-2xl shadow-sm p-8 text-center border-2 border-dashed border-slate-200 dark:border-white/[0.08] hover:border-[#F89B24] dark:hover:border-[#F89B24] transition-all group cursor-pointer"
      onClick={triggerUpload}
    >
      {/* Tip de calidad */}
      <div
        className="mb-5 px-3 py-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20 flex items-center gap-2 text-left"
        onClick={e => e.stopPropagation()}
      >
        <svg className="w-3.5 h-3.5 text-[#002E6E] dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-[9px] font-bold text-[#002E6E] dark:text-blue-300 leading-snug">
          Para mejores resultados usa el <span className="text-[#F89B24]">PDF oficial de la app de LUMA</span>. Si usas foto, asegúrate de que el historial de barras sea legible y nítido.
        </p>
      </div>

      <div className="mb-6">
        <div className="bg-orange-50 dark:bg-[#F89B24]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-sm">
          <svg className="w-10 h-10 text-[#F89B24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-[#e8eaed] mb-2 tracking-tighter">Sube tu Factura</h2>
        <p className="text-slate-500 dark:text-[#a0a4ad] max-w-xs mx-auto text-xs leading-relaxed font-medium">
          Carga el PDF oficial de LUMA o una foto clara del historial de consumo para un análisis instantáneo.
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="hidden"
      />

      <button
        disabled={isLoading}
        className={`w-full sm:w-auto px-10 py-4 rounded-xl font-black text-base shadow-lg transition-all transform active:scale-95 ${
          isLoading
            ? 'bg-slate-300 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'
            : 'bg-[#F89B24] hover:bg-[#F89B24]/90 text-white hover:shadow-orange-500/30'
        }`}
      >
        {isLoading ? 'Analizando...' : 'Seleccionar Archivo'}
      </button>

      <div className="mt-4 grid grid-cols-2 gap-2 text-left">
        <div className="p-2 bg-slate-50 dark:bg-[#0f1215] rounded-lg border border-slate-100 dark:border-white/[0.08]">
          <p className="text-[8px] font-black text-[#002E6E] dark:text-blue-400 uppercase mb-0.5">LUMA App</p>
          <p className="text-[9px] text-slate-500 dark:text-[#6b7280] leading-none">PDF oficial.</p>
        </div>
        <div className="p-2 bg-slate-50 dark:bg-[#0f1215] rounded-lg border border-slate-100 dark:border-white/[0.08]">
          <p className="text-[8px] font-black text-[#F89B24] uppercase mb-0.5">Cámara</p>
          <p className="text-[9px] text-slate-500 dark:text-[#6b7280] leading-none">Foto de barras.</p>
        </div>
      </div>
    </div>
  );
};
