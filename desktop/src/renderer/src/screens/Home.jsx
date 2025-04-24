import { FiUsers } from 'react-icons/fi'
import { MdOutlineLocalMovies } from 'react-icons/md'
import Sidebar from '../components/Sidebar'
import { Link } from 'react-router-dom'

function Home() {
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
          <p className="text-right text-4xl !font-bold">3</p>
        </Link>

        <Link to="/movies" className="w-2xs bg-[#74C1ED] rounded-2xl p-5">
          <div className="flex flex-col gap-2">
            <MdOutlineLocalMovies className="text-5xl text-white" />
            <h1 className="text-white text-xl">Movies</h1>
          </div>
          <p className="text-right text-4xl !font-bold">3</p>
        </Link>
      </div>
    </div>
  )
}

export default Home
