import { useState } from 'react';
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
  MenuItem
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
  Menu as MenuIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/settings/settingsContext';  // Importante para leer el themeMode

const NavBar = ({ onNotificationClick }) => {
  const { themeMode } = useSettings();  // Obtenemos el modo actual
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);

  const navigate = useNavigate();
  const location = useLocation();

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const navItems = [
    { text: 'Inicio', icon: <HomeAdmin />, url: '/home' },
    { text: 'Usuarios', icon: <UserIcon />, url: '/user' },
    { text: 'Alumnos', icon: <PeopleIcon />, url: '/students' },
    { text: 'Cuotas', icon: <AttachMoneyIcon />, url: '/shares' },
    { text: 'Movimientos', icon: <MovimientosIcon />, url: '/motions' },
    { text: 'Reporte', icon: <ReportIcon />, url: '/reports' },
    { text: 'Notificaciones', icon: <PageNotification />, url: '/notifications' },
    { text: 'Settings', icon: <SettingsIcon />, url: '/settings' },
  ];

  return (
    <AppBar
      position="static"
      color="default"
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
          justifyContent: 'center',
          minHeight: '64px !important',
          px: 0,
        }}
      >
        <IconButton
          edge="start"
          aria-label="menu"
          onClick={handleMobileMenuOpen}
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            color: 'inherit'
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'bold',
            display: { xs: 'none', md: 'block' },
            mr: 4,
            color: 'inherit'
          }}
        >
          Golazo
        </Typography>

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1
          }}
        >
          <List
            sx={{
              display: 'flex',
              padding: 0,
              '& .MuiListItem-root': {
                width: 'auto',
                padding: '8px 16px',
                color: 'inherit',
              },
              '& .MuiListItemIcon-root': {
                color: 'inherit',
                minWidth: '36px'
              },
              '& .Mui-selected': {
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
              },
              '& .Mui-selected:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.24)',
              }
            }}
          >
            {navItems.map((item, index) => (
              <ListItem
                button
                key={index}
                selected={location.pathname === item.url}
                onClick={() => navigate(item.url)}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.url ? 'medium' : 'normal',
                    whiteSpace: 'nowrap'
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Menu
          anchorEl={mobileMenuAnchorEl}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
          PaperProps={{
            style: {
              width: 250,
            },
          }}
        >
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Menú Principal
            </Typography>
          </Box>
          <Divider />
          {navItems.map((item, index) => (
            <MenuItem
              key={index}
              selected={location.pathname === item.url}
              onClick={() => {
                handleMobileMenuClose();
                navigate(item.url);
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={() => {
            handleMobileMenuClose();
            onNotificationClick();
          }}>
            <ListItemIcon>
              <PageNotification />
            </ListItemIcon>
            <ListItemText primary="Notificaciones" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
