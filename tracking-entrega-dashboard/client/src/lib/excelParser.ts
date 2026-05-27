/**
 * Parser para arquivos Excel de Notas Fiscais
 * Processa as abas: "Notas de Saida", "Status", "Itens"
 */

import * as XLSX from 'xlsx';
import { NotaFiscal, ItemNota, StatusNota, ResumoExpedicao, DadosExpedicao } from './types';

export async function parseExcelFile(file: File): Promise<{
  notasFiscais: NotaFiscal[];
  itens: ItemNota[];
  status: StatusNota[];
  expedicoes: DadosExpedicao[];
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Parse abas
        const notasFiscais = parseNotasFiscais(workbook);
        const itens = parseItens(workbook);
        const status = parseStatus(workbook);
        const expedicoes = extractExpedicoes(status);
        
        resolve({
          notasFiscais,
          itens,
          status,
          expedicoes,
        });
      } catch (error) {
        reject(new Error(`Erro ao processar arquivo Excel: ${error}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsArrayBuffer(file);
  });
}

function parseNotasFiscais(workbook: XLSX.WorkBook): NotaFiscal[] {
  const sheet = workbook.Sheets['Notas de Saida'];
  if (!sheet) return [];
  
  const rows = XLSX.utils.sheet_to_json(sheet);
  return rows.map((row: any) => ({
    id: row.ID,
    numeroNota: row['Número Nota'],
    numeroPedido: row['Número Pedido'],
    idNotaSaida: row.ID,
    nomeDestinatario: row['Nome Destinatário'],
    cidade: row.Cidade,
    estado: row.Estado,
    dataEmissao: row['Data Emissão'],
    valorDeclarado: parseFloat(row['Valor Declarado']) || 0,
    quantidadeVolumes: row['Quantidade Volumes'] || 1,
  }));
}

function parseItens(workbook: XLSX.WorkBook): ItemNota[] {
  const sheet = workbook.Sheets['Itens'];
  if (!sheet) return [];
  
  const rows = XLSX.utils.sheet_to_json(sheet);
  return rows.map((row: any) => ({
    idItem: row['ID Item'],
    idNotaSaida: row['ID Nota Saída'],
    numeroNota: row['Número Nota'],
    descricao: row.Descrição,
    quantidade: row.Quantidade || 0,
    valorUnitario: parseFloat(row['Valor Unitário']) || 0,
  }));
}

function parseStatus(workbook: XLSX.WorkBook): StatusNota[] {
  const sheet = workbook.Sheets['Status'];
  if (!sheet) return [];
  
  const rows = XLSX.utils.sheet_to_json(sheet);
  return rows.map((row: any) => {
    // Extrair romaneio das observações se não estiver na coluna específica
    let codigoRomaneio = row['Código Romaneio'] || null;
    if (!codigoRomaneio && row.Observações) {
      const match = row.Observações.match(/REC-\d{4}-\d{5,6}/);
      if (match) {
        codigoRomaneio = match[0];
      }
    }
    
    // Mapear status: FINALIZADO=EXPEDIDO, CANCELADO=CANCELADO, outros=EM_SEPARACAO
    let status = row.Status || 'AGUARDANDO_ETIQUETAS';
    if (status === 'FINALIZADO') {
      status = 'EXPEDIDO';
    } else if (status === 'CANCELADO') {
      status = 'CANCELADO';
    } else {
      // Qualquer outro status (AGUARDANDO_ETIQUETAS, EM_SEPARACAO, etc) = EM_SEPARACAO
      status = 'EM_SEPARACAO';
    }
    
    return {
      idStatus: row['ID Status'],
      idNotaSaida: row['ID Nota Saída'],
      numeroNota: row['Número Nota'],
      status,
      codigoRomaneio,
      dataExpedicao: row['Data Expedido'] || null,
      observacoes: row.Observações || '',
    };
  });
}

function extractExpedicoes(statusList: StatusNota[]): DadosExpedicao[] {
  return statusList
    .filter(s => s.status === 'EXPEDIDO')
    .map(s => ({
      numeroNota: s.numeroNota,
      dataExpedicao: s.dataExpedicao || new Date().toISOString().split('T')[0],
      codigoRomaneio: s.codigoRomaneio || 'N/A',
      status: 'expedido' as const,
    }));
}

export function calcularResumo(
  notasFiscais: NotaFiscal[],
  itens: ItemNota[],
  status: StatusNota[]
): ResumoExpedicao {
  const totalNotas = notasFiscais.length;
  const totalItens = itens.reduce((sum, item) => sum + item.quantidade, 0);
  
  const notasExpedidas = status.filter(s => s.status === 'EXPEDIDO').length;
  const itensExpedidos = itens
    .filter(item => {
      const notaStatus = status.find(s => s.numeroNota === item.numeroNota);
      return notaStatus?.status === 'EXPEDIDO';
    })
    .reduce((sum, item) => sum + item.quantidade, 0);
  
  const notasEmSeparacao = status.filter(s => s.status === 'EM_SEPARACAO').length;
  const itensEmSeparacao = itens
    .filter(item => {
      const notaStatus = status.find(s => s.numeroNota === item.numeroNota);
      return notaStatus?.status === 'EM_SEPARACAO';
    })
    .reduce((sum, item) => sum + item.quantidade, 0);
  
  return {
    totalNotas,
    totalItens,
    notasExpedidas,
    itensExpedidos,
    notasEmSeparacao,
    itensEmSeparacao,
    porcentagemExpedicao: totalNotas > 0 ? (notasExpedidas / totalNotas) * 100 : 0,
    porcentagemItens: totalItens > 0 ? (itensExpedidos / totalItens) * 100 : 0,
  };
}

export function extrairRomaneioDoTexto(observacoes: string): string | null {
  // Procura por padrão REC-YYYY-XXXXXX nas observações
  const match = observacoes.match(/REC-\d{4}-\d{6}/);
  return match ? match[0] : null;
}
