import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useContext } from 'react'; // Importar useContext
import { LoginContext } from '../../context/login/LoginContext'; // Importar LoginContext

const Navigato = () => {
  // Usar el contexto de login para acceder a la función logout
  const { logout, userData } = useContext(LoginContext);

  // Manejar el clic en el botón de cerrar sesión
  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
    <Container fluid>
      <Navbar.Brand as={Link} to="/">Inicio</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="navbarScroll">
        <Nav
          className="me-auto my-2 my-lg-0"
          style={{ maxHeight: '100px' }}
          navbarScroll
        >
          <Nav.Link as={Link} to="/user">usuarios</Nav.Link>
           <Nav.Link as={Link} to="/notifications">Notificaciones</Nav.Link>
           <Nav.Link as={Link} to="/motions">Movimientos</Nav.Link>
           <Nav.Link as={Link} to="/reports">Reportes</Nav.Link>
           <Nav.Link as={Link} to="/students">Alumnos</Nav.Link>
          <Nav.Link as={Link} to="/shares" >Cuotas</Nav.Link>
        </Nav>
        <Form className="d-flex">
          {userData && <span className="me-3 align-self-center">Hola, {userData.name}</span>}
          <Button variant="outline-success" onClick={handleLogout}>Cerrar Sesión</Button>
        </Form>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}

export default Navigato