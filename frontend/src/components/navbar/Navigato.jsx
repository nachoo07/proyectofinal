import { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Avatar,
  Container,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Notifications as PageNotification,
  SwapHoriz as SwapHorizIcon,
  Report as ReportIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { LoginContext } from '../../context/login/LoginContext';

const Navigato = () => {
  const { logout, userData } = useContext(LoginContext);
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/login');
  };

  const navItems = [
    { text: 'Usuarios', url: '/user', icon: <PersonIcon /> },
    { text: 'Notificaciones', url: '/notifications', icon: <PageNotification /> },
    { text: 'Movimientos', url: '/motions', icon: <SwapHorizIcon /> },
    { text: 'Reportes', url: '/reports', icon: <ReportIcon /> },
    { text: 'Cuotas', url: '/shares', icon: <AttachMoneyIcon /> },
    { text: 'Profesores', url: '/teachers', icon: <SchoolIcon /> },
    { text: 'Alumnos', url: '/students', icon: <SchoolIcon /> }
  ];

  const userSettings = userData
    ? [`Hola, ${userData.name}`, 'Cerrar Sesión']
    : ['Cerrar Sesión'];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#00335c', boxShadow: 3 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '64px !important' }}>
          {/* Logo Desktop */}
          <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#8eeab1' }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#8eeab1',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            ACADEMIA
          </Typography>

          {/* Botón menú mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: '#8eeab1' }}
            >
              <MenuIcon />
            </IconButton>
            <SchoolIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: '#8eeab1' }} />
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: '#8eeab1',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              ACADEMIA
            </Typography>
          </Box>

          {/* Ítems de navegación (Desktop) */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {navItems.map((item) => (
              <Tooltip title={item.text} key={item.text}>
                <Button
                  component={Link}
                  to={item.url}
                  onClick={handleCloseNavMenu}
                  startIcon={item.icon}
                  sx={{
                    my: 2,
                    color: '#8eeab1',
                    display: 'inline-flex',
                    alignItems: 'center',
                    mx: 1,
                    textTransform: 'none',
                    fontWeight: 'normal',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(142, 234, 177, 0.1)',
                    },
                    '& .MuiButton-startIcon': {
                      marginRight: '8px',
                      marginBottom: 0,
                    },
                  }}
                >
                  {item.text}
                </Button>
              </Tooltip>
            ))}
          </Box>

          {/* Menú de usuario */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Abrir ajustes">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, cursor: 'pointer' }}>
                <Avatar
                  alt={userData?.name || 'Usuario'}
                  src={userData?.avatarUrl || '/static/images/avatar/1.jpg'}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-user"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userSettings.map((setting, index) => (
                <MenuItem
                  key={setting}
                  onClick={setting === 'Cerrar Sesión' ? handleLogout : handleCloseUserMenu}
                  disabled={index === 0}
                  sx={{ cursor: index === 0 ? 'default' : 'pointer' }}
                >
                  <Typography sx={{ textAlign: 'center', color: '#00335c' }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Menú mobile */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: 'block', md: 'none' } }}
            PaperProps={{
              style: {
                width: 250,
              },
            }}
          >
            <MenuItem disabled>
              <Typography sx={{ textAlign: 'center', color: '#00335c', fontWeight: 'bold' }}>
                Menú
              </Typography>
            </MenuItem>
            {navItems.map((item) => (
              <MenuItem
                key={item.text}
                onClick={() => {
                  navigate(item.url);
                  handleCloseNavMenu();
                }}
                component={Link}
                to={item.url}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemIcon sx={{ color: '#00335c' }}>{item.icon}</ListItemIcon>
                <Typography sx={{ color: '#00335c' }}>{item.text}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigato;
