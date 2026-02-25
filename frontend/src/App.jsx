import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Card from './components/Card.jsx';
import Home from './components/Home.jsx';
import CardPage from './components/CardPage.jsx';
import NewTopicForm from './components/NewTopicForm.jsx';
import Login from './components/Login.jsx';
import UserProfile from './components/UserProfile.jsx';
import AboutUs from './components/AboutUs.jsx';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/card-page/:id" element={<CardPage />} />
        <Route path="/new-topic-form" element={<NewTopicForm /> } />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/about-us" element={<AboutUs/>} />
      </Routes>
    </Router>
  )
}

export default App
