import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, Stack } from '@mui/material';

const FiltersBar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      paymentMethod: '',
      incomeType: '',
    });
  };

  return (
    <Box mb={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Fecha desde"
          name="dateFrom"
          type="date"
          value={filters.dateFrom}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          label="Fecha hasta"
          name="dateTo"
          type="date"
          value={filters.dateTo}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          label="Monto mínimo"
          name="amountMin"
          type="number"
          value={filters.amountMin}
          onChange={handleChange}
          size="small"
          inputProps={{ min: 0 }}
        />
        <TextField
          label="Monto máximo"
          name="amountMax"
          type="number"
          value={filters.amountMax}
          onChange={handleChange}
          size="small"
          inputProps={{ min: 0 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Método de pago</InputLabel>
          <Select
            name="paymentMethod"
            value={filters.paymentMethod}
            label="Método de pago"
            onChange={handleChange}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="efectivo">Efectivo</MenuItem>
            <MenuItem value="transferencia">Transferencia</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Tipo de movimiento</InputLabel>
          <Select
            name="incomeType"
            value={filters.incomeType}
            label="Tipo de movimiento"
            onChange={handleChange}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="ingreso">Ingreso</MenuItem>
            <MenuItem value="egreso">Egreso</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" color="secondary" onClick={clearFilters}>
          Limpiar filtros
        </Button>
      </Stack>
    </Box>
  );
};
export default FiltersBar; 