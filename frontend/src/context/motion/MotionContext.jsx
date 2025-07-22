import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { LoginContext } from '../login/LoginContext';

const MotionContext = createContext();

export const MotionProvider = ({ children }) => {
  const { auth, loading: authLoading } = useContext(LoginContext);
  const [motions, setMotions] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    incomeByCategory: {},
    expenseByCategory: {},
  });
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    paymentMethod: '',
    incomeType: '',
  });

  // Función para obtener movimientos por año
  const fetchMotionsByYear = useCallback(async (year) => {
    setLoading(true);
    try {
      const dateFrom = `${year}-01-01`;
      const dateTo = `${year}-12-31`;
      const response = await axios.get(
        `http://localhost:4000/api/motion?dateFrom=${dateFrom}&dateTo=${dateTo}`,
        { withCredentials: true }
      );
      setMotions(response.data.motions);
      setCount(response.data.totalItems);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar movimientos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Función general para obtener movimientos
  const fetchMotions = useCallback(async (customFilters = {}) => {
    setLoading(true);
    try {
      const activeFilters = { ...filters, ...customFilters };
      const params = new URLSearchParams();
      
      if (activeFilters.dateFrom) params.append('dateFrom', activeFilters.dateFrom);
      if (activeFilters.dateTo) params.append('dateTo', activeFilters.dateTo);
      if (activeFilters.amountMin) params.append('amountMin', activeFilters.amountMin);
      if (activeFilters.amountMax) params.append('amountMax', activeFilters.amountMax);
      if (activeFilters.paymentMethod) params.append('paymentMethod', activeFilters.paymentMethod);
      if (activeFilters.incomeType) params.append('incomeType', activeFilters.incomeType);
      if (activeFilters.page) params.append('page', activeFilters.page);
      if (activeFilters.pageSize) params.append('pageSize', activeFilters.pageSize);

      const response = await axios.get(
        `http://localhost:4000/api/motion/paginated?${params.toString()}`,
        { withCredentials: true }
      );
      
      setMotions(response.data.motions);
      setCount(response.data.totalItems);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar movimientos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createMotion = async (motionData) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/motion/create', motionData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      setMotions((prev) => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error creating motion:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Error al crear movimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMotion = async (id, motionData) => {
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:4000/api/motion/update/${id}`, motionData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      setMotions((prev) => prev.map((m) => (m.id === id ? response.data : m)));
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error updating motion:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Error al actualizar movimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMotion = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:4000/api/motion/delete/${id}`, {
        withCredentials: true,
      });
      setMotions((prev) => prev.filter((m) => m.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting motion:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Error al eliminar movimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async (periodFilters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(periodFilters);
      const response = await axios.get(`http://localhost:4000/api/motion/summary?${params.toString()}`, {
        withCredentials: true,
      });
      setSummary(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching summary:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Error al cargar resumen');
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyReport = async (year, month) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ year, month });
      const response = await axios.get(`http://localhost:4000/api/motion/report/monthly?${params.toString()}`, {
        withCredentials: true,
      });
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error generating monthly report:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Error al generar reporte');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionContext.Provider
      value={{
        motions,
        count,
        loading,
        error,
        summary,
        filters,
        setFilters,
        fetchMotions,
        fetchMotionsByYear, // Nueva función
        createMotion,
        updateMotion,
        deleteMotion,
        fetchSummary,
        generateMonthlyReport,
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