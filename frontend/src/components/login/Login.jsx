import  { useState, useContext, useEffect } from 'react';
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

const PageLogin = () => {
  const { login, auth, loading } = useContext(LoginContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });

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
    <div
      className="position-relative d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${fondoLogin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      {/* Overlay oscuro */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1,
        }}
      ></div>

      {/* Login */}
      <Container
        fluid
        className="position-relative z-2 d-flex align-items-center justify-content-center"
        style={{ zIndex: 2 }}
      >
        {loading ? (
          <div className="text-center text-white">
            <Spinner animation="border" variant="light" />
            <p className="mt-3">Cargando...</p>
          </div>
        ) : (
          <Row className="justify-content-center w-100">
            <Col xs={11} sm={8} md={6} lg={4}>
              <Card
                className="shadow border-0 rounded-4 p-3"
                style={{ backgroundColor: '#e8f5e9' }} // verde muy suave
              >
                <Card.Body>
                  <h3 className="text-center mb-4 text-success fw-bold">
                    Iniciar Sesión
                  </h3>
                  <Form onSubmit={handleSubmit} className="text-center">
                    <Form.Group controlId="email" className="mb-3">
                      <Form.Label className="fw-semibold">Correo</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="ej: usuario@gmail.com"
                        className="mx-auto rounded-pill p-2 text-center"
                        style={{ maxWidth: '300px' }}
                        value={email}
                        isInvalid={!!formErrors.email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="password" className="mb-3">
                      <Form.Label className="fw-semibold">Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="********"
                        className="mx-auto rounded-pill p-2 text-center"
                        style={{ maxWidth: '300px' }}
                        value={password}
                        isInvalid={!!formErrors.password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {error && (
                      <div className="text-danger text-center mb-3">{error}</div>
                    )}

                    <Button
                      type="submit"
                      variant="success"
                      className="w-75 rounded-pill mt-2"
                    >
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
