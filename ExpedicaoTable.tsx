/**
 * Componente Tabela de Expedição
 * Design: Premium Corporate Dark - Tabela com status coloridos
 */

import React, { useState } from 'react';
import { NotaFiscal, StatusNota } from '@/lib/types';
import { CheckCircle2, Clock, AlertCircle, Calendar, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ExpedicaoTableProps {
  notas: NotaFiscal[];
  statusMap: Map<number, StatusNota>;
  onUpdateStatus?: (numeroNota: number, dataExpedicao: string, romaneio: string) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'EXPEDIDO':
      return <CheckCircle2 className="text-[#10B981]" size={18} />;
    case 'EM_SEPARACAO':
      return <Clock className="text-[#F59E0B]" size={18} />;
    case 'ENTREGUE':
      return <Truck className="text-[#3B82F6]" size={18} />;
    case 'CANCELADO':
      return <AlertCircle className="text-[#EF4444]" size={18} />;
    default:
      return <AlertCircle className="text-[#CBD5E0]" size={18} />;
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'EXPEDIDO': 'Expedido',
    'EM_SEPARACAO': 'Em Separação',
    'ENTREGUE': 'Entregue',
    'CANCELADO': 'Cancelado',
  };
  return labels[status] || status;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'EXPEDIDO':
      return 'bg-[#10B981]/10 text-[#10B981]';
    case 'EM_SEPARACAO':
      return 'bg-[#F59E0B]/10 text-[#F59E0B]';
    case 'ENTREGUE':
      return 'bg-[#3B82F6]/10 text-[#3B82F6]';
    case 'CANCELADO':
      return 'bg-[#EF4444]/10 text-[#EF4444]';
    default:
      return 'bg-[#4A5568]/10 text-[#CBD5E0]';
  }
};

export const ExpedicaoTable: React.FC<ExpedicaoTableProps> = ({
  notas,
  statusMap,
  onUpdateStatus,
}) => {
  const [editingNota, setEditingNota] = useState<number | null>(null);
  const [editData, setEditData] = useState('');
  const [editRomaneio, setEditRomaneio] = useState('');

  const handleSave = (numeroNota: number) => {
    if (onUpdateStatus && editData && editRomaneio) {
      onUpdateStatus(numeroNota, editData, editRomaneio);
      setEditingNota(null);
      setEditData('');
      setEditRomaneio('');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2D3748]">
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#CBD5E0] uppercase tracking-wider">NF</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#CBD5E0] uppercase tracking-wider">Pedido</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#CBD5E0] uppercase tracking-wider">Destinatário</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#CBD5E0] uppercase tracking-wider">Cidade</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#CBD5E0] uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#CBD5E0] uppercase tracking-wider">Romaneio</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#CBD5E0] uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((nota, idx) => {
            const status = statusMap.get(nota.id);
            return (
              <tr
                key={nota.id}
                className={`border-b border-[#2D3748] hover:bg-[#1A1F2E]/50 transition-colors duration-150 ${idx % 2 === 0 ? 'bg-[#0F1419]' : 'bg-[#1A1F2E]/30'}`}
              >
                <td className="px-4 py-3 text-sm font-semibold text-white">{nota.numeroNota}</td>
                <td className="px-4 py-3 text-sm text-[#CBD5E0]">{nota.numeroPedido}</td>
                <td className="px-4 py-3 text-sm text-[#CBD5E0] truncate">{nota.nomeDestinatario}</td>
                <td className="px-4 py-3 text-sm text-[#CBD5E0]">{nota.cidade}/{nota.estado}</td>
                <td className="px-4 py-3">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${getStatusColor(status?.status || 'AGUARDANDO_ETIQUETAS')}`}>
                    {getStatusIcon(status?.status || 'AGUARDANDO_ETIQUETAS')}
                    <span className="text-xs font-medium">{getStatusLabel(status?.status || 'AGUARDANDO_ETIQUETAS')}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[#CBD5E0]">
                  {status?.codigoRomaneio ? (
                    <span className="font-mono text-[#10B981]">{status.codigoRomaneio}</span>
                  ) : (
                    <span className="text-[#4A5568]">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Dialog open={editingNota === nota.id} onOpenChange={(open) => !open && setEditingNota(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingNota(nota.id)}
                        className="text-xs"
                      >
                        Marcar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1A1F2E] border-[#2D3748]">
                      <DialogHeader>
                        <DialogTitle className="text-white">Marcar Expedição - NF {nota.numeroNota}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="text-sm font-medium text-[#CBD5E0] mb-2 block">Data de Expedição</label>
                          <Input
                            type="date"
                            value={editData}
                            onChange={(e) => setEditData(e.target.value)}
                            className="bg-[#2D3748] border-[#4A5568] text-white"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#CBD5E0] mb-2 block">Código Romaneio</label>
                          <Input
                            type="text"
                            placeholder="Ex: REC-2026-000093"
                            value={editRomaneio}
                            onChange={(e) => setEditRomaneio(e.target.value)}
                            className="bg-[#2D3748] border-[#4A5568] text-white"
                          />
                        </div>
                        <Button
                          onClick={() => handleSave(nota.id)}
                          className="w-full bg-[#0F5BA3] hover:bg-[#0A3D7A]"
                        >
                          Salvar Expedição
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
