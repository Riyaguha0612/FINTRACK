import React from 'react';
import { Link } from 'react-router-dom';
import './Launchpage.css';

const Launchpage = () => {
    return (
        <div className="landing-container">
            <h1 >Simplified Financial </h1>
            <h1>Tracking </h1>
            <h1>Application</h1>
            <p className="landing-subheader">
                Welcome! You’re on the right path. Get started with FinTrack and</p><p> take control of your expenses today!
            </p>
            <div className="landing-buttons">
            <Link to='/signin'><button>Log in</button></Link>
            <Link to='/signup'><button>Sign Up for free</button></Link>
                
            </div>
            <div className="landing-features">
                <div className="feature-item">
                    <img src="path/to/your/image1.jpg" alt="Cashback" />
                    <p>Get rewarded up to 10% Cashback</p>
                </div>
                <div className="feature-item">
                    <img src="path/to/your/image2.jpg" alt="Security" />
                    <p>Security & privacy guaranteed</p>
                </div>
                <div className="feature-item">
                    <img src="path/to/your/image3.jpg" alt="Deposits" />
                    <p>100% Refundable Deposits</p>
                </div>
            </div>
        </div>
    );
};

export default Launchpage;
