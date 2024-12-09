import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';
import axios from 'axios';

const Signup = () => {
    const [res, setRes] = useState();
    const username = useRef();
    const password = useRef();
    const confirmPassword = useRef();
    const email = useRef();
    const dob = useRef();
    const phone = useRef();

    const post_data = () => {
        if (validateInputs()) {
            postEx();
        } else {
            setRes("Please fill in all fields correctly.");
        }
    };

    const validateInputs = () => {
        // Check if all fields are filled
        const usernameValue = username.current.value.trim();
        const passwordValue = password.current.value.trim();
        const confirmPasswordValue = confirmPassword.current.value.trim();
        const emailValue = email.current.value.trim();
        const dobValue = dob.current.value.trim();
        const phoneValue = phone.current.value.trim();

        // Validate if all fields are filled and passwords match
        if (usernameValue === "" || passwordValue === "" || confirmPasswordValue === "" || emailValue === "" || dobValue === "" || phoneValue === "") {
            return false;
        }

        // Check if password and confirm password match
        if (passwordValue !== confirmPasswordValue) {
            setRes("Passwords do not match!");
            return false;
        }

        return true;
    };

    const postEx = async () => {
        try {
            const response = await axios.post("http://localhost:9000/signup", {
                "username": username.current.value,
                "password": password.current.value,
                "email": email.current.value,
                "dob": dob.current.value,
                "phone": phone.current.value
            });

            if (response.status === 200) {
                setRes("New User has been added Successfully!");
            } else {
                setRes("User Registration failed");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            setRes("An error occurred while registering.");
        }
    };

    return (
        <React.Fragment>
            <div className="signup-container">
                <div className="signup-interior">
                    <div className="login-content">
                        <h1>Welcome Back!</h1>
                        <p>To keep connected with us please log in with your personal info</p>
                        <Link to="/signin"><button>SIGN IN</button></Link>
                    </div>
                    <div className="register-content">
                        <h1>Create Account</h1>
                        <p className="result">{JSON.stringify(res)}</p>
                        <input type="text" ref={username} placeholder='Username' autoFocus />
                        <br />
                        <input type="email" ref={email} placeholder='Email' />
                        <br />
                        <input type="password" ref={password} placeholder='Password' />
                        <br />
                        <input type="password" ref={confirmPassword} placeholder='Confirm Password' />
                        <br />
                        <input type="date" ref={dob} placeholder='Date of Birth' />
                        <br />
                        <input type="tel" ref={phone} placeholder='Phone Number' />
                        <br />
                        <p>Already have an account?</p>
                        <button onClick={post_data}>SIGN UP</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Signup;
