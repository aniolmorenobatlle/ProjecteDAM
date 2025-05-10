import { useState, useRef } from 'react'
import Header from '../components/Header'
import PaginatedTable from '../components/PaginatedTable'
import { API_URL } from '../../../../config'
import { GoPencil } from 'react-icons/go'
import { AiOutlineDelete } from 'react-icons/ai'
import ModalDeleteMovie from './MovieScreen/ModalDeleteMovie'
import ModalEditMovie from './MovieScreen/ModalEditMovie'

export default function Movies() {
  const modalEditRef = useRef()
  const modalDeleteRef = useRef()

  const [searchTerm, setSearchTerm] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const token = localStorage.getItem('token')

  const handleOpenEditModal = (user) => {
    modalEditRef.current?.open(user)
  }

  const handleOpenDeleteModal = (movie) => {
    modalDeleteRef.current?.open(movie)
  }

  return (
    <div className="flex h-screen gap-5">
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
          columns={['Title', 'Release Year', 'Director', 'Vote average']}
          refreshTrigger={refreshTrigger}
          enableSorting={true}
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
              <div className="flex-1">{movie.vote_average}</div>
              <div className="flex-1">{new Date(movie.created_at).toLocaleDateString('es-ES')}</div>
              <div className="w-18 flex justify-between text-2xl text-orange-400">
                <button onClick={() => handleOpenEditModal(movie)}>
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

      <ModalEditMovie
        ref={modalEditRef}
        token={token}
        API_URL={API_URL}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />

      <ModalDeleteMovie
        ref={modalDeleteRef}
        token={token}
        API_URL={API_URL}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  )
}
