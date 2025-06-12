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

// eslint-disable-next-line react/prop-types
const NavBar = ({ onNotificationClick }) => {  // Recibimos una función desde el padre
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
    { text: 'Alumnos', icon: <PeopleIcon />, url: '/students' },
    { text: 'Cuotas', icon: <AttachMoneyIcon />, url: '/shares' },
    { text: 'Movimientos', icon: <MovimientosIcon />, url: '/motions' },
    { text: 'Usuarios', icon: <UserIcon />, url: '/user' },
    { text: 'Settings', icon: <SettingsIcon />, url: '/settings' },
    { text: 'Reporte', icon: <ReportIcon />, url: '/reports' },
    { text: 'Notificaciones', icon: <PageNotification />, url: '/notifications' },
  ];

  return (
    <>
      <AppBar position="static" color="default" elevation={3} sx={{
        backgroundColor: '#007F5F',
        overflowX: 'auto',
      }}>
        <Toolbar sx={{
          display: 'flex',
          justifyContent: 'center',
          minHeight: '64px !important',
          px: 0,
        }}>
          {/* Mobile menu button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuOpen}
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Title - hidden on mobile */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              display: { xs: 'none', md: 'block' },
              mr: 4
            }}
          >
            Golazo
          
          </Typography>

          {/* Desktop nav items */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1
          }}>
            <List sx={{
              display: 'flex',
              padding: 0,
              '& .MuiListItem-root': {
                width: 'auto',
                padding: '8px 16px',
              }
            }}>
              {navItems.map((item, index) => (
                <ListItem
                  button
                  key={index}
                  selected={location.pathname === item.url}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.12)',
                    }
                  }}
                  onClick={() => {
                    navigate(item.url);
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: item.selected ? 'medium' : 'normal',
                      whiteSpace: 'nowrap'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Mobile menu */}
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
                selected={item.selected}
                onClick={handleMobileMenuClose}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={onNotificationClick}>  {/* También en móvil */}
              <ListItemIcon>
                <PageNotification />
              </ListItemIcon>
              <ListItemText primary="Notificaciones" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;