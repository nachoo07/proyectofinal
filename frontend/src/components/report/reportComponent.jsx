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

// Función para procesar datos para el gráfico
const processChartData = (motions, selectedYear) => {
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
  ];
  const data = months.map((month, index) => {
    const monthMotions = motions.filter((motion) => {
      const motionDate = new Date(motion.date);
      return (
        motionDate.getFullYear() === selectedYear &&
        motionDate.getMonth() === index
      );
    });
    return {
      month,
      ingresos: monthMotions
        .filter((m) => m.incomeType === 'ingreso')
        .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0),
      egresos: monthMotions
        .filter((m) => m.incomeType === 'egreso')
        .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0),
    };
  });
  return data;
};

// Función para calcular métricas
const calculateMetrics = (motions, selectedYear) => {
  const yearMotions = motions.filter(
    (m) => new Date(m.date).getFullYear() === selectedYear
  );
  console.log("Motions del año:", yearMotions);
  const totalIngresos = yearMotions
    .filter((m) => m.incomeType === 'ingreso')
    .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
  const totalEgresos = yearMotions
    .filter((m) => m.incomeType === 'egreso')
    .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
  return {
    totalIngresos,
    totalEgresos,
    balance: totalIngresos - totalEgresos,
  };
};

const formatAsCurrency = (number, currencyCode = 'ARS', locale = 'es-AR') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(number);
};

const ReportComponent = () => {
  const {
    motions = [],
    loading,
    error,
    fetchMotions,
  } = useMotions();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showDetails, setShowDetails] = useState(false);

  // Obtener años disponibles
  const years = Array.from(
    new Set(motions.map((m) => new Date(m.date).getFullYear()))
  ).sort((a, b) => b - a);

  // Procesar datos para el gráfico
  const chartData = processChartData(motions, selectedYear);
  const metrics = calculateMetrics(motions, selectedYear);

  useEffect(() => {
    fetchMotions({ year: selectedYear }); // Ajusta según la API
  }, [selectedYear]);

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
        <Typography>No hay datos disponibles</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: 'background.paper' }} className="min-h-screen">
      <Typography variant="h4" gutterBottom className="text-center">
        Reporte Financiero
      </Typography>

      {/* Filtro de año */}
      <FormControl sx={{ minWidth: 120, mb: 4 }}>
        <InputLabel>Año</InputLabel>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          label="Año"
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Métricas */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Total Ingresos</Typography>
              <Typography variant="h5" color="green">
                {formatAsCurrency(metrics.totalIngresos)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Total Egresos</Typography>
              <Typography variant="h5" color="red">
                {formatAsCurrency(metrics.totalEgresos)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Balance</Typography>
              <Typography
                variant="h5"
                color={metrics.balance >= 0 ? 'green' : 'red'}
              >
                {formatAsCurrency(metrics.balance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráfico */}
      <Box sx={{ height: 400, mb: 4 }}>
        <ResponsiveBar
          data={chartData}
          keys={['ingresos', 'egresos']}
          indexBy="month"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          colors={['green', 'red']}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Mes',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Monto ($)',
            legendPosition: 'middle',
            legendOffset: -40,
            domain: [0, Math.max(...chartData.flatMap(d => [d.ingresos, d.egresos])) * 1.1],
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="#ffffff"
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
          tooltip={({ id, value, indexValue }) => (
            <div className="bg-white p-2 border rounded shadow">
              <strong>{indexValue}</strong>: {id} = ${value.toLocaleString()}
            </div>
          )}
          groupMode="grouped"
        />
      </Box>

      {/* Botón para mostrar/ocultar detalles */}
      <Button
        variant="outlined"
        onClick={() => setShowDetails(!showDetails)}
        sx={{ mb: 2 }}
      >
        {showDetails ? 'Ocultar Detalles' : 'Mostrar Detalles'}
      </Button>

      {/* Tabla de detalles */}
      <Collapse in={showDetails}>
        <Paper sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mes</TableCell>
                <TableCell>Ingresos</TableCell>
                <TableCell>Egresos</TableCell>
                <TableCell>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chartData.map((row) => (
                <TableRow key={row.month}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell sx={{ color: 'green' }}>
                    {formatAsCurrency(row.ingresos)}
                  </TableCell>
                  <TableCell sx={{ color: 'red' }}>
                    {formatAsCurrency(row.egresos)}
                  </TableCell>
                  <TableCell
                    sx={{ color: row.ingresos - row.egresos >= 0 ? 'green' : 'red' }}
                  >
                    {formatAsCurrency(row.ingresos - row.egresos)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default ReportComponent;