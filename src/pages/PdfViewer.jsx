
import React, { useState } from 'react';
import { X, Download, ExternalLink, Loader2 } from 'lucide-react';
import { obterUrlPdf } from '../services/notaService';

export default function PdfViewer({ nota, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!nota) return null;

  const pdfUrl = obterUrlPdf(nota._id, false);
  const downloadUrl = obterUrlPdf(nota._id, true);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const openInNewTab = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              NFE {nota.numero}
            </h3>
            <p className="text-sm text-slate-600">
              {nota.remetente?.nome}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={openInNewTab}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              title="Abrir em nova aba"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            
            <a
              href={downloadUrl}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              title="Baixar PDF"
            >
              <Download className="w-4 h-4" />
            </a>
            
            <button
              onClick={onClose}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 relative bg-slate-100">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
                <p className="text-sm text-slate-600">Carregando PDF...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-lg font-medium text-slate-900 mb-2">
                  Erro ao carregar PDF
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  Não foi possível carregar o PDF da nota fiscal.
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setError(false);
                      setLoading(true);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Tentar novamente
                  </button>
                  <a
                    href={downloadUrl}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded-md hover:bg-slate-50 transition-colors"
                  >
                    Baixar PDF
                  </a>
                </div>
              </div>
            </div>
          )}

          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title={`PDF da NFE ${nota.numero}`}
            onLoad={handleLoad}
            onError={handleError}
            style={{ display: loading || error ? 'none' : 'block' }}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 text-center">
          <p className="text-xs text-slate-500">
            PDF gerado automaticamente a partir do XML da NFE
          </p>
        </div>
      </div>
    </div>
  );
}

