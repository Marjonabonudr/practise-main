import React, { useState } from 'react';
import api, { errMsg } from '../../api';
import './login.css';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/users/login', { email, password }); // data = { token, role, id, email }
            localStorage.setItem('token', data.token);
            onLoginSuccess();
        } catch (err) {
            setError(errMsg(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Algoritm Monitoring</h2>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Parol</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <div style={{ color: '#b91c1c', marginBottom: '0.75rem' }}>{error}</div>}
                <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? 'Kirilmoqda...' : 'Kirish'}
                </button>
            </form>
        </div>
    );
};

export default Login;