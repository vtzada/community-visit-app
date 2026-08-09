import { api } from '../api/api';

export const solicitacaoService = {
  async consultarPorTelefone(telefone: string) {
    const response = await api.get(`/solicitacoes/consultar?telefone=${telefone}`);
    return response.data;
  }
};