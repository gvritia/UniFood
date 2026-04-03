import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Badge,
  Avatar, Menu, MenuItem, Chip
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" color="primary" elevation={1}>
      <Toolbar>
        {/* Логотип */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
            mr: 4
          }}
        >
          UniFood
        </Typography>

        {/* Навигация */}
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/menu"
            sx={{ fontWeight: isActive('/menu') ? 'bold' : 'normal' }}
          >
            Меню
          </Button>
          {isAuthenticated && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/cart"
                sx={{ fontWeight: isActive('/cart') ? 'bold' : 'normal' }}
              >
                <IconButton color="inherit" size="small">
                  <Badge badgeContent={cartItemsCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/orders"
                sx={{ fontWeight: isActive('/orders') ? 'bold' : 'normal' }}
              >
                Заказы
              </Button>
            </>
          )}
        </Box>

        {/* Профиль пользователя */}
        {isAuthenticated ? (
          <>
            {/* Баланс */}
            <Chip
              icon={<AccountBalanceIcon />}
              label={`${user?.balance?.toFixed(2) || '0.00'} ₽`}
              sx={{ 
                mr: 2, 
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                display: { xs: 'none', sm: 'flex' }
              }}
            />
            
            <Typography sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              {user?.name}
            </Typography>
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.name?.charAt(0)}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                Профиль
              </MenuItem>
              <MenuItem component={Link} to="/orders" onClick={handleMenuClose}>
                Мои заказы
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Выйти
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              component={Link}
              to="/auth/login"
              variant="outlined"
            >
              Войти
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/auth/register"
              variant="contained"
            >
              Регистрация
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
