import React, { useRef, useState } from 'react';
import { enviarCompraXmls } from '../services/notaCompraService';
import { Loader2, UploadCloud, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function UploadXml({ onSuccess }) {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | completed
  const [results, setResults] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const handleFiles = async (files) => {
    const xmlFiles = Array.from(files).filter(f => f.name.endsWith('.xml'));
    if (!xmlFiles.length) {
      setStatus('completed');
      setResults([{ 
        fileName: 'Erro', 
        success: false, 
        error: 'validation',
        message: 'Selecione ao menos um arquivo .xml válido.' 
      }]);
      return;
    }

    try {
      setStatus('uploading');
      setResults([]);
      setShowDetails(false);

      const resultados = await enviarCompraXmls(xmlFiles);
      setResults(resultados);
      setStatus('completed');
      
      // Se pelo menos uma nota foi importada com sucesso, chama onSuccess
      const sucessos = resultados.filter(r => r.success);
      if (sucessos.length > 0) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      setStatus('completed');
      setResults([{ 
        fileName: 'Erro', 
        success: false, 
        error: 'server',
        message: 'Erro inesperado ao processar arquivos.' 
      }]);
    }
  };

  const resetUpload = () => {
    setStatus('idle');
    setResults([]);
    setShowDetails(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusIcon = (result) => {
    if (result.success) return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    if (result.error === 'duplicate') return <AlertCircle className="w-4 h-4 text-amber-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusColor = (result) => {
    if (result.success) return 'text-emerald-600';
    if (result.error === 'duplicate') return 'text-amber-600';
    return 'text-red-600';
  };

  const sucessos = results.filter(r => r.success).length;
  const duplicatas = results.filter(r => r.error === 'duplicate').length;
  const erros = results.filter(r => r.error && r.error !== 'duplicate').length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Área de Upload */}
      <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xml"
          multiple
          className="sr-only"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        <div className="text-center">
          <UploadCloud className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Importar Arquivos XML de compra 
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Selecione um ou múltiplos arquivos XML de compra para importar
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={status === 'uploading'}
          className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'uploading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              Selecionar Arquivos
            </>
          )}
        </button>
      </div>

      {/* Resultados */}
      {status === 'completed' && results.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">Resultados do Processamento</h4>
              <button
                onClick={resetUpload}
                className="text-sm text-pink-600 hover:text-indigo-800"
              >
                Novo Upload
              </button>
            </div>
            
            {/* Resumo */}
            <div className="mt-3 flex gap-4 text-sm">
              {sucessos > 0 && (
                <span className="text-emerald-600">
                  ✓ {sucessos} importada{sucessos > 1 ? 's' : ''}
                </span>
              )}
              {duplicatas > 0 && (
                <span className="text-amber-600">
                  ⚠ {duplicatas} duplicata{duplicatas > 1 ? 's' : ''}
                </span>
              )}
              {erros > 0 && (
                <span className="text-red-600">
                  ✗ {erros} erro{erros > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          <div className="p-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-slate-600 hover:text-slate-800 mb-3"
            >
              {showDetails ? 'Ocultar detalhes' : 'Ver detalhes'} ({results.length} arquivo{results.length > 1 ? 's' : ''})
            </button>

            {showDetails && (
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-md">
                    {getStatusIcon(result)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {result.fileName}
                      </p>
                      <p className={`text-sm ${getStatusColor(result)}`}>
                        {result.message}
                      </p>
                      {result.success && result.data?.nota && (
                        <p className="text-xs text-slate-500 mt-1">
                          NFE {result.data.nota.numero} • R$ {result.data.nota.valorTotal}
                        </p>
                      )}
                      {result.error === 'duplicate' && result.existingNote && (
                        <p className="text-xs text-slate-500 mt-1">
                          Importada em {new Date(result.existingNote.criadoEm).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading durante upload */}
      {status === 'uploading' && (
        <div className="mt-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-pink-600" />
          <p className="mt-2 text-sm text-slate-600">
            Processando arquivos XML e gerando PDFs...
          </p>
        </div>
      )}
    </div>
  );
}


