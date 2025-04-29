import { useState, useEffect } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { GoPencil } from 'react-icons/go'
import { RiExpandUpDownFill } from 'react-icons/ri'
import axios from 'axios'
import { API_URL } from '../../../../../config'

// eslint-disable-next-line react/prop-types
export default function Body({ userQuery }) {
  const [cachePages, setCachePages] = useState({})
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 7
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(3)

  const usersToShow = cachePages[currentPage] || []

  const fetchPage = async (pageNumber) => {
    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      const response = await axios.get(
        // eslint-disable-next-line react/prop-types
        `${API_URL}/api/users?page=${pageNumber + 1}&query=${userQuery.toLowerCase()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const users = response.data.users
      const total = response.data.totalUsers

      setCachePages((prev) => ({
        ...prev,
        [pageNumber]: users // Guardar les dades de la pàgina a l'objecte cachePages
      }))

      setTotalPages(Math.ceil(total / itemsPerPage))
    } catch (error) {
      console.error('Error fetching page:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  useEffect(() => {
    fetchPage(currentPage)
  }, [currentPage, userQuery])

  return (
    <div className="flex flex-col gap-4 w-full mx-auto mt-10">
      <div className="flex font-semibold text-gray-500 px-6 py-3 rounded-t-lg">
        <div className="w-15 !mr-5"></div>
        <div className="flex-1">Name</div>
        <div className="flex-1">Email</div>
        <div className="flex-1">Username</div>
        <div className="flex-1">Role</div>
        <div className="flex-1 !pr-2">
          <button className="flex flex-row items-center gap-2">
            Date of creation
            <RiExpandUpDownFill className="text-lg" />
          </button>
        </div>
        <div className="w-16"></div>
      </div>

      {loading ? (
        <div className="text-center text-xl">Loading...</div>
      ) : (
        usersToShow.map((user) => (
          <div key={user.id} className="flex bg-gray-100 items-center px-6 py-4 rounded-lg">
            <img src={user.avatar} alt="avatar" className="w-15 h-15 rounded-full !mr-5" />
            <div className="flex-1">{user.name}</div>
            <div className="flex-1">{user.email}</div>
            <div className="flex-1">{user.username}</div>
            <div className="flex-1">{user.is_admin ? 'Admin' : 'Normal'}</div>{' '}
            <div className="flex-1">{new Date(user.created_at).toLocaleDateString()}</div>
            <div className="w-18 flex justify-between text-2xl text-orange-400">
              <button>
                <GoPencil />
              </button>
              <button>
                <AiOutlineDelete />
              </button>
            </div>
          </div>
        ))
      )}

      <div className="flex justify-between items-center w-full rounded-lg">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          className={`${
            currentPage === 0 ? 'bg-gray-300 !cursor-default' : 'bg-[#FEAF00]'
          } text-white p-2 px-5 rounded-lg text-xl`}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
          className={`${
            currentPage >= totalPages - 1 ? 'bg-gray-300 !cursor-default' : 'bg-[#FEAF00]'
          } text-white p-2 px-5 rounded-lg text-xl`}
        >
          Next
        </button>
      </div>
    </div>
  )
}
