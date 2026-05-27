/**
 * Script de teste para validar o parser de Excel
 */

const XLSX = require('xlsx');
const fs = require('fs');

const filePath = '/home/ubuntu/upload/lisa-notas-saida-2026-05-26(1).xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  
  console.log('\n=== ESTRUTURA DO ARQUIVO ===');
  console.log('Abas disponíveis:', workbook.SheetNames);
  
  // Parse Notas de Saida
  const notasSheet = workbook.Sheets['Notas de Saida'];
  const notas = XLSX.utils.sheet_to_json(notasSheet);
  console.log(`\n✓ Notas de Saida: ${notas.length} registros`);
  console.log('Colunas:', Object.keys(notas[0]));
  
  // Parse Status
  const statusSheet = workbook.Sheets['Status'];
  const status = XLSX.utils.sheet_to_json(statusSheet);
  console.log(`\n✓ Status: ${status.length} registros`);
  console.log('Colunas:', Object.keys(status[0]));
  
  // Parse Itens
  const itensSheet = workbook.Sheets['Itens'];
  const itens = XLSX.utils.sheet_to_json(itensSheet);
  console.log(`\n✓ Itens: ${itens.length} registros`);
  console.log('Colunas:', Object.keys(itens[0]));
  
  // Estatísticas
  const totalItens = itens.reduce((sum, item) => sum + (item.Quantidade || 0), 0);
  const notasExpedidas = status.filter(s => s.Status === 'EXPEDIDO').length;
  const notasEmSeparacao = status.filter(s => s.Status === 'EM_SEPARACAO').length;
  
  console.log('\n=== RESUMO ===');
  console.log(`Total de Notas: ${notas.length}`);
  console.log(`Total de Itens: ${totalItens}`);
  console.log(`Notas Expedidas: ${notasExpedidas}`);
  console.log(`Notas em Separação: ${notasEmSeparacao}`);
  console.log(`Porcentagem Expedição: ${((notasExpedidas / notas.length) * 100).toFixed(1)}%`);
  
  console.log('\n✅ Arquivo validado com sucesso!');
} catch (error) {
  console.error('❌ Erro:', error.message);
}
