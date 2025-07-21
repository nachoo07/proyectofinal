import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  FormControl,
  Alert,
  Stack,
Modal
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
    <Card elevation={4} sx={{ maxWidth: 600, mx: "auto", mt: 4, borderRadius: 3 }}>
      <CardHeader
        title={isEditing ? "Editar Movimiento" : "Nuevo Movimiento"}
        sx={{ backgroundColor: "#f5f5f5ff", textAlign: "center" }}
      />
      <CardContent >
        <Box component="form" onSubmit={submit} >
          <Stack spacing={2}>
            {localError && (
              <Alert severity="error">{localError}</Alert>
            )}

            <TextField
              fullWidth
              label="Descripción"
              name="concept"
              value={formData.concept}
              onChange={handleInputChange}
              variant="outlined"
              required
            />

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

            <FormControl fullWidth required>
              <InputLabel>Método de Pago</InputLabel>
              <Select
                label="Método de Pago"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <MenuItem value="">
                  <em>Seleccione un método</em>
                </MenuItem>
                <MenuItem value="efectivo">Efectivo</MenuItem>
                <MenuItem value="transferencia">Transferencia</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Tipo de Movimiento</InputLabel>
              <Select
                label="Tipo de Movimiento"
                name="incomeType"
                value={formData.incomeType}
                onChange={handleInputChange}
              >
                <MenuItem value="">
                  <em>Seleccione un tipo</em>
                </MenuItem>
                <MenuItem value="ingreso">Ingreso</MenuItem>
                <MenuItem value="egreso">Egreso</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              {isEditing && (
                <Button variant="outlined" color="secondary" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" variant="contained"   color="success">
                {isEditing ? "Actualizar" : "Agregar"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
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
