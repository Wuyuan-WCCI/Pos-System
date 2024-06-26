import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from '../context/ProductContext';
import { Container, Typography, Grid, Card, CardContent, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel, IconButton, Slider, Checkbox, FormControlLabel } from '@mui/material';
import { Add, Search, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import ProductForm from './ProductForm';
import Pagination from '@mui/material/Pagination';

const ProductList = () => {
    const { products, fetchProducts } = useContext(ProductContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        ).filter(product => 
            product.price >= priceRange[0] && product.price <= priceRange[1]
        ).filter(product =>
            !inStockOnly || product.quantityInStock > 0
        );

        setFilteredProducts(sortProducts(filtered));
    }, [searchQuery, products, sortField, sortOrder, priceRange, inStockOnly]);

    const sortProducts = (products) => {
        if (!sortField) return products;
        return [...products].sort((a, b) => {
            const fieldA = a[sortField];
            const fieldB = b[sortField];
            if (sortOrder === 'asc') {
                return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
            } else {
                return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
            }
        });
    };

    const handleSortChange = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const displayedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Product List</Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8}>
                    <TextField
                        fullWidth
                        label="Search Products"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <Search />,
                        }}
                    />
                </Grid>
                
            </Grid>

            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value)}
                        >
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="price">Price</MenuItem>
                            <MenuItem value="quantityInStock">Quantity</MenuItem>
                        </Select>
                    </FormControl>
                    <IconButton onClick={() => handleSortChange(sortField)}>
                        {sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
                    </IconButton>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Typography gutterBottom>Price Range</Typography>
                    <Slider
                        value={priceRange}
                        onChange={handlePriceRangeChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={1000}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={inStockOnly}
                                onChange={(e) => setInStockOnly(e.target.checked)}
                            />
                        }
                        label="In Stock Only"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 2 }}>
                {displayedProducts.map(product => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{product.name}</Typography>
                                <Typography color="textSecondary">{product.brand}</Typography>
                                <Typography>{product.description}</Typography>
                                <Typography color="textSecondary">${product.price.toFixed(2)}</Typography>
                                <Typography color="textSecondary">Quantity: {product.quantityInStock}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>


            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
    <Grid item>
        <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpenAddDialog(true)}
        >
            Add New Product
        </Button>
    </Grid>
</Grid>

            <Pagination
                count={Math.ceil(filteredProducts.length / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                sx={{ mt: 2 }}
            />

            {/* Add Product Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent>
                    <ProductForm />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductList;
