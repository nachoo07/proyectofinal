import { useState, useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { UserContext } from '../../context/user/UserContext';
import { toast } from 'react-toastify';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import CancelIcon from '@mui/icons-material/Cancel';
import './tableUser.css';

const TableUser = () => {
  const { users, loading, fetchUsers, deleteUser, updateUserState, createUser, updateUser } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [formData, setFormData] = useState({
    name: '',
    mail: '',
    password: '',
    role: 'user',
    state: 'activo',
  });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateDialog = () => {
    setDialogMode('create');
    setFormData({ name: '', mail: '', password: '', role: 'user', state: 'activo' });
    setOpenDialog(true);
  };

  const openEditDialog = (user) => {
    setDialogMode('edit');
    setFormData({
      name: user.name,
      mail: user.mail,
      password: '',
      role: user.role,
      state: user.state,
    });
    setSelectedUserId(user.id);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedUserId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (dialogMode === 'create') {
        await createUser({
          name: formData.name,
          mail: formData.mail,
          password: formData.password,
          role: formData.role,
        });
        toast.success('Usuario creado exitosamente');
        closeDialog();
      } else {
        const updateData = {
          name: formData.name,
          mail: formData.mail,
          role: formData.role,
          state: formData.state,
        };
        if (formData.password) updateData.password = formData.password;
        await updateUser(selectedUserId, updateData);
        toast.success('Usuario actualizado exitosamente');
        closeDialog();
      }
    } catch (err) {
      toast.error(`Error: ${err.response?.data?.message || 'Error al procesar la solicitud'}`);
    }
  };

  const handleOpenDeleteDialog = (userId) => {
    setUserToDelete(userId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(userToDelete);
      toast.success('Usuario eliminado exitosamente');
    } catch (err) {
      toast.error(`Error al eliminar usuario: ${err.response?.data?.message || 'Desconocido'}`);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleStateChange = async (id, currentState) => {
    const newState = currentState === 'activo' ? 'inactivo' : 'activo';
    try {
      await updateUserState(id, newState);
      toast.success(`Estado cambiado a ${newState}`);
    } catch (err) {
      toast.error(`Error al cambiar estado: ${err.response?.data?.message || 'Desconocido'}`);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          mt: 8,
          backgroundColor: '#E6F9EC',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="#00335c">
          Cargando usuarios...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #e8f5e9 0%, #b2dfdb 100%)',
        minHeight: '100vh',
        p: { xs: 1, md: 2, lg: 2 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        boxSizing: 'border-box',
      }}
      className="user-container"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          mb: 4,
          p: 2,
          background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
          borderRadius: '16px',
          boxShadow: '0 6px 24px rgba(67, 233, 123, 0.15)',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.01)',
          },
        }}
      >
        <PersonIcon sx={{ fontSize: 48, color: '#00335c', mr: 2 }} />
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: '#00335c',
            textShadow: '2px 2px 6px rgba(56, 249, 215, 0.15)',
            letterSpacing: '0.08rem',
          }}
        >
          Panel de Usuarios
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          mb: { xs: 2, md: 4 },
          flexWrap: 'wrap',
          gap: 2,
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            flexGrow: 1,
            maxWidth: '900px',
            minWidth: '260px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(56, 249, 215, 0.08)',
            p: 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextField
            label="Buscar por Nombre o Correo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
              },
              '& .MuiInputLabel-root': { color: '#00335c' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={openCreateDialog}
            sx={{
              borderRadius: '32px',
              fontWeight: 700,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              px: { xs: 3, md: 5 },
              py: { xs: 1.5, md: 2 },
              minWidth: { xs: '180px', md: '220px' },
            }}
          >
            Agregar Usuario
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          mb: 4,
          borderRadius: '16px',
          boxShadow: '0 6px 24px rgba(67, 233, 123, 0.10)',
          overflow: 'auto',
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)' }}>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, borderTopLeftRadius: '16px', textAlign: 'center' }}>#</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Nombre</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Correo</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Rol</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Estado</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, borderTopRightRadius: '16px', textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', color: '#00335c', fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' }, py: 4 }}>
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  sx={{
                    background: index % 2 === 0 ? '#f8fafc' : '#e0f7fa',
                    transition: 'background 0.2s',
                    '&:hover': { background: '#b2dfdb' },
                  }}
                >
                  <TableCell sx={{ color: '#00335c', fontWeight: 600, textAlign: 'center' }}>{index + 1}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{user.name}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{user.mail}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{user.role}</TableCell>
                  <TableCell sx={{ color: user.state === 'activo' ? '#388e3c' : '#d32f2f', fontWeight: 700, textAlign: 'center' }}>{user.state}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Editar usuario">
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          onClick={() => openEditDialog(user)}
                          sx={{ borderRadius: '50%', minWidth: 40, height: 40, p: 0 }}
                        >
                          <EditIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Eliminar usuario">
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleOpenDeleteDialog(user.id)}
                          sx={{ borderRadius: '50%', minWidth: 40, height: 40, p: 0 }}
                        >
                          <DeleteIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip title={user.state === 'activo' ? 'Desactivar' : 'Activar'}>
                        <Button
                          variant="contained"
                          sx={{
                            borderRadius: '50%',
                            minWidth: 40,
                            height: 40,
                            p: 0,
                            backgroundColor: user.state === 'activo' ? '#ffc107' : '#388e3c',
                            '&:hover': { backgroundColor: user.state === 'activo' ? '#e0a800' : '#2e7d32' },
                          }}
                          size="small"
                          onClick={() => handleStateChange(user.id, user.state)}
                        >
                          {user.state === 'activo' ? <ToggleOffIcon /> : <ToggleOnIcon />}
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={closeDialog}
        maxWidth="md"
        fullWidth
        className="user-management-dialog"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(27, 94, 32, 0.15)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(165, 214, 167, 0.3)',
            minHeight: '500px',
            maxWidth: '700px',
            margin: '20px',
          
          },
        }}
      >
        <DialogTitle
          className="user-management-dialog-title"
          sx={{
            background: 'linear-gradient(135deg, #a5d6a7 0%, #81c784 100%)',
            color: '#1b5e20',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            fontSize: '1.8rem',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '1rem 2rem',
            textAlign: 'center',
            justifyContent: 'center',
            
          }}
        >
          <PersonIcon sx={{ mr: 2, fontSize: 36, color: '#1b5e20' }} />
          {dialogMode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
        </DialogTitle>
        <DialogContent 
          className="user-management-dialog-content"
          sx={{ 
            padding: '2rem 3rem', 
            backgroundColor: 'rgba(248, 255, 254, 0.8)',
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            className="user-management-form"
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              mt: 2
            }}
          >
            <TextField
              label="Nombre completo"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
              className="user-management-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '& fieldset': { borderColor: '#e2e8f0', borderWidth: '2px' },
                  '&:hover fieldset': { borderColor: '#81c784' },
                  '&.Mui-focused fieldset': { borderColor: '#81c784', borderWidth: '2px' },
                  transition: 'all 0.3s ease',
                },
                '& .MuiInputLabel-root': { color: '#1b5e20', fontWeight: 600 },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1b5e20' },
              }}
            />
            <TextField
              label="Correo electrónico"
              name="mail"
              type="email"
              value={formData.mail}
              onChange={handleInputChange}
              required
              fullWidth
              className="user-management-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '& fieldset': { borderColor: '#e2e8f0', borderWidth: '2px' },
                  '&:hover fieldset': { borderColor: '#81c784' },
                  '&.Mui-focused fieldset': { borderColor: '#81c784', borderWidth: '2px' },
                  transition: 'all 0.3s ease',
                },
                '& .MuiInputLabel-root': { color: '#1b5e20', fontWeight: 600 },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1b5e20' },
              }}
            />
            <TextField
              label={`Contraseña${dialogMode === 'edit' ? ' (opcional)' : ''}`}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required={dialogMode === 'create'}
              disabled={dialogMode === 'edit'}
              fullWidth
              className="user-management-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '& fieldset': { borderColor: '#e2e8f0', borderWidth: '2px' },
                  '&:hover fieldset': { borderColor: '#81c784' },
                  '&.Mui-focused fieldset': { borderColor: '#81c784', borderWidth: '2px' },
                  transition: 'all 0.3s ease',
                },
                '& .MuiInputLabel-root': { color: '#1b5e20', fontWeight: 600 },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1b5e20' },
              }}
            />
            <FormControl
              fullWidth
              className="user-management-select"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '& fieldset': { borderColor: '#e2e8f0', borderWidth: '2px' },
                  '&:hover fieldset': { borderColor: '#81c784' },
                  '&.Mui-focused fieldset': { borderColor: '#81c784', borderWidth: '2px' },
                  transition: 'all 0.3s ease',
                },
                '& .MuiInputLabel-root': { color: '#1b5e20', fontWeight: 600 },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1b5e20' },
              }}
            >
              <InputLabel>Rol del usuario</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label="Rol del usuario"
                required
              >
                <MenuItem value="user">Usuario</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>
            {dialogMode === 'edit' && (
              <FormControl
                fullWidth
                className="user-management-select"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '& fieldset': { borderColor: '#e2e8f0', borderWidth: '2px' },
                    '&:hover fieldset': { borderColor: '#81c784' },
                    '&.Mui-focused fieldset': { borderColor: '#81c784', borderWidth: '2px' },
                    transition: 'all 0.3s ease',
                  },
                  '& .MuiInputLabel-root': { color: '#1b5e20', fontWeight: 600 },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#1b5e20' },
                }}
              >
                <InputLabel>Estado del usuario</InputLabel>
                <Select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  label="Estado del usuario"
                  required
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions 
          className="user-management-dialog-actions"
          sx={{ 
            padding: '2rem 3rem 3rem', 
            justifyContent: 'center',
            gap: 2,
            backgroundColor: 'rgba(248, 255, 254, 0.8)',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
          }}
        >
          <Button
            onClick={closeDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            className="user-management-btn-cancel"
            sx={{
              color: '#1b5e20',
              borderColor: '#81c784',
              borderRadius: '16px',
              fontWeight: 600,
              fontSize: '1.1rem',
              padding: '8px 16px',
              minWidth: '140px',
              borderWidth: '2px',
              '&:hover': {
                backgroundColor: 'rgba(129, 199, 132, 0.1)',
                borderColor: '#1b5e20',
                borderWidth: '2px',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(129, 199, 132, 0.3)',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={dialogMode === 'create' ? <PersonIcon /> : <EditIcon />}
            className="user-management-btn-save"
            sx={{
              background: 'linear-gradient(135deg, #a5d6a7 0%, #81c784 100%)',
              color: '#1b5e20',
              borderRadius: '16px',
              fontWeight: 600,
              fontSize: '1.1rem',
              padding: '8px 16px',
              minWidth: '140px',
              border: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #81c784 0%, #66bb6a 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(129, 199, 132, 0.4)',
              },
            }}
          >
            {dialogMode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        className="user-delete-confirmation-dialog"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(211, 47, 47, 0.15)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(244, 67, 54, 0.2)',
            minWidth: '500px',
            margin: '20px',
          },
        }}
      >
        <DialogTitle
          className="user-delete-dialog-title"
          sx={{
            background: 'linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%)',
            color: '#b71c1c',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            fontSize: '1.6rem',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '2rem 3rem',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <DeleteIcon sx={{ mr: 2, fontSize: 32, color: '#d32f2f' }} />
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent 
          className="user-delete-dialog-content"
          sx={{ 
            padding: '3rem', 
            backgroundColor: 'rgba(255, 249, 249, 0.8)',
            textAlign: 'center'
          }}
        >
          <Typography 
            className="user-delete-message"
            sx={{ 
              color: '#d32f2f', 
              fontSize: '1.2rem',
              fontWeight: 500,
              lineHeight: 1.6,
              maxWidth: '400px',
              margin: '0 auto'
            }}
          >
            ¿Estás seguro de que quieres eliminar este usuario? 
            <br />
            <strong>Esta acción no se puede deshacer.</strong>
          </Typography>
        </DialogContent>
        <DialogActions 
          className="user-delete-dialog-actions"
          sx={{ 
            padding: '2rem 3rem 3rem', 
            justifyContent: 'center',
            gap: 2,
            backgroundColor: 'rgba(255, 249, 249, 0.8)',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
          }}
        >
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            className="user-delete-btn-cancel"
            sx={{
              color: '#666',
              borderColor: '#bbb',
              borderRadius: '16px',
              fontWeight: 600,
              fontSize: '1.1rem',
              padding: '8px 16px',
              minWidth: '140px',
              borderWidth: '2px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                borderColor: '#999',
                borderWidth: '2px',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            startIcon={<DeleteIcon />}
            className="user-delete-btn-confirm"
            sx={{
              background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
              color: '#ffffff',
              borderRadius: '16px',
              fontWeight: 600,
              fontSize: '1.1rem',
              padding: '8px 16px',
              minWidth: '140px',
              border: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(211, 47, 47, 0.4)',
              },
            }}
          >
            Eliminar Usuario
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableUser;