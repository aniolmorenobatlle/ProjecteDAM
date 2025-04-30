import { useState } from 'react'
import Sidebar from './../components/Sidebar'
import Header from '../components/Header'
import PaginatedTable from '../components/PaginatedTable'
import { API_URL } from '../../../../config'
import { GoPencil } from 'react-icons/go'
import { AiOutlineDelete } from 'react-icons/ai'
import axios from 'axios'

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const token = localStorage.getItem('token')

  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user)
    document.getElementById('delete_user').showModal()
  }

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await axios.post(
          `${API_URL}/api/users/delete-user`,
          { userId: selectedUser.id },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        document.getElementById('delete_user').close()
        setRefreshTrigger((prev) => prev + 1)
      } catch (error) {
        alert('Error deleting user. Try again later.')
        console.error('Error deleting user:', error)
      }
    }
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
        />

        <div className="w-full h-0.5 bg-[#dbdee3]" />

        <PaginatedTable
          apiEndpoint={`${API_URL}/api/users`}
          query={searchTerm}
          headers={{ Authorization: `Bearer ${token}` }}
          columns={['Name', 'Email', 'Username', 'Role']}
          refreshTrigger={refreshTrigger}
          renderRow={(user) => (
            <div key={user.id} className="flex bg-gray-100 items-center px-6 py-4 rounded-lg">
              <img src={user.avatar} alt="avatar" className="w-15 h-15 rounded-full !mr-5" />
              <div className="flex-1">{user.name}</div>
              <div className="flex-1">{user.email}</div>
              <div className="flex-1">{user.username}</div>
              <div className="flex-1">{user.is_admin ? 'Admin' : 'Normal'}</div>
              <div className="flex-1">{new Date(user.created_at).toLocaleDateString()}</div>
              <div className="w-18 flex justify-between text-2xl text-orange-400">
                <button>
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

      <dialog id="delete_user" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="!font-bold text-lg">Delete user</h3>
          <p className="py-4">
            Are you sure you want to delete <span className="!font-bold">{selectedUser?.name}</span>
            ?
          </p>
          <div className="flex justify-between !mt-5">
            <button className="btn btn-error" onClick={handleDeleteUser}>
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
