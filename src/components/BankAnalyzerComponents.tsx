import React, { useState } from 'react';
import { Upload, Check, Sparkles } from 'lucide-react';

interface Transaction {
  id: number;
  fecha: string;
  concepto: string;
  importe: number;
  categoria: string | null;
  autoCategoria?: boolean;
}

interface Stats {
  ventas: number;
  gastosGenerales: number;
  personal: number;
  materiaPrima: number;
  totalCostes: number;
  beneficio: number;
  ratios: {
    gastosVentas: number;
    personalVentas: number;
    materiaVentas: number;
    margen: string;
  };
}

interface DailySales {
  fecha: string;
  ventas: number;
}

// Componente de Logo y Header
export const LogoHeader: React.FC = () => (
  <div className="flex items-center gap-3 mb-1">
    <div style={{ 
      backgroundColor: 'rgba(255,255,255,0.1)', 
      padding: '0.5rem', 
      borderRadius: '0.4rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <img 
        src="/MC_white.png" 
        alt="MindChef Logo" 
        style={{ 
          width: '36px', 
          height: '36px',
          objectFit: 'contain'
        }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement!.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"></path></svg>';
        }}
      />
    </div>
    <div>
      <h1 className="text-2xl font-bold text-white">Analiza tus gastos reales en 2 minutos</h1>
      <p className="text-white text-sm" style={{ opacity: 0.8, fontWeight: 300 }}>
        ¿Dónde se te va el dinero de tu restaurante?
      </p>
    </div>
  </div>
);

// Componente de Requisitos del Archivo
export const FileRequirements: React.FC = () => (
  <div style={{
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '1rem',
    maxWidth: '28rem',
    margin: '0 auto 1.5rem auto',
    textAlign: 'left'
  }}>
    <p style={{ 
      fontSize: '0.8125rem',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '0.625rem',
      margin: '0 0 0.625rem 0'
    }}>
      MindChef solo necesita que el documento contenga:
    </p>
    <ul style={{ 
      listStyle: 'none', 
      padding: 0, 
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.375rem'
    }}>
      {['Fecha', 'Concepto', 'Importe'].map((item) => (
        <li key={item} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '0.8125rem',
          color: '#6b7280'
        }}>
          <Check size={14} style={{ color: '#059669', flexShrink: 0 }} />
          <span><strong>{item}</strong></span>
        </li>
      ))}
    </ul>
    <p style={{ 
      fontSize: '0.7rem',
      color: '#6b7280',
      marginTop: '0.625rem',
      margin: '0.625rem 0 0 0',
      fontStyle: 'italic'
    }}>
      Formatos: Excel (.xlsx, .xls) o CSV
    </p>
  </div>
);

// Componente de Badge de Seguridad
export const SecurityBadge: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1rem',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '0.5rem',
    maxWidth: '32rem',
    margin: '0 auto 1rem auto'
  }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
    <p style={{ 
      fontSize: '0.75rem',
      color: '#15803d',
      margin: 0,
      lineHeight: '1.3'
    }}>
      Tus datos son privados y solo se usan para generar tu análisis financiero.
    </p>
  </div>
);

// Componente de FAQ
export const FAQ: React.FC = () => (
  <details style={{
    maxWidth: '32rem',
    margin: '0 auto',
    padding: '0.875rem',
    backgroundColor: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: '0.5rem',
    cursor: 'pointer'
  }}>
    <summary style={{
      fontSize: '0.8125rem',
      fontWeight: 500,
      color: '#92400e',
      cursor: 'pointer',
      listStyle: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      ¿Qué pasa si mi banco añade más columnas?
    </summary>
    <p style={{
      fontSize: '0.75rem',
      color: '#78350f',
      marginTop: '0.625rem',
      margin: '0.625rem 0 0 0',
      lineHeight: '1.4'
    }}>
      No hay problema. Ignoramos el resto de la información y solo usamos Fecha, Concepto e Importe.
    </p>
  </details>
);

// Componente de pantalla de inicio (Upload)
export const UploadScreen: React.FC<{ 
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void 
}> = ({ onFileUpload }) => (
  <div style={{ textAlign: 'center', padding: '2rem 1.25rem' }}>
    <div style={{ 
      marginBottom: '1.25rem',
      display: 'inline-block',
      padding: '1.25rem',
      borderRadius: '9999px',
      backgroundColor: '#f0f9ff',
      border: '2px dashed #bfdbfe'
    }}>
      <Upload size={40} style={{ color: '#2563eb' }} strokeWidth={1.5} />
    </div>

    <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
      <Upload size={18} style={{ color: '#203c42' }} />
      <h3 style={{ 
        fontSize: '1.375rem', 
        fontWeight: 600, 
        color: '#203c42',
        margin: 0
      }}>
        Sube tu extracto bancario
      </h3>
    </div>

    <p style={{ 
      marginBottom: '1.25rem',
      maxWidth: '32rem',
      margin: '0 auto 1.25rem auto',
      color: '#374151',
      fontSize: '0.875rem',
      lineHeight: '1.4'
    }}>
      Descarga el archivo directamente desde tu banco y súbelo aquí, <strong>sin editarlo</strong>.
    </p>

    <FileRequirements />

    <label 
      className="hover-lift"
      style={{
        display: 'inline-block',
        color: 'white',
        padding: '0.75rem 1.75rem',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontWeight: 500,
        fontSize: '0.875rem',
        backgroundColor: '#203c42',
        marginBottom: '1.25rem'
      }}
    >
      Seleccionar archivo
      <input
        type="file"
        accept=".csv,.xlsx,.xls,.txt"
        onChange={onFileUpload}
        style={{ display: 'none' }}
      />
    </label>

    <SecurityBadge />
    <FAQ />
  </div>
);

// Banner de autocategorización
export const AutoCategorizeBanner: React.FC<{ count: number }> = ({ count }) => (
  <div style={{
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '0.5rem',
    padding: '0.625rem 0.875rem',
    marginBottom: '1.25rem',
    fontSize: '0.8125rem',
    color: '#1e40af',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }}>
    <Sparkles size={14} />
    <span>
      <strong>Categorización automática:</strong> Se han categorizado {count} transacciones automáticamente. 
      Revísalas y ajusta si es necesario.
    </span>
  </div>
);

// Fila de transacción
export const TransactionRow: React.FC<{
  transaction: Transaction;
  index: number;
  total: number;
  onCategoryChange: (id: number, categoria: string) => void;
  formatCurrency: (amount: number) => string;
}> = ({ transaction, index, total, onCategoryChange, formatCurrency }) => {
  const getCategoryIcon = (cat: string | null) => {
    const iconMap: Record<string, string> = {
      venta: '%3Cpolyline points=\'23 6 13.5 15.5 8.5 10.5 1 18\'%3E%3C/polyline%3E%3Cpolyline points=\'17 6 23 6 23 12\'%3E%3C/polyline%3E',
      gastos: '%3Cpath d=\'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\'%3E%3C/path%3E%3Cpolyline points=\'9 22 9 12 15 12 15 22\'%3E%3C/polyline%3E',
      personal: '%3Cpath d=\'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\'%3E%3C/path%3E%3Ccircle cx=\'9\' cy=\'7\' r=\'4\'%3E%3C/circle%3E%3Cpath d=\'M23 21v-2a4 4 0 0 0-3-3.87\'%3E%3C/path%3E%3Cpath d=\'M16 3.13a4 4 0 0 1 0 7.75\'%3E%3C/path%3E',
      materia: '%3Cline x1=\'16.5\' y1=\'9.4\' x2=\'7.5\' y2=\'4.21\'%3E%3C/line%3E%3Cpath d=\'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\'%3E%3C/path%3E%3Cpolyline points=\'3.27 6.96 12 12.01 20.73 6.96\'%3E%3C/polyline%3E%3Cline x1=\'12\' y1=\'22.08\' x2=\'12\' y2=\'12\'%3E%3C/line%3E',
      'no-aplica': '%3Ccircle cx=\'12\' cy=\'12\' r=\'10\'%3E%3C/circle%3E%3Cline x1=\'4.93\' y1=\'4.93\' x2=\'19.07\' y2=\'19.07\'%3E%3C/line%3E'
    };
    return iconMap[cat || ''] || '';
  };

  const getCategoryColor = (cat: string | null) => {
    const colorMap: Record<string, string> = {
      venta: '%23059669',
      gastos: '%23dc2626',
      personal: '%23f97316',
      materia: '%23ec4899',
      'no-aplica': '%236b7280'
    };
    return colorMap[cat || ''] || '%239ca3af';
  };

  return (
    <tr 
      style={{ 
        borderBottom: index < total - 1 ? '1px solid #f3f4f6' : 'none',
        transition: 'background-color 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
    >
      <td style={{ 
        padding: '0.75rem 1rem',
        fontSize: '0.8125rem',
        whiteSpace: 'nowrap',
        color: '#6b7280'
      }}>
        {transaction.fecha}
      </td>
      <td style={{ 
        padding: '0.75rem 1rem',
        fontSize: '0.8125rem',
        color: '#111827'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {transaction.concepto}
          {transaction.autoCategoria && (
            <Sparkles size={12} style={{ color: '#6b7280', flexShrink: 0 }} />
          )}
        </div>
      </td>
      <td style={{ 
        padding: '0.75rem 1rem',
        fontSize: '0.8125rem',
        textAlign: 'right',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        color: transaction.importe >= 0 ? '#059669' : '#dc2626'
      }}>
        {formatCurrency(transaction.importe)}
      </td>
      <td style={{ padding: '0.75rem 1rem' }}>
        <select
          value={transaction.categoria || ''}
          onChange={(e) => onCategoryChange(transaction.id, e.target.value)}
          style={{ 
            width: '100%',
            padding: '0.4rem 0.75rem',
            paddingLeft: '2rem',
            border: transaction.categoria ? '1px solid #e5e7eb' : '2px solid #fbbf24',
            borderRadius: '0.375rem',
            fontSize: '0.8125rem',
            outline: 'none',
            backgroundColor: 'white',
            cursor: 'pointer',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='${getCategoryColor(transaction.categoria)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E${getCategoryIcon(transaction.categoria)}%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0.625rem center',
            backgroundSize: '14px 14px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#e5b45f'}
          onBlur={(e) => {
            e.target.style.borderColor = transaction.categoria ? '#e5e7eb' : '#fbbf24';
          }}
        >
          <option value="">Seleccionar...</option>
          <option value="venta">Venta</option>
          <option value="gastos">Gastos Generales</option>
          <option value="personal">Personal</option>
          <option value="materia">Materia Prima</option>
          <option value="no-aplica">No Aplica</option>
        </select>
      </td>
    </tr>
  );
};

// Gráfico de pastel
export const PieChart: React.FC<{ stats: Stats; formatCurrency: (amount: number) => string }> = ({ stats, formatCurrency }) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  
  const total = stats.gastosGenerales + stats.personal + stats.materiaPrima;
  const gastosPercent = stats.ratios.gastosVentas;
  const personalPercent = stats.ratios.personalVentas;
  const materiaPercent = stats.ratios.materiaVentas;

  if (total === 0) {
    return (
      <div style={{ 
        border: '1px solid #e5e7eb',
        padding: '1.25rem',
        borderRadius: '0.5rem',
        backgroundColor: 'white',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9ca3af'
      }}>
        No hay datos de costes
      </div>
    );
  }

  const legendItems = [
    { label: 'Gastos Generales', color: '#dc2626', value: stats.gastosGenerales, percent: gastosPercent, key: 'gastos', bg: '#fef2f2' },
    { label: 'Personal', color: '#f97316', value: stats.personal, percent: personalPercent, key: 'personal', bg: '#fff7ed' },
    { label: 'Materia Prima', color: '#ec4899', value: stats.materiaPrima, percent: materiaPercent, key: 'materia', bg: '#fdf2f8' }
  ];

  return (
    <div style={{ 
      border: '1px solid #e5e7eb',
      padding: '1.25rem',
      borderRadius: '0.5rem',
      backgroundColor: 'white',
      height: '100%'
    }}>
      <h4 style={{ 
        fontSize: '1rem', 
        fontWeight: 700, 
        marginBottom: '1rem',
        color: '#203c42',
        margin: '0 0 1rem 0'
      }}>
        Estructura de Costes
      </h4>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <svg width="140" height="140" viewBox="0 0 200 200">
          <circle
            cx="100" cy="100" r="80"
            fill="transparent" stroke="#dc2626" strokeWidth="40"
            strokeDasharray={`${(gastosPercent / 100) * 502.65} 502.65`}
            transform="rotate(-90 100 100)"
            style={{ 
              cursor: 'pointer',
              opacity: hoveredSegment === 'gastos' || !hoveredSegment ? 1 : 0.5,
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={() => setHoveredSegment('gastos')}
            onMouseLeave={() => setHoveredSegment(null)}
          />
          <circle
            cx="100" cy="100" r="80"
            fill="transparent" stroke="#f97316" strokeWidth="40"
            strokeDasharray={`${(personalPercent / 100) * 502.65} 502.65`}
            strokeDashoffset={-((gastosPercent / 100) * 502.65)}
            transform="rotate(-90 100 100)"
            style={{ 
              cursor: 'pointer',
              opacity: hoveredSegment === 'personal' || !hoveredSegment ? 1 : 0.5,
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={() => setHoveredSegment('personal')}
            onMouseLeave={() => setHoveredSegment(null)}
          />
          <circle
            cx="100" cy="100" r="80"
            fill="transparent" stroke="#ec4899" strokeWidth="40"
            strokeDasharray={`${(materiaPercent / 100) * 502.65} 502.65`}
            strokeDashoffset={-(((gastosPercent + personalPercent) / 100) * 502.65)}
            transform="rotate(-90 100 100)"
            style={{ 
              cursor: 'pointer',
              opacity: hoveredSegment === 'materia' || !hoveredSegment ? 1 : 0.5,
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={() => setHoveredSegment('materia')}
            onMouseLeave={() => setHoveredSegment(null)}
          />
          <circle cx="100" cy="100" r="60" fill="white" />
          <text x="100" y="92" textAnchor="middle" style={{ fontSize: '10px', fill: '#6b7280', fontWeight: 500 }}>
            Total
          </text>
          <text x="100" y="108" textAnchor="middle" style={{ fontSize: '13px', fill: '#111827', fontWeight: 700 }}>
            {formatCurrency(total)}
          </text>
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {legendItems.map((item) => (
          <div 
            key={item.key}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.375rem',
              borderRadius: '0.3rem',
              backgroundColor: hoveredSegment === item.key ? item.bg : 'transparent',
              transition: 'background-color 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={() => setHoveredSegment(item.key)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: item.color, borderRadius: '2px' }}></div>
              <span style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: hoveredSegment === item.key ? 600 : 400 }}>
                {item.label}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>
                {formatCurrency(item.value)}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#6b7280', marginLeft: '0.375rem' }}>
                ({item.percent}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Gráfico de barras
export const BarChart: React.FC<{ data: DailySales[]; formatCurrency: (amount: number) => string }> = ({ data, formatCurrency }) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const maxVentas = Math.max(...data.map(d => d.ventas), 0);
  
  return (
    <div style={{ 
      border: '1px solid #e5e7eb',
      padding: '1.25rem',
      borderRadius: '0.5rem',
      backgroundColor: 'white',
      height: '100%'
    }}>
      <h4 style={{ 
        fontSize: '1rem', 
        fontWeight: 700, 
        marginBottom: '1rem',
        color: '#203c42',
        margin: '0 0 1rem 0'
      }}>
        Ventas por Día
      </h4>

      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        justifyContent: 'space-between',
        height: '180px',
        gap: '0.375rem',
        paddingTop: '0.75rem'
      }}>
        {data.length > 0 ? data.map((day, idx) => {
          const height = (day.ventas / maxVentas) * 100;
          const isHovered = hoveredBar === idx;
          
          return (
            <div 
              key={idx} 
              style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.375rem'
              }}
              onMouseEnter={() => setHoveredBar(idx)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <div style={{ 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                justifyContent: 'flex-end'
              }}>
                <span style={{ 
                  fontSize: '0.65rem', 
                  color: '#059669',
                  fontWeight: 600,
                  marginBottom: '0.2rem',
                  opacity: isHovered ? 1 : 0.7,
                  transition: 'opacity 0.2s ease'
                }}>
                  {formatCurrency(day.ventas)}
                </span>
                <div style={{ 
                  width: '100%',
                  minWidth: '28px',
                  maxWidth: '45px',
                  height: `${height}%`,
                  minHeight: '16px',
                  backgroundColor: '#059669',
                  borderRadius: '0.2rem 0.2rem 0 0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  opacity: isHovered ? 1 : 0.85,
                  transform: isHovered ? 'scaleY(1.05)' : 'scaleY(1)',
                  transformOrigin: 'bottom'
                }}></div>
              </div>
              <span style={{ 
                fontSize: '0.6rem', 
                color: '#6b7280',
                transform: 'rotate(-45deg)',
                whiteSpace: 'nowrap',
                marginTop: '0.625rem',
                fontWeight: isHovered ? 600 : 400,
                transition: 'font-weight 0.2s ease'
              }}>
                {day.fecha.split('/').slice(0, 2).join('/')}
              </span>
            </div>
          );
        }) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#9ca3af',
            fontSize: '0.875rem'
          }}>
            No hay datos de ventas
          </div>
        )}
      </div>
    </div>
  );
};