import { useState, useMemo } from 'react';
import { format, parseISO, isBefore } from 'date-fns';
import { useNotifications } from '../../context/notification/notificationContext';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import { Box, Typography, Button } from '@mui/material'; // Added Material-UI components
import './notifications.css';

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
  const navigate = useNavigate(); // Added for navigation

  const [newNotification, setNewNotification] = useState({
    message: '',
    type: 'reminder',
    expirationDate: '',
  });

  const handleTabChange = (event) => {
    setActiveTab(event.target.value);
  };

  const filteredNotifications = useMemo(() => {
    return context.notifications.filter((notification) => {
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
        expirationDate: newNotification.expirationDate || new Date(Date.now() + 86400000).toISOString(),
      });
      setNewNotificationOpen(false);
      setNewNotification({
        message: '',
        type: 'reminder',
        expirationDate: '',
      });
      setSuccessMessage('Notificación creada con éxito');
      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleEditNotification = async () => {
    try {
      await context.updateNotification(currentNotification.id, currentNotification);
      setEditModalOpen(false);
      setSuccessMessage('Notificación actualizada con éxito');
      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await context.deleteNotification(id);
      setDeleteModalOpen(false);
      setSuccessMessage('Notificación eliminada con éxito');
      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (context.loading) {
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
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%',
            mb: 2,
            p: 1,
            borderRadius: '16px',
            background: '#e8f5e9',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 800,
              color: 'rgba(32, 129, 38, 1) !important',
              letterSpacing: '0.08rem',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
              textShadow: '2px 2px 6px rgba(56, 249, 215, 0.15)',
            }}
          >
            Notificaciones
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, md: 2 },
            flexDirection: 'row',
            width: { xs: '100%', md: 'auto' },
            mb: { xs: 2, md: 4 },
            justifyContent: 'center',
          }}
        >
          <Button
            variant="outlined"
            color="success"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: '32px',
              fontWeight: 600,
              fontSize: { xs: '0.8rem', md: '1rem' },
              px: { xs: 1.5, md: 3 },
              py: { xs: 0.5, md: 1 },
              minWidth: { xs: '120px', md: '160px' },
              flex: { xs: 1, md: 'none' },
            }}
          >
            Volver
          </Button>
        </Box>
        <div className="content-container">
          <div className="notification-loading">
            <div className="spinner"></div>
          </div>
        </div>
      </Box>
    );
  }

  if (context.error) {
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
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%',
            mb: 2,
            p: 1,
            borderRadius: '16px',
            background: '#e8f5e9',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 800,
              color: 'rgba(32, 129, 38, 1) !important',
              letterSpacing: '0.08rem',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
              textShadow: '2px 2px 6px rgba(56, 249, 215, 0.15)',
            }}
          >
            Notificaciones
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, md: 2 },
            flexDirection: 'row',
            width: { xs: '100%', md: 'auto' },
            mb: { xs: 2, md: 4 },
            justifyContent: 'center',
          }}
        >
          <Button
            variant="outlined"
            color="success"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: '32px',
              fontWeight: 600,
              fontSize: { xs: '0.8rem', md: '1rem' },
              px: { xs: 1.5, md: 3 },
              py: { xs: 0.5, md: 1 },
              minWidth: { xs: '120px', md: '160px' },
              flex: { xs: 1, md: 'none' },
            }}
          >
            Volver
          </Button>
        </Box>
        <div className="content-container">
          <div className="notification-error">
            <span>{context.error}</span>
            <button className="notification-action-btn refresh" onClick={context.refreshNotifications}>
              Reintentar
            </button>
          </div>
        </div>
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
      className="main-container" // igual que StudentTable
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80%',
          mb: 2,
          p: 1,
          borderRadius: '16px',
          background: '#e8f5e9'
        }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            fontWeight: 800,
            color: 'rgba(32, 129, 38, 1) !important',
            letterSpacing: '0.08rem',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
            textShadow: '2px 2px 6px rgba(56, 249, 215, 0.15)',
          }}
        >
          Notificaciones
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
        <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, flexDirection: 'row', width: { xs: '100%', md: 'auto' } }}>
          <Button
            variant="outlined"
            color="success"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: '32px',
              fontWeight: 600,
              fontSize: { xs: '0.8rem', md: '1rem' },
              px: { xs: 1.5, md: 3 },
              py: { xs: 0.5, md: 1 },
              minWidth: { xs: '120px', md: '160px' },
              flex: { xs: 1, md: 'none' },
            }}
          >
            Volver
          </Button>
        </Box>
      </Box>
      <div className="content-container">
        <div className="notification-header">
          <div className="notification-actions">
            <button className="notification-action-btn create" onClick={() => setNewNotificationOpen(true)}>
              +
            </button>
            <button className="notification-action-btn refresh" onClick={context.refreshNotifications}>
              ↻
            </button>
          </div>
        </div>
        <div className="notification-tabs">
          {['all', 'events', 'reminders', 'expired'].map((tab) => (
            <label key={tab} className={`notification-tab ${activeTab === tab ? 'selected' : ''}`}>
              <input
                type="radio"
                name="notification-tab"
                value={tab}
                checked={activeTab === tab}
                onChange={handleTabChange}
                style={{ display: 'none' }}
              />
              <span className="notification-tab-label">
                {tab === 'all' && (
                  <span className="notification-badge">
                    {context.notifications.filter(
                      (n) => !n.read && !isBefore(parseISO(n.expirationDate), new Date())
                    ).length}
                  </span>
                )}
                {tab === 'events' && (
                  <span className="notification-badge">
                    {context.notifications.filter(
                      (n) => n.type === 'event' && !n.read && !isBefore(parseISO(n.expirationDate), new Date())
                    ).length}
                  </span>
                )}
                {tab === 'reminders' && (
                  <span className="notification-badge">
                    {context.notifications.filter(
                      (n) => n.type === 'reminder' && !n.read && !isBefore(parseISO(n.expirationDate), new Date())
                    ).length}
                  </span>
                )}
                {tab === 'all' && 'Todas'}
                {tab === 'events' && 'Eventos'}
                {tab === 'reminders' && 'Recordatorios'}
                {tab === 'expired' && 'Expiradas'}
              </span>
            </label>
          ))}
        </div>
        <h2 className="notification-subtitle">
          {activeTab === 'all' && 'Todas las notificaciones'}
          {activeTab === 'events' && 'Eventos'}
          {activeTab === 'reminders' && 'Recordatorios'}
          {activeTab === 'expired' && 'Notificaciones expiradas'}
        </h2>
        <hr className="notification-divider" />
        {filteredNotifications.length === 0 ? (
          <div className="notification-empty">
            <p className="notification-empty-message">
              {activeTab === 'all' && 'No tienes notificaciones nuevas'}
              {activeTab === 'events' && 'No tienes eventos programados'}
              {activeTab === 'reminders' && 'No tienes recordatorios pendientes'}
              {activeTab === 'expired' && 'No tienes notificaciones expiradas'}
            </p>
          </div>
        ) : (
          <ul className="notification-list">
            {filteredNotifications.map((notification) => {
              const isExpired = isBefore(parseISO(notification.expirationDate), new Date());
              const notificationDate = format(parseISO(notification.date), 'dd/MM/yyyy HH:mm');
              const expirationDate = format(parseISO(notification.expirationDate), 'dd/MM/yyyy HH:mm');
              return (
                <li key={notification.id} className={`notification-item ${isExpired ? 'expired' : ''}`}>
                  <div className="notification-item-content">
                    <span className={`notification-icon ${isExpired ? 'disabled' : ''}`}>
                      {notification.type === 'event' ? '📅' : '🔔'}
                    </span>
                    <div className="notification-text-content">
                      <span className={`notification-text ${notification.read ? 'read' : ''} ${isExpired ? 'expired' : ''}`}>
                        {notification.message}
                      </span>
                      <span className={`notification-text-secondary ${isExpired ? 'expired' : ''}`}>
                        Creada: {notificationDate}
                        {isExpired && ` • Expirada: ${expirationDate}`}
                      </span>
                    </div>
                    <div className="notification-item-actions">
                      <button
                        className="notification-item-action edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentNotification(notification);
                          setEditModalOpen(true);
                        }}
                      >
                        ✎
                      </button>
                      <button
                        className="notification-item-action delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotificationToDelete(notification.id);
                          setDeleteModalOpen(true);
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {newNotificationOpen && (
          <div className="notification-dialog">
            <div className="notification-dialog-content">
              <h3 className="notification-dialog-title">Crear Nueva Notificación</h3>
              <div className="notification-dialog-body">
                <input
                  type="text"
                  placeholder="Mensaje"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  className="notification-input"
                />
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                  className="notification-input"
                >
                  <option value="event">Evento</option>
                  <option value="reminder">Recordatorio</option>
                </select>
                <input
                  type="datetime-local"
                  value={newNotification.expirationDate}
                  onChange={(e) => setNewNotification({ ...newNotification, expirationDate: e.target.value })}
                  className="notification-input"
                />
              </div>
              <div className="notification-dialog-actions">
                <button className="notification-dialog-btn cancel" onClick={() => setNewNotificationOpen(false)}>
                  Cancelar
                </button>
                <button
                  className="notification-dialog-btn create"
                  onClick={handleCreateNotification}
                  disabled={!newNotification.message}
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}
        {editModalOpen && currentNotification && (
          <div className="notification-dialog">
            <div className="notification-dialog-content">
              <h3 className="notification-dialog-title">Editar Notificación</h3>
              <div className="notification-dialog-body">
                <input
                  type="text"
                  placeholder="Mensaje"
                  value={currentNotification.message}
                  onChange={(e) =>
                    setCurrentNotification({ ...currentNotification, message: e.target.value })
                  }
                  className="notification-input"
                />
                <select
                  value={currentNotification.type}
                  onChange={(e) =>
                    setCurrentNotification({ ...currentNotification, type: e.target.value })
                  }
                  className="notification-input"
                >
                  <option value="event">Evento</option>
                  <option value="reminder">Recordatorio</option>
                </select>
                <input
                  type="datetime-local"
                  value={currentNotification.expirationDate.split('.')[0]}
                  onChange={(e) =>
                    setCurrentNotification({ ...currentNotification, expirationDate: e.target.value })
                  }
                  className="notification-input"
                />
              </div>
              <div className="notification-dialog-actions">
                <button className="notification-dialog-btn cancel" onClick={() => setEditModalOpen(false)}>
                  Cancelar
                </button>
                <button
                  className="notification-dialog-btn create"
                  onClick={handleEditNotification}
                  disabled={!currentNotification.message}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
        {deleteModalOpen && (
          <div className="notification-dialog">
            <div className="notification-dialog-content">
              <h3 className="notification-dialog-title">Confirmar Eliminación</h3>
              <p className="notification-dialog-text">
                ¿Está seguro que desea eliminar esta notificación?
              </p>
              <div className="notification-dialog-actions">
                <button className="notification-dialog-btn cancel" onClick={() => setDeleteModalOpen(false)}>
                  No
                </button>
                <button
                  className="notification-dialog-btn delete"
                  onClick={() => handleDeleteNotification(notificationToDelete)}
                >
                  Sí
                </button>
              </div>
            </div>
          </div>
        )}
        {successModalOpen && (
          <div className="notification-dialog">
            <div className="notification-dialog-content">
              <h3 className="notification-dialog-title">Operación Exitosa</h3>
              <p className="notification-dialog-text">{successMessage}</p>
              <div className="notification-dialog-actions">
                <button className="notification-dialog-btn create" onClick={() => setSuccessModalOpen(false)}>
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Box>
  );
};

export default NotificationComponent;