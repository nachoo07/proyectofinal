import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../context/login/LoginContext';
import {
  Spinner,
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import fondoLogin from '../../assets/ninos-futbol.webp';
import './login.css';
 
const PageLogin = () => {
  const { login, auth, loading } = useContext(LoginContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (auth && !loading) {
      navigate(auth === 'admin' ? '/' : '/homeuser', { replace: true });
    }
  }, [auth, loading, navigate]);

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

    if (!validateForm()) return;

    try {
      await login(email, password);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Overlay oscuro */}
      <div className="login-overlay"></div>

      {/* Login */}
      <Container fluid className="login-container">
        {loading ? (
          <div className="login-loading">
            <Spinner animation="border" variant="light" />
            <p className="login-loading-text">Cargando...</p>
          </div>
        ) : (
          <Row className="login-row">
            <Col xs={11} sm={9} md={7} lg={5} xl={4}>
              <Card className="login-card">
                <Card.Body className="login-card-body">
                  <h3 className="login-title">
                    <i className="fas fa-futbol" style={{marginRight: '10px', fontSize: '2rem'}}></i>
                    Bienvenido
                  </h3>
                  <Form onSubmit={handleSubmit} className="login-form">
                    <Form.Group controlId="email" className="login-form-group">
                      <Form.Label className="login-form-label">
                        <i className="fas fa-envelope" style={{marginRight: '8px'}}></i>
                        Correo Electrónico
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Ingresa tu correo electrónico"
                        className="login-form-control"
                        value={email}
                        isInvalid={!!formErrors.email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid" className="login-form-feedback">
                        {formErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="password" className="login-form-group">
                      <Form.Label className="login-form-label">
                        <i className="fas fa-lock" style={{marginRight: '8px'}}></i>
                        Contraseña
                      </Form.Label>
                      <div style={{ position: 'relative' }}>
  <Form.Control
    type={showPassword ? 'text' : 'password'}
    placeholder="Ingresa tu contraseña"
    className="login-form-control"
    value={password}
    isInvalid={!!formErrors.password}
    onChange={(e) => setPassword(e.target.value)}
    style={{ paddingRight: '40px' }}
  />
  <i
    className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: 'absolute',
      top: '50%',
      right: '10px',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: '#666'
    }}
  />
</div>
<Form.Control.Feedback type="invalid" className="login-form-feedback">
  {formErrors.password}
</Form.Control.Feedback>

                      <Form.Control.Feedback type="invalid" className="login-form-feedback">
                        {formErrors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {error && (
                      <div className="login-error">{error}</div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      className="login-button"
                      disabled={loading}
                    >
                      <i className="fas fa-sign-in-alt" style={{marginRight: '8px'}}></i>
                      Iniciar Sesión
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default PageLogin;