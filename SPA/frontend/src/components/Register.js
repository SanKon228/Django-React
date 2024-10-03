import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import './css/Register.css';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/register/', formData);
            alert('Реєстрація успішна. Будь ласка, увійдіть у систему.');
            navigate('/login');
        } catch (err) {
            console.error('Registration error:', err);
            setErrors(err.response.data);
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Реєстрація</h2>
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                    />
                    {errors.username && <p className="error">{errors.username}</p>}
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password2"
                        value={formData.password2}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                    />
                    {errors.password2 && <p className="error">{errors.password2}</p>}
                </div>
                {errors.non_field_errors && (
                    <p className="error">{errors.non_field_errors}</p>
                )}
                <button type="submit">Зареєструватися</button>
                <p>Вже маєте акаунт? <Link to="/login">Увійти</Link></p>
            </form>
        </div>
    );
}

export default Register;
