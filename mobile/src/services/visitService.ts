import { api } from '../api/api';

export interface EnderecoData {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
}

export interface VisitRequestData {
  id?: string | number;
  nomeSolicitante: string;
  telefoneSolicitante: string;
  pedidoOracao?: string;
  endereco: EnderecoData;
  statusSolicitacao?: string;
}

export const visitService = {
  async createVisit(data: VisitRequestData) {
    const response = await api.post('/solicitacoes', data);
    return response.data;
  },

  async listarSolicitacoes(status?: string) {
    const url = status ? `/solicitacoes?status=${status}` : '/solicitacoes';
    const response = await api.get(url);
    return response.data;
  },

  async listarVisitas(status?: string) {
    const url = status ? `/visitas?status=${status}` : '/visitas';
    const response = await api.get(url);
    return response.data;
  },

  async aceitarSolicitacao(id: string | number, primeiraVisita: string) {
    const response = await api.post(`/visitas/aceitar/${id}?primeiraVisita=${primeiraVisita}`);
    return response.data;
  },

  async concluirVisita(visitaId: string | number) {
    const response = await api.patch(`/visitas/${visitaId}/concluir`);
    return response.data;
  },

  async aceitarComData(solicitacaoId: number, primeiraVisita: string) {
    const response = await api.post(`/visitas/aceitar/${solicitacaoId}?primeiraVisita=${primeiraVisita}`);
    return response.data;
  },

  async remarcarVisita(visitaId: number, novaData: string) {
    const response = await api.patch(`/visitas/${visitaId}/remarcar?novaData=${novaData}`);
    return response.data;
  }
};