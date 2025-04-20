import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { publicAxios } from '../api/axios';
import '../Styles/Login.css';

const VolunteerLogin = () => {
    const [user_name, setUserName] = useState('');
    const [user_password, setUserPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    //   const BACKEND_URL = process.env.REACT_APP_BACKEND || 'http://localhost:5002';

    useEffect(() => {
        // Check for auth token and user type when component mounts
        const authToken = localStorage.getItem('authToken');
        const userType = localStorage.getItem('userType');

        if (authToken) {
            // Redirect based on user type
            if (userType === 'admin') {
                navigate('/dashboard-admin');
            } else if (userType === 'volunteer') {
                navigate('/dashboard');
            }
        }
    }, [navigate]);

    const handleVolunteerLogin = async (e) => {
        e.preventDefault();

        if (!user_name || !user_password) {
            setError('Please enter both username and password');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            //   const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
            //     user_name,
            //     user_password,
            //     user_type: 'volunteer'
            //   });
            const response = await publicAxios.post('/api/auth/login', {
                user_name,
                user_password,
                user_type: 'volunteer'
            });


            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('userType', 'volunteer');
                navigate('/dashboard');
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Invalid username or password');
            } else if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Server error. Please try again later.');
            }
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Volunteer Login</h2>
            <form className="login-admin-form" onSubmit={handleVolunteerLogin}>
                {error && <div className="error-message">{error}</div>}
                <input
                    type="text"
                    placeholder="Username"
                    value={user_name}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={user_password}
                    onChange={(e) => setUserPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="login-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default VolunteerLogin;