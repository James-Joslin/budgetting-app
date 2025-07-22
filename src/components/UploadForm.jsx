import React, { useState, useEffect } from 'react';
import axios from '../api/api';

export default function UploadForm() {
    const [accounts, setAccounts] = useState([]);
    const [selected, setSelected] = useState('');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await axios.get('/uploads/getAccounts');
                
                // Transform Rows array into objects with id and name properties
                const accountObjects = res.data.Rows.map(row => ({
                    id: row[0],
                    name: row[1]
                }));
                
                setAccounts(accountObjects);
            } catch (error) {
                console.error('Error fetching accounts:', error);
                setStatus('Error loading accounts');
            }
        };

        fetchAccounts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file || !selected) {
            setStatus('Please select both a file and an account');
            return;
        }

        setIsUploading(true);
        setStatus('Uploading...');

        const formData = new FormData();
        formData.append('OfxContent', file);
        formData.append('AccountId', selected);

        try {
            const res = await axios.post('/uploads/uploadTransactions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            const selectedAccount = accounts.find(acc => acc.id === selected);
            setStatus(`Upload successful! Data uploaded to: ${selectedAccount?.name || 'Selected account'}`);
            
            // Reset form after successful upload
            setFile(null);
            setSelected('');
            
            // Clear the file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
            
        } catch (err) {
            console.error('Upload error:', err);
            setStatus(`Error: ${err.response?.data?.error || err.message}`);
        } finally {
            setIsUploading(false);
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
            setStatus(''); // Clear any previous status
        } else if (droppedFile) {
            setStatus('Please select a QIF or OFX file');
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.name.endsWith('.qif') || selectedFile.name.endsWith('.ofx'))) {
            setFile(selectedFile);
            setStatus(''); // Clear any previous status
        } else if (selectedFile) {
            // Reset the input value so the same invalid file can be selected again
            e.target.value = '';
            setStatus('Please select a QIF or OFX file');
        }
    };

    const getSelectedAccountName = () => {
        const selectedAccount = accounts.find(acc => acc.id === selected);
        return selectedAccount ? selectedAccount.name : '';
    };

    return (
        <div className="p-2 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Upload Financial Data</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Account Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account
                    </label>
                    <select 
                        value={selected}
                        onChange={e => setSelected(e.target.value)} 
                        className="border border-gray-300 rounded p-2 w-full text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isUploading}
                    >
                        <option value="" className="text-gray-500">Select Account</option>
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.id} className="text-black">
                                {acc.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* File Upload Area */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        File
                    </label>
                    <div
                        className={`relative border-2 border-dashed rounded-lg p-6 w-full transition-all duration-200 ${
                            isDragOver 
                                ? 'border-blue-400 bg-blue-50 bg-opacity-50' 
                                : file
                                ? 'border-green-400 bg-green-50'
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
                            disabled={isUploading}
                        />
                        <div className="text-center h-12 flex flex-col justify-center">
                            {isDragOver ? (
                                <p className="text-blue-600 font-medium">Drop file here</p>
                            ) : (
                                <>
                                    <p className={`${file ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                                        {file ? `✓ ${file.name}` : 'Choose file or drag and drop'}
                                    </p>
                                    <p className="text-sm text-gray-400">QIF or OFX files only</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Selected Account Display */}
                {selected && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        Selected Account: <span className="font-medium">{getSelectedAccountName()}</span>
                    </div>
                )}
                
                {/* Upload Button */}
                <button 
                    type="submit"
                    disabled={isUploading || !file || !selected}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium transition-colors"
                >
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>

                {/* Status Message */}
                {status && (
                    <div className={`text-sm p-2 rounded ${
                        status.includes('successful') || status.includes('✓') 
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : status.includes('Error') || status.includes('error')
                            ? 'bg-red-100 text-red-700 border border-red-300'
                            : 'bg-blue-100 text-blue-700 border border-blue-300'
                    }`}>
                        {status}
                    </div>
                )}
            </form>
        </div>
    );
}