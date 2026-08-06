import React, { useState } from 'react';
import './AuthForm.css';

export default function Auth({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);

  // Form input states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Client');

  // UI status states
  const [errors, setErrors] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('Client');
    setErrors([]);
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMsg('');

    const endpoint = isRegistering ? '/api/register' : '/api/login';
    const payload = isRegistering
      ? { username, email, password, role }
      : { username, password };

    try {
      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Backend returned error(s)
        if (data.errors) {
          setErrors(data.errors);
        } else if (data.error) {
          setErrors([data.error]);
        } else {
          setErrors(['An unexpected error occurred.']);
        }
        return;
      }

      // Success!
      if (isRegistering) {
        setSuccessMsg('Account created successfully! You can now log in.');
        setIsRegistering(false);
        resetForm();
      } else {
        // Logged in successfully: pass user data back up to App
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setErrors(['Unable to connect to the backend server. Make sure Python is running!']);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="auth-subtitle">Violetta Laundry Service</p>

        {errors.length > 0 && (
          <div className="error-banner">
            {errors.length === 1 ? (
              <p>{errors[0]}</p>
            ) : (
              <ul>
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {successMsg && (
          <div style={{ backgroundColor: '#DEF7EC', color: '#03543F', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. johndoe"
              required
            />
          </div>

          {isRegistering && (
            <>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Account Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Client">Client</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div className="toggle-text">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            className="toggle-link"
            onClick={() => {
              setIsRegistering(!isRegistering);
              resetForm();
            }}
          >
            {isRegistering ? 'Log In' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
}