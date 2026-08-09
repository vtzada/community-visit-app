export interface Endereco {
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
}

export interface Solicitacao {
  id?: string | number;
  nomeSolicitante?: string;
  telefoneSolicitante?: string;
  pedidoOracao?: string;
  endereco?: Endereco;
  statusSolicitacao?: string;
}

export interface Visita {
  id: string | number;
  statusVisita?: string;
  status?: string;
  dataHoraVisita?: string;
  solicitacao?: Solicitacao;
}

export interface Grupo {
  id: string | number;
  nome: string;
  nomeLider?: string;
  membros?: string[];
}

export interface User {
  nome?: string;
  role?: string;
  email?: string;
}

export interface LoginResponse {
  token: string;
  nome?: string;
  role?: string;
  email?: string;
}

export interface VisitRequestData {
  id?: string | number;
  nomeSolicitante: string;
  telefoneSolicitante: string;
  pedidoOracao?: string;
  endereco: Required<Pick<Endereco, 'logradouro' | 'numero' | 'bairro' | 'cep'>> & {
    complemento?: string;
  };
  statusSolicitacao?: string;
}
