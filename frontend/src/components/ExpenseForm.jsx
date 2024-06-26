import React, { useState, useEffect } from 'react';
import { addExpense, updateExpense, getExpenseById } from '../api/expenseService';
import { useParams, useNavigate } from 'react-router-dom';

const ExpenseForm = () => {
    const [expense, setExpense] = useState({ description: '', amount: '', date: '' });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            loadExpense();
        }
    }, [id]);

    const loadExpense = async () => {
        const data = await getExpenseById(id);
        setExpense(data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpense({ ...expense, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (id) {
            await updateExpense(id, expense);
        } else {
            await addExpense(expense);
        }
        navigate('/expenses');
    };

    return (
        <div>
            <h2>{id ? 'Edit Expense' : 'Add Expense'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Description</label>
                    <input type="text" name="description" value={expense.description} onChange={handleChange} />
                </div>
                <div>
                    <label>Amount</label>
                    <input type="number" name="amount" value={expense.amount} onChange={handleChange} />
                </div>
                <div>
                    <label>Date</label>
                    <input type="date" name="date" value={expense.date} onChange={handleChange} />
                </div>
                <button type="submit">{id ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default ExpenseForm;
