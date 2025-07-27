
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nfesystembackend.onrender.com/api/notas'
});

export async function enviarXmls(files) {
  const form = new FormData();
  files.forEach(file => form.append('xmls', file));

  const res = await api.post('/xmls', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return res.data.resultados;
}

export async function buscarNotas(numero = '') {
  const url = numero ? `/?numero=${numero}` : '/';
  const res = await api.get(url);
  return res.data;
}

