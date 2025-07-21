// imports iguales que antes...
import React, { useState, useContext } from 'react';
import {
  AppBar, Toolbar, Box, Typography, Button, Menu, MenuItem, ListItemIcon,
  ListItemText, Divider, IconButton, useMediaQuery, useTheme
} from '@mui/material';
import {
  Home as HomeIcon, Dashboard as PrincipalIcon, AttachMoney as FinanzasIcon,
  Description as InformesIcon, Settings as ConfiguracionIcon, People as PeopleIcon,
  Assignment as AsistenciaIcon, SwapHoriz as MovimientosIcon, Person as UsuariosIcon,
  SportsSoccer as ProfesoresIcon, Notifications as NotificacionesIcon,
  Menu as MenuIcon, Logout as LogoutIcon, ArrowDropDown as ArrowDropDownIcon,
  Payment as CuotasIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/settings/settingsContext';
import { LoginContext } from '../../context/login/LoginContext';

const NavBar = () => {
  const { themeMode } = useSettings();
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [currentSubmenu, setCurrentSubmenu] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);
  const isSubmenuOpen = Boolean(submenuAnchorEl);
  const { logout, userData } = useContext(LoginContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isHome = location.pathname === '/';

  const handleMobileMenuOpen = (event) => setMobileMenuAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchorEl(null);
  const handleSubmenuOpen = (event, submenuItems, parentUrl) => {
    setSubmenuAnchorEl(event.currentTarget);
    setCurrentSubmenu({ items: submenuItems, url: parentUrl });
  };
  const handleSubmenuClose = () => {
    setSubmenuAnchorEl(null);
    setCurrentSubmenu(null);
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const handleNavigate = (url) => {
    navigate(url);
    handleSubmenuClose();
    if (isMobile) handleMobileMenuClose();
  };

  const iconSize = isMobile ? 30 : 36;
  const mobileIconSize = 32;

  const navItems = [
    { text: 'Todos', icon: <HomeIcon sx={{ fontSize: iconSize }} />, url: '/' },
    {
      text: 'Principal',
      icon: <PrincipalIcon sx={{ fontSize: iconSize }} />,
      submenu: [
        { text: 'Alumnos', url: '/students', icon: <PeopleIcon sx={{ fontSize: iconSize }} /> },
        { text: 'Asistencia', url: '/attendance', icon: <AsistenciaIcon sx={{ fontSize: iconSize }} /> },
        { text: 'Profesores', icon: <ProfesoresIcon sx={{ fontSize: iconSize }} />, url: '/teachers' },
      ],
    },
    { text: 'Usuarios', icon: <UsuariosIcon sx={{ fontSize: iconSize }} />, url: '/user' },
    {
      text: 'Finanzas',
      icon: <FinanzasIcon sx={{ fontSize: iconSize }} />,
      submenu: [
        { text: 'Cuotas', url: '/shares', icon: <CuotasIcon sx={{ fontSize: iconSize }} /> },
        { text: 'Movimientos', url: '/motions', icon: <MovimientosIcon sx={{ fontSize: iconSize }} /> },
        { text: 'Informes', icon: <InformesIcon sx={{ fontSize: iconSize }} />, url: '/panel-reports' },
      ],
    },
    { text: 'Notificaciones', icon: <NotificacionesIcon sx={{ fontSize: iconSize }} />, url: '/notifications' },
    { text: 'Configuración', icon: <ConfiguracionIcon sx={{ fontSize: iconSize }} />, url: '/settings' },
  ];

  return (
    <AppBar position="static" elevation={2} sx={{
      backgroundColor: themeMode === 'dark' ? theme.palette.background.paper : '#007F5F',
      color: themeMode === 'dark' ? theme.palette.text.primary : 'white',
    }}>
      <Toolbar sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 0.5, sm: 1 },
        position: 'relative',
      }}>
        {/* IZQUIERDA */}
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120, flex: isMobile ? '0 0 auto' : 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.4rem', md: '1.6rem' } }}>
            Golazo
          </Typography>
          {!isMobile && (
            <Typography variant="body1" sx={{ fontSize: { md: '1.5rem', sm: '1.2rem' }, ml: { sm: 1, md: 2 } }}>
              ¡Hola, {userData?.name || 'Usuario'}!
            </Typography>
          )}
        </Box>

        {/* CENTRO (Tabs + Submenus unificados) */}
        {!isMobile && userData && !isHome && (
          <Box sx={{
            position: { sm: 'static', md: 'absolute' },
            left: '50%',
            transform: { md: 'translateX(-50%)' },
            display: 'flex',
            flexWrap: isTablet ? 'wrap' : 'nowrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1, md: 2 },
            maxWidth: '100%',
            overflowX: isTablet ? 'auto' : 'visible',
            py: isTablet ? 1 : 0
          }}>
            {navItems.map((item) => {
              const selected = location.pathname === item.url;
              if (item.submenu) {
                return (
                  <Button
                    key={item.text}
                    onClick={(e) => handleSubmenuOpen(e, item.submenu, item.url)}
                    sx={{
                      color: 'inherit',
                      fontSize: { sm: '0.8rem', md: '0.95rem' },
                      textTransform: 'none',
                      padding: { sm: '6px 8px', md: '8px 16px' },
                      minWidth: 'max-content',
                    }}
                    startIcon={React.cloneElement(item.icon, {
                      sx: {
                        fontSize: isTablet ? 28 : iconSize,
                        marginRight: '4px',
                      },
                    })}
                  >
                    {item.text}
                    <ArrowDropDownIcon fontSize="small" sx={{ ml: 0.5 }} />
                  </Button>
                );
              } else {
                return (
                <Button
  key={item.text}
  onClick={() => handleNavigate(item.url)}
  sx={{
    color: selected ? 'secondary.main' : 'inherit',
    fontWeight: selected ? 'bold' : 'normal',
    fontSize: { sm: '0.8rem', md: '0.95rem' },
    textTransform: 'none',
    padding: { sm: '6px 8px', md: '8px 16px' },
    minWidth: 'max-content',
    '&:hover': {
      color: '#1976d2', // 🔵 Azul MUI (como antes)
      backgroundColor: 'transparent', // 🧼 evita fondo morado
    },
  }}
  startIcon={React.cloneElement(item.icon, {
    sx: {
      fontSize: isTablet ? 28 : iconSize,
      marginRight: '4px',
    },
  })}
>
  {item.text}
</Button>

                );
              }
            })}
          </Box>
        )}

        {/* DERECHA */}
        {!isMobile && userData && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', minWidth: 120, flex: 1 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#007F5F',
                color: 'white',
                '&:hover': { backgroundColor: '#006647' },
                fontSize: { sm: '0.8rem', md: '0.95rem' },
                textTransform: 'none',
                padding: { sm: '6px 12px', md: '8px 16px' },
                whiteSpace: 'nowrap'
              }}
              onClick={handleLogout}
              startIcon={<LogoutIcon sx={{ fontSize: isTablet ? 28 : iconSize, mr: '4px' }} />}
            >
              Cerrar Sesión
            </Button>
          </Box>
        )}

        {/* BOTÓN MENÚ MÓVIL */}
        {isMobile && (
          <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleMobileMenuOpen} sx={{ ml: 'auto' }}>
            <MenuIcon sx={{ fontSize: mobileIconSize }} />
          </IconButton>
        )}
      </Toolbar>

      {/* SUBMENÚ DESKTOP */}
      <Menu
        anchorEl={submenuAnchorEl}
        open={isSubmenuOpen}
        onClose={handleSubmenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            minWidth: 220,
            backgroundColor: themeMode === 'dark' ? theme.palette.background.paper : '#fff',
            color: themeMode === 'dark' ? theme.palette.text.primary : '#000',
            '& .MuiListItemIcon-root': { minWidth: '45px !important' }
          }
        }}
      >
        {currentSubmenu?.items?.map((subItem) => (
          <MenuItem
            key={subItem.text}
            selected={location.pathname === subItem.url}
            onClick={() => handleNavigate(subItem.url)}
          >
            <ListItemIcon>
              {React.cloneElement(subItem.icon, {
                sx: { fontSize: iconSize, mr: '8px' },
              })}
            </ListItemIcon>
            <ListItemText>{subItem.text}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      {/* MENÚ MÓVIL */}
      <Menu
        anchorEl={mobileMenuAnchorEl}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '100%',
            backgroundColor: themeMode === 'dark' ? theme.palette.background.paper : '#007F5F',
            color: themeMode === 'dark' ? theme.palette.text.primary : 'white',
            '& .MuiListItemIcon-root': {
              minWidth: '45px !important',
              '& svg': { mr: '8px' },
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
            ¡Hola, {userData?.name || 'Usuario'}!
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

        {navItems.map((item) =>
          item.submenu ? (
            <MenuItem
              key={item.text}
              onClick={(e) => handleSubmenuOpen(e, item.submenu, item.url)}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>
                {React.cloneElement(item.icon, {
                  sx: { fontSize: mobileIconSize, mr: '8px' },
                })}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontSize: '1.05rem' }}
              />
              <ArrowDropDownIcon fontSize="medium" sx={{ ml: 1 }} />
            </MenuItem>
          ) : (
            <MenuItem
              key={item.text}
              selected={location.pathname === item.url}
              onClick={() => handleNavigate(item.url)}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>
                {React.cloneElement(item.icon, {
                  sx: { fontSize: mobileIconSize, mr: '8px' },
                })}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontSize: '1.05rem' }}
              />
            </MenuItem>
          )
        )}

        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
        <MenuItem onClick={handleLogout} sx={{ backgroundColor: '#007F5F', color: 'white', py: 1.5 }}>
          <ListItemIcon>
            <LogoutIcon sx={{ fontSize: mobileIconSize, color: 'white', mr: '8px' }} />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ fontSize: '1.05rem' }} />
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default NavBar;
