import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nfesystembackend.onrender.com/api/notasCompra'
});

// Função para enviar um único XML
export async function enviarCompraXml(file) {
  const formData = new FormData();
  formData.append('xml', file);

  try {
    const response = await api.post('/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 409) {
      // Erro de duplicidade
      return { 
        success: false, 
        error: 'duplicate', 
        message: error.response.data.error,
        existingNote: error.response.data.notaExistente
      };
    }
    return { 
      success: false, 
      error: 'server', 
      message: error.response?.data?.error || error.message 
    };
  }
}

// Função para enviar múltiplos XMLs
export async function enviarCompraXmls(files) {
  const results = [];
  
  for (const file of files) {
    const result = await enviarCompraXml(file);
    results.push({
      fileName: file.name,
      ...result
    });
  }
  
  return results;
}

// Função para buscar notas com filtros avançados
export async function buscarNotasCompra(filtros = {}) {
  const params = new URLSearchParams();
  
  if (filtros.busca) params.append('busca', filtros.busca);
  if (filtros.numero) params.append('numero', filtros.numero);
  if (filtros.valorMin) params.append('valorMin', filtros.valorMin);
  if (filtros.valorMax) params.append('valorMax', filtros.valorMax);
  if (filtros.page) params.append('page', filtros.page);
  if (filtros.limit) params.append('limit', filtros.limit);

  const url = params.toString() ? `/?${params.toString()}` : '/';
  const response = await api.get(url);
  return response.data;
}

// Função para buscar uma nota específica por ID
export async function buscarNotaCompraPorId(id) {
  const response = await api.get(`/${id}`);
  return response.data;
}

// Função para deletar uma nota
export async function deletarNotaCompra(id) {
  const response = await api.delete(`/${id}`);
  return response.data;
}

// Função para deletar todas as notas
export async function deletarTodasNotasCompra() {
  const response = await api.delete('/');
  return response.data;
}

// Função para obter URL do PDF
export function obterUrlPdf(notaId, download = false) {
  const baseUrl = api.defaults.baseURL.replace('/api/notasCompra', '');
  const downloadParam = download ? '?download=true' : '';
  return `${baseUrl}/api/notasCompra/${notaId}/pdf${downloadParam}`;
}

// Função para verificar saúde da API
export async function verificarSaude() {
  try {
    const response = await axios.get(api.defaults.baseURL.replace('/api/notasCompra', '/api/health'));
    return response.data;
  } catch (error) {
    return { status: 'ERROR', error: error.message };
  }
}


