import React, { useState } from 'react';
import './Login_page.css';
import { useNavigate } from 'react-router-dom';
import { database } from '../src/firebase';
import { ref, get, child } from 'firebase/database';
import { ImCross } from 'react-icons/im';

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ userInput: '', password: '' });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials(prev => ({ ...prev, [id]: value }));
  };

  function goHome() {
    navigate('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { userInput, password } = credentials;
    const dbRef = ref(database);

    try {
      const snapshot = await get(child(dbRef, 'users'));

      if (snapshot.exists()) {
        const users = snapshot.val();
        const matchedUser = Object.entries(users).find(([_, data]) =>
          data.username === userInput || data.email === userInput
        );

        if (matchedUser) {
          const [_, userData] = matchedUser;
          if (userData.password === password) {
            localStorage.setItem('pulsePointUser', JSON.stringify(userData));
            alert('Login successful!');
            navigate('/'); // Redirect to home page
          } else {
            alert('Wrong password. Please try again.');
          }
        } else {
          alert('Username or email is incorrect.');
        }
      } else {
        alert('No users found.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <>
      <header style={{ position: 'relative' }}>
        <h2>Pulse Point</h2>
        <button
          onClick={goHome}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            fontSize: '20px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#333'
          }}
          aria-label="Close"
        >
          <ImCross/>
        </button>
      </header>

      <main className="login-container">
        <section className="login-box">
          <div className="login-left">
            <h2>Log In</h2>
            <form onSubmit={handleLogin}>
              <div id='login_data'>
                <label htmlFor="userInput">Username or Email</label>
                <input
                  type="text"
                  id="userInput"
                  placeholder="Enter username or email"
                  required
                  onChange={handleChange}
                />
              </div>
              <div id='login_data'>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <input type="submit" value="Log In" />
              </div>
            </form>
          </div>

          <div className="login-right">
            <h2>Welcome to signup page!</h2>
            <p>Don’t have an account?</p>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </section>
      </main>
      
      <div
        style={{
          backgroundColor: '#f05f70',color: 'white',textAlign: 'center',padding: '10px 0',fontSize: '0.9rem',width: '100%',position: 'relative',bottom: '0',left: '0',borderRadius: '0',marginTop: '40px',fontFamily: 'Arial, sans-serif'
        }}
      >
        &copy; {new Date().getFullYear()} Pulse Point
      </div>

    </>
  );
};

export default LoginPage;
