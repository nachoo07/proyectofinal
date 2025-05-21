// contexts/NotificationContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      console.log(`${process.env.BACKEND_URL}/api/notification/notifications`);
      const response = await (await fetch(`${process.env.BACKEND_URL}/api/notification/notifications`)).json();
      setNotifications(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.response?.data?.error || 'Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear una nueva notificación
  const createNotification = async (notificationData) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.BACKEND_URL}/api/notification/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create notification');
      fetchNotifications(); // Refresh notifications after creating a new one
      return data;
    } catch (err) {
      console.error('Error creating notification:', err);
      setError(err.message || 'Failed to create notification');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const refreshNotifications = async () => {
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/api/notification/notifications`);
      if (!res.ok) {
        // Si la respuesta es 400, 404, 500, etc.
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch notifications');
      }
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
    }
  };
  

  // Función para actualizar una notificación existente
  const updateNotification = async (id, updatedData) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.BACKEND_URL}/api/notification/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update notification');
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, ...data.notification } : notification
        )
      );
      return data;
    } catch (err) {
      console.error('Error updating notification:', err);
      setError(err.message || 'Failed to update notification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar una notificación
  const deleteNotification = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.BACKEND_URL}/api/notification/notifications/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete notification');
      }
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError(err.message || 'Failed to delete notification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para marcar como leída
  

  // Fetch notifications on mount and then daily
  useEffect(() => {
    fetchNotifications();

    // Set up daily refresh (e.g., at midnight)
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        fetchNotifications();
      }
    }, 60000); // Check every minute if it's midnight

    return () => clearInterval(interval);
  }, []);

  const value = {
    notifications,
    loading,
    error,
    refreshNotifications,
     fetchNotifications,
    // Funciones añadidas:
    createNotification,
    updateNotification,
    deleteNotification,
  
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};