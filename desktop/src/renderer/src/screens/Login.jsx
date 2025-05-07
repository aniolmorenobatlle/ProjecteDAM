import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import InputLogin from '../components/InputLogin'
import { API_URL } from '../../../../config'

function Login() {
  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${API_URL}/api/users/login-desktop`, {
        username,
        password
      })

      localStorage.setItem('token', response.data.token)
      navigate('/home')
    } catch (error) {
      console.error('Error en el login', error)

      setError('Incorrect username or password. Please try again.')
    }
  }

  return (
    <div className="flex items-center justify-center min-w-screen min-h-screen bg-gradient-to-l from-[#FEAF00] to-[#ffda44]">
      <div className="flex flex-col p-10 py-15 w-[50dvh] bg-gray-100 rounded-3xl">
        <div className="flex items-center justify-center gap-5">
          <div className="h-15 w-2 bg-amber-300" />
          <h1 className="text-5xl !font-bold leading-none">ADMIN PANEL</h1>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 !mt-10">
          <h2 className="text-3xl !font-bold">SIGN IN</h2>
          <p className="text-xl text-gray-400">Enter your credentials to access your account</p>
        </div>

        <div>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-8 !mt-10">
              <div className="w-full flex flex-col gap-2">
                <p className="text-md text-gray-500">Username</p>
                <InputLogin
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="w-full flex flex-col gap-2">
                <p className="text-md text-gray-500">Password</p>
                <InputLogin
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="w-full flex flex-col">
                  <p className="text-md text-red-500">{error}</p>
                </div>
              )}
            </div>

            <button className="text-white !mt-10 w-full h-12 bg-amber-400 rounded-lg focus:bg-amber-500 transition-all duration-300">
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
