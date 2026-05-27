/**
 * Componente Header do Dashboard
 * Design: Premium Corporate Dark - Hero com gradiente azul
 */

import React from 'react';
import { Package, Calendar, RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  modo?: string;
  totalDados?: number;
  totalExibindo?: number;
  ultimaAtualizacao?: string;
  onRefresh?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  modo = 'VD',
  totalDados = 0,
  totalExibindo = 0,
  ultimaAtualizacao,
  onRefresh,
}) => {
  return (
    <div
      className="bg-gradient-to-r from-[#0A3D7A] via-[#0F5BA3] to-[#1A7AB8] rounded-2xl p-8 mb-8 shadow-2xl relative overflow-hidden"
    >
      {/* Overlay gradient para garantir legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A3D7A]/95 via-[#0F5BA3]/90 to-[#1A7AB8]/85" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <Package className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-1">
                Tracking de Entrega
              </h1>
              <p className="text-blue-100 text-sm">Dashboard de Expedição - Direct Beauty</p>
            </div>
          </div>

          {/* Info box - Modo e dados */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-right hidden md:block">
            <p className="text-blue-100 text-xs mb-2">Modo: <span className="font-bold text-white">{modo}</span></p>
            <p className="text-blue-100 text-xs mb-2">Dados: <span className="font-bold text-white">{totalDados.toLocaleString('pt-BR')} registros</span></p>
            <p className="text-blue-100 text-xs mb-2">Exibindo: <span className="font-bold text-white">{totalExibindo.toLocaleString('pt-BR')} registros</span></p>
            {ultimaAtualizacao && (
              <p className="text-blue-100 text-xs flex items-center justify-end gap-1 mt-2">
                <Calendar size={12} />
                <span>Atualização: <span className="font-bold">{ultimaAtualizacao}</span></span>
              </p>
            )}
          </div>
        </div>

        {/* Mobile info */}
        <div className="md:hidden bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-blue-100">Modo</p>
              <p className="font-bold text-white">{modo}</p>
            </div>
            <div>
              <p className="text-blue-100">Registros</p>
              <p className="font-bold text-white">{totalDados.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm"
          >
            <RefreshCw size={16} />
            Atualizar
          </button>
        )}
      </div>
    </div>
  );
};
