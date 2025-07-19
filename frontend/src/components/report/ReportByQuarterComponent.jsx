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
  useTheme
} from '@mui/material';
import { useMotions } from '../../context/motion/MotionContext.jsx';

// Función para procesar datos trimestrales
const processQuarterlyData = (motions, selectedYear) => {
  const quarters = [
    { id: 1, name: 'Q1 (Ene-Mar)', months: [0, 1, 2] },
    { id: 2, name: 'Q2 (Abr-Jun)', months: [3, 4, 5] },
    { id: 3, name: 'Q3 (Jul-Sep)', months: [6, 7, 8] },
    { id: 4, name: 'Q4 (Oct-Dic)', months: [9, 10, 11] },
  ];
  
  const data = quarters.map(q => {
    const quarterMotions = motions.filter(motion => {
      const motionDate = new Date(motion.date);
      return (
        motionDate.getFullYear() === selectedYear &&
        q.months.includes(motionDate.getMonth())
      );
    });
    
    const ingresos = quarterMotions
      .filter(m => m.incomeType === 'ingreso')
      .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
    
    const egresos = quarterMotions
      .filter(m => m.incomeType === 'egreso')
      .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
    
    return {
      quarter: q.name,
      ingresos,
      egresos,
      balance: ingresos - egresos,
    };
  });
  
  return data;
};

// Función para calcular métricas anuales
const calculateAnnualMetrics = (quarterlyData) => {
  const totalIngresos = quarterlyData.reduce((sum, q) => sum + q.ingresos, 0);
  const totalEgresos = quarterlyData.reduce((sum, q) => sum + q.egresos, 0);
  
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

const ReportByQuarterComponent = () => {
  const theme = useTheme();
  const {
    motions = [],
    loading,
    error,
    fetchMotions,
    fetchSummary,
    summary,
  } = useMotions();
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showDetails, setShowDetails] = useState(false);
  const [quarterlyData, setQuarterlyData] = useState([]);
  const [annualMetrics, setAnnualMetrics] = useState({
    totalIngresos: 0,
    totalEgresos: 0,
    balance: 0,
  });

  // Obtener años disponibles
  const years = Array.from(
    new Set(motions.map(m => new Date(m.date).getFullYear()))
  ).sort((a, b) => b - a);

  // Cargar datos cuando cambia el año
  useEffect(() => {
    const fetchData = async () => {
      await fetchMotions({ 
        dateFrom: `${selectedYear}-01-01`,
        dateTo: `${selectedYear}-12-31`
      });
      await fetchSummary({ 
        year: selectedYear,
        groupBy: 'quarter'
      });
    };
    
    if (years.length > 0) {
      fetchData();
    }
  }, [selectedYear]);

  // Procesar datos cuando cambian los movimientos o el resumen
  useEffect(() => {
    if (motions.length > 0) {
      const data = processQuarterlyData(motions, selectedYear);
      setQuarterlyData(data);
      setAnnualMetrics(calculateAnnualMetrics(data));
    }
  }, [motions, selectedYear]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '50vh',
        p: 4 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Error al cargar los datos
        </Typography>
        <Typography color="textSecondary" sx={{ mt: 2 }}>
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          sx={{ mt: 3 }}
          onClick={() => fetchMotions({ year: selectedYear })}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  if (!motions.length) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          No hay movimientos registrados
        </Typography>
        <Typography color="textSecondary">
          No se encontraron movimientos financieros para el año seleccionado
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          fontWeight: 'bold',
          color: theme.palette.primary.dark,
          mb: 4,
          textTransform: 'uppercase',
          letterSpacing: 1
        }}
      >
        Reporte Financiero Trimestral
      </Typography>

      {/* Filtro de año */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Año</InputLabel>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            label="Año"
            variant="outlined"
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button
          variant={showDetails ? "outlined" : "contained"}
          color="primary"
          onClick={() => setShowDetails(!showDetails)}
          sx={{ height: 56 }}
        >
          {showDetails ? 'Ocultar Detalles' : 'Mostrar Detalles'}
        </Button>
      </Box>

      {/* Métricas anuales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            boxShadow: 3, 
            borderLeft: '4px solid #2e7d32',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': { 
              transform: 'translateY(-5px)',
              boxShadow: 6
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  bgcolor: '#e8f5e9', 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <span style={{ fontSize: 24, color: '#2e7d32' }}>↑</span>
                </Box>
                <Typography variant="h6" color="textSecondary">Total Ingresos</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                {formatAsCurrency(annualMetrics.totalIngresos)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#66bb6a', mt: 1 }}>
                {summary?.incomeByCategory ? 
                  `Principales: ${Object.entries(summary.incomeByCategory)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 2)
                    .map(([cat]) => cat)
                    .join(', ')}`
                  : 'No hay datos de categorías'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            boxShadow: 3, 
            borderLeft: '4px solid #d32f2f',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': { 
              transform: 'translateY(-5px)',
              boxShadow: 6
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  bgcolor: '#ffebee', 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <span style={{ fontSize: 24, color: '#d32f2f' }}>↓</span>
                </Box>
                <Typography variant="h6" color="textSecondary">Total Egresos</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                {formatAsCurrency(annualMetrics.totalEgresos)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#f44336', mt: 1 }}>
                {summary?.expenseByCategory ? 
                  `Principales: ${Object.entries(summary.expenseByCategory)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 2)
                    .map(([cat]) => cat)
                    .join(', ')}`
                  : 'No hay datos de categorías'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            boxShadow: 3, 
            borderLeft: `4px solid ${annualMetrics.balance >= 0 ? '#2e7d32' : '#d32f2f'}`,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': { 
              transform: 'translateY(-5px)',
              boxShadow: 6
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  bgcolor: annualMetrics.balance >= 0 ? '#e8f5e9' : '#ffebee', 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <span style={{ 
                    fontSize: 24, 
                    color: annualMetrics.balance >= 0 ? '#2e7d32' : '#d32f2f' 
                  }}>
                    {annualMetrics.balance >= 0 ? '↗' : '↘'}
                  </span>
                </Box>
                <Typography variant="h6" color="textSecondary">Balance Anual</Typography>
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  color: annualMetrics.balance >= 0 ? '#2e7d32' : '#d32f2f'
                }}
              >
                {formatAsCurrency(annualMetrics.balance)}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: annualMetrics.balance >= 0 ? '#66bb6a' : '#f44336',
                  mt: 1
                }}
              >
                {annualMetrics.balance >= 0 ? 
                  'Resultado positivo' : 
                  'Resultado negativo'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráfico de flujo trimestral */}
      <Box sx={{ 
        height: 400, 
        mb: 4, 
        bgcolor: 'background.paper', 
        borderRadius: 2, 
        p: 2, 
        boxShadow: 2,
        border: '1px solid',
        borderColor: theme.palette.divider
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            mb: 2, 
            fontWeight: 'bold',
            color: theme.palette.primary.dark
          }}
        >
          Flujo Financiero por Trimestre
        </Typography>
        <ResponsiveBar
          data={quarterlyData}
          keys={['ingresos', 'egresos']}
          indexBy="quarter"
          margin={{ top: 50, right: 130, bottom: 80, left: 70 }}
          padding={0.3}
          colors={['#4caf50', '#f44336']}
          borderRadius={4}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Trimestre',
            legendPosition: 'middle',
            legendOffset: 45,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Monto',
            legendPosition: 'middle',
            legendOffset: -50,
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
              itemsSpacing: 8,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 16,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            },
          ]}
          tooltip={({ id, value, indexValue }) => (
            <Box sx={{ 
              bgcolor: 'background.paper', 
              p: 1.5, 
              borderRadius: 1, 
              boxShadow: 3,
              border: `2px solid ${id === 'ingresos' ? '#4caf50' : '#f44336'}`
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {indexValue}
              </Typography>
              <Typography sx={{ 
                color: id === 'ingresos' ? '#4caf50' : '#f44336',
                fontWeight: 'medium'
              }}>
                {id === 'ingresos' ? 'Ingresos' : 'Egresos'}: {formatAsCurrency(value)}
              </Typography>
            </Box>
          )}
          groupMode="grouped"
          animate={true}
          motionConfig="gentle"
        />
      </Box>

      {/* Gráfico de balance trimestral */}
      <Box sx={{ 
        height: 300, 
        mb: 4, 
        bgcolor: 'background.paper', 
        borderRadius: 2, 
        p: 2, 
        boxShadow: 2,
        border: '1px solid',
        borderColor: theme.palette.divider
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            mb: 2, 
            fontWeight: 'bold',
            color: theme.palette.primary.dark
          }}
        >
          Balance por Trimestre
        </Typography>
        <ResponsiveBar
          data={quarterlyData.map(q => ({
            quarter: q.quarter,
            balance: q.balance
          }))}
          keys={['balance']}
          indexBy="quarter"
          margin={{ top: 50, right: 50, bottom: 80, left: 70 }}
          padding={0.4}
          colors={(bar) => bar.data.balance >= 0 ? '#4caf50' : '#f44336'}
          borderRadius={4}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Trimestre',
            legendPosition: 'middle',
            legendOffset: 45,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Balance',
            legendPosition: 'middle',
            legendOffset: -50,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="#ffffff"
          tooltip={({ value, indexValue }) => (
            <Box sx={{ 
              bgcolor: 'background.paper', 
              p: 1.5, 
              borderRadius: 1, 
              boxShadow: 3,
              border: `2px solid ${value >= 0 ? '#4caf50' : '#f44336'}`
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {indexValue}
              </Typography>
              <Typography sx={{ 
                color: value >= 0 ? '#4caf50' : '#f44336',
                fontWeight: 'medium'
              }}>
                Balance: {formatAsCurrency(value)}
              </Typography>
            </Box>
          )}
          animate={true}
          motionConfig="gentle"
        />
      </Box>

      {/* Tabla de detalles trimestrales */}
      <Collapse in={showDetails}>
        <Paper sx={{ 
          overflowX: 'auto', 
          mb: 4,
          boxShadow: 3,
          borderRadius: 2
        }}>
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.primary.light }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Trimestre</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Ingresos</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Egresos</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quarterlyData.map((row) => (
                <TableRow 
                  key={row.quarter}
                  sx={{ 
                    '&:nth-of-type(odd)': { 
                      bgcolor: theme.palette.action.hover 
                    },
                    '&:hover': {
                      bgcolor: theme.palette.action.selected
                    }
                  }}
                >
                  <TableCell sx={{ fontWeight: 'medium' }}>{row.quarter}</TableCell>
                  <TableCell sx={{ color: '#4caf50', fontWeight: 'medium' }}>
                    {formatAsCurrency(row.ingresos)}
                  </TableCell>
                  <TableCell sx={{ color: '#f44336', fontWeight: 'medium' }}>
                    {formatAsCurrency(row.egresos)}
                  </TableCell>
                  <TableCell
                    sx={{ 
                      color: row.balance >= 0 ? '#4caf50' : '#f44336',
                      fontWeight: 'bold'
                    }}
                  >
                    {formatAsCurrency(row.balance)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Total Anual</TableCell>
                <TableCell sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {formatAsCurrency(annualMetrics.totalIngresos)}
                </TableCell>
                <TableCell sx={{ color: '#f44336', fontWeight: 'bold' }}>
                  {formatAsCurrency(annualMetrics.totalEgresos)}
                </TableCell>
                <TableCell
                  sx={{ 
                    color: annualMetrics.balance >= 0 ? '#4caf50' : '#f44336',
                    fontWeight: 'bold'
                  }}
                >
                  {formatAsCurrency(annualMetrics.balance)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default ReportByQuarterComponent;