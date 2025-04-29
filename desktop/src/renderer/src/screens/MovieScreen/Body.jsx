import { useState, useEffect } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { GoPencil } from 'react-icons/go'
import { RiExpandUpDownFill } from 'react-icons/ri'
import axios from 'axios'
import { API_URL } from '../../../../../config'

export default function Body() {
  const [cachePages, setCachePages] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 7
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(0)

  const moviesToShow = cachePages[currentPage] || []

  const fetchPage = async (pageNumber) => {
    // Verificar si la pagina ja esta en cache
    if (cachePages[pageNumber]) return

    setLoading(true)

    try {
      const response = await axios.get(
        `${API_URL}/api/movies?page=${pageNumber}&limit=${itemsPerPage}`
      )
      const movies = response.data.movies
      const total = response.data.total

      setCachePages((prev) => ({
        ...prev,
        [pageNumber]: movies
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
  }, [currentPage])

  return (
    <div className="flex flex-col gap-4 w-full mx-auto mt-10">
      <div className="flex font-semibold text-gray-500 px-6 py-3 rounded-t-lg">
        <div className="w-15 !mr-5"></div>
        <div className="flex-1">Title</div>
        <div className="flex-1">Release Year</div>
        <div className="flex-1">Director</div>
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
        moviesToShow.map((movie) => (
          <div key={movie.id} className="flex bg-gray-100 items-center px-6 py-4 rounded-lg">
            <img
              src={movie.poster}
              alt="poster"
              className="w-15 h-15 rounded-full object-cover !mr-5"
            />
            <div className="flex-1">{movie.title}</div>
            <div className="flex-1">{new Date(movie.release_year).getFullYear()}</div>
            <div className="flex-1">{movie.director}</div>
            <div className="flex-1">{new Date(movie.created_at).toLocaleDateString()}</div>
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
