import React, { useState } from 'react';
import axios from '../api/api';

export default function NewAccountForm() {
    const [form, setForm] = useState({ 
        AccountName: '', 
        FirstName: '', 
        LastName: '', 
        StartingBalance: '', 
        StartingDate: '' 
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/uploads/newAccount', {
                AccountName: form.AccountName,
                FirstName: form.FirstName,
                LastName: form.LastName,
                StartingBalance: parseFloat(form.StartingBalance),
                StartingDate: form.StartingDate,
            });
            setStatus(`Account created with ID ${res.data.account_id}`);
        } catch (err) {
            setStatus(`Error: ${err.response?.data?.error || err.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <input 
                name="AccountName" 
                type="text" 
                placeholder="Account Name" 
                onChange={handleChange} 
                className="border p-2 w-full" 
            />
            <div className="grid grid-cols-2 gap-1">
                <input 
                    name="FirstName" 
                    type="text" 
                    placeholder="First Name" 
                    onChange={handleChange} 
                    className="border p-1 w-full" 
                />
                <input 
                    name="LastName" 
                    type="text" 
                    placeholder="Last Name" 
                    onChange={handleChange} 
                    className="border p-1 w-full" 
                />
            </div>
            <input 
                name="StartingBalance" 
                type="number" 
                step="0.01" 
                placeholder="Starting Balance" 
                onChange={handleChange} 
                className="border p-2 w-full" 
            />
            <input 
                name="StartingDate" 
                placeholder="Starting Balance Date" 
                type="date" 
                onChange={handleChange} 
                className="border p-2 w-full" 
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Account</button>
            {status && <p className="text-sm">{status}</p>}
        </form>
    );
}