import { FiUsers } from 'react-icons/fi'
import { IoIosLogOut } from 'react-icons/io'
import { IoHomeOutline } from 'react-icons/io5'
import { MdOutlineLocalMovies } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../../../../config'

export default function Sidebar({ activePage }) {
  const [userInfo, setUserInfo] = useState({})
  const listMenu = [
    {
      name: 'Home',
      key: '/home',
      href: '/home',
      icon: <IoHomeOutline className="text-2xl" />
    },
    {
      name: 'Users',
      key: '/users',
      href: '/users',
      icon: <FiUsers className="text-2xl" />
    },
    {
      name: 'Movies',
      key: '/movies',
      href: '/movies',
      icon: <MdOutlineLocalMovies className="text-2xl" />
    },
    {
      name: 'Logout',
      key: 'logout',
      href: '/',
      icon: <IoIosLogOut className="text-2xl" />
    }
  ]

  const token = localStorage.getItem('token')

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setUserInfo(response.data)
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  useEffect(() => {
    fetchUserInfo()
  })

  return (
    <div className="flex flex-col h-screen p-5 gap-5 bg-[#f0e1d0]">
      <div className="flex items-center justify-center gap-5">
        <div className="h-8 w-1 bg-amber-300" />
        <h1 className="text-xl !font-bold leading-none">ADMIN PANEL</h1>
      </div>

      <div className="flex flex-col items-center gap-5 !my-10">
        <img
          src={userInfo.avatar ? userInfo.avatar : userInfo.avatar_binary}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover"
        />
        <h2 className="text-lg !font-bold">{userInfo.name}</h2>
      </div>

      <div className="flex flex-col gap-5 w-full">
        <ul className="w-full">
          {listMenu.map((item, index) => (
            <li key={index} className="w-full">
              <Link
                to={item.href}
                className={`flex items-center w-full gap-3 rounded-lg p-2 ${
                  item.key === activePage
                    ? 'bg-[#FEAF00]'
                    : 'hover:bg-[#FFCB33] transition-all duration-300'
                }`}
              >
                <div className="flex items-center justify-center w-10 h-10 text-black">
                  {item.icon}
                </div>
                <p className="text-lg font-medium">{item.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
