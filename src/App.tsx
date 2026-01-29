
import { useState } from 'react';
import './App.css';

function App() {
  const [annualGoal, setAnnualGoal] = useState<number | ''>('');
  const [billableHours, setBillableHours] = useState<number | ''>('');
  const [vacationDays, setVacationDays] = useState<number | ''>('');
  const [expenses, setExpenses] = useState<number | ''>('');
  const [taxRate, setTaxRate] = useState<number | ''>('');
  const [projectHours, setProjectHours] = useState<number | ''>('');

  // Cálculos
  const safeAnnualGoal = Number(annualGoal) || 0;
  const safeExpenses = Number(expenses) || 0;
  const safeBillableHours = Number(billableHours) || 0;
  const safeVacationDays = Number(vacationDays) || 0;
  const safeTaxRate = Number(taxRate) || 0;
  const safeProjectHours = Number(projectHours) || 0;

  // 1. Ingresos Necesarios (Mensual)
  const monthlyGoal = safeAnnualGoal / 12;
  const ingresosNecesarios = monthlyGoal + safeExpenses;

  // 2. Horas Facturables Mensuales
  // (365 - días libres) / 12 meses * horas al día
  const workDaysPerYear = 365 - safeVacationDays;
  const workDaysPerMonth = workDaysPerYear / 12;
  const monthlyBillableHours = workDaysPerMonth * safeBillableHours;

  // 3. Tarifa Hora
  // (ingresosNecesarios / horasFacturables) * (1 + margenImpuestos/100)
  const baseHourlyRate = monthlyBillableHours > 0 ? (ingresosNecesarios / monthlyBillableHours) : 0;
  const tarifaHora = baseHourlyRate * (1 + safeTaxRate / 100);

  // 4. Tarifa Día (Específico x8 según requerimiento, aunque billableHours sea distinto)
  const tarifaDia = tarifaHora * 8;

  // 5. Precio Proyecto
  const precioProyecto = tarifaHora * safeProjectHours;

  const currencyFormatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  });

  // 6. Generación de Texto Propuesta
  const proposalText = `Presupuesto Rápido

Tarifa por hora: ${currencyFormatter.format(tarifaHora)}
Horas estimadas: ${safeProjectHours}h

*************************************
TOTAL PROYECTO: ${currencyFormatter.format(precioProyecto)}
*************************************

*Presupuesto válido por 15 días.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(proposalText).then(() => {
      alert('¡Propuesta copiada al portapapeles!');
    });
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Calculadora de Precio/Hora (DEPLOY OK)</h1>
        <p>Define tu valor y genera una propuesta justa.</p>
      </header>

      <main className="main-content">
        <section className="config-section">
          <h2>Configuración</h2>
          <form className="calculator-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="annualGoal">Meta de Ingresos Anuales (€)</label>
              <input
                type="number"
                id="annualGoal"
                placeholder="Ej: 50000"
                value={annualGoal}
                onChange={(e) => setAnnualGoal(e.target.valueAsNumber || '')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="billableHours">Horas Facturables por Día</label>
              <input
                type="number"
                id="billableHours"
                placeholder="Ej: 5"
                max="24"
                value={billableHours}
                onChange={(e) => setBillableHours(e.target.valueAsNumber || '')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="vacationDays">Días No Facturables (Total Anual)</label>
              <input
                type="number"
                id="vacationDays"
                placeholder="Ej: 30"
                value={vacationDays}
                onChange={(e) => setVacationDays(e.target.valueAsNumber || '')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="expenses">Gastos Operativos Mensuales (€)</label>
              <input
                type="number"
                id="expenses"
                placeholder="Ej: 200"
                value={expenses}
                onChange={(e) => setExpenses(e.target.valueAsNumber || '')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="taxRate">Impuestos (%)</label>
              <input
                type="number"
                id="taxRate"
                placeholder="Ej: 20"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.valueAsNumber || '')}
              />
            </div>

            {/* Nuevo input para cálculo de proyecto */}
            <div className="form-group">
              <label htmlFor="projectHours">Horas Estimadas del Proyecto</label>
              <input
                type="number"
                id="projectHours"
                placeholder="Ej: 40"
                value={projectHours}
                onChange={(e) => setProjectHours(e.target.valueAsNumber || '')}
              />
            </div>
          </form>
        </section>

        <section className="results-section">
          <h2>Resultados Estimados</h2>
          <div className="results-grid">
            <div className="result-card">
              <h3>Precio / Hora</h3>
              <span className="result-value">{currencyFormatter.format(tarifaHora)}</span>
            </div>
            <div className="result-card">
              <h3>Precio / Jornada (8h)</h3>
              <span className="result-value">{currencyFormatter.format(tarifaDia)}</span>
            </div>
            <div className="result-card">
              <h3>Precio Proyecto</h3>
              <span className="result-value">{currencyFormatter.format(precioProyecto)}</span>
            </div>
          </div>
        </section>

        <section className="proposal-section">
          <h2>Generar Propuesta</h2>
          <textarea
            className="proposal-preview"
            placeholder="La propuesta generada con el desglose de costos aparecerá aquí..."
            value={proposalText}
            readOnly
          ></textarea>
          <div className="actions">
            <button className="btn-copy" onClick={handleCopy}>
              Copiar Propuesta
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
