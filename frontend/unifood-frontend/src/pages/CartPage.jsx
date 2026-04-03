import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Box, IconButton,
  Divider, Alert, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersApi } from '../api/orders';

const CartPage = () => {
  const { cartItems, totalPrice, loading, updateQuantity, removeItem, clearCart, refreshCart } = useCart();
  const { isAuthenticated, user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    // Проверяем баланс
    if (user.balance < totalPrice) {
      alert(`Недостаточно средств на балансе!\nТекущий баланс: ${user.balance.toFixed(2)} ₽\nТребуется: ${totalPrice.toFixed(2)} ₽\n\nПополните баланс в профиле.`);
      navigate('/profile');
      return;
    }

    try {
      await ordersApi.createOrder();
      // Очищаем корзину после успешного заказа
      await clearCart();
      // Обновляем данные пользователя после заказа
      await refreshUser();
      navigate('/orders', { state: { message: 'Заказ успешно оформлен!' } });
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      const errorMessage = error.response?.data?.detail || 'Ошибка при оформлении заказа. Попробуйте позже.';
      alert(errorMessage);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Пожалуйста, <Link to="/auth/login">войдите</Link>, чтобы увидеть свою корзину
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Загрузка корзины...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom fontWeight="bold">
        Корзина
      </Typography>

      {/* Отображение баланса */}
      {isAuthenticated && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalanceIcon />
              <Typography variant="body1">Ваш баланс:</Typography>
            </Box>
            <Chip
              label={`${user?.balance?.toFixed(2) || '0.00'} ₽`}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.3)', 
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            />
          </Box>
        </Paper>
      )}

      {cartItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Ваша корзина пуста
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Добавьте блюда из меню, чтобы сделать заказ
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/menu"
            size="large"
          >
            Перейти в меню
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Блюдо</TableCell>
                  <TableCell align="right">Цена</TableCell>
                  <TableCell align="center">Количество</TableCell>
                  <TableCell align="right">Сумма</TableCell>
                  <TableCell align="center">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.menu_item?.food_name || 'Блюдо удалено'}
                      {item.menu_item?.category && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {item.menu_item.category}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {item.menu_item?.price || 0} ₽
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography component="span" sx={{ mx: 2 }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {(item.menu_item?.price * item.quantity || 0).toFixed(2)} ₽
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Итого:</Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {totalPrice.toFixed(2)} ₽
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                color="error"
                onClick={clearCart}
              >
                Очистить корзину
              </Button>
              <Button 
                variant="contained" 
                size="large"
                onClick={handleCheckout}
                disabled={totalPrice === 0}
              >
                Оформить заказ
              </Button>
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default CartPage;
