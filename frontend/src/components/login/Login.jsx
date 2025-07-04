import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../context/login/LoginContext';

const PageLogin = () => {
  const { login, auth, loading } = useContext(LoginContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (auth && !loading) {
      navigate(auth === 'admin' ? '/' : '/homeuser', { replace: true });
    }
  }, [auth, loading, navigate]);

  // Validación en el frontend
  const validateForm = () => {
    let valid = true;
    const errors = { email: '', password: '' };

    if (!email) {
      errors.email = 'El correo es obligatorio';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'El correo no es válido';
      valid = false;
    }

    if (!password) {
      errors.password = 'La contraseña es obligatoria';
      valid = false;
    } else if (password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.email ? 'border-red-500' : ''
                }`}
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.password ? 'border-red-500' : ''
                }`}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {formErrors.password && (
                <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
              )}
            </div>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PageLogin;