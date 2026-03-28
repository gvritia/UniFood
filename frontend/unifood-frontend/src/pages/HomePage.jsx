import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentIcon from '@mui/icons-material/Assignment';

const HomePage = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 10,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            UniFood
          </Typography>
          <Typography variant="h5" gutterBottom>
            Онлайн-заказ еды в столовой вашего вуза
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Быстро, удобно и вкусно! Заказывайте еду не выходя из аудитории.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/menu"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
                px: 4
              }}
            >
              Заказать еду
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/auth/login"
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' },
                px: 4
              }}
            >
              Войти
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <RestaurantMenuIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Большое меню
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Разнообразные блюда на любой вкус: пицца, бургеры, салаты, напитки и многое другое
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button component={Link} to="/menu" size="small">
                  Смотреть меню
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <ShoppingCartIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Удобная корзина
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Добавляйте блюда в корзину, меняйте количество и оформляйте заказ в пару кликов
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button component={Link} to="/cart" size="small">
                  Перейти в корзину
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <AssignmentIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  История заказов
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Отслеживайте статус заказа и смотрите историю всех ваших покупок
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button component={Link} to="/orders" size="small">
                  Мои заказы
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">
            Как это работает?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  1
                </Box>
                <Typography variant="h6" gutterBottom>
                  Выберите блюда
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Изучите меню и добавьте понравившиеся блюда в корзину
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  2
                </Box>
                <Typography variant="h6" gutterBottom>
                  Оформите заказ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Проверьте состав заказа и оплатите его онлайн
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  3
                </Box>
                <Typography variant="h6" gutterBottom>
                  Дождитесь готовности
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Отслеживайте статус приготовления в реальном времени
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  4
                </Box>
                <Typography variant="h6" gutterBottom>
                  Получите заказ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Заберите готовый заказ в столовой по номеру заказа
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
