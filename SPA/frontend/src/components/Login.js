import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import './css/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/login/', { username, password });
            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('username', username);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            alert('Логін успішний');
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            alert('Логін не вдалося. Перевірте свої дані.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                <p>Немає акаунта? <Link to="/register">Зареєструватися</Link></p> 
            </form>
        </div>
    );
};

export default Login;
