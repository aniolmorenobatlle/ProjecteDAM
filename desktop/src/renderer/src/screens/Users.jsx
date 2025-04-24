import { useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { CiSearch } from 'react-icons/ci'
import { GoPencil } from 'react-icons/go'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { RiExpandUpDownFill } from 'react-icons/ri'
import profileImage from '../assets/profile.jpg'
import Sidebar from './../components/Sidebar'

function Users() {
  const students = Array.from({ length: 10 }, (_, i) => ({
    name: `User ${i + 1}`,
    email: `user${i + 1}@gmail.com`,
    role: 'admin',
    date: '2025-04-23',
    avatar: profileImage
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
      <Sidebar activePage="users" />

      <div className="flex flex-col flex-1 gap-5 py-5 !mr-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl !font-bold">Users List</h1>

          <div className="flex items-center gap-2 border-2 border-[#bfbfbf] rounded-lg p-1 w-[30%]">
            <CiSearch className="text-2xl text-gray-500" />
            <input type="text" placeholder="Search..." className="flex-1 text-xl" />
            <IoCloseCircleOutline className="text-2xl text-gray-500 ml-auto" />
          </div>

          <button
            className="p-2 px-5 bg-amber-400 rounded-lg text-xl text-white"
            onClick={() => document.getElementById('modal_add_user').showModal()}
          >
            Add new user
          </button>
        </div>

        <div className="w-full h-0.5 bg-[#dbdee3]" />

        <div className="flex flex-col gap-4 w-full mx-auto mt-10">
          <div className="flex font-semibold text-gray-500 px-6 py-3 rounded-t-lg">
            <div className="w-15 !mr-5"></div>
            <div className="flex-1">Name</div>
            <div className="flex-1">Email</div>
            <div className="flex-1">Role</div>
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
              <div className="flex-1">{student.name}</div>
              <div className="flex-1">{student.email}</div>
              <div className="flex-1">{student.role}</div>
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

      <dialog id="modal_add_user" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default Users
