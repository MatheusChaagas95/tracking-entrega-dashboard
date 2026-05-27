/**
 * Componente Header do Dashboard
 * Design: Premium Corporate Dark - Hero com gradiente azul
 */

const Package = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
  >
    <path d="M4.5 7.5l7.5-4.5 7.5 4.5v9a1.5 1.5 0 01-1.5 1.5h-12A1.5 1.5 0 014.5 16.5v-9z" />
    <path d="M12 3v13.5" />
    <path d="M4.5 7.5l7.5 4.5 7.5-4.5" />
  </svg>
);

const Calendar = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
  >
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 2.5v3" />
    <path d="M16 2.5v3" />
    <path d="M3 10.5h18" />
  </svg>
);

const RefreshCw = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
  >
    <path d="M21 12.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9l-2.4 2.4" />
    <path d="M3 11.5a8.38 8.38 0 01.9-3.8 8.5 8.5 0 017.6-4.7 8.38 8.38 0 013.8.9l2.4-2.4" />
    <path d="M21 3v6h-6" />
    <path d="M3 21v-6h6" />
  </svg>
);

interface DashboardHeaderProps {
  modo?: string;
  totalDados?: number;
  totalExibindo?: number;
  ultimaAtualizacao?: string;
  onRefresh?: () => void;
}

export const DashboardHeader = ({
  modo = 'VD',
  totalDados = 0,
  totalExibindo = 0,
  ultimaAtualizacao,
  onRefresh,
}: DashboardHeaderProps) => {
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
