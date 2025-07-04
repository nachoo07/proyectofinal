import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/user/UserContext';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './tableUser.css';

const TableUser = () => {
  const { users, loading, error, fetchUsers, deleteUser, updateUserState, createUser, updateUser } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState({
    name: '',
    mail: '',
    password: '',
    role: 'user',
    state: 'activo',
  });
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
  }, [isModalOpen]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ name: '', mail: '', password: '', role: 'user', state: 'activo' }); // Reiniciar formulario
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setFormData({
      name: user.name,
      mail: user.mail,
      password: '',
      role: user.role,
      state: user.state,
    });
    setSelectedUserId(user.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await createUser({
          name: formData.name,
          mail: formData.mail,
          password: formData.password,
          role: formData.role,
        });
        await Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Usuario creado exitosamente',
          timer: 2000,
          showConfirmButton: false,
        });
        closeModal();
      } else {
        const updateData = {
          name: formData.name,
          mail: formData.mail,
          role: formData.role,
          state: formData.state,
        };
        if (formData.password) updateData.password = formData.password;
        await updateUser(selectedUserId, updateData);
        await Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Usuario actualizado exitosamente',
          timer: 2000,
          showConfirmButton: false,
        });
        closeModal();
      }
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al procesar la solicitud',
        showConfirmButton: true,
      });
      // No cerrar el modal en caso de error
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: '¿Quieres eliminar este usuario?',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        await Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'Usuario eliminado exitosamente',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Error al eliminar usuario',
        });
      }
    }
  };

  const handleStateChange = async (id, currentState) => {
    const newState = currentState === 'activo' ? 'inactivo' : 'activo';
    try {
      await updateUserState(id, newState);
      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: `Estado cambiado a ${newState}`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al cambiar estado',
      });
    }
  };

  return (
    <div className="container">
      <h1 className="title">Panel de Usuarios</h1>
      <div className="search-row">
        <input
          type="text"
          placeholder="Buscar usuario..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="add-button" onClick={openCreateModal}>
          Agregar Usuario
        </button>
      </div>
      {loading && <p>Cargando...</p>}
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Mail</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.mail}</td>
                  <td>{user.role}</td>
                  <td>{user.state}</td>
                  <td>
                    <button
                      className="action-button edit-button"
                      onClick={() => openEditModal(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDelete(user.id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="action-button state-button"
                      onClick={() => handleStateChange(user.id, user.state)}
                    >
                      {user.state === 'activo' ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No se encontraron usuarios</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal con React-Bootstrap */}
      <Modal show={isModalOpen} onHide={closeModal} centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                name="mail"
                value={formData.mail}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña {modalMode === 'edit' && '(opcional)'}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={modalMode === 'create'}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
            {modalMode === 'edit' && (
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </Form.Select>
              </Form.Group>
            )}
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={closeModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {modalMode === 'create' ? 'Crear' : 'Guardar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TableUser;