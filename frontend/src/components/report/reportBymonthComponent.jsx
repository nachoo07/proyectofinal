import { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { useMotions } from '../../context/motion/MotionContext.jsx';

// Función para preparar datos del gráfico agrupando por mes y tipo
const processChartData = (motions, selectedYear) => {
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
  ];

  return months.map((month, index) => {
    const motionsInMonth = motions.filter(motion => {
      const d = new Date(motion.date);
      return d.getFullYear() === selectedYear && d.getMonth() === index;
    });

    return {
      month,
      ingresos: motionsInMonth
        .filter(m => m.incomeType === 'ingreso')
        .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0),
      egresos: motionsInMonth
        .filter(m => m.incomeType === 'egreso')
        .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0),
    };
  });
};

// Calcula métricas resumen para el año seleccionado
const calculateMetrics = (motions, selectedYear) => {
  const filtered = motions.filter(m => new Date(m.date).getFullYear() === selectedYear);

  const totalIngresos = filtered
    .filter(m => m.incomeType === 'ingreso')
    .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);

  const totalEgresos = filtered
    .filter(m => m.incomeType === 'egreso')
    .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);

  return {
    totalIngresos,
    totalEgresos,
    balance: totalIngresos - totalEgresos,
  };
};

// Formatea a moneda argentina
const formatAsCurrency = (number, currencyCode = 'ARS', locale = 'es-AR') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(number);

const ReportByMonthComponent = () => {
  const { motions = [], loading, error, fetchMotions } = useMotions();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showDetails, setShowDetails] = useState(false);

  // Obtiene los años únicos ordenados descendentemente
  const years = Array.from(
    new Set(motions.map(m => new Date(m.date).getFullYear()))
  ).sort((a, b) => b - a);

  // Datos y métricas procesados
  const chartData = processChartData(motions, selectedYear);
  const metrics = calculateMetrics(motions, selectedYear);

  // Carga los movimientos al cambiar año
  useEffect(() => {
    fetchMotions({ 
      dateFrom: `${selectedYear}-01-01`,
      dateTo: `${selectedYear}-12-31`
    });
  }, [selectedYear, fetchMotions]);

  // Estados de carga y error
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Error al cargar los movimientos: {error}</Typography>
      </Box>
    );
  }
  
  if (!motions.length) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>No hay datos disponibles para el año seleccionado</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => fetchMotions()}
        >
          Recargar datos
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: 'background.paper', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom textAlign="center" color="#2e7d32">
        Reporte Mensual
      </Typography>

      {/* Selector de Año */}
      <FormControl sx={{ minWidth: 120, mb: 4 }}>
        <InputLabel>Año</InputLabel>
        <Select
          value={selectedYear}
          label="Año"
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map(year => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Métricas resumen */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ boxShadow: 3, borderLeft: 4, borderColor: 'green' }}>
            <CardContent>
              <Typography color="textSecondary">Total Ingresos</Typography>
              <Typography variant="h5" color="green">
                {formatAsCurrency(metrics.totalIngresos)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ boxShadow: 3, borderLeft: 4, borderColor: 'red' }}>
            <CardContent>
              <Typography color="textSecondary">Total Egresos</Typography>
              <Typography variant="h5" color="red">
                {formatAsCurrency(metrics.totalEgresos)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            boxShadow: 3, 
            borderLeft: 4, 
            borderColor: metrics.balance >= 0 ? 'green' : 'red' 
          }}>
            <CardContent>
              <Typography color="textSecondary">Balance Anual</Typography>
              <Typography variant="h5" color={metrics.balance >= 0 ? 'green' : 'red'}>
                {formatAsCurrency(metrics.balance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráfico */}
      <Card sx={{ maxWidth: 900, mx: 'auto', p: 2, mb: 4, boxShadow: 3 }}>
        <Typography variant="h6" textAlign="center" gutterBottom>
          Comparación Mensual: Ingresos vs Egresos
        </Typography>
        <Box sx={{ height: 400 }}>
          <ResponsiveBar
            data={chartData}
            keys={['ingresos', 'egresos']}
            indexBy="month"
            margin={{ top: 40, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            colors={['#2e7d32', '#d32f2f']}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Mes',
              legendPosition: 'middle',
              legendOffset: 36,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Monto (ARS)',
              legendPosition: 'middle',
              legendOffset: -50,
              format: v => formatAsCurrency(v).replace('$', '').trim()
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor="#fff"
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
              },
            ]}
            groupMode="grouped"
            tooltip={({ id, value, indexValue }) => (
              <Box sx={{ 
                bgcolor: 'background.paper', 
                p: 1, 
                borderRadius: 1, 
                boxShadow: 3,
                minWidth: 120
              }}>
                <Typography fontWeight="bold">{indexValue} {selectedYear}</Typography>
                <Typography>
                  {id === 'ingresos' ? 'Ingresos' : 'Egresos'}: {formatAsCurrency(value)}
                </Typography>
              </Box>
            )}
          />
        </Box>
      </Card>

      {/* Botón para mostrar/ocultar tabla de detalles */}
      <Box textAlign="center" mt={3}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setShowDetails(!showDetails)}
          sx={{ mb: 2 }}
        >
          {showDetails ? 'Ocultar Detalles Mensuales' : 'Mostrar Detalles Mensuales'}
        </Button>
      </Box>

      {/* Tabla de detalles colapsable */}
      <Collapse in={showDetails}>
        <Paper sx={{ overflowX: 'auto', mt: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Mes</strong></TableCell>
                <TableCell><strong>Ingresos</strong></TableCell>
                <TableCell><strong>Egresos</strong></TableCell>
                <TableCell><strong>Balance Mensual</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chartData.map(row => {
                const balance = row.ingresos - row.egresos;
                return (
                  <TableRow key={row.month} hover>
                    <TableCell>{row.month}</TableCell>
                    <TableCell sx={{ color: 'green' }}>{formatAsCurrency(row.ingresos)}</TableCell>
                    <TableCell sx={{ color: 'red' }}>{formatAsCurrency(row.egresos)}</TableCell>
                    <TableCell sx={{ 
                      color: balance >= 0 ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}>
                      {formatAsCurrency(balance)}
                    </TableCell>
                  </TableRow>
                )
              })}
              {/* Total anual */}
              <TableRow sx={{ borderTop: 2 }}>
                <TableCell><strong>Total Anual</strong></TableCell>
                <TableCell sx={{ color: 'green', fontWeight: 'bold' }}>
                  {formatAsCurrency(metrics.totalIngresos)}
                </TableCell>
                <TableCell sx={{ color: 'red', fontWeight: 'bold' }}>
                  {formatAsCurrency(metrics.totalEgresos)}
                </TableCell>
                <TableCell sx={{ 
                  color: metrics.balance >= 0 ? 'green' : 'red',
                  fontWeight: 'bold'
                }}>
                  {formatAsCurrency(metrics.balance)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default ReportByMonthComponent;