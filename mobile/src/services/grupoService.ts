import { api } from '../api/api';

export interface GrupoRequestData {
  nome: string;
  membros?: string[];
}

export const grupoService = {
  async criarGrupo(data: GrupoRequestData) {
    const response = await api.post('/grupos', data);
    return response.data;
  },

  async listarGrupos() {
    const response = await api.get('/grupos');
    return response.data;
  },
};