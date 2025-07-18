import { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as PrincipalIcon,
  AttachMoney as FinanzasIcon,
  Description as InformesIcon,
  Settings as ConfiguracionIcon,
  People as PeopleIcon,
  Assignment as AsistenciaIcon,
  SwapHoriz as MovimientosIcon,
  Person as UsuariosIcon,
  SportsSoccer as ProfesoresIcon,
  Notifications as NotificacionesIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  ArrowDropDown as ArrowDropDownIcon,
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
  const { logout, userData, auth } = useContext(LoginContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isHome = location.pathname === '/'

  // Verificar si el usuario es admin
  const isAdmin = auth === 'admin';

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

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

  // Elementos de navegación según el rol
  const getNavItems = () => {
    if (isAdmin) {
      // Navegación completa para admin
      return [
        { text: 'Todos', icon: <HomeIcon />, url: '/' },
        {
          text: 'Principal',
          icon: <PrincipalIcon />,
          submenu: [
            { text: 'Alumnos', url: '/students', icon: <PeopleIcon /> },
            { text: 'Asistencia', url: '/attendance', icon: <AsistenciaIcon /> },
            { text: 'Profesores', icon: <ProfesoresIcon />, url: '/teachers' },
          ],
        },
        {
          text: 'Finanzas',
          icon: <FinanzasIcon />,
          submenu: [
            { text: 'Movimientos', url: '/motions', icon: <MovimientosIcon /> },
            { text: 'Informes', icon: <InformesIcon />, url: '/reports' },
          ],
        },
        { text: 'Usuarios', icon: <UsuariosIcon />, url: '/user' },
        { text: 'Notificaciones', icon: <NotificacionesIcon />, url: '/notifications' },
        { text: 'Configuración', icon: <ConfiguracionIcon />, url: '/settings' },
      ];
    } else {
      // Navegación limitada para usuarios no admin
      return [
        { text: 'Inicio', icon: <HomeIcon />, url: '/homeuser' },
        { text: 'Asistencia', icon: <AsistenciaIcon />, url: '/attendance' },
        { text: 'Notificaciones', icon: <NotificacionesIcon />, url: '/notifications' },
      ];
    }
  };

  const navItems = getNavItems();

  const tabItems = navItems.filter(item => !item.submenu && !item.variant);

  return (
    <AppBar
      position="static"
      elevation={3}
      sx={{
        backgroundColor: (theme) =>
          themeMode === 'dark' ? theme.palette.background.paper : '#007F5F',
        color: (theme) => (themeMode === 'dark' ? theme.palette.text.primary : 'white'),
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        {/* IZQUIERDA: Nombre de la página + saludo */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', color: 'inherit', mr: 2 }}
          >
            Golazo
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: 'inherit',
              display: { xs: 'none', md: 'flex' },
            }}
          >
            ¡Hola, {userData?.name || 'Usuario'}!
          </Typography>
          {isMobile && (
            <IconButton
              edge="start"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
              sx={{ color: 'inherit', ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        {/* CENTRO: Íconos / Tabs / Submenús */}
        {!isMobile && userData && !isHome && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 2,
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <Tabs
              value={tabItems.findIndex(item => location.pathname === item.url)}
              onChange={(_, newValue) => {
                const item = tabItems[newValue];
                if (item) navigate(item.url);
              }}
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                '& .MuiTabs-flexContainer': {
                  justifyContent: 'center',
                  gap: 1,
                },
              }}
            >
              {tabItems.map((item) => (
                <Tab
                  key={item.text}
                  label={item.text}
                  icon={item.icon}
                  iconPosition="start"
                  sx={{
                    minWidth: 'auto',
                    px: 1,
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                    '&:hover': { color: '#90caf9' },
                  }}
                />
              ))}
            </Tabs>

            {navItems.map((item) =>
              item.submenu ? (
                <Button
                  key={item.text}
                  onClick={(e) => handleSubmenuOpen(e, item.submenu, item.url)}
                  sx={{
                    color: 'inherit',
                    textTransform: 'none',
                    px: 1,
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                    '&:hover': { color: '#90caf9' },
                  }}
                >
                  {item.icon}
                  <Box component="span" sx={{ ml: 0.5, display: { xs: 'none', sm: 'inline' } }}>
                    {item.text}
                  </Box>
                  <ArrowDropDownIcon />
                </Button>
              ) : null
            )}
          </Box>
        )}

        {/* DERECHA: Botón cerrar sesión */}
        {!isMobile && userData && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#007F5F',
                color: 'white',
                '&:hover': { backgroundColor: '#006647' },
                px: 1,
                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
              }}
              onClick={handleLogout}
            >
              <LogoutIcon />
              <Box component="span" sx={{ ml: 0.5, display: { xs: 'none', sm: 'inline' } }}>
                Cerrar Sesión
              </Box>
            </Button>
          </Box>
        )}
      </Toolbar>


      {/* SUBMENÚ */}
      <Menu
        anchorEl={submenuAnchorEl}
        open={isSubmenuOpen}
        onClose={handleSubmenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { minWidth: 200, boxShadow: theme.shadows[3] } }}
      >
        {currentSubmenu?.url && (
          <MenuItem onClick={() => handleNavigate(currentSubmenu.url)}>
            <ListItemIcon>
              <FinanzasIcon />
            </ListItemIcon>
          </MenuItem>
        )}
        {currentSubmenu?.url && <Divider />}
        {currentSubmenu?.items?.map((subItem) => (
          <MenuItem
            key={subItem.text}
            selected={location.pathname === subItem.url}
            onClick={() => handleNavigate(subItem.url)}
          >
            <ListItemIcon>{subItem.icon}</ListItemIcon>
            <ListItemText>{subItem.text}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      {/* MENÚ MOBILE */}
      <Menu
        anchorEl={mobileMenuAnchorEl}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '100%',
            maxHeight: '80vh',
            backgroundColor: themeMode === 'dark' ? theme.palette.background.paper : '#007F5F',
            color: 'white',
          },
        }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ¡Hola, {userData?.name || 'Usuario'}!
          </Typography>
        </Box>

        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

        {navItems.map((item) => (
          <div key={item.text}>
            {item.submenu ? (
              <MenuItem onClick={(e) => handleSubmenuOpen(e, item.submenu, item.url)}>
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText>{item.text}</ListItemText>
                <ArrowDropDownIcon />
              </MenuItem>
            ) : (
              <MenuItem
                selected={location.pathname === item.url}
                onClick={() => handleNavigate(item.url)}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText>{item.text}</ListItemText>
              </MenuItem>
            )}
          </div>
        ))}

        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            backgroundColor: '#007F5F',
            color: 'white',
            '&:hover': { backgroundColor: '#006647' },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}><LogoutIcon /></ListItemIcon>
          <ListItemText>Cerrar Sesión</ListItemText>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default NavBar;
