// contexts/useAccounts.js
import { useContext } from 'react';
import { AccountContext } from './AccountContext';

export const useAccounts = () => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccounts must be used within AccountProvider');
    }
    return context;
};