import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookingPage } from './pages/BookingPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingPage />} />
        {/* Catch-all: redirect everything to home */}
        <Route path="*" element={<BookingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
