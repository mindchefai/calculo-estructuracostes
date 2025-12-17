import React from 'react';

// Tipos para las props de los componentes estilizados
interface TabButtonProps {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'profit' | 'loss' | 'gradient';
}

interface ProgressBarProps {
  label: string;
  percentage: string;
  amount: string;
  color: string;
}

// Estilos globales
export const GlobalStyles: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    .hover-lift:hover {
      transform: translateY(-2px);
      transition: all 0.3s ease;
    }
    
    .transition-all {
      transition: all 0.2s ease;
    }
  `}</style>
);

// Contenedor principal
export const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
    {children}
  </div>
);

// Wrapper del contenido
export const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-7xl mx-auto">
    <div className="bg-white rounded-lg overflow-hidden" style={{ boxShadow: '0 10px 25px rgba(32, 60, 66, 0.1)' }}>
      {children}
    </div>
  </div>
);

// Header
export const Header: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ 
  icon, 
  title, 
  subtitle 
}) => (
  <div style={{ 
    background: 'linear-gradient(135deg, #203c42 0%, #2a4c53 100%)',
    padding: '2rem'
  }}>
    <div className="flex items-center gap-4 mb-2">
      <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '0.5rem' }}>
        {icon}
      </div>
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-white mt-1" style={{ opacity: 0.8, fontWeight: 300 }}>
          {subtitle}
        </p>
      </div>
    </div>
  </div>
);

// Tabs Container
export const TabsContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex border-b" style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}>
    {children}
  </div>
);

// Tab Button
export const TabButton: React.FC<TabButtonProps> = ({ active, disabled, onClick, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex-1 py-4 px-6 font-medium transition-all relative"
    style={{
      color: active ? '#203c42' : disabled ? '#d1d5db' : '#6b7280',
      backgroundColor: active ? 'white' : 'transparent',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }}
  >
    {active && (
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        backgroundColor: '#e5b45f'
      }}></div>
    )}
    {children}
  </button>
);

// Content Area
export const ContentArea: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-8">{children}</div>
);

// Upload Area
export const UploadArea: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ icon, title, description, onFileChange }) => (
  <div className="text-center py-16">
    <div className="mb-6 inline-block p-6 rounded-full" style={{ backgroundColor: '#f9fafb' }}>
      {icon}
    </div>
    <h3 className="text-2xl font-semibold mb-3" style={{ color: '#203c42' }}>
      {title}
    </h3>
    <p className="mb-8 max-w-md mx-auto" style={{ color: '#6b7280' }}>
      {description}
    </p>
    <label 
      className="inline-block text-white px-8 py-3 rounded-lg cursor-pointer font-medium hover-lift"
      style={{ backgroundColor: '#203c42' }}
    >
      Seleccionar archivo
      <input
        type="file"
        accept=".csv"
        onChange={onFileChange}
        className="hidden"
      />
    </label>
  </div>
);

// Section Header
export const SectionHeader: React.FC<{ 
  title: string; 
  subtitle: string;
  children?: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
    <div>
      <h3 className="text-xl font-semibold mb-1" style={{ color: '#203c42' }}>
        {title}
      </h3>
      <p className="text-sm" style={{ color: '#6b7280' }}>
        {subtitle}
      </p>
    </div>
    {children && <div className="flex gap-3">{children}</div>}
  </div>
);

// Primary Button
export const PrimaryButton: React.FC<{ 
  onClick: () => void; 
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ onClick, icon, children }) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 text-sm hover-lift"
    style={{ background: 'linear-gradient(135deg, #e5b45f 0%, #f8b64a 100%)' }}
  >
    {icon}
    {children}
  </button>
);

// Secondary Button
export const SecondaryButton: React.FC<{ 
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
}> = ({ onFileChange, children }) => (
  <label 
    className="px-5 py-2.5 rounded-lg cursor-pointer font-medium text-sm transition-all"
    style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
  >
    {children}
    <input
      type="file"
      accept=".csv"
      onChange={onFileChange}
      className="hidden"
    />
  </label>
);

// Table Container
export const TableContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="overflow-x-auto border rounded-lg" style={{ borderColor: '#e5e7eb' }}>
    <table className="w-full">{children}</table>
  </div>
);

// Table Header
export const TableHeader: React.FC<{ columns: string[] }> = ({ columns }) => (
  <thead>
    <tr className="border-b" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
      {columns.map((col, idx) => (
        <th 
          key={idx}
          className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" 
          style={{ 
            color: '#6b7280',
            textAlign: idx === 2 ? 'right' : 'left'
          }}
        >
          {col}
        </th>
      ))}
    </tr>
  </thead>
);

// KPI Card
export const KPICard: React.FC<KPICardProps> = ({ title, value, icon, variant = 'default' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          bg: '#dcfce7',
          iconColor: '#16a34a',
          textColor: '#111827'
        };
      case 'default':
        return {
          bg: '#dbeafe',
          iconColor: '#2563eb',
          textColor: '#111827'
        };
      case 'profit':
        return {
          cardBg: '#d1fae5',
          borderColor: '#a7f3d0',
          bg: '#a7f3d0',
          iconColor: '#059669',
          titleColor: '#047857',
          textColor: '#064e3b'
        };
      case 'loss':
        return {
          cardBg: '#fee2e2',
          borderColor: '#fecaca',
          bg: '#fecaca',
          iconColor: '#dc2626',
          titleColor: '#b91c1c',
          textColor: '#7f1d1d'
        };
      case 'gradient':
        return {
          cardBg: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
          borderColor: '#fcd34d',
          bg: '#fde68a',
          iconColor: '#d97706',
          titleColor: '#92400e',
          textColor: '#78350f'
        };
      default:
        return {
          bg: '#dcfce7',
          iconColor: '#16a34a',
          textColor: '#111827'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div 
      className="border p-6 rounded-lg hover-lift" 
      style={{ 
        backgroundColor: variant === 'default' || variant === 'success' ? 'white' : styles.cardBg,
        borderColor: styles.borderColor || '#e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        background: variant === 'gradient' ? styles.cardBg : undefined
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 
          className="text-xs font-semibold uppercase tracking-wide" 
          style={{ color: styles.titleColor || '#6b7280' }}
        >
          {title}
        </h4>
        <div className="p-2 rounded-lg" style={{ backgroundColor: styles.bg }}>
          {React.cloneElement(icon as React.ReactElement, { 
            size: 20, 
            style: { color: styles.iconColor } 
          })}
        </div>
      </div>
      <p className="text-3xl font-bold" style={{ color: styles.textColor }}>
        {value}
      </p>
    </div>
  );
};

// Progress Bar
export const ProgressBar: React.FC<ProgressBarProps> = ({ label, percentage, amount, color }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="font-medium" style={{ color: '#374151' }}>{label}</span>
      <div className="text-right">
        <span className="font-bold text-lg" style={{ color }}>{percentage}%</span>
        <span className="text-sm ml-2" style={{ color: '#6b7280' }}>{amount}</span>
      </div>
    </div>
    <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: '#e5e7eb' }}>
      <div
        className="h-2 rounded-full"
        style={{ 
          width: `${Math.min(parseFloat(percentage), 100)}%`,
          backgroundColor: color,
          background: color.includes('gradient') ? color : undefined,
          transition: 'width 0.6s ease'
        }}
      />
    </div>
  </div>
);

// Cost Structure Card
export const CostStructureCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border p-8 rounded-lg mb-8" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
    <h4 className="text-lg font-bold mb-6" style={{ color: '#203c42' }}>Estructura de Costes</h4>
    <div className="space-y-6">{children}</div>
  </div>
);

// Executive Summary Card
export const ExecutiveSummaryCard: React.FC<{ 
  items: Array<{ label: string; value: string }> 
}> = ({ items }) => (
  <div className="p-8 rounded-lg text-white" style={{
    background: 'linear-gradient(135deg, #203c42 0%, #2a4c53 100%)'
  }}>
    <h4 className="text-xl font-bold mb-6">Resumen Ejecutivo</h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {items.map((item, idx) => (
        <div key={idx}>
          <p className="text-sm mb-2 font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {item.label}
          </p>
          <p className="text-3xl font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  </div>
);

// Dashboard Title
export const DashboardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-2xl font-bold mb-8" style={{ color: '#203c42' }}>{children}</h3>
);

// Grid Layout
export const GridLayout: React.FC<{ 
  children: React.ReactNode;
  columns?: number;
}> = ({ children, columns = 4 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6 mb-10`}>
    {children}
  </div>
);