import { useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { CiSearch } from 'react-icons/ci'
import { GoPencil } from 'react-icons/go'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { RiExpandUpDownFill } from 'react-icons/ri'
import sw from './../assets/sw.jpeg'
import Sidebar from './../components/Sidebar'

function Movies() {
  const students = Array.from({ length: 9 }, (_, i) => ({
    title: `Star Wars ${i + 1}`,
    releas_year: 2005,
    duration: '150 min',
    director: 'George Lucas',
    date: '2025-04-23',
    avatar: sw
  }))

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 7
  const totalPages = Math.ceil(students.length / itemsPerPage)

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const paginatedStudents = students.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  )

  return (
    <div className="flex w-screen h-screen gap-5">
      <Sidebar activePage="movies" />

      <div className="flex flex-col flex-1 gap-5 py-5 !mr-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl !font-bold">Movies List</h1>

          <div className="flex items-center gap-2 border-2 border-[#bfbfbf] rounded-lg p-1 w-[30%]">
            <CiSearch className="text-2xl text-gray-500" />
            <input type="text" placeholder="Search..." className="flex-1 text-xl" />
            <IoCloseCircleOutline className="text-2xl text-gray-500 ml-auto" />
          </div>

          <button className="p-2 px-5 bg-amber-400 rounded-lg text-xl text-white">
            Add new movie
          </button>
        </div>

        <div className="w-full h-0.5 bg-[#dbdee3]" />

        <div className="flex flex-col gap-4 w-full mx-auto mt-10">
          <div className="flex font-semibold text-gray-500 px-6 py-3 rounded-t-lg">
            <div className="w-15 !mr-5"></div>
            <div className="flex-1">Title</div>
            <div className="flex-1">Release Year</div>
            <div className="flex-1">Duration</div>
            <div className="flex-1">Director</div>
            <div className="flex-1 !pr-2">
              <button className="flex flex-row items-center gap-2">
                Date of creation
                <RiExpandUpDownFill className="text-lg" />
              </button>
            </div>
            <div className="w-16"></div>
          </div>

          {paginatedStudents.map((student, i) => (
            <div key={i} className="flex bg-gray-100 items-center px-6 py-4 rounded-lg">
              <img src={student.avatar} alt="avatar" className="w-15 h-15 rounded-full !mr-5" />
              <div className="flex-1">{student.title}</div>
              <div className="flex-1">{student.releas_year}</div>
              <div className="flex-1">{student.duration}</div>
              <div className="flex-1">{student.director}</div>
              <div className="flex-1">{student.date}</div>
              <div className="w-18 flex justify-between text-2xl text-orange-400">
                <button>
                  <GoPencil />
                </button>
                <button>
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}

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
      </div>
    </div>
  )
}

export default Movies
