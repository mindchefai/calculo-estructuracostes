import React, { useState, useMemo } from 'react';
import { 
  Upload, 
  Check, 
  TrendingUp, 
  DollarSign, 
  PieChart as PieChartIcon,  
  Sparkles, 
  TrendingDown,
} from 'lucide-react';
import {
  GlobalStyles,
  Container,
  ContentWrapper,
  TabsContainer,
  TabButton,
  ContentArea,
  SectionHeader,
  PrimaryButton,
  TableContainer,
  TableHeader,
  DashboardTitle,
} from './BankAnalyzerStyled';
import {
  LogoHeader,
  UploadScreen,
  AutoCategorizeBanner,
  TransactionRow,
  PieChart,
  BarChart
} from './BankAnalyzerComponents';

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

// Reglas de categorización automática
const CATEGORIA_RULES = {
  venta: [
    /transfer.*en div/i, /ingreso/i, /cobro/i, /venta/i, /factura/i, 
    /pago.*recibido/i, /abono/i, /stripe/i, /paypal/i
  ],
  gastos: [
    /google ads/i, /facebook/i, /facebk/i, /canva/i, /publicidad/i, /marketing/i,
    /office/i, /microsoft/i, /adobe/i, /hosting/i, /dominio/i, /servidor/i,
    /aws/i, /azure/i, /dropbox/i, /zoom/i, /software/i, /licencia/i,
    /suscripcion/i, /alquiler/i, /luz/i, /agua/i, /telefono/i, /internet/i,
    /gestor/i, /asesoria/i, /seguro/i, /banco/i, /comision/i
  ],
  personal: [
    /nomina/i, /salario/i, /sueldo/i, /tgss/i, /seguridad social/i,
    /cotizacion/i, /irpf/i, /autonomo/i,
  ],
  materia: [
    /compra/i, /proveedor/i, /material/i, /suministro/i,
    /mercaderia/i, /stock/i,
  ]
};

const BankAnalyzer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'datos' | 'resultados'>('datos');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [validated, setValidated] = useState<boolean>(false);

  const showError = (title: string, message: string) => {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: white; padding: 1.5rem; border-radius: 0.75rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      max-width: 28rem; z-index: 9999; border: 2px solid #fbbf24;
    `;
    
    errorDiv.innerHTML = `
      <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" style="flex-shrink: 0;">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <div>
          <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 600; color: #92400e;">
            ${title}
          </h3>
          <p style="margin: 0; font-size: 0.8125rem; color: #78350f; line-height: 1.4;">
            ${message}
          </p>
        </div>
      </div>
      <button onclick="this.parentElement.remove()" style="
        width: 100%; padding: 0.5rem; background: #f59e0b; color: white;
        border: none; border-radius: 0.375rem; font-weight: 500; cursor: pointer; font-size: 0.8125rem;
      ">
        Entendido
      </button>
    `;
    
    document.body.appendChild(errorDiv);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    
    let headerLineIndex = lines.findIndex(line => {
      const lower = line.toLowerCase();
      return lower.includes('concepto') && 
             (lower.includes('fecha') || lower.includes('date')) &&
             (lower.includes('importe') || lower.includes('amount'));
    });

    if (headerLineIndex === -1) {
      headerLineIndex = lines.findIndex(line => line.includes('\t'));
    }

    if (headerLineIndex === -1) {
      showError(
        'No encontramos las columnas necesarias',
        'Tu archivo debe contener estas columnas: <strong>Fecha</strong>, <strong>Concepto</strong> e <strong>Importe</strong>. Por favor, revisa el archivo o descarga el extracto completo desde tu banco.'
      );
      return;
    }

    const headers = lines[headerLineIndex].toLowerCase().split(/[\t,;]/);
    
    const conceptoIdx = headers.findIndex(h => 
      h.includes('concepto') || h.includes('descripcion') || h.includes('description')
    );
    const fechaIdx = headers.findIndex(h => 
      h.includes('fecha') || h.includes('date')
    );
    const importeIdx = headers.findIndex(h => 
      h.includes('importe') || h.includes('cantidad') || h.includes('amount')
    );

    if (conceptoIdx === -1 || fechaIdx === -1 || importeIdx === -1) {
      const missingColumns = [];
      if (fechaIdx === -1) missingColumns.push('Fecha');
      if (conceptoIdx === -1) missingColumns.push('Concepto');
      if (importeIdx === -1) missingColumns.push('Importe');
      
      showError(
        'Faltan columnas obligatorias',
        `No encontramos: <strong>${missingColumns.join(', ')}</strong>. Por favor, revisa el archivo o descarga el extracto completo desde tu banco.`
      );
      return;
    }

    const parsed: Transaction[] = lines
      .slice(headerLineIndex + 1)
      .filter(line => line.trim())
      .map((line, idx) => {
        const separator = line.includes('\t') ? '\t' : /[,;]/;
        const values = line.split(separator).map(v => v.trim());

        let importeStr = values[importeIdx] || '0';
        
        importeStr = importeStr.replace(/[€$£]/g, '').replace(/\s/g, '');
        
        let importe = 0;
        
        if (importeStr.includes(',') && importeStr.includes('.')) {
          const lastComma = importeStr.lastIndexOf(',');
          const lastDot = importeStr.lastIndexOf('.');
          
          if (lastComma > lastDot) {
            importeStr = importeStr.replace(/\./g, '').replace(',', '.');
          } else {
            importeStr = importeStr.replace(/,/g, '');
          }
        } else if (importeStr.includes(',')) {
          const parts = importeStr.split(',');
          if (parts.length === 2 && parts[1].length <= 2) {
            importeStr = importeStr.replace(',', '.');
          } else {
            importeStr = importeStr.replace(/,/g, '');
          }
        } else if (importeStr.includes('.')) {
          const parts = importeStr.split('.');
          if (parts.length === 2 && parts[1].length <= 2) {
            // Decimal americano
          } else {
            importeStr = importeStr.replace(/\./g, '');
          }
        }
        
        importe = parseFloat(importeStr) || 0;
        const concepto = values[conceptoIdx]?.trim() || '';
        const categoria = autoCategorize(concepto, importe);

        return {
          id: idx,
          fecha: values[fechaIdx]?.trim() || '',
          concepto: concepto,
          importe: importe,
          categoria: categoria,
          autoCategoria: categoria !== null
        };
      })
      .filter(t => t.concepto || t.importe !== 0);

    setTransactions(parsed);
    setValidated(false);
  };

  const autoCategorize = (concepto: string, importe: number): string | null => {
    if (importe > 0) {
      for (const pattern of CATEGORIA_RULES.venta) {
        if (pattern.test(concepto)) {
          return 'venta';
        }
      }
      return 'venta';
    }

    for (const [categoria, patterns] of Object.entries(CATEGORIA_RULES)) {
      if (categoria === 'venta') continue;
      
      for (const pattern of patterns) {
        if (pattern.test(concepto)) {
          return categoria;
        }
      }
    }

    return null;
  };

  const handleAutoCategorize = () => {
    const updated = transactions.map(t => ({
      ...t,
      categoria: autoCategorize(t.concepto, t.importe),
      autoCategoria: true
    }));
    setTransactions(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          const text = event.target.result as string;
          parseCSV(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCategoryChange = (id: number, categoria: string) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, categoria, autoCategoria: false } : t)
    );
  };

  const handleValidate = () => {
    const allCategorized = transactions.every(t => t.categoria);
    if (allCategorized) {
      setValidated(true);
      setActiveTab('resultados');
    } else {
      const uncategorized = transactions.filter(t => !t.categoria).length;
      alert(`Por favor, categoriza todas las transacciones. Faltan ${uncategorized} transacciones por categorizar.`);
    }
  };

  const stats = useMemo<Stats | null>(() => {
    if (!validated) return null;

    const relevantTransactions = transactions.filter(t => t.categoria !== 'no-aplica');

    const ventas = relevantTransactions
      .filter(t => t.categoria === 'venta')
      .reduce((sum, t) => sum + Math.abs(t.importe), 0);

    const gastosGenerales = relevantTransactions
      .filter(t => t.categoria === 'gastos')
      .reduce((sum, t) => sum + Math.abs(t.importe), 0);

    const personal = relevantTransactions
      .filter(t => t.categoria === 'personal')
      .reduce((sum, t) => sum + Math.abs(t.importe), 0);

    const materiaPrima = relevantTransactions
      .filter(t => t.categoria === 'materia')
      .reduce((sum, t) => sum + Math.abs(t.importe), 0);

    const totalCostes = gastosGenerales + personal + materiaPrima;
    const beneficio = ventas - totalCostes;

    const gastosPercent = totalCostes > 0 ? (gastosGenerales / totalCostes) * 100 : 0;
    const personalPercent = totalCostes > 0 ? (personal / totalCostes) * 100 : 0;
    const materiaPercent = totalCostes > 0 ? (materiaPrima / totalCostes) * 100 : 0;

    let gastosRounded = Math.round(gastosPercent);
    let personalRounded = Math.round(personalPercent);
    let materiaRounded = Math.round(materiaPercent);

    if (totalCostes > 0) {
      const sum = gastosRounded + personalRounded + materiaRounded;
      if (sum !== 100) {
        const diff = 100 - sum;
        if (gastosPercent >= personalPercent && gastosPercent >= materiaPercent) {
          gastosRounded += diff;
        } else if (personalPercent >= materiaPercent) {
          personalRounded += diff;
        } else {
          materiaRounded += diff;
        }
      }
    }

    return {
      ventas,
      gastosGenerales,
      personal,
      materiaPrima,
      totalCostes,
      beneficio,
      ratios: {
        gastosVentas: gastosRounded,
        personalVentas: personalRounded,
        materiaVentas: materiaRounded,
        margen: ventas > 0 ? (beneficio / ventas * 100).toFixed(1) : '0.0'
      }
    };
  }, [transactions, validated]);

  const dailySales = useMemo<DailySales[]>(() => {
    if (!validated) return [];

    const salesByDate = new Map<string, number>();
    
    transactions
      .filter(t => t.categoria === 'venta')
      .forEach(t => {
        const current = salesByDate.get(t.fecha) || 0;
        salesByDate.set(t.fecha, current + Math.abs(t.importe));
      });

    return Array.from(salesByDate.entries())
      .map(([fecha, ventas]) => ({ fecha, ventas }))
      .sort((a, b) => {
        const dateA = a.fecha.split('/').reverse().join('');
        const dateB = b.fecha.split('/').reverse().join('');
        return dateA.localeCompare(dateB);
      });
  }, [transactions, validated]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const categorizedCount = transactions.filter(t => t.categoria).length;
  const autoCategorizedCount = transactions.filter(t => t.autoCategoria).length;

  const CompactKPI: React.FC<{ 
    title: string; 
    value: string; 
    icon: React.ReactNode;
    variant: 'success' | 'danger';
  }> = ({ title, value, icon, variant }) => (
    <div style={{ 
      border: '1px solid #e5e7eb',
      padding: '0.875rem',
      borderRadius: '0.5rem',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease',
    }}
    className="hover-lift"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
        <h4 style={{ 
          fontSize: '0.7rem', 
          fontWeight: 600, 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          color: '#6b7280',
          margin: 0
        }}>
          {title}
        </h4>
        <div style={{ 
          padding: '0.3rem', 
          borderRadius: '0.3rem',
          backgroundColor: variant === 'success' ? '#dcfce7' : '#fee2e2'
        }}>
          {React.cloneElement(icon as React.ReactElement, { 
            size: 14, 
            style: { color: variant === 'success' ? '#059669' : '#dc2626' } 
          })}
        </div>
      </div>
      <p style={{ 
        fontSize: '1.25rem', 
        fontWeight: 700,
        color: variant === 'success' ? '#059669' : '#dc2626',
        margin: 0
      }}>
        {value}
      </p>
    </div>
  );

  return (
    <>
      <GlobalStyles />
      <Container>
        <ContentWrapper>
          <div style={{ 
            background: 'linear-gradient(135deg, #203c42 0%, #2a4c53 100%)',
            padding: '1.25rem 1.5rem'
          }}>
            <LogoHeader />
          </div>

          <TabsContainer>
            <TabButton active={activeTab === 'datos'} onClick={() => setActiveTab('datos')}>
              <Upload style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} size={16} />
              Datos
            </TabButton>
            <TabButton 
              active={activeTab === 'resultados'} 
              disabled={!validated}
              onClick={() => validated && setActiveTab('resultados')}
            >
              <PieChartIcon style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} size={16} />
              Resultados
            </TabButton>
          </TabsContainer>

          <ContentArea>
            {activeTab === 'datos' && (
              <div>
                {transactions.length === 0 ? (
                  <UploadScreen onFileUpload={handleFileUpload} />
                ) : (
                  <div>
                    <SectionHeader
                      title="Categoriza tus transacciones"
                      subtitle={`${categorizedCount} de ${transactions.length} categorizadas${autoCategorizedCount > 0 ? ` (${autoCategorizedCount} automáticas)` : ''}`}
                    >
                      <label 
                        className="px-4 py-2 rounded-lg cursor-pointer font-medium text-sm transition-all"
                        style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
                      >
                        Cambiar archivo
                        <input
                          type="file"
                          accept=".csv,.xlsx,.xls,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={handleAutoCategorize}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          fontWeight: 500,
                          fontSize: '0.8125rem',
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      >
                        <Sparkles size={14} />
                        Auto-categorizar
                      </button>
                      <PrimaryButton onClick={handleValidate} icon={<Check size={16} />}>
                        Validar
                      </PrimaryButton>
                    </SectionHeader>

                    {autoCategorizedCount > 0 && (
                      <AutoCategorizeBanner count={autoCategorizedCount} />
                    )}

                    <TableContainer>
                      <TableHeader columns={['Fecha', 'Concepto', 'Importe', 'Categoría']} />
                      <tbody style={{ backgroundColor: 'white' }}>
                        {transactions.map((transaction, index) => (
                          <TransactionRow
                            key={transaction.id}
                            transaction={transaction}
                            index={index}
                            total={transactions.length}
                            onCategoryChange={handleCategoryChange}
                            formatCurrency={formatCurrency}
                          />
                        ))}
                      </tbody>
                    </TableContainer>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'resultados' && stats && (
              <div>
                <DashboardTitle>Dashboard Financiero</DashboardTitle>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.875rem',
                  marginBottom: '1.5rem'
                }}>
                  <CompactKPI
                    title="Ventas Totales"
                    value={formatCurrency(stats.ventas)}
                    icon={<TrendingUp />}
                    variant="success"
                  />
                  <CompactKPI
                    title="Costes Totales"
                    value={formatCurrency(stats.totalCostes)}
                    icon={<TrendingDown />}
                    variant="danger"
                  />
                  <CompactKPI
                    title="Beneficio"
                    value={formatCurrency(stats.beneficio)}
                    icon={<DollarSign />}
                    variant={stats.beneficio >= 0 ? 'success' : 'danger'}
                  />
                  <CompactKPI
                    title="Margen"
                    value={`${stats.ratios.margen}%`}
                    icon={<PieChartIcon />}
                    variant={parseFloat(stats.ratios.margen) >= 0 ? 'success' : 'danger'}
                  />
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '1.25rem'
                }}>
                  <PieChart stats={stats} formatCurrency={formatCurrency} />
                  <BarChart data={dailySales} formatCurrency={formatCurrency} />
                </div>
              </div>
            )}
          </ContentArea>
        </ContentWrapper>
      </Container>
    </>
  );
};

export default BankAnalyzer;