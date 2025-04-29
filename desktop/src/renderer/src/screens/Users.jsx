import { useState } from 'react'
import Sidebar from './../components/Sidebar'
import Header from '../components/Header'
import Body from './UsersScreen/Body'

function Users() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="flex w-screen h-screen gap-5">
      <Sidebar activePage="users" />

      <div className="flex flex-col flex-1 gap-5 py-5 !mr-5">
        <Header
          title="Users List"
          titleButton="Add new User"
          onQueryChange={(value) => setSearchTerm(value)}
          setTerm={searchTerm}
        />

        <div className="w-full h-0.5 bg-[#dbdee3]" />

        <Body userQuery={searchTerm} />
      </div>
    </div>
  )
}

export default Users
