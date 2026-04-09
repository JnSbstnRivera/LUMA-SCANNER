
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
    <div className="bg-white rounded-2xl shadow-sm p-8 text-center border-2 border-dashed border-slate-200 hover:border-[#F89B24] transition-all group cursor-pointer" onClick={triggerUpload}>
      <div className="mb-6">
        <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-sm">
          <svg className="w-10 h-10 text-[#F89B24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tighter">Sube tu Factura</h2>
        <p className="text-slate-500 max-w-xs mx-auto text-xs leading-relaxed font-medium">
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
            ? 'bg-slate-300 cursor-not-allowed' 
            : 'bg-[#F89B24] hover:bg-[#F89B24]/90 text-white hover:shadow-orange-500/30'
        }`}
      >
        {isLoading ? 'Analizando...' : 'Seleccionar Archivo'}
      </button>

      <div className="mt-4 grid grid-cols-2 gap-2 text-left">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-[8px] font-black text-[#002E6E] uppercase mb-0.5">LUMA App</p>
          <p className="text-[9px] text-slate-500 leading-none">PDF oficial.</p>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-[8px] font-black text-[#F89B24] uppercase mb-0.5">Cámara</p>
          <p className="text-[9px] text-slate-500 leading-none">Foto de barras.</p>
        </div>
      </div>
    </div>
  );
};
