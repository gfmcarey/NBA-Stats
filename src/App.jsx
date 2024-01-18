import * as React from 'react';
import { Home } from './Home/index.jsx'
import {  NavLink, Routes, Route } from 'react-router-dom';

import './Style.scss';

const App = () => {
  return (
    <div className="container">
      <h1 className="headline-primary">NBA Stats</h1>

      <Navigation />
      <Main />
      
    </div>
  );
};

const Navigation = () => (
  <nav>
    <ul>
      <li><NavLink to='/'>Home</NavLink></li>
      <li><NavLink to='/about'>About</NavLink></li>
    </ul>
  </nav>
);

const Main = () => (
  <Routes>
    <Route exact path='/' element={<Home />}></Route>
    <Route exact path='/about' element={<About />}></Route>
  </Routes>
);

const About = () => (
  <div className='about'>
    <h1>About Me</h1>
    <p>Ipsum dolor dolorem consectetur est velit fugiat. Dolorem provident corporis fuga saepe distinctio ipsam? Et quos harum excepturi dolorum molestias?</p>
    <p>Ipsum dolor dolorem consectetur est velit fugiat. Dolorem provident corporis fuga saepe distinctio ipsam? Et quos harum excepturi dolorum molestias?</p>
  </div>
);

export default App;
