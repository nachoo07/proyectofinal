import Joi from 'joi';

export const loginSchema = Joi.object({
  mail: Joi.string().email().required().messages({
    'string.email': 'El correo debe ser un email válido.',
    'any.required': 'El correo es obligatorio.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres.',
    'any.required': 'La contraseña es obligatoria.',
  }),
});