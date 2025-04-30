import { useState, useRef } from 'react'
import Sidebar from './../components/Sidebar'
import Header from '../components/Header'
import PaginatedTable from '../components/PaginatedTable'
import { API_URL } from '../../../../config'
import { GoPencil } from 'react-icons/go'
import { AiOutlineDelete } from 'react-icons/ai'
import ModalDeleteUser from './UsersScreen/ModalDeleteUser'
import ModalAddUser from './UsersScreen/ModalAddUser'
import ModalEditUser from './UsersScreen/ModalEditUser'

export default function Users() {
  const modalAddRef = useRef()
  const modalEditRef = useRef()
  const modalDeleteRef = useRef()

  const [searchTerm, setSearchTerm] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const token = localStorage.getItem('token')

  const handleOpenAddModal = () => {
    modalAddRef.current?.open()
  }

  const handleOpenEditModal = (user) => {
    modalEditRef.current?.open(user)
  }

  const handleOpenDeleteModal = (user) => {
    modalDeleteRef.current?.open(user)
  }

  return (
    <div className="flex w-screen h-screen gap-5">
      <Sidebar activePage="users" />

      <div className="flex flex-col flex-1 gap-5 py-5 !mr-5">
        <Header
          title="Users List"
          titleButton="Add new User"
          onQueryChange={(value) => setSearchTerm(value)}
          setTerm={searchTerm}
          onButtonClick={handleOpenAddModal}
        />

        <div className="w-full h-0.5 bg-[#dbdee3]" />

        <PaginatedTable
          apiEndpoint={`${API_URL}/api/users`}
          query={searchTerm}
          headers={{ Authorization: `Bearer ${token}` }}
          columns={['Full Name', 'Email', 'Username', 'Role']}
          refreshTrigger={refreshTrigger}
          renderRow={(user) => (
            <div key={user.id} className="flex bg-gray-100 items-center px-6 py-4 rounded-lg">
              <img src={user.avatar} alt="avatar" className="w-15 h-15 rounded-full !mr-5" />
              <div className="flex-1">{user.name}</div>
              <div className="flex-1">{user.email}</div>
              <div className="flex-1">{user.username}</div>
              <div className="flex-1">{user.is_admin ? 'Admin' : 'User'}</div>
              <div className="flex-1">{new Date(user.created_at).toLocaleDateString('es-ES')}</div>
              <div className="w-18 flex justify-between text-2xl text-orange-400">
                <button onClick={() => handleOpenEditModal(user)}>
                  <GoPencil />
                </button>
                <button onClick={() => handleOpenDeleteModal(user)}>
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          )}
        />
      </div>

      <ModalAddUser
        ref={modalAddRef}
        API_URL={API_URL}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />

      <ModalEditUser
        ref={modalEditRef}
        token={token}
        API_URL={API_URL}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />

      <ModalDeleteUser
        ref={modalDeleteRef}
        token={token}
        API_URL={API_URL}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  )
}
