import React, { useState } from 'react';
import Apartments from './Apartments';
import Wishlist from './Wishlist';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import '../styles/Dashboard.css';

const Dashboard = ({ user, setLogin }) => {
  const [currentModule, setCurrentModule] = useState(
    <Apartments user={user} />
  );

  return (
    <div className={'main-container'}>
      <div className={'side-nav'}>
        <Navbar bg="light" variant="light">
          <Navbar.Brand href="#home">Welcome {user.username}</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link
              href="#home"
              onClick={() => setCurrentModule(<Apartments user={user} />)}
              style={{ color: 'black' }}
            >
              <i
                className="fas fa-home"
                style={{ color: '#D70F4E', fontSize: '1.5em' }}
              ></i>
              Home
            </Nav.Link>
            <Nav.Link
              href="#wishlist"
              onClick={() => setCurrentModule(<Wishlist user={user} />)}
              style={{ color: 'black' }}
            >
              <i
                className="far fa-heart"
                style={{ color: '#D70F4E', fontSize: '1.5em' }}
              ></i>
              Wishlist
            </Nav.Link>
            <Nav.Link
              href={'/logout'}
              id="logout-link"
              style={{ color: 'black' }}
              onClick={() => setLogin(false)}
            >
              {' '}
              <i
                className="fas fa-sign-out-alt"
                style={{ color: '#D70F4E', fontSize: '1.5em' }}
              ></i>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar>
      </div>
      <div style={{ paddingTop: '100px' }}>{currentModule}</div>
    </div>
  );
};

export default Dashboard;
