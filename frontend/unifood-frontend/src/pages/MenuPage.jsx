import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Card, CardMedia, CardContent, CardActions,
  Typography, Button, TextField, Chip, Box, Fab, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { menuApi } from '../api/menu';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedDish, setSelectedDish] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const categories = ['Все', 'Пицца', 'Бургеры', 'Напитки', 'Салаты', 'Десерты', 'Горячее'];

  useEffect(() => {
    fetchMenu();
  }, [selectedCategory]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'Все') {
        params.category = selectedCategory;
      }
      if (search.trim()) {
        params.q = search.trim();
      }
      
      const response = await menuApi.getMenu(params);
      setItems(response);
    } catch (error) {
      console.error('Ошибка при загрузке меню:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMenu();
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    try {
      await addToCart(selectedDish.id, quantity);
      setSelectedDish(null);
      setQuantity(1);
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
    }
  };

  const openDishModal = (dish) => {
    setSelectedDish(dish);
    setQuantity(1);
  };

  const closeDishModal = () => {
    setSelectedDish(null);
    setQuantity(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom fontWeight="bold">
        Меню UniFood
      </Typography>

      {/* Поиск и фильтры */}
      <Box sx={{ mb: 4 }}>
        <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
          <TextField
            fullWidth
            placeholder="Поиск блюда..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
          />
        </form>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setSelectedCategory(cat)}
              color={selectedCategory === cat ? 'primary' : 'default'}
              variant={selectedCategory === cat ? 'filled' : 'outlined'}
              clickable
            />
          ))}
        </Box>
      </Box>

      {/* Сетка блюд */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ py: 8 }}>
          Блюда не найдены
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 6 }
                }}
                onClick={() => openDishModal(item)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={item.food_name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {item.category}
                  </Typography>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {item.food_name}
                  </Typography>
                  {item.calories && (
                    <Typography variant="body2" color="text.secondary">
                      {item.calories} ккал
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {item.price} ₽
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDishModal(item);
                    }}
                  >
                    В корзину
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Модальное окно блюда */}
      {selectedDish && (
        <Dialog 
          open={!!selectedDish} 
          onClose={closeDishModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ m: 0, p: 2, position: 'relative' }}>
            {selectedDish.food_name}
            <IconButton
              onClick={closeDishModal}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box component="img" 
              src={selectedDish.image_url || 'https://via.placeholder.com/400x250?text=No+Image'} 
              alt={selectedDish.food_name}
              sx={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 1, mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Категория: {selectedDish.category}
            </Typography>
            {selectedDish.calories && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Калорийность: {selectedDish.calories} ккал
              </Typography>
            )}
            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 2, mb: 2 }}>
              {selectedDish.price} ₽
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
              <Typography variant="subtitle1">Количество:</Typography>
              <IconButton 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                size="small"
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>
                {quantity}
              </Typography>
              <IconButton 
                onClick={() => setQuantity(q => q + 1)}
                size="small"
              >
                <AddIcon />
              </IconButton>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={closeDishModal} color="inherit">
              Отмена
            </Button>
            <Button 
              onClick={handleAddToCart} 
              variant="contained" 
              color="primary"
              disabled={!isAuthenticated}
            >
              Добавить за {selectedDish.price * quantity} ₽
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default MenuPage;
