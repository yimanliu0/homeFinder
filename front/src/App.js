import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/scripts/Dashboard.js';
import Login from './components/scripts/Login.js';
import RegisterForm from './components/scripts/RegisterForm.js';

function App() {
  const [user, setUser] = useState();
  const [register, setRegister] = useState(false);

  const setHomepage = () => {
    if (!user && !register) {
      return (
        <div className={'app-login'}>
          <Login setUser={setUser} setRegister={setRegister} />
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="App">
      <h1>SweetHome</h1>
      {setHomepage()}
      {user && <Dashboard user={user} />}
      {register && <RegisterForm />}
    </div>
  );
}

export default App;
