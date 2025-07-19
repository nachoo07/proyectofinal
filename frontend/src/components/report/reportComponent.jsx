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

// Función para obtener trimestres
const getQuarter = (month) => {
  return Math.floor(month / 3) + 1;
};

// Función para obtener el rango de meses de un trimestre
const getQuarterMonths = (quarter) => {
  const months = [
    ['Ene', 'Feb', 'Mar'],
    ['Abr', 'May', 'Jun'],
    ['Jul', 'Ago', 'Sep'],
    ['Oct', 'Nov', 'Dic'],
  ];
  return months[quarter - 1];
};

// Función para procesar datos para el gráfico
const processChartData = (motions, selectedYear, groupBy, paymentMethodFilter) => {
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
  ];

  motions = motions.filter(m => (paymentMethodFilter == 'todo' || m.paymentMethod == paymentMethodFilter))
  
  if (groupBy === 'trimestre') {
    // Agrupar por trimestre
    const quarters = [1, 2, 3, 4];
    
    return quarters.map(quarter => {
      const quarterMotions = motions.filter(m => {
        const date = new Date(m.date);
        return (
          date.getFullYear() === selectedYear &&
          getQuarter(date.getMonth()) === quarter
        );
      });
      
      const ingresos = quarterMotions
        .filter(m => m.incomeType === 'ingreso')
        .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
        
      const egresos = quarterMotions
        .filter(m => m.incomeType === 'egreso')
        .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);

      return {
        period: `T${quarter}`,
        label: `Trimestre ${quarter}`,
        months: getQuarterMonths(quarter),
        ingresos,
        egresos,
      };
    });
  }

  // Por defecto: agrupar por mes
  return months.map((month, index) => {
    const monthMotions = motions.filter(m => {
      const date = new Date(m.date);
      return (
        date.getFullYear() === selectedYear &&
        date.getMonth() === index
      );
    });
    
    const ingresos = monthMotions
      .filter(m => m.incomeType === 'ingreso')
      .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
      
    const egresos = monthMotions
      .filter(m => m.incomeType === 'egreso')
      .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);

    return {
      period: month,
      label: month,
      ingresos,
      egresos,
    };
  });
};

// Función para calcular métricas
const calculateMetrics = (motions, selectedYear, paymentMethodFilter) => {
  motions = motions.filter(m => (paymentMethodFilter == 'todo' || m.paymentMethod == paymentMethodFilter))

  // Para mes y trimestre usamos el año seleccionado
  const yearMotions = motions.filter(
    m => new Date(m.date).getFullYear() === selectedYear
  );
  
  const totalIngresos = yearMotions
    .filter(m => m.incomeType === 'ingreso')
    .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
    
  const totalEgresos = yearMotions
    .filter(m => m.incomeType === 'egreso')
    .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
    
  return [{
    period: selectedYear.toString(),
    totalIngresos,
    totalEgresos,
    balance: totalIngresos - totalEgresos,
  }];
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
    fetchMotionsByYear,
    fetchAllMotions,  // Nueva función para cargar todos los movimientos
  } = useMotions();
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [groupBy, setGroupBy] = useState('mes'); // 'mes', 'trimestre' o 'anio'
  const [showDetails, setShowDetails] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('todo')

  // Obtener años disponibles
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/motion/years', {
          withCredentials: true,
        });
        setAvailableYears(response.data.sort((a, b) => b - a));
      } catch (err) {
        console.error('Error fetching years:', err);
        const yearsFromMotions = Array.from(
          new Set(motions.map(m => new Date(m.date).getFullYear()))
        ).sort((a, b) => b - a);
        setAvailableYears(yearsFromMotions);
      }
    };
    
    fetchYears();
  }, [motions]);

  // Cargar movimientos según el tipo de agrupamiento
  useEffect(() => {
    if (groupBy === 'anio') {
      fetchAllMotions(); // Cargar todos los movimientos para agrupamiento anual
    } else if (selectedYear) {
      fetchMotionsByYear(selectedYear); // Cargar solo el año seleccionado
    }
  }, [selectedYear, groupBy, fetchMotionsByYear, fetchAllMotions]);

  // Procesar datos para el gráfico
  const chartData = processChartData(motions, selectedYear, groupBy, paymentMethodFilter);
  const metrics = calculateMetrics(motions, selectedYear, paymentMethodFilter);
  console.log(chartData)

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
      <Typography variant="h4" gutterBottom className="text-center" color='#2e7d32'>
        Reporte Financiero
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
        {/* Selector de agrupamiento */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Agrupar por</InputLabel>
            <Select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              label="Agrupar por"
            >
              <MenuItem value="mes">Mes</MenuItem>
              <MenuItem value="trimestre">Trimestre</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Mostrar</InputLabel>
            <Select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              label="Agrupar por"
            >
              <MenuItem value="todo">Todo</MenuItem>
              <MenuItem value="efectivo">Efectivo</MenuItem>
              <MenuItem value="transferencia">Transferencia</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Selector de año (solo visible cuando no se agrupa por año) */}
        {groupBy !== 'anio' && (
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Año</InputLabel>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                label="Año"
              >
                {availableYears.map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>

      {/* Métricas */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)' }}>
              <CardContent>
                <Typography color="textSecondary">
                  {groupBy === 'anio' ? `Año ${metric.period}` : 'Resumen Anual'}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Ingresos:</Typography>
                    <Typography variant="h6" color="green">
                      {formatAsCurrency(metric.totalIngresos)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Egresos:</Typography>
                    <Typography variant="h6" color="red">
                      {formatAsCurrency(metric.totalEgresos)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Balance:</Typography>
                    <Typography
                      variant="h6"
                      color={metric.balance >= 0 ? 'green' : 'red'}
                    >
                      {formatAsCurrency(metric.balance)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gráfico */}
      {chartData.length > 0 && (
        <Box sx={{ height: 400, mb: 4 }}>
          <ResponsiveBar
            data={chartData}
            keys={['ingresos', 'egresos']}
            indexBy="period"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            colors={['green', 'red']}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: groupBy === 'anio' ? 'Año' : 
                      groupBy === 'trimestre' ? 'Trimestre' : 'Mes',
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
              domain: [0, Math.max(1, ...chartData.flatMap(d => [d.ingresos, d.egresos])) * 1.1],
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
                <strong>
                  {groupBy === 'anio' ? `Año ${indexValue}` : 
                   groupBy === 'trimestre' ? `Trimestre ${indexValue.replace('T', '')}` : 
                   indexValue}
                </strong>: {id} = {formatAsCurrency(value)}
              </div>
            )}
            groupMode="grouped"
          />
        </Box>
      )}

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
                <TableCell>
                  {groupBy === 'anio' ? 'Año' : 
                   groupBy === 'trimestre' ? 'Trimestre' : 'Mes'}
                </TableCell>
                {groupBy === 'trimestre' && <TableCell>Meses</TableCell>}
                <TableCell>Ingresos</TableCell>
                <TableCell>Egresos</TableCell>
                <TableCell>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chartData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {groupBy === 'trimestre' ? row.label : row.period}
                  </TableCell>
                  {groupBy === 'trimestre' && (
                    <TableCell>{row.months.join(', ')}</TableCell>
                  )}
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