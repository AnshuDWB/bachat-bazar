import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useStore();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm w-full animate-bounce-short">
      <div className={`p-4 rounded-xl shadow-lg border flex items-center gap-3 ${
        isSuccess
          ? 'bg-[#111111] text-white border-[#D71920]'
          : isError
          ? 'bg-red-600 text-white border-red-700'
          : 'bg-[#111111] text-white border-neutral-700'
      }`}>
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#D71920] shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-white shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-[#D71920] shrink-0" />}
        
        <p className="text-sm font-medium flex-1">{toast.message}</p>
      </div>
    </div>
  );
}
