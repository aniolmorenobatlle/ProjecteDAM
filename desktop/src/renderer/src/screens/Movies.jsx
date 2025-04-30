import { useState } from 'react'
import Header from '../components/Header'
import Sidebar from './../components/Sidebar'
import PaginatedTable from '../components/PaginatedTable'
import { API_URL } from '../../../../config'
import { GoPencil } from 'react-icons/go'
import { AiOutlineDelete } from 'react-icons/ai'
import axios from 'axios'

export default function Movies() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const token = localStorage.getItem('token')

  const handleOpenDeleteModal = (movie) => {
    setSelectedMovie(movie)
    document.getElementById('delete_movie').showModal()
  }

  const handleDeleteMovie = async () => {
    if (selectedMovie) {
      try {
        await axios.post(
          `${API_URL}/api/movies/delete-movie`,
          { id_api: selectedMovie.id_api },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        document.getElementById('delete_movie').close()
        setRefreshTrigger((prev) => prev + 1)
      } catch (error) {
        alert('Error deleting the movie. Try again later.')
        console.error('Error deleting user:', error)
      }
    }
  }

  return (
    <div className="flex w-screen h-screen gap-5">
      <Sidebar activePage="movies" />

      <div className="flex flex-col flex-1 gap-5 py-5 !mr-5">
        <Header
          title="Movies List"
          titleButton="Add new Movie"
          onQueryChange={(value) => setSearchTerm(value)}
          setTerm={searchTerm}
        />

        <div className="w-full h-0.5 bg-[#dbdee3]" />

        <PaginatedTable
          apiEndpoint={`${API_URL}/api/movies`}
          query={searchTerm}
          columns={['Title', 'Release Year', 'Director']}
          refreshTrigger={refreshTrigger}
          renderRow={(movie) => (
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
                <button onClick={() => handleOpenDeleteModal(movie)}>
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          )}
        />
      </div>

      <dialog id="delete_movie" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="!font-bold text-lg">Delete movie</h3>
          <p className="py-4">
            Are you sure you want to delete{' '}
            <span className="!font-bold">
              {selectedMovie?.title} ({new Date(selectedMovie?.release_year).getFullYear()})
            </span>
            ?
          </p>
          <div className="flex justify-between !mt-5">
            <button className="btn btn-error" onClick={handleDeleteMovie}>
              Delete
            </button>
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}
