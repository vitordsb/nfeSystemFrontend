
// src/components/UploadXml.jsx
import React, { useRef, useState } from 'react';
import { enviarXmls } from '../services/notaService';
import { Loader2, UploadCloud } from 'lucide-react';

export default function UploadXml({ onSuccess }) {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [msg, setMsg] = useState('');

  const handleFiles = async (files) => {
    const xmlFiles = Array.from(files).filter(f => f.name.endsWith('.xml'));
    if (!xmlFiles.length) {
      setStatus('error');
      return setMsg('Selecione ao menos um arquivo .xml válido.');
    }

    try {
      setStatus('uploading');
      setMsg('Enviando XMLs…');
      const resultados = await enviarXmls(xmlFiles);
      setStatus('success');
      setMsg(`${resultados.length} notas processadas com sucesso!`);
      onSuccess();
    } catch (e) {
      console.error(e);
      setStatus('error');
      setMsg('Erro ao enviar XMLs.');
    }
  };

  return (
    <div className="max-w-sm mx-auto flex flex-col items-center gap-4">
      {/* input invisível, mas acessível, permite múltiplos */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xml"
        multiple
        className="sr-only"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={status === 'uploading'}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50 disabled:opacity-50"
      >
        {status === 'uploading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" />
            Selecionar XMLs
          </>
        )}
      </button>

      {/* feedback */}
      <p
        aria-live="polite"
        className={`text-sm ${
          status === 'success'
            ? 'text-emerald-600'
            : status === 'error'
            ? 'text-rose-600'
            : 'text-slate-500'
        }`}
      >
        {msg}
      </p>
    </div>
  );
}

