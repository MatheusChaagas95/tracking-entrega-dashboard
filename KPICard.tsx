/**
 * Componente KPI Card
 * Design: Premium Corporate Dark - Cards com gradiente azul e linha colorida
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: LucideIcon;
  status?: 'success' | 'warning' | 'pending' | 'error';
  percentage?: number;
  trend?: 'up' | 'down' | 'stable';
}

const statusColors = {
  success: 'border-l-[#10B981]',
  warning: 'border-l-[#F59E0B]',
  pending: 'border-l-[#3B82F6]',
  error: 'border-l-[#EF4444]',
};

const statusTextColors = {
  success: 'text-[#10B981]',
  warning: 'text-[#F59E0B]',
  pending: 'text-[#3B82F6]',
  error: 'text-[#EF4444]',
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  status = 'pending',
  percentage,
  trend,
}) => {
  return (
    <div
      className={`
        bg-gradient-to-br from-[#1A1F2E] to-[#0F1419] 
        border-l-4 ${statusColors[status]}
        rounded-lg p-6 
        shadow-lg hover:shadow-xl 
        transition-all duration-200 ease-out
        hover:scale-[1.02]
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#CBD5E0] mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl md:text-4xl font-bold text-white">
              {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            </h3>
            {percentage !== undefined && (
              <span className={`text-sm font-semibold ${statusTextColors[status]}`}>
                {percentage.toFixed(1)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[#4A5568] mt-2">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${statusTextColors[status]} bg-opacity-10`}>
            <Icon size={24} className={statusTextColors[status]} />
          </div>
        )}
      </div>

      {/* Trend indicator */}
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-xs">
          {trend === 'up' && (
            <>
              <span className="text-[#10B981]">↑</span>
              <span className="text-[#CBD5E0]">Crescimento</span>
            </>
          )}
          {trend === 'down' && (
            <>
              <span className="text-[#EF4444]">↓</span>
              <span className="text-[#CBD5E0]">Redução</span>
            </>
          )}
          {trend === 'stable' && (
            <>
              <span className="text-[#3B82F6]">→</span>
              <span className="text-[#CBD5E0]">Estável</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
