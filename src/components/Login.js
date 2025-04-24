import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiMethods } from '../utils/api';
import { useAuth } from '../context/AuthContext'; // Import AuthContext

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login from AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiMethods.connectUser({ email, password });
      if (response.status === 200) { // Ensure the response is OK
        const token = response.data.token;
        await login(token); // Use the login method from AuthContext
        setError(null);
        navigate('/dashboard'); // Redirect to the dashboard
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container">
      <div className="card white">
        <div className="card-content">
          <form onSubmit={handleLogin} className="col s12">
            <h5 className="center-align">Connexion</h5>
            <div className="input-field">
              <label htmlFor="email">Courriel</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="validate"
              />
            </div>
            <div className="input-field">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="validate"
              />
            </div>
            {error && <p className="red-text center-align">{error}</p>}
            <div className="center-align" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
              <button type="submit" className="btn waves-effect waves-light">
                Se connecter
              </button>
              <button
                type="button"
                className="btn-flat waves-effect"
                onClick={() => navigate('/register')}
              >
                S'enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
