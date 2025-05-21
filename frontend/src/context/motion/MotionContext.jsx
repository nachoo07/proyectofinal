import { createContext, useState, useContext} from 'react';
import PropTypes from 'prop-types';

const MotionContext = createContext();

export const MotionProvider = ({ children }) => {
  const [motions, setMotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    incomeByCategory: {},
    expenseByCategory: {}
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '', // 'ingreso' o 'egreso'
    paymentMethod: '' // 'efectivo', 'transferencia', etc.
  });

  // Obtener todos los movimientos
  const fetchMotions = async (customFilters = {}) => {
    setLoading(true);
    try {
      const activeFilters = { ...filters, ...customFilters };
      const params = new URLSearchParams();

      if (activeFilters.startDate) params.append('startDate', activeFilters.startDate);
      if (activeFilters.endDate) params.append('endDate', activeFilters.endDate);
      if (activeFilters.type) params.append('type', activeFilters.type);
      if (activeFilters.paymentMethod) params.append('paymentMethod', activeFilters.paymentMethod);

      const response = await fetch(`${process.env.BACKEND_URL}/api/motion?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al cargar movimientos');
      setMotions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching motions:', err);
      setError(err.message || 'Error al cargar movimientos');
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo movimiento
  const createMotion = async (motionData) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/motion/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(motionData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al crear movimiento');
      setMotions(prev => [...prev, data]);
      //await fetchSummary(); // Actualizar el resumen
      setError(null);
      return data;
    } catch (err) {
      console.error('Error creating motion:', err);
      setError(err.message || 'Error al crear movimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un movimiento
  const updateMotion = async (id, motionData) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/motion/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(motionData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al actualizar movimiento');
      setMotions(prev => prev.map(m => m.id === id ? data : m));
      //await fetchSummary(); // Actualizar el resumen
      setError(null);
      return data;
    } catch (err) {
      console.error('Error updating motion:', err);
      setError(err.message || 'Error al actualizar movimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un movimiento
  const deleteMotion = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/motion/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al eliminar movimiento');
      }
      setMotions(prev => prev.filter(m => m.id !== id));
      //await fetchSummary(); // Actualizar el resumen
      setError(null);
    } catch (err) {
      console.error('Error deleting motion:', err);
      setError(err.message || 'Error al eliminar movimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener resumen financiero
  const fetchSummary = async (periodFilters = {}) => {
    try {
      const params = new URLSearchParams(periodFilters);
      const response = await fetch(`${process.env.BACKEND_URL}/api/motion/summary?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al cargar resumen');
      setSummary(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError(err.message || 'Error al cargar resumen');
    }
  };

  // Generar reporte mensual automático
  const generateMonthlyReport = async (year, month) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ year, month });
      const response = await fetch(`${process.env.BACKEND_URL}/api/motion/report/monthly?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al generar reporte');
      setError(null);
      return data; // Devuelve el reporte generado
    } catch (err) {
      console.error('Error generating monthly report:', err);
      setError(err.message || 'Error al generar reporte');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionContext.Provider
      value={{
        motions,
        loading,
        error,
        summary,
        filters,
        setFilters,
        fetchMotions,
        createMotion,
        updateMotion,
        deleteMotion,
        fetchSummary,
        generateMonthlyReport
      }}
    >
      {children}
    </MotionContext.Provider>
  );
};

MotionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useMotions = () => {
  const context = useContext(MotionContext);
  if (context === undefined) {
    throw new Error('useMotions must be used within a MotionProvider');
  }
  return context;
};