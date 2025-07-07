import { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemButton,
  Button,
} from '@mui/material';
import {
  Home as HomeAdmin,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  SwapHoriz as MovimientosIcon,
  Person as UserIcon,
  Settings as SettingsIcon,
  Report as ReportIcon,
  Notifications as PageNotification,
  SportsSoccer as SportsSoccerIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import './navbar.css'; // Import your custom CSS for NavBar
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/settings/settingsContext';
import { LoginContext } from '../../context/login/LoginContext';

const NavBar = ({ onNotificationClick }) => {
  const { themeMode } = useSettings();
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);
  const { logout } = useContext(LoginContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { text: 'Inicio', icon: <HomeAdmin />, url: '/' },
    { text: 'Usuarios', icon: <UserIcon />, url: '/user' },
    { text: 'Alumnos', icon: <PeopleIcon />, url: '/students' },
    { text: 'Cuotas', icon: <AttachMoneyIcon />, url: '/shares' },
    { text: 'Asistencia', icon: <AttachMoneyIcon />, url: '/attendance' },
    { text: 'Movimientos', icon: <MovimientosIcon />, url: '/motions' },
    { text: 'Reporte', icon: <ReportIcon />, url: '/reports' },
    { text: 'Notificaciones', icon: <PageNotification />, url: '/notifications' },
    { text: 'Settings', icon: <SettingsIcon />, url: '/settings' },
    { text: 'Profesores', icon: <SportsSoccerIcon />, url: '/teachers' },
  ];

  return (
    <AppBar
      position="static"
      elevation={3}
      sx={{
        backgroundColor: (theme) =>
          themeMode === 'dark'
            ? theme.palette.background.paper
            : '#007F5F',
        color: (theme) =>
          themeMode === 'dark'
            ? theme.palette.text.primary
            : 'white',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: { xs: 1, sm: 2 },
        }}
      >
        {/* Icono para abrir menú en mobile */}
        <IconButton
          edge="start"
          aria-label="menu"
          onClick={handleMobileMenuOpen}
          sx={{
            display: { xs: 'flex', md: 'none' },
            color: 'inherit',
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'bold',
            color: 'inherit',
            textAlign: 'center',
            flexGrow: { xs: 1, md: 0 },
            display: 'block',
          }}
        >
          Golazo
        </Typography>

        {/* Navegación desktop */}
        <Box
        className="mi-clase-personalizada"
          sx={{}}
        >
          <List
            sx={{
              display: 'flex',
              padding: 0,
              '& .MuiListItem-root': {
                width: 'auto',
                padding: 0,
              },
              '& .MuiListItemButton-root': {
               
                color: 'inherit',
              },
              '& .Mui-selected': {
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
              },
              '& .Mui-selected:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.24)',
              },
            }}
          >
            {navItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.url}
                  onClick={() => navigate(item.url)}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: location.pathname === item.url ? 'medium' : 'normal',
                      whiteSpace: 'nowrap',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {/* Botón cerrar sesión (solo desktop) */}
          <Button
            color="inherit"
            variant="outlined"
            sx={{ ml: 2, display: { xs: 'none', md: 'inline-flex' } }}
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </Box>
      </Toolbar>

      {/* Menú móvil */}
      <Menu
        anchorEl={mobileMenuAnchorEl}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '100%',
          },
        }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {navItems.map((item, index) => (
          <MenuItem
            key={index}
            selected={location.pathname === item.url}
            onClick={() => {
              navigate(item.url);
              handleMobileMenuClose();
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={() => {
            handleMobileMenuClose();
            handleLogout();
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMobileMenuClose();
            onNotificationClick && onNotificationClick();
          }}
        >
          <ListItemIcon>
            <PageNotification />
          </ListItemIcon>
          <ListItemText primary="Notificaciones" />
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default NavBar;