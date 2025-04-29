import { FiUsers } from 'react-icons/fi'
import { MdOutlineLocalMovies } from 'react-icons/md'
import Sidebar from '../components/Sidebar'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../../../../config'
import { useEffect, useState } from 'react'

function Home() {
  const [totalMovies, setTotalMovies] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)

  const fetchTotalMovie = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/movies`)
      const total = response.data.total
      setTotalMovies(total)
    } catch (error) {
      console.error('Error fetching total movies:', error)
    }
  }

  const fetchTotalUsers = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const total = response.data.totalUsers
      setTotalUsers(total)
    } catch (error) {
      console.error('Error fetching total users:', error)
    }
  }

  useEffect(() => {
    fetchTotalMovie()
    fetchTotalUsers()
  })

  return (
    <div className="flex w-screen h-screen gap-5">
      <Sidebar activePage="home" />

      <div className="flex gap-5 h-fit !mt-5">
        <Link
          to="/users"
          className="w-2xs bg-gradient-to-r from-[#FEAF00] to-[#F8D442] rounded-2xl p-5"
        >
          <div className="flex flex-col gap-2">
            <FiUsers className="text-5xl text-white" />
            <h1 className="text-white text-xl">Users</h1>
          </div>
          <p className="text-right text-4xl !font-bold">{totalUsers}</p>
        </Link>

        <Link to="/movies" className="w-2xs bg-[#74C1ED] rounded-2xl p-5">
          <div className="flex flex-col gap-2">
            <MdOutlineLocalMovies className="text-5xl text-white" />
            <h1 className="text-white text-xl">Movies</h1>
          </div>
          <p className="text-right text-4xl !font-bold">{totalMovies}</p>
        </Link>
      </div>
    </div>
  )
}

export default Home
