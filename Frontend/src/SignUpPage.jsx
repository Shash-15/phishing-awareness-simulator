import React, { useState } from 'react';
import './SignUpPage.css';
import './LoginPage.css'; // Reuse some styles

export default function SignUpPage({ onSignUpSuccess, onBackToLogin }) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });

    // Password strength checker (reused logic from LoginPage)
    const checkPasswordStrength = (pwd) => {
        if (!pwd) {
            setPasswordStrength({ score: 0, text: '', color: '' });
            return;
        }

        let score = 0;
        const checks = {
            length: pwd.length >= 8,
            uppercase: /[A-Z]/.test(pwd),
            lowercase: /[a-z]/.test(pwd),
            number: /[0-9]/.test(pwd),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
        };

        score = Object.values(checks).filter(Boolean).length;

        const strengthLevels = [
            { score: 0, text: '', color: '' },
            { score: 1, text: 'Very Weak', color: '#ef4444' },
            { score: 2, text: 'Weak', color: '#f97316' },
            { score: 3, text: 'Fair', color: '#eab308' },
            { score: 4, text: 'Good', color: '#22c55e' },
            { score: 5, text: 'Strong', color: '#10b981' }
        ];

        setPasswordStrength(strengthLevels[score]);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        checkPasswordStrength(newPassword);
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name.trim(), username: username.trim(), password }),
            });

            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                try {
                    data = await response.json();
                } catch (parseErr) {
                    console.error('Failed to parse JSON response:', parseErr);
                    throw new Error('Invalid response format from server');
                }
            } else {
                const text = await response.text();
                console.error('Expected JSON, but received:', text.substring(0, 100));

                if (response.status === 504 || response.status === 502) {
                    throw new Error('Authentication server is currently unreachable. Please ensure the backend is running.');
                }
                if (text.trim().startsWith('<')) {
                    throw new Error('Server returned an HTML page. This usually means the backend server is not running! Please run "npm run start-server" in a separate terminal.');
                }
                throw new Error(`Unexpected response from server (${response.status})`);
            }

            if (response.ok) {
                alert('Account created successfully! You can now log in.');
                onSignUpSuccess(username);
            } else {
                const additionalInfo = data.errors ? ` (${data.errors.join('; ')})` : '';
                setError((data.message || 'Registration failed.') + additionalInfo);
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message.includes('fetch') || err.message.includes('unreachable')
                ? 'Unable to connect to the authentication server. Please ensure the backend is running.'
                : err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <nav className="login-nav">
                <div className="login-nav-logo-container">
                    <img src="/logo.png" alt="PhishSim Logo" className="login-nav-logo" />
                </div>
            </nav>

            <div className="login-card-wrapper animate-slide-up">
                <div className="login-card">
                    <div className="login-header">
                        <h2 className="login-title">Create Account</h2>
                        <p className="login-subtitle">Join the Security Training Portal today.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="login-form-group">
                            <label className="login-label">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="login-input"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="login-form-group">
                            <label className="login-label">Email / Employee ID</label>
                            <input
                                type="email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="login-input"
                                placeholder="employee@company.com"
                                required
                            />
                        </div>
                        <div className="login-form-group">
                            <label className="login-label">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="login-input"
                                placeholder="••••••••"
                                required
                            />
                            {password && passwordStrength.text && (
                                <div className="password-strength">
                                    <div className="strength-bar-container">
                                        <div
                                            className="strength-bar"
                                            style={{
                                                width: `${(passwordStrength.score / 5) * 100}%`,
                                                backgroundColor: passwordStrength.color
                                            }}
                                        ></div>
                                    </div>
                                    <span className="strength-text" style={{ color: passwordStrength.color }}>
                                        {passwordStrength.text}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="login-form-group">
                            <label className="login-label">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="login-input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="login-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Already have an account?{' '}
                            <button
                                onClick={onBackToLogin}
                                className="signup-action-btn"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
