import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import './Balance.css';

const Balance = () => {
    const { username } = useContext(UserContext);
    const [accounts, setAccounts] = useState([]);
    const [cardDetails, setCardDetails] = useState({
        accountNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        amount: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isFormVisible, setFormVisible] = useState(false);
    const [clickedAccountIndex, setClickedAccountIndex] = useState(null); // Track the clicked card index
    let totalAmount = 0;

    // Calculate the total amount
    accounts.forEach(account => {
        totalAmount += parseFloat(account.amount);
    });
    totalAmount = totalAmount.toFixed(2);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/home/balance?username=${username}`);
                if (response.status === 200) {
                    setAccounts(response.data);
                } else {
                    setError('No accounts found.');
                }
            } catch (error) {
                setError('Failed to fetch accounts. Please try again later.');
            }
        };
        if (username) {
            fetchAccounts();
        }
    }, [username]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails({ ...cardDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate CVV and account number
        if (!/^\d{4}$/.test(cardDetails.cvv)) {
            setError('CVV must be exactly 4 digits.');
            return;
        }

        if (!/^\d{12}$/.test(cardDetails.accountNumber)) {
            setError('Account number must be exactly 12 digits.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:9000/home/add-account', {
                ...cardDetails,
                username: username,
            });

            if (response.status === 200) {
                setSuccessMessage('Card added successfully!');
                setError('');
                setCardDetails({ accountNumber: '', cardHolder: '', expiryDate: '', cvv: '', amount: '' });
                setFormVisible(false);

                // Fetch updated accounts after adding new card
                const updatedResponse = await axios.get(`http://localhost:9000/home/balance?username=${username}`);
                setAccounts(updatedResponse.data);
            }
        } catch (error) {
            setError('Failed to add account. Please try again.');
        }
    };

    const toggleVisible = () => {
        setFormVisible(!isFormVisible);
    };

    const handleCardClick = (index) => {
        // Toggle clicked account index
        setClickedAccountIndex(clickedAccountIndex === index ? null : index);
    };

    return (
        <div className="balance-container">
            <button id="acc-btn" onClick={toggleVisible}>Add Account</button>
            {successMessage && <p className="success">{successMessage}</p>}
            {error && <p className="error">{error}</p>}
            {isFormVisible && (
                <div className="overlay">
                    <div className="overlay-content">
                        <div className="top-row">
                            <h2>Add Account</h2>
                            <button onClick={toggleVisible}>X</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="accountNumber"
                                value={cardDetails.accountNumber}
                                onChange={handleInputChange}
                                placeholder="Account Number (12 digits)"
                                required
                            />
                            <input
                                type="text"
                                name="cardHolder"
                                value={cardDetails.cardHolder}
                                onChange={handleInputChange}
                                placeholder="Card Holder Name"
                                required
                            />
                            <input
                                type="text"
                                name="expiryDate"
                                value={cardDetails.expiryDate}
                                onChange={handleInputChange}
                                placeholder="Expiry Date (MM/YY)"
                                required
                            />
                            <input
                                type="text"
                                name="cvv"
                                value={cardDetails.cvv}
                                onChange={handleInputChange}
                                placeholder="CVV (4 digits)"
                                required
                            />
                            <input
                                type="number"
                                name="amount"
                                value={cardDetails.amount}
                                onChange={handleInputChange}
                                placeholder="Amount"
                                required
                            />
                            <button type="submit">Add Card</button>   
                        </form>
                    </div>
                </div>
            )}

            <div className="account-list">
                <h2>Your Accounts</h2>
                <div className="account-items">
                    {accounts.length > 0 ? (
                        accounts.map((account, index) => (
                            <div 
                                key={index} 
                                className="account-card"
                                onClick={() => handleCardClick(index)} // Handle click on card
                            >
                                <p className="card-number">
                                    {/* Toggle between showing stars and full account number */}
                                    {clickedAccountIndex === index
                                        ? account.accountNumber // Show full number if clicked
                                        : `**** **** **** ${account.accountNumber.slice(-4)}`} {/* Show stars by default */}
                                </p>
                                <p className="card-holder">Card Holder: {account.cardHolder}</p>
                                <p className="card-expiry">Expiry: {account.expiryDate}</p>
                                <p className="card-cvv">CVV: {account.cvv}</p>
                                <p className="card-amount">Amount: ₹{account.amount}</p>
                            </div>
                        ))
                    ) : (
                        <p>No accounts available.</p>
                    )}
                </div>
                <div className="total-amount">
                    <h1>Total Amount: ₹{totalAmount}</h1>
                </div>
            </div>
        </div>
    );
};

export default Balance;
