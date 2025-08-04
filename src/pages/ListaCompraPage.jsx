
import React, { useEffect, useState } from "react";
import { buscarNotasCompra, deletarNotaCompra, obterUrlPdf } from "../services/notaCompraService";
import { Search, Eye, Download, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ListaCompraPage({ reload }) {
  const [notasCompra, setNotasCompra] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    busca: '',
    valorMin: '',
    valorMax: '',
    page: 1,
    limit: 12
  });
  const [showFilters, setShowFilters] = useState(false);

  async function carregar(novosFiltros = filtros) {
    try {
      setLoading(true);
      const response = await buscarNotasCompra(novosFiltros);
      setNotasCompra(response.notas || []);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
      setNotasCompra([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [reload]);

  const handleBusca = (e) => {
    e.preventDefault();
    const novosFiltros = { ...filtros, page: 1 };
    setFiltros(novosFiltros);
    carregar(novosFiltros);
  };

  const handlePagina = (novaPagina) => {
    const novosFiltros = { ...filtros, page: novaPagina };
    setFiltros(novosFiltros);
    carregar(novosFiltros);
  };

  const handleDelete = async (id, numero) => {
    if (!confirm(`Tem certeza que deseja excluir a NFE ${numero}?`)) return;
    
    try {
      await deletarNotaCompra(id);
      carregar(); // Recarrega a lista
    } catch (error) {
      alert('Erro ao excluir nota: ' + error.message);
    }
  };

  const limparFiltros = () => {
    const filtrosLimpos = {
      busca: '',
      valorMin: '',
      valorMax: '',
      page: 1,
      limit: 12
    };
    setFiltros(filtrosLimpos);
    carregar(filtrosLimpos);
  };

  return (
    <div className="space-y-6">
      {/* Barra de Busca e Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <form onSubmit={handleBusca} className="space-y-4">
          {/* Busca Principal */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por número, remetente ou destinatário..."
                value={filtros.busca}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 border rounded-md transition-colors ${
                showFilters 
                  ? 'bg-pink-50 border-indigo-300 text-indigo-700' 
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              Buscar
            </button>
          </div>

          {/* Filtros Avançados */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Valor Mínimo
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={filtros.valorMin}
                  onChange={(e) => setFiltros({ ...filtros, valorMin: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Valor Máximo
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={filtros.valorMax}
                  onChange={(e) => setFiltros({ ...filtros, valorMax: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={limparFiltros}
                  className="w-full px-3 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Resultados */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-pink-600 mx-auto"></div>
          <p className="mt-2 text-slate-600">Carregando notas...</p>
        </div>
      ) : notasCompra.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">Nenhuma nota encontrada.</p>
          {(filtros.busca || filtros.valorMin || filtros.valorMax) && (
            <button
              onClick={limparFiltros}
              className="mt-2 text-pink-600 hover:text-indigo-800"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Grid de Notas */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notasCompra.map((nota) => (
              <article
                key={nota._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        NFE {nota.numero}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {nota.chaveNFe && `Chave: ${nota.chaveNFe.slice(-8)}...`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(nota._id, nota.numero)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                      title="Excluir nota"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-slate-700">Emitente:</span>
                      <p className="text-slate-600 truncate">{nota.remetente?.nome}</p>
                    </div>
                    
                    {nota.destinatario?.nome && (
                      <div>
                        <span className="font-medium text-slate-700">Destinatário:</span>
                        <p className="text-slate-600 truncate">{nota.destinatario.nome}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <span className="font-medium text-slate-700">Valor:</span>
                        <p className="text-lg font-semibold text-emerald-600">
                          R$ {nota.valorTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          {new Date(nota.criadoEm).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    {nota.produtos && nota.produtos.length > 0 && (
                      <div className="pt-2 border-t">
                        <span className="text-xs text-slate-500">
                          {nota.produtos.length} produto{nota.produtos.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex bg-slate-50">
                  <a
                    href={obterUrlPdf(nota._id, false)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Visualizar
                  </a>
                  <div className="w-px bg-slate-200"></div>
                  <a
                    href={obterUrlPdf(nota._id, true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-pink-700 hover:bg-indigo-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Baixar
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 border rounded-lg">
              <div className="text-sm text-slate-700">
                Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} a{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de{' '}
                {pagination.totalItems} resultados
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePagina(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                  className="p-2 rounded-md border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span className="px-3 py-1 text-sm">
                  {pagination.currentPage} de {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => handlePagina(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="p-2 rounded-md border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}


