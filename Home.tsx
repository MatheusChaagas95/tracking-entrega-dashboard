/**
 * Página Principal - Dashboard de Tracking de Entrega
 * Design: Premium Corporate Dark
 */

import React, { useState, useMemo } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FileUploader } from '@/components/FileUploader';
import { KPICard } from '@/components/KPICard';
import { ExpedicaoTable } from '@/components/ExpedicaoTable';
import { parseExcelFile, calcularResumo } from '@/lib/excelParser';
import { NotaFiscal, ItemNota, StatusNota, ResumoExpedicao, FiltroExpedicao } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Package, Truck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [itens, setItens] = useState<ItemNota[]>([]);
  const [status, setStatus] = useState<StatusNota[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [filtro, setFiltro] = useState<FiltroExpedicao>({
    dataInicio: null,
    dataFim: null,
    status: 'todos',
    transportadora: null,
    romaneio: null,
    busca: '',
  });
  const [dataExpedicaoLote, setDataExpedicaoLote] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await parseExcelFile(file);
      setNotas(data.notasFiscais);
      setItens(data.itens);
      setStatus(data.status);
      toast.success(`Arquivo carregado com sucesso! ${data.notasFiscais.length} notas processadas.`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao processar arquivo';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const statusMap = useMemo(() => {
    const map = new Map<number, StatusNota>();
    status.forEach(s => {
      const nota = notas.find(n => n.numeroNota === s.numeroNota);
      if (nota) {
        map.set(nota.id, s);
      }
    });
    return map;
  }, [status, notas]);

  const resumo: ResumoExpedicao = useMemo(() => {
    return calcularResumo(notas, itens, status);
  }, [notas, itens, status]);

  const romaneiosUnicos = useMemo(() => {
    const romaneios = new Set<string>();
    status.forEach(s => {
      if (s.codigoRomaneio) {
        romaneios.add(s.codigoRomaneio);
      }
    });
    return Array.from(romaneios).sort();
  }, [status]);

  const notasFiltradas = useMemo(() => {
    return notas.filter(nota => {
      const notaStatus = statusMap.get(nota.id);
      
      // Filtro por status
      if (filtro.status !== 'todos') {
        const statusMap: Record<string, string> = {
          'em_separacao': 'EM_SEPARACAO',
          'expedido': 'EXPEDIDO',
          'entregue': 'ENTREGUE',
          'cancelado': 'CANCELADO',
        };
        if (notaStatus?.status !== statusMap[filtro.status]) {
          return false;
        }
      }

      // Filtro por romaneio
      if (filtro.romaneio) {
        if (notaStatus?.codigoRomaneio !== filtro.romaneio) {
          return false;
        }
      }

      // Filtro por busca
      if (filtro.busca) {
        const search = filtro.busca.toLowerCase();
        return (
          nota.numeroNota.toString().includes(search) ||
          nota.numeroPedido.toLowerCase().includes(search) ||
          nota.nomeDestinatario.toLowerCase().includes(search) ||
          nota.cidade.toLowerCase().includes(search)
        );
      }

      return true;
    });
  }, [notas, filtro, statusMap]);

  const handleUpdateStatus = (numeroNota: number, dataExpedicao: string, romaneio: string) => {
    setStatus(prev => prev.map(s => 
      s.numeroNota === numeroNota 
        ? { ...s, status: 'EXPEDIDO', dataExpedicao, codigoRomaneio: romaneio }
        : s
    ));
    toast.success(`Expedição marcada para NF ${numeroNota}`);
  };

  const handleMarcarLote = () => {
    if (!filtro.romaneio || !dataExpedicaoLote) {
      toast.error('Selecione um romaneio e uma data');
      return;
    }

    const notasDoRomaneio = notasFiltradas.filter(nota => {
      const notaStatus = statusMap.get(nota.id);
      return notaStatus?.codigoRomaneio === filtro.romaneio;
    });

    setStatus(prev => prev.map(s => {
      const notaDoRomaneio = notasDoRomaneio.find(n => n.numeroNota === s.numeroNota);
      if (notaDoRomaneio) {
        return { ...s, status: 'EXPEDIDO', dataExpedicao: dataExpedicaoLote, codigoRomaneio: filtro.romaneio! };
      }
      return s;
    }));

    toast.success(`${notasDoRomaneio.length} notas do romaneio ${filtro.romaneio} marcadas como expedidas!`);
    setDataExpedicaoLote('');
  };

  return (
    <div className="min-h-screen bg-[#0F1419] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <DashboardHeader
          modo="VD"
          totalDados={notas.length}
          totalExibindo={notasFiltradas.length}
          ultimaAtualizacao={new Date().toLocaleString('pt-BR')}
          onRefresh={() => window.location.reload()}
        />

        {/* Upload Section */}
        {notas.length === 0 ? (
          <div className="bg-[#1A1F2E] rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Começar</h2>
            <FileUploader
              onFileSelect={handleFileSelect}
              isLoading={isLoading}
              error={error}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="flex items-start gap-3">
                <Package className="text-[#0F5BA3] flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-white mb-1">Abas Necessárias</h3>
                  <p className="text-sm text-[#CBD5E0]">Notas de Saida, Status e Itens</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="text-[#0F5BA3] flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-white mb-1">Acompanhamento</h3>
                  <p className="text-sm text-[#CBD5E0]">Marque expedições com data e romaneio</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[#0F5BA3] flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-white mb-1">Status Visual</h3>
                  <p className="text-sm text-[#CBD5E0]">Verde, Âmbar e Azul para cada status</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <KPICard
                title="Total de Notas"
                value={resumo.totalNotas}
                icon={Package}
                status="pending"
                subtitle="Notas Fiscais"
              />
              <KPICard
                title="Total de Itens"
                value={resumo.totalItens}
                icon={AlertCircle}
                status="pending"
                subtitle="Quantidade de produtos"
              />
              <KPICard
                title="Notas Expedidas"
                value={resumo.notasExpedidas}
                icon={Truck}
                status="success"
                percentage={resumo.porcentagemExpedicao}
                trend="up"
              />
              <KPICard
                title="Em Separação"
                value={resumo.notasEmSeparacao}
                icon={AlertCircle}
                status="warning"
                percentage={100 - resumo.porcentagemExpedicao}
                trend="stable"
              />
            </div>

            {/* Filtros */}
            <div className="bg-[#1A1F2E] rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Filtros</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-[#CBD5E0] mb-2 block">Buscar</label>
                  <Input
                    type="text"
                    placeholder="NF, Pedido, Cliente..."
                    value={filtro.busca}
                    onChange={(e) => setFiltro({ ...filtro, busca: e.target.value })}
                    className="bg-[#2D3748] border-[#4A5568] text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#CBD5E0] mb-2 block">Status</label>
                  <select
                    value={filtro.status}
                    onChange={(e) => setFiltro({ ...filtro, status: e.target.value as any })}
                    className="w-full bg-[#2D3748] border border-[#4A5568] text-white rounded-lg px-3 py-2"
                  >
                    <option value="todos">Todos</option>
                    <option value="em_separacao">Em Separação</option>
                    <option value="expedido">Expedido</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#CBD5E0] mb-2 block">Romaneio</label>
                  <select
                    value={filtro.romaneio || ''}
                    onChange={(e) => setFiltro({ ...filtro, romaneio: e.target.value || null })}
                    className="w-full bg-[#2D3748] border border-[#4A5568] text-white rounded-lg px-3 py-2"
                  >
                    <option value="">Todos</option>
                    {romaneiosUnicos.map(romaneio => (
                      <option key={romaneio} value={romaneio}>{romaneio}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => setFiltro({ dataInicio: null, dataFim: null, status: 'todos', transportadora: null, romaneio: null, busca: '' })}
                    variant="outline"
                    className="w-full"
                  >
                    Limpar
                  </Button>
                </div>
              </div>

              {/* Seção de Marcar em Lote */}
              {filtro.romaneio && (
                <div className="bg-[#0F1419] rounded-lg p-4 border border-[#0F5BA3]/30">
                  <h4 className="text-sm font-semibold text-[#10B981] mb-3">Marcar Expedição em Lote</h4>
                  <div className="flex flex-col md:flex-row gap-3 items-end">
                    <div className="flex-1">
                      <label className="text-xs font-medium text-[#CBD5E0] mb-2 block">Data de Expedição para Romaneio {filtro.romaneio}</label>
                      <Input
                        type="date"
                        value={dataExpedicaoLote}
                        onChange={(e) => setDataExpedicaoLote(e.target.value)}
                        className="bg-[#2D3748] border-[#4A5568] text-white"
                      />
                    </div>
                    <Button
                      onClick={handleMarcarLote}
                      className="bg-[#10B981] hover:bg-[#059669] text-white"
                    >
                      Marcar {notasFiltradas.length} Notas
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Tabela */}
            <div className="bg-[#1A1F2E] rounded-lg overflow-hidden shadow-lg">
              <div className="p-6 border-b border-[#2D3748]">
                <h3 className="text-lg font-semibold text-white">
                  Notas Fiscais ({notasFiltradas.length})
                </h3>
              </div>
              <ExpedicaoTable
                notas={notasFiltradas}
                statusMap={statusMap}
                onUpdateStatus={handleUpdateStatus}
              />
            </div>

            {/* Botão para carregar novo arquivo */}
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => {
                  setNotas([]);
                  setItens([]);
                  setStatus([]);
                  setFiltro({ dataInicio: null, dataFim: null, status: 'todos', transportadora: null, romaneio: null, busca: '' });
                  setDataExpedicaoLote('');
                }}
                variant="outline"
              >
                Carregar Novo Arquivo
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
