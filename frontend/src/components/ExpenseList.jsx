import React, { useEffect, useState } from 'react';
import { getExpenses, deleteExpense, addExpense } from '../api/expenseService';
import dayjs from 'dayjs';
import {
    Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton,
    Collapse, Grid, Card, CardContent, CardActions, Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, TextField, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { ExpandLess, ExpandMore, Delete, Add } from '@mui/icons-material';

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const [totals, setTotals] = useState({});
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(dayjs().year());
    const [yearlyTotal, setYearlyTotal] = useState(0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newExpense, setNewExpense] = useState({ description: '', amount: '', date: '' });

    useEffect(() => {
        loadExpenses();
    }, []);

    useEffect(() => {
        calculateYearlyTotal();
    }, [selectedYear, expenses]);

    const loadExpenses = async () => {
        const data = await getExpenses();
        setExpenses(data);
        calculateTotals(data);
    };

    const calculateTotals = (expenses) => {
        const totals = expenses.reduce((acc, expense) => {
            const monthYear = dayjs(expense.date).format('MMM YYYY');
            if (!acc[monthYear]) {
                acc[monthYear] = 0;
            }
            acc[monthYear] += expense.amount;
            return acc;
        }, {});
        setTotals(totals);
    };

    const calculateYearlyTotal = () => {
        const yearlyTotal = expenses
            .filter(expense => dayjs(expense.date).year() === selectedYear)
            .reduce((acc, expense) => acc + expense.amount, 0);
        setYearlyTotal(yearlyTotal);
    };

    const handleDelete = async () => {
        await deleteExpense(expenseToDelete);
        setOpenDeleteDialog(false);
        setExpenseToDelete(null);
        loadExpenses();
    };

    const handleMonthClick = (monthYear) => {
        setSelectedMonth(selectedMonth === monthYear ? null : monthYear);
    };

    const handleAddExpense = async () => {
        await addExpense(newExpense);
        setOpenAddDialog(false);
        setNewExpense({ description: '', amount: '', date: '' });
        loadExpenses();
    };

    const filteredExpenses = selectedMonth
        ? expenses.filter(expense => dayjs(expense.date).format('MMM YYYY') === selectedMonth)
        : [];

    const years = [...new Set(expenses.map(expense => dayjs(expense.date).year()))];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Expenses</Typography>

            <FormControl fullWidth margin="normal">
                <InputLabel>Select Year</InputLabel>
                <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    {years.map(year => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>Total Expense for {selectedYear}: ${yearlyTotal.toFixed(2)}</Typography>

            <Typography variant="h6" gutterBottom>Monthly Totals</Typography>
            <List>
                {Object.keys(totals).map(monthYear => (
                    <div key={monthYear}>
                        <ListItem button onClick={() => handleMonthClick(monthYear)}>
                            <ListItemText primary={`${monthYear}: $${totals[monthYear].toFixed(2)}`} />
                            {selectedMonth === monthYear ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={selectedMonth === monthYear} timeout="auto" unmountOnExit>
                            <Grid container spacing={2}>
                                {filteredExpenses.map(expense => (
                                    <Grid item xs={12} sm={6} md={4} key={expense.id}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6">{expense.description}</Typography>
                                                <Typography color="textSecondary">${expense.amount.toFixed(2)}</Typography>
                                                <Typography color="textSecondary">{dayjs(expense.date).format('DD MMM YYYY')}</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <IconButton onClick={() => { setOpenDeleteDialog(true); setExpenseToDelete(expense.id); }}>
                                                    <Delete />
                                                </IconButton>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Collapse>
                    </div>
                ))}
            </List>
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setOpenAddDialog(true)}>Add Expense</Button>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Delete Expense</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this expense?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">Cancel</Button>
                    <Button onClick={handleDelete} color="primary">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Add Expense Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Description"
                        fullWidth
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Amount"
                        type="number"
                        fullWidth
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        type="date"
                        fullWidth
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)} color="primary">Cancel</Button>
                    <Button onClick={handleAddExpense} color="primary">Add</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ExpenseList;
