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
import { useState } from "react";
import PropTypes from "prop-types";

const Formulario = ({ formData, setFormData, handleSubmit, isEditing, handleCancel }) => {
  const [localError, setLocalError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
    if (!formData.paymentMethod) {
      setLocalError("El método de pago es obligatorio");
      return false;
    }
    if (!["ingreso", "egreso"].includes(formData.incomeType)) {
      setLocalError("El tipo de movimiento no es válido");
      return false;
    }
    setLocalError("");
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!validateForm()) return;

    try {
      await handleSubmit(formData);
      setFormData({
        id: null,
        concept: "",
        amount: "",
        date: null,
        paymentMethod: "",
        incomeType: "",
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
        <Grid xs={12}>
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
        <Grid xs={12} sm={6}>
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
        <Grid xs={12} sm={6}>
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
              <MenuItem value="efectivo">Efectivo</MenuItem>
              <MenuItem value="transferencia">Transferencia</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Movimiento</InputLabel>
            <Select
              label="Tipo de Movimiento"
              name="incomeType"
              value={formData.incomeType}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="">
                <em>Seleccione un tipo</em>
              </MenuItem>
              <MenuItem value="ingreso">Ingreso</MenuItem>
              <MenuItem value="egreso">Egreso</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12}>
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
Formulario.propTypes = {
  formData: PropTypes.shape({
    id: PropTypes.any,
    concept: PropTypes.string.isRequired,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    date: PropTypes.any,
    paymentMethod: PropTypes.string.isRequired,
    incomeType: PropTypes.string.isRequired,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func,
};

export default Formulario;
