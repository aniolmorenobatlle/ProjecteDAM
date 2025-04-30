import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import axios from 'axios'
import InputAddUser from '../../components/InputAddUser'

const ModalDeleteUser = forwardRef(({ token, API_URL, onSuccess }, ref) => {
  const modalRef = useRef()
  const [user, setUser] = useState(null)

  useImperativeHandle(ref, () => ({
    open: (userToDelete) => {
      setUser(userToDelete)
      modalRef.current?.showModal()
    },
    close: () => {
      modalRef.current?.close()
    }
  }))

  // const handleDeleteUser = async () => {
  //   if (!user) return

  //   try {
  //     await axios.post(
  //       `${API_URL}/api/users/delete-user`,
  //       { userId: user.id },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     )

  //     modalRef.current?.close()
  //     onSuccess?.() // Per refrescar dades
  //   } catch (error) {
  //     alert('Error deleting user. Try again later.')
  //     console.error('Error deleting user:', error)
  //   }
  // }

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box w-full max-w-3xl">
        <h3 className="!font-bold text-lg">Edit the user!</h3>

        <div className="flex flex-col gap-5 !my-8">
          <div className="flex items-center gap-5">
            <img src={user?.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
            <button className="text-blue-500">Change profile photo</button>
          </div>

          <div className="flex gap-5">
            <InputAddUser placeholder="Full Name" type="text" value={user?.name} />
            <InputAddUser placeholder="Username" type="text" value={user?.username} />
          </div>

          <div className="flex gap-5">
            <div className="flex-1">
              <InputAddUser placeholder="Email" type="email" value={user?.email} />
            </div>

            <div className="flex-1 relative">
              <select
                value={user?.is_admin ? 'admin' : 'user'}
                className="w-full placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 appearance-none cursor-pointer"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor"
                className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex justify-between modal-action">
          <button className="btn bg-green-400 hover:bg-green-500 transition-all duration-300 ease-in-out">
            Confirm changes
          </button>
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
})

export default ModalDeleteUser
