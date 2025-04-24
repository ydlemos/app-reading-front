import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Register() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registering user:', formData);
    // Add registration logic here
  };

  return (
    <div className="container">
      <div className="card white">
        <div className="card-content">
          <h5 className="center-align">Créer un compte</h5>
          <form onSubmit={handleSubmit} className="col s12">
            <div className="input-field">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="validate"
              />
            </div>
            <div className="input-field">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="validate"
              />
            </div>
            <div className="center-align" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button className="btn waves-effect waves-light" type="submit">
                S'inscrire
              </button>
              <button
                type="button"
                className="btn-flat waves-effect"
                onClick={() => navigate('/login')}
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
