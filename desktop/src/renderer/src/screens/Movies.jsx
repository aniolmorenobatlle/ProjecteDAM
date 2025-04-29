import { useState } from 'react'
import Header from '../components/Header'
import Sidebar from './../components/Sidebar'
import PaginatedTable from '../components/PaginatedTable'
import { API_URL } from '../../../../config'
import { GoPencil } from 'react-icons/go'
import { AiOutlineDelete } from 'react-icons/ai'

function Movies() {
  const [searchTerm, setSearchTerm] = useState('')

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
                <button>
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default Movies
