import {
  Box,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  FormControl,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import es from "date-fns/locale/es";
import { useState } from "react";

const Formulario = ({ formData, setFormData, handleSubmit, incomeType, isEditing, handleCancel }) => {
  const [localError, setLocalError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData((prevData) => ({
      ...prevData,
      date: newDate,
    }));
  };

  const validateForm = () => {
    if (!formData.concept.trim()) {
      setLocalError("La descripción es obligatoria");
      return false;
    }
    if (!formData.amount || formData.amount <= 0) {
      setLocalError("El monto debe ser un número positivo");
      return false;
    }
    if (!formData.date) {
      setLocalError("La fecha es obligatoria");
      return false;
    }
    if (!formData.paymentMethod) {
      setLocalError("El método de pago es obligatorio");
      return false;
    }
    if (!["ingreso", "egreso"].includes(formData.incomeType)) {
      setLocalError("El tipo de movimiento no es válido");
      return false;
    }
    return true;
  };
const submit = (e) => {
  e.preventDefault();
  setLocalError("");
  if (!validateForm()) return;

  try {
    handleSubmit(formData);
    // Solo restablecer el formulario si handleSubmit tiene éxito
    setFormData({
      id: null,
      concept: "",
      amount: "",
      date: null,
      paymentMethod: "",
      incomeType: incomeType,
    });
  } catch (err) {
    setLocalError("Error al enviar el formulario");
    console.error(err);
  }
};

  return (
    <Box component="form" onSubmit={submit} sx={{ mb: 4 }}>
      {localError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {localError}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descripción"
            name="concept"
            value={formData.concept}
            onChange={handleInputChange}
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Monto"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleInputChange}
            variant="outlined"
            required
            inputProps={{ min: 0, step: "0.01" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label="Fecha"
              value={formData.date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField fullWidth {...params} required />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Método de Pago</InputLabel>
            <Select
              label="Método de Pago"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="">
                <em>Seleccione un método</em>
              </MenuItem>
              <MenuItem value="Efectivo">Efectivo</MenuItem>
              <MenuItem value="Transferencia">Transferencia</MenuItem>
            
            </Select>
          </FormControl>
        </Grid>
       
        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? "Actualizar" : "Agregar"}
            </Button>
            {isEditing && (
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Cancelar
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Formulario;