import React, { useState, useEffect } from 'react';
import axios from '../api/api';

export default function UploadForm() {
    const [accounts, setAccounts] = useState([]);
    const [selected, setSelected] = useState('');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');

    // useEffect(() => {
    //     axios.get('/accounts').then(res => setAccounts(res.data));
    // }, []);

    useEffect(() => {
    // Simulate API response with mock data
    const mockAccounts = [
        { id: '1', name: 'Checking' },
        { id: '2', name: 'Savings' },
    ];
    setAccounts(mockAccounts);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !selected) return setStatus('Select file and account');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('account_id', selected);

        try {
            const res = await axios.post('/transactions/upload', formData);
            setStatus(res.data.message);
        } catch (err) {
            setStatus(`Error: ${err.response?.data?.error || err.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <select onChange={e => setSelected(e.target.value)} className="border p-2 w-full">
                <option value="">Select Account</option>
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
            <input type="file" onChange={e => setFile(e.target.files[0])} accept=".qif,.ofx" className="border p-2 w-full" />
            <button className="bg-green-600 text-white px-4 py-2 rounded">Upload</button>
            {status && <p className="text-sm">{status}</p>}
        </form>
    );
}