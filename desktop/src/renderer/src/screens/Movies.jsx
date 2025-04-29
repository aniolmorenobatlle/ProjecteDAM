import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from './../components/Sidebar'
import Body from './MovieScreen/Body'

function Movies() {
  const [searchTerm, setSearchTerm] = useState('')

  // useEffect(() => {
  //   console.log('Search term', searchTerm)
  // })

  return (
    <div className="flex w-screen h-screen gap-5">
      <Sidebar activePage="movies" />

      <div className="flex flex-col flex-1 gap-5 py-5 !mr-5">
        <Header
          title="Movies List"
          titleButton="Add new Movie"
          onTitleChange={(value) => setSearchTerm(value)}
          setTerm={searchTerm}
        />

        <div className="w-full h-0.5 bg-[#dbdee3]" />

        <Body movieTitleQuery={searchTerm} />
      </div>
    </div>
  )
}

export default Movies
