import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, Box, Typography, Button, Grid, Card, CardContent, 
  Avatar, Stack, useTheme, useMediaQuery, Paper 
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BoltIcon from '@mui/icons-material/Bolt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const steps = [
    { 
      title: 'Выбирайте', 
      desc: 'Сотни блюд из меню вашей столовой', 
      icon: <RestaurantMenuIcon sx={{ fontSize: 40 }} />,
      color: '#FF5722'
    },
    { 
      title: 'Заказывайте', 
      desc: 'Оформляйте заказ в пару кликов', 
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      color: '#4CAF50'
    },
    { 
      title: 'Забирайте', 
      desc: 'Без очередей по номеру заказа', 
      icon: <BoltIcon sx={{ fontSize: 40 }} />,
      color: '#2196F3'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'white', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 'auto', md: '600px' },
          pt: { xs: 8, md: 15 },
          pb: { xs: 15, md: 25 },
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
          color: 'white',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2,
            zIndex: 0
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: { md: '700px' } }}>
            <Typography 
              variant={isMobile ? "h3" : "h1"} 
              component="h1" 
              gutterBottom 
              fontWeight="900"
              sx={{ letterSpacing: -1, lineHeight: 1.1 }}
            >
              Ешь вкусно. <br />
              <Box component="span" sx={{ color: 'secondary.main' }}>Живи ярко.</Box>
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}>
              UniFood — это современный сервис заказа еды в столовых вашего университета. Забудь об очередях навсегда.
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent={{ xs: 'center', md: 'flex-start' }}
            >
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/menu"
                sx={{
                  py: 2, px: 6,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 10,
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  bgcolor: 'secondary.main',
                  '&:hover': { bgcolor: 'secondary.dark' }
                }}
              >
                В Меню
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/auth/login"
                  sx={{
                    py: 2, px: 6,
                    borderRadius: 10,
                    color: 'white',
                    borderColor: 'white',
                    fontSize: '1.1rem',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Войти
                </Button>
              )}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Stats Section / Value Cards */}
      <Box sx={{ mt: 4, mb: 10, position: 'relative', zIndex: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {[
              { label: 'Быстро', desc: 'Заказ за 30 секунд', icon: <BoltIcon color="primary" /> },
              { label: 'Надежно', desc: 'Гарантия качества', icon: <VerifiedUserIcon color="primary" /> },
              { label: 'Удобно', desc: 'Без очередей', icon: <AccessTimeIcon color="primary" /> }
            ].map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    borderRadius: 4,
                    height: '100%',
                    border: '1px solid #eee',
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-10px)', boxShadow: 12 }
                  }}
                >
                  <Avatar sx={{ bgcolor: 'blue', mb: 2, mx: 'auto', width: 64, height: 64 }}>
                    {item.icon}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>{item.label}</Typography>
                  <Typography variant="body1" color="text.secondary">{item.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How it works */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 15 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Как это работает?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Три простых шага к вашему обеду
          </Typography>
        </Box>

        <Grid container spacing={6} justifyContent="center">
          {steps.map((step, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box sx={{ textAlign: 'center', px: 2 }}>
                <Box
                  sx={{
                    width: 100, height: 100,
                    borderRadius: '24px',
                    bgcolor: step.color + '15',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    color: step.color,
                    transform: 'rotate(10deg)',
                    '& > *': { transform: 'rotate(-10deg)' }
                  }}
                >
                  {step.icon}
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>{step.title}</Typography>
                <Typography variant="body1" color="text.secondary">{step.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Promo Section */}
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Paper 
          sx={{ 
            p: { xs: 4, md: 8 }, 
            borderRadius: 8, 
            textAlign: 'center',
            background: 'linear-gradient(45deg, #FF5722 30%, #FF9800 90%)',
            color: 'white',
            boxShadow: '0 20px 40px rgba(255, 87, 34, 0.3)'
          }}
        >
          <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom> 
            Готовы начать? 
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, opacity: 0.9, fontWeight: 300 }}>
            Присоединяйтесь к тысячам студентов, которые уже выбрали UniFood.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            to="/menu"
            sx={{ 
              bgcolor: 'white', 
              color: '#FF5722', 
              fontWeight: 'bold',
              px: 6, py: 2,
              fontSize: '1.2rem',
              borderRadius: 10,
              '&:hover': { bgcolor: 'grey.100', transform: 'scale(1.05)' },
              transition: '0.2s'
            }}
          >
            Перейти к меню
          </Button>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 6, bgcolor: 'grey.50', borderTop: '1px solid #eee' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="primary">UniFood</Typography>
            <Typography variant="body2" color="text.secondary">
              © 2026 UniFood. Сделано с любовью для студентов.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography variant="body2" component={Link} to="/menu" sx={{ textDecoration: 'none', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>Меню</Typography>
              <Typography variant="body2" component={Link} to="/profile" sx={{ textDecoration: 'none', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>Профиль</Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
