
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import "./main.css"

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
  )
}

export default App
