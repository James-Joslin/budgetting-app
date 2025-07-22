import React, { useState, useEffect } from 'react';
import axios from '../api/api';

export default function UploadForm() {
    const [accounts, setAccounts] = useState([]);
    const [selected, setSelected] = useState('');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);

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

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.qif') || droppedFile.name.endsWith('.ofx'))) {
            setFile(droppedFile);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.name.endsWith('.qif') || selectedFile.name.endsWith('.ofx'))) {
            setFile(selectedFile);
        } else if (selectedFile) {
            // Reset the input value so the same invalid file can be selected again
            e.target.value = '';
            setStatus('Please select a QIF or OFX file');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <select onChange={e => setSelected(e.target.value)} className="border p-2 w-full">
                <option value="">Select Account</option>
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
            
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 w-full transition-all duration-200 ${
                    isDragOver 
                        ? 'border-blue-400 bg-blue-50 bg-opacity-50' 
                        : 'border-gray-300 hover:border-blue-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".qif,.ofx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center h-12 flex flex-col justify-center">
                    {isDragOver ? (
                        <p className="text-blue-600 font-medium">Drop file here</p>
                    ) : (
                        <>
                            <p className="text-gray-600">
                                {file ? file.name : 'Choose file or drag and drop'}
                            </p>
                            <p className="text-sm text-gray-400">QIF or OFX files only</p>
                        </>
                    )}
                </div>
            </div>
            
            <button className="bg-green-600 text-white px-4 py-2 rounded">Upload</button>
            {status && <p className="text-sm">{status}</p>}
        </form>
    );
}