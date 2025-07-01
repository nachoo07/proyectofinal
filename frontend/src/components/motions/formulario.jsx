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
    console.log("Fecha seleccionada:", newDate); // Depuración de la selección de fecha
    setFormData((prevData) => ({
      ...prevData,
      date: newDate,
    }));
  };

  const validateForm = () => {
    console.log("Validando formulario con datos:", formData); // Depuración de datos del formulario
    if (!formData.concept.trim()) {
      setLocalError("La descripción es obligatoria");
      console.log("Validación fallida: Descripción vacía");
      return false;
    }
    if (!formData.amount || formData.amount <= 0) {
      setLocalError("El monto debe ser un número positivo");
      console.log("Validación fallida: Monto inválido");
      return false;
    }
    if (!formData.date || isNaN(new Date(formData.date).getTime())) {
      setLocalError("La fecha es obligatoria y debe ser válida");
      console.log("Validación fallida: Fecha inválida");
      return false;
    }
    if (!formData.paymentMethod) {
      setLocalError("El método de pago es obligatorio");
      console.log("Validación fallida: Método de pago faltante");
      return false;
    }
    if (!["ingreso", "egreso"].includes(formData.incomeType)) {
      setLocalError("El tipo de movimiento no es válido");
      console.log("Validación fallida: incomeType inválido");
      return false;
    }
    setLocalError(""); // Limpiar error si la validación pasa
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    console.log("Formulario enviado con datos:", formData); // Depuración de envío
    setLocalError("");
    if (!validateForm()) {
      console.log("Validación del formulario fallida");
      return;
    }

    try {
      await handleSubmit(formData);
      console.log("Envío del formulario exitoso");
      setFormData({
        id: null,
        concept: "",
        amount: "",
        date: null,
        paymentMethod: "",
        incomeType: incomeType,
      });
    } catch (err) {
      console.error("Error en el envío del formulario:", err);
      setLocalError(err.message || "Error al enviar el formulario");
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
          <FormControl fullWidth sx={{ minWidth: 165}} >
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
              <MenuItem value="efectivo">Efectivo</MenuItem>
              <MenuItem value="transferencia">Transferencia</MenuItem>
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