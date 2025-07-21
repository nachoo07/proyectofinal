import { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon,
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Tabs, 
  Tab, 
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Event as EventIcon,
  Notifications as ReminderIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { format, parseISO, isBefore } from 'date-fns';
import { useNotifications } from '../../context/notification/notificationContext';

const NotificationComponent = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [newNotificationOpen, setNewNotificationOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const context = useNotifications();
  
  const [newNotification, setNewNotification] = useState({
    message: '',
    type: 'reminder',
    expirationDate: ''
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredNotifications = useMemo(() => {
    return context.notifications.filter(notification => {
      const isExpired = isBefore(parseISO(notification.expirationDate), new Date());
      
      if (activeTab === 'all') return !isExpired;
      if (activeTab === 'events') return notification.type === 'event' && !isExpired;
      if (activeTab === 'reminders') return notification.type === 'reminder' && !isExpired;
      if (activeTab === 'expired') return isExpired;
      
      return true;
    });
  }, [context.notifications, activeTab]);

  const handleCreateNotification = async () => {
    try {
      await context.createNotification({
        ...newNotification,
        expirationDate: newNotification.expirationDate || new Date(Date.now() + 86400000).toISOString()
      });
      setNewNotificationOpen(false);
      setNewNotification({
        message: '',
        type: 'reminder',
        expirationDate: ''
      });
      setSuccessMessage('Notificación creada con éxito');
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  const handleEditNotification = async () => {
    try {
      await context.updateNotification(currentNotification.id, currentNotification);
      setEditModalOpen(false);
      setSuccessMessage('Notificación actualizada con éxito');
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await context.deleteNotification(id);
      setDeleteModalOpen(false);
      setSuccessMessage('Notificación eliminada con éxito');
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  if (context.loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (context.error) {
    return (
      <Box p={2}>
        <Alert 
          severity="error"
          action={
            <Button 
              color="inherit" 
              size="small"
              startIcon={<RefreshIcon />}
              onClick={context.refreshNotifications}
            >
              Reintentar
            </Button>
          }
        >
          {context.error}
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => { if (typeof window !== 'undefined' && window.history) window.history.back(); }}
          sx={{ color: '#007F5F', borderColor: '#007F5F' }}
        >
          Volver
        </Button>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h1" color='#007F5F'>Notificaciones</Typography>
            <Box>
              <IconButton onClick={() => setNewNotificationOpen(true)} color="primary">
                <AddIcon />
              </IconButton>
              <IconButton onClick={context.refreshNotifications} size="small">
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          {/* TABS CON TEXTO BLANCO EN SELECCIONADAS Y FONDO VERDE */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                textTransform: 'none',
                color: '#007F5F', // Texto verde para pestañas no seleccionadas
              },
              '& .Mui-selected': {
                backgroundColor: '#007F5F',
                color: '#ffffff !important', // Texto blanco para pestañas seleccionadas
                borderRadius: 2,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'transparent',
              }
            }}
          >
            <Tab 
              value="all" 
              label={
                <Badge 
                  badgeContent={context.notifications.filter(n => !n.read && !isBefore(parseISO(n.expirationDate), new Date())).length} 
                  color="primary"
                  sx={{ '& .MuiBadge-badge': { right: -8, top: -8 } }}
                >
                  <Box sx={{ px: 1 }}>Todas</Box>
                </Badge>
              } 
            />
            <Tab 
              value="events" 
              label={
                <Badge 
                  badgeContent={context.notifications.filter(n => n.type === 'event' && !n.read && !isBefore(parseISO(n.expirationDate), new Date())).length} 
                  color="primary"
                  sx={{ '& .MuiBadge-badge': { right: -8, top: -8 } }}
                >
                  <Box sx={{ px: 1 }}>Eventos</Box>
                </Badge>
              } 
            />
            <Tab 
              value="reminders" 
              label={
                <Badge 
                  badgeContent={context.notifications.filter(n => n.type === 'reminder' && !n.read && !isBefore(parseISO(n.expirationDate), new Date())).length} 
                  color="primary"
                  sx={{ '& .MuiBadge-badge': { right: -8, top: -8 } }}
                >
                  <Box sx={{ px: 1 }}>Recordatorios</Box>
                </Badge>
              } 
            />
            <Tab 
              value="expired" 
              label="Expiradas" 
              sx={{ px: 2 }}
            />
          </Tabs>
        </Box>

        <Box mt={2}>
          <Typography variant="h5" gutterBottom>
            {activeTab === 'all' && 'Todas las notificaciones'}
            {activeTab === 'events' && 'Eventos'}
            {activeTab === 'reminders' && 'Recordatorios'}
            {activeTab === 'expired' && 'Notificaciones expiradas'}
          </Typography>
          
          <Divider sx={{ my: 2 }} />

          {filteredNotifications.length === 0 ? (
            <Box p={3} textAlign="center">
              <Typography variant="subtitle1" color="text.secondary">
                {activeTab === 'all' && 'No tienes notificaciones nuevas'}
                {activeTab === 'events' && 'No tienes eventos programados'}
                {activeTab === 'reminders' && 'No tienes recordatorios pendientes'}
                {activeTab === 'expired' && 'No tienes notificaciones expiradas'}
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {filteredNotifications.map(notification => {
                const isExpired = isBefore(parseISO(notification.expirationDate), new Date());
                const notificationDate = format(parseISO(notification.date), 'dd/MM/yyyy HH:mm');
                const expirationDate = format(parseISO(notification.expirationDate), 'dd/MM/yyyy HH:mm');
                
                return (
                  <Paper 
                    key={notification.id} 
                    elevation={1} 
                    sx={{
                      margin: '8px 0',
                      backgroundColor: isExpired ? 'action.hover' : 'background.paper',
                      // SIN HOVER AZUL - MISMO COLOR EN HOVER
                      '&:hover': {
                        backgroundColor: isExpired ? 'action.hover' : 'background.paper'
                      }
                    }}
                  >
                    <ListItem>
                      <ListItemIcon>
                        {notification.type === 'event' ? (
                          <EventIcon color={isExpired ? "disabled" : "primary"} />
                        ) : (
                          <ReminderIcon color={isExpired ? "disabled" : "secondary"} />
                        )}
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={notification.message}
                        secondary={
                          <>
                            <span>Creada: {notificationDate}</span>
                            {isExpired && (
                              <span> • Expirada: {expirationDate}</span>
                            )}
                          </>
                        }
                        primaryTypographyProps={{
                          sx: {
                            textDecoration: notification.read ? 'line-through' : 'none',
                            color: isExpired ? 'text.disabled' : 'text.primary'
                          }
                        }}
                        secondaryTypographyProps={{
                          sx: {
                            color: isExpired ? 'text.disabled' : 'text.secondary'
                          }
                        }}
                      />
                      
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentNotification(notification);
                            setEditModalOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotificationToDelete(notification.id);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Paper>
                );
              })}
            </List>
          )}
        </Box>

        {/* Diálogos permanecen iguales */}
        <Dialog open={newNotificationOpen} onClose={() => setNewNotificationOpen(false)}>
          <DialogTitle color='#007F5F'>Crear Nueva Notificación</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Mensaje"
                value={newNotification.message}
                onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                sx={{ mb: 2 }}
              />
              <Select
                fullWidth
                value={newNotification.type}
                onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                sx={{ mb: 2 }}
              >
                <MenuItem value="event">Evento</MenuItem>
                <MenuItem value="reminder">Recordatorio</MenuItem>
              </Select>
              <TextField
                fullWidth
                label="Fecha de Expiración"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={newNotification.expirationDate}
                onChange={(e) => setNewNotification({...newNotification, expirationDate: e.target.value})}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewNotificationOpen(false)} sx={{ color: '#007F5F' }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateNotification} 
              disabled={!newNotification.message}
              variant="contained"
              sx={{
                backgroundColor: '#007F5F',
                '&:hover': {
                  backgroundColor: '#005F46'
                }
              }}
            >
              Crear
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogTitle>Editar Notificación</DialogTitle>
          <DialogContent>
            {currentNotification && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Mensaje"
                  value={currentNotification.message}
                  onChange={(e) => setCurrentNotification({...currentNotification, message: e.target.value})}
                  sx={{ mb: 2 }}
                />
                <Select
                  fullWidth
                  value={currentNotification.type}
                  onChange={(e) => setCurrentNotification({...currentNotification, type: e.target.value})}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="event">Evento</MenuItem>
                  <MenuItem value="reminder">Recordatorio</MenuItem>
                </Select>
                <TextField
                  fullWidth
                  label="Fecha de Expiración"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  value={currentNotification.expirationDate.split('.')[0]}
                  onChange={(e) => setCurrentNotification({...currentNotification, expirationDate: e.target.value})}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)}>Cancelar</Button>
            <Button 
              onClick={handleEditNotification} 
              disabled={!currentNotification?.message}
              variant="contained"
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography>¿Está seguro que desea eliminar esta notificación?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteModalOpen(false)}>No</Button>
            <Button 
              onClick={() => handleDeleteNotification(notificationToDelete)}
              variant="contained"
              color="error"
            >
              Sí
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
          <DialogTitle>Operación Exitosa</DialogTitle>
          <DialogContent>
            <Typography>{successMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSuccessModalOpen(false)} variant="contained">
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default NotificationComponent;