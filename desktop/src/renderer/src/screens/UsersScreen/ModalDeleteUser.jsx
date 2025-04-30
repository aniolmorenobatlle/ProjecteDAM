import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import axios from 'axios'

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

  const handleDeleteUser = async () => {
    if (!user) return

    try {
      await axios.post(
        `${API_URL}/api/users/delete-user`,
        { userId: user.id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      modalRef.current?.close()
      onSuccess?.() // Per refrescar dades
    } catch (error) {
      alert('Error deleting user. Try again later.')
      console.error('Error deleting user:', error)
    }
  }

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="!font-bold text-lg">Delete user</h3>
        <p className="py-4">
          Are you sure you want to delete <span className="!font-bold">{user?.name}</span>?
        </p>
        <div className="flex justify-between !mt-8">
          <button className="btn btn-error" onClick={handleDeleteUser}>
            Delete
          </button>
          <form method="dialog">
            <button className="btn">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  )
})

export default ModalDeleteUser
