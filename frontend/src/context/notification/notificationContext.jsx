import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { LoginContext } from '../login/LoginContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { auth, loading: authLoading } = useContext(LoginContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    if (authLoading || !auth) return; // Esperar autenticación

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/notification/notifications', {
        withCredentials: true,
      });
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (notificationData) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:4000/api/notification/notifications', notificationData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      fetchNotifications();
      return response.data;
    } catch (err) {
      console.error('Error creating notification:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to create notification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/notification/notifications', {
        withCredentials: true,
      });
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to fetch notifications');
    }
  };

  const updateNotification = async (id, updatedData) => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:4000/api/notification/notifications/${id}`, updatedData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, ...response.data.notification } : notification))
      );
      return response.data;
    } catch (err) {
      console.error('Error updating notification:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to update notification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:4000/api/notification/notifications/${id}`, {
        withCredentials: true,
      });
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to delete notification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [auth, authLoading]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,
        refreshNotifications,
        fetchNotifications,
        createNotification,
        updateNotification,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};