
import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const ProductGrid = () => {
  // Sample data
  const products = [
    { id: 1, name: 'Product 1', quality: 'Good' },
    { id: 2, name: 'Product 2', quality: 'Bad' },
    { id: 3, name: 'Product 3', quality: 'Good' },
    { id: 4, name: 'Product 4', quality: 'Good' },
  ];

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {product.name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Quality: {product.quality}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
