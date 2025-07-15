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
    <div className="main-container" style={{ padding: '32px 16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2.5rem',
          padding: '1.5rem',
          background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
          borderRadius: '16px',
          boxShadow: '0 6px 24px rgba(67, 233, 123, 0.15)',
        }}
      >
        <span style={{ fontSize: 40, color: '#00335c', marginRight: 16 }}>👤</span>
        <h1 className="title" style={{ fontWeight: 800, color: '#00335c', margin: 0, fontSize: '2.2rem', letterSpacing: '0.07em' }}>
          Panel de Usuarios
        </h1>
      </div>
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
      {loading && <p style={{ textAlign: 'center', color: '#00335c', fontWeight: 700 }}>Cargando...</p>}
      <div className="table-container">
        <table className="user-table" style={{ minWidth: 650 }}>
          <thead>
            <tr style={{ background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)' }}>
              <th style={{ color: '#00335c', fontWeight: 700, fontSize: '1.1rem', borderTopLeftRadius: '16px', textAlign: 'center' }}>#</th>
              <th style={{ color: '#00335c', fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }}>Nombre</th>
              <th style={{ color: '#00335c', fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }}>Mail</th>
              <th style={{ color: '#00335c', fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }}>Rol</th>
              <th style={{ color: '#00335c', fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }}>Estado</th>
              <th style={{ color: '#00335c', fontWeight: 700, fontSize: '1.1rem', borderTopRightRadius: '16px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  style={{
                    background: index % 2 === 0 ? '#f8fafc' : '#e0f7fa',
                    transition: 'background 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#b2dfdb'}
                  onMouseLeave={e => e.currentTarget.style.background = index % 2 === 0 ? '#f8fafc' : '#e0f7fa'}
                >
                  <td style={{ color: '#00335c', fontWeight: 600, textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{user.name}</td>
                  <td style={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{user.mail}</td>
                  <td style={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{user.role}</td>
                  <td style={{ color: user.state === 'activo' ? '#388e3c' : '#d32f2f', fontWeight: 700, textAlign: 'center' }}>{user.state}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                      <button
                        className="action-button edit-button"
                        onClick={() => openEditModal(user)}
                        style={{ borderRadius: '50%', minWidth: 40, height: 40, padding: 0, background: '#43e97b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Editar"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 21h4.586a2 2 0 0 0 1.414-.586l9.707-9.707a2 2 0 0 0 0-2.828l-3.172-3.172a2 2 0 0 0-2.828 0L4.586 14.414A2 2 0 0 0 4 15.828V21z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDelete(user.id)}
                        style={{ borderRadius: '50%', minWidth: 40, height: 40, padding: 0, background: '#d32f2f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Eliminar"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6h18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                          <rect x="5" y="6" width="14" height="14" rx="2" stroke="#fff" strokeWidth="2"/>
                        </svg>
                      </button>
                      <button
                        className="action-button state-button"
                        onClick={() => handleStateChange(user.id, user.state)}
                        style={{ borderRadius: '50%', minWidth: 40, height: 40, padding: 0, background: user.state === 'activo' ? '#ffc107' : '#388e3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title={user.state === 'activo' ? 'Desactivar' : 'Activar'}
                      >
                        {user.state === 'activo' ? (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/>
                            <line x1="8" y1="12" x2="16" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        ) : (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/>
                            <path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', fontWeight: 600, color: '#00335c', padding: '2rem' }}>No se encontraron usuarios</td>
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
              <Form.Label>Contraseña {modalMode === 'edit'}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={modalMode === 'create'}
                disabled={modalMode === 'edit'}
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