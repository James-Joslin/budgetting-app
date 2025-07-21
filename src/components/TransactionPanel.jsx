import React from 'react';
import UploadForm from './UploadForm';

export default function TransactionPanel() {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Import Transactions</h2>
            <UploadForm />
        </div>
    );
}
