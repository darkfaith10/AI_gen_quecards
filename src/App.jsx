import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Card from './components/Card.jsx';
import Home from './components/Home.jsx';
import CardPage from './components/CardPage.jsx';
import NewTopicForm from './components/NewTopicForm.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/card-page/:id" element={<CardPage />} />
        <Route path="/new-topic-form" element={<NewTopicForm /> } />
      </Routes>
    </Router>
  )
}

export default App
