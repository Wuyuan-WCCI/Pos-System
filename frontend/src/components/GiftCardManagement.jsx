import React, { useState } from "react";

import axios from 'axios';

const GiftCardManagement = () => {
    const [code, setCode] = useState('');
    const [balance, setBalance] = useState(0);
    const [isActive, setIsActive] = useState(true);

    const createGiftCard = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/giftcards', { code, balance, isActive});
            console.log('Gift card created', response.data);

        }catch (error) {
            console.log('Error creating gift card:', error);
        }
    }


return(
    <div>
        <h2>Gift Card Management</h2>
        <input type = "text" placeholder="code" value={code} onChange={(e) => setCode(e.target.value)}/>
        <input type = 'number' placeholder="Balance" value={balance} onChange={(e) => setBalance(parseFloat(e.target.value))} />
        <button onClick={createGiftCard}>Create Gift Card</button>
    </div>
);

};

export default GiftCardManagement;