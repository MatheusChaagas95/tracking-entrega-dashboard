/**
 * Tipos para o Dashboard de Tracking de Entrega
 * Design: Premium Corporate Dark
 */

export interface NotaFiscal {
  id: number;
  numeroNota: number;
  numeroPedido: string;
  idNotaSaida: number;
  nomeDestinatario: string;
  cidade: string;
  estado: string;
  dataEmissao: string;
  valorDeclarado: number;
  quantidadeVolumes: number;
}

export interface ItemNota {
  idItem: number;
  idNotaSaida: number;
  numeroNota: number;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

export interface StatusNota {
  idStatus: number;
  idNotaSaida: number;
  numeroNota: number;
  status: 'EM_SEPARACAO' | 'EXPEDIDO' | 'ENTREGUE' | 'CANCELADO';
  codigoRomaneio: string | null;
  dataExpedicao: string | null;
  observacoes: string;
}

export interface DadosExpedicao {
  numeroNota: number;
  dataExpedicao: string;
  codigoRomaneio: string;
  status: 'em_separacao' | 'expedido' | 'entregue';
}

export interface ResumoExpedicao {
  totalNotas: number;
  totalItens: number;
  notasExpedidas: number;
  itensExpedidos: number;
  notasEmSeparacao: number;
  itensEmSeparacao: number;
  porcentagemExpedicao: number;
  porcentagemItens: number;
}

export interface FiltroExpedicao {
  dataInicio: string | null;
  dataFim: string | null;
  status: 'todos' | 'em_separacao' | 'expedido' | 'entregue' | 'cancelado';
  transportadora: string | null;
  romaneio: string | null;
  busca: string;
}
