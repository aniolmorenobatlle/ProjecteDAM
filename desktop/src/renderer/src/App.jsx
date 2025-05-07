import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import Home from './screens/Home'
import Login from './screens/Login'
import Movies from './screens/Movies'
import Users from './screens/Users'
import Sidebar from './components/Sidebar'

function App() {
  const location = useLocation()

  return (
    <div className="flex w-screen h-screen gap-5">
      {location.pathname !== '/' && <Sidebar activePage={location.pathname} />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/movies" element={<Movies />} />
        </Routes>
      </div>
    </div>
  )
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  )
}
