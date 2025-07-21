import React, { useState } from 'react';
import axios from '../api/api';

export default function NewAccountForm() {
    const [form, setForm] = useState({ account_name: '', account_holder: '', starting_balance: '', starting_date: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/NewAccounts', {
                account_name: form.account_name,
                account_holder: form.account_holder,
                starting_balance: parseFloat(form.starting_balance),
                starting_date: form.starting_date,
            });
            setStatus(`Account created with ID ${res.data.account_id}`);
        } catch (err) {
            setStatus(`Error: ${err.response?.data?.error || err.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <input name="account_name" type="text" placeholder="Account Name" onChange={handleChange} className="border p-2 w-full" />
            <input name="account_holder" type="text" placeholder="Account Holder`" onChange={handleChange} className="border p-2 w-full" />
            <input name="starting_balance" type="number" step="0.01" placeholder="Starting Balance" onChange={handleChange} className="border p-2 w-full" />
            <input name="starting_date" placeholder='Starting Balance Date' type="date" onChange={handleChange} className="border p-2 w-full" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Account</button>
            {status && <p className="text-sm">{status}</p>}
        </form>
    );
}