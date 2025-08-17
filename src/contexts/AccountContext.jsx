import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/api';

const AccountContext = createContext();

export const useAccounts = () => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccounts must be used within AccountProvider');
    }
    return context;
};

export const AccountProvider = ({ children }) => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchAccounts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('/uploads/getAccounts');
            const accountObjects = res.data.Rows.map(row => ({
                id: row[0],
                name: row[1]
            }));
            setAccounts(accountObjects);
            return accountObjects;
        } catch (error) {
            console.error('Error fetching accounts:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch accounts on mount
    useEffect(() => {
        fetchAccounts();
    }, []);
    
    return (
        <AccountContext.Provider value={{ 
            accounts, 
            fetchAccounts, 
            loading, 
            error,
            setAccounts 
        }}>
            {children}
        </AccountContext.Provider>
    );
};