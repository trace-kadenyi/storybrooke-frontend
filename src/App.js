import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './Components/Registration/Registration';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
      </Routes>
    </Router>
  );
}

export default App;
