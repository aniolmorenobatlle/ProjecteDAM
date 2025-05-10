import { useState, useEffect } from 'react'
import { RiExpandUpDownFill } from 'react-icons/ri'
import axios from 'axios'

export default function PaginatedTable({
  apiEndpoint,
  query,
  headers,
  columns,
  refreshTrigger,
  enableSorting,
  renderRow
}) {
  const [cachePages, setCachePages] = useState({})
  const [loading, setLoading] = useState(false)
  const [orderDirection, setOrderDirection] = useState('desc')

  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const itemsPerPage = 7

  const itemsToShow = cachePages[currentPage] || []

  const fetchPage = async (pageNumber) => {
    setLoading(true)
    try {
      const config = {
        headers: headers || {}
      }

      const params = new URLSearchParams({
        page: pageNumber + 1,
        limit: itemsPerPage,
        query: query.toLowerCase(),
        sort: 'created_at',
        order: orderDirection
      })

      if (enableSorting) {
        params.append('orderBy', 'created_at')
        params.append('orderDirection', orderDirection)
      }

      const response = await axios.get(`${apiEndpoint}?${params.toString()}`, config)

      const data = response.data
      const items = data.movies || data.users || []
      const total = data.total || data.totalUsers || 0

      setCachePages((prev) => ({
        ...prev,
        [pageNumber]: items
      }))

      setTotalPages(Math.ceil(total / itemsPerPage))
    } catch (err) {
      console.error('Error fetching page:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1)
  }

  const handlePrevious = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1)
  }

  useEffect(() => {
    setCurrentPage(0)
  }, [query])

  useEffect(() => {
    fetchPage(currentPage)
  }, [currentPage, query, refreshTrigger])

  return (
    <div className="flex flex-col gap-4 w-full mx-auto mt-10 overflow-y-auto">
      <div className="flex font-semibold text-gray-500 px-6 py-3 rounded-t-lg">
        <div className="w-15 !mr-5"></div>
        {columns.map((col, idx) => (
          <div key={idx} className="flex-1">
            {col}
          </div>
        ))}
        <div className="flex-1 !pr-2">
          <button
            className="flex flex-row items-center gap-2"
            onClick={() => {
              setOrderDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              setCachePages({})
              fetchPage(0)
              setCurrentPage(0)
            }}
          >
            Date of creation
            <RiExpandUpDownFill className="text-lg" />
          </button>
        </div>
        <div className="w-16"></div>
      </div>

      {loading ? (
        <div className="text-center text-xl">Loading...</div>
      ) : (
        itemsToShow.map((item) => renderRow(item))
      )}

      <div className="flex justify-between items-center w-full rounded-lg">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          className={`${
            currentPage === 0 ? 'bg-gray-300 !cursor-not-allowed' : 'bg-[#FEAF00]'
          } text-white p-2 px-5 rounded-lg text-xl`}
        >
          Previous
        </button>

        <span className="text-xl text-gray-500">
          Page {currentPage + 1} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
          className={`${
            currentPage >= totalPages - 1 ? 'bg-gray-300 !cursor-not-allowed' : 'bg-[#FEAF00]'
          } text-white p-2 px-5 rounded-lg text-xl`}
        >
          Next
        </button>
      </div>
    </div>
  )
}
