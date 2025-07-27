
import React, { useState } from "react";
import UploadXml from "./pages/UploadXml.jsx";
import ListaPage from "./pages/ListaPage.jsx";
import { FileText, Upload, List } from 'lucide-react';

export default function App() {
  const [reload, setReload] = useState(0);
  const [activeTab, setActiveTab] = useState('upload');

  const handleUploadSuccess = () => {
    setReload((r) => r + 1);
    // Muda para a aba de listagem após upload bem-sucedido
    setActiveTab('lista');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Sistema de NFE
              </h1>
              <p className="text-sm text-slate-600">
                Importação e gerenciamento de Notas Fiscais Eletrônicas
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-1 py-4 border-b-2 text-sm font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Upload className="w-4 h-4" />
              Importar XML
            </button>
            <button
              onClick={() => setActiveTab('lista')}
              className={`flex items-center gap-2 px-1 py-4 border-b-2 text-sm font-medium transition-colors ${
                activeTab === 'lista'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <List className="w-4 h-4" />
              Notas Fiscais
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Importar Arquivos XML
              </h2>
              <p className="text-slate-600">
                Selecione um ou múltiplos arquivos XML de NFE para importar e gerar os PDFs automaticamente
              </p>
            </div>
            <UploadXml onSuccess={handleUploadSuccess} />
          </div>
        )}

        {activeTab === 'lista' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Notas Fiscais Importadas
                </h2>
                <p className="text-slate-600">
                  Visualize, busque e gerencie suas notas fiscais eletrônicas
                </p>
              </div>
              <button
                onClick={() => setActiveTab('upload')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Importar Mais
              </button>
            </div>
            <ListaPage reload={reload} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-slate-500">
            <p>
              Sistema de NFE - Importação e visualização de Notas Fiscais Eletrônicas
            </p>
            <p className="mt-1">
              PDFs gerados automaticamente usando biblioteca oficial da SEFAZ
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

