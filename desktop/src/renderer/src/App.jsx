import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import Home from './screens/Home'
import Login from './screens/Login'
import Movies from './screens/Movies'
import Users from './screens/Users'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/movies" element={<Movies />} />
      </Routes>
    </Router>
  )
}

export default App
