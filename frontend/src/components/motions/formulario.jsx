import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";

// Define constants for reusability
const PAYMENT_METHODS = [
  { value: "efectivo", label: "Efectivo" },
  { value: "transferencia", label: "Transferencia" },
]; 
const TRANSACTION_TYPES = [
  { value: "ingreso", label: "Ingreso" },
  { value: "egreso", label: "Egreso" },
];

const Formulario = ({ formData, setFormData, handleSubmit, isEditing, handleCancel }) => {
  const [localError, setLocalError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "amount" ? parseFloat(value) || "" : value,
    }));
  };

  const validateForm = () => {
    if (!formData.concept.trim()) {
      setLocalError("La descripción es obligatoria");
      return false;
    }
    if (formData.concept.length > 100) {
      setLocalError("La descripción no puede exceder los 100 caracteres");
      return false;
    }
    if (!formData.amount || formData.amount <= 0 || isNaN(formData.amount)) {
      setLocalError("El monto debe ser un número positivo válido");
      return false;
    }
    if (!formData.paymentMethod) {
      setLocalError("El método de pago es obligatorio");
      return false;
    }
    if (!TRANSACTION_TYPES.some((type) => type.value === formData.incomeType)) {
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
        id: "",
        concept: "",
        amount: "",
        date: "",
        paymentMethod: "",
        incomeType: "",
      });
    } catch (err) {
      console.error("Error en el envío del formulario:", err);
      setLocalError(err.message || "Error al enviar el formulario. Intente nuevamente.");
    }
  };

  return (
    <Card elevation={4} sx={{ maxWidth: 600, mx: "auto", mt: 4, borderRadius: 3 }}>
      <CardHeader
        title={isEditing ? "Editar Movimiento" : "Nuevo Movimiento"}
        sx={{ backgroundColor: "rgba(32, 129, 38, 1) !important", color: "white", textAlign: "center" }}
      />
      <CardContent>
        <Box component="form" onSubmit={submit} aria-label={isEditing ? "Formulario de edición" : "Formulario de nuevo movimiento"}>
          <Stack spacing={2}>
            {localError && <Alert severity="error">{localError}</Alert>}

            <TextField
              fullWidth
              label="Descripción"
              name="concept"
              value={formData.concept}
              onChange={handleInputChange}
              variant="outlined"
              required
              inputProps={{ maxLength: 100 }}
              aria-describedby="concept-error"
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
              inputProps={{ min: 0, step: "0.01", "aria-describedby": "amount-error" }}
            />

            <FormControl fullWidth required>
              <InputLabel id="payment-method-label">Método de Pago</InputLabel>
              <Select
                labelId="payment-method-label"
                label="Método de Pago"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                aria-describedby="payment-method-error"
              >
                <MenuItem value="" disabled>
                  Seleccione un método
                </MenuItem>
                {PAYMENT_METHODS.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel id="income-type-label">Tipo de Movimiento</InputLabel>
              <Select
                labelId="income-type-label"
                label="Tipo de Movimiento"
                name="incomeType"
                value={formData.incomeType}
                onChange={handleInputChange}
                aria-describedby="income-type-error"
              >
                <MenuItem value="" disabled>
                  Seleccione un tipo
                </MenuItem>
                {TRANSACTION_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              {isEditing && (
                <Button variant="outlined" color="secondary" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" variant="contained" color="success">
                {isEditing ? "Actualizar" : "Agregar"}
              </Button>
              <Button
  variant="outlined"
  color="inherit"
  onClick={handleCancel}
  sx={{ ml: 2 }}
>
  Cancelar
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