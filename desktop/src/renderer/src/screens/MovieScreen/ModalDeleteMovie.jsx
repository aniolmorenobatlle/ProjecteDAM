import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import axios from 'axios'

const ModalDeleteMovie = forwardRef(({ token, API_URL, onSuccess }, ref) => {
  const modalRef = useRef()
  const [selectedMovie, setSelectedMovie] = useState(null)

  const handleDeleteMovie = async () => {
    if (selectedMovie) {
      try {
        await axios.delete(`${API_URL}/api/movies/delete-movie/${selectedMovie.id_api}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        modalRef.current?.close()
        onSuccess?.()
      } catch (error) {
        alert('Error deleting the movie. Try again later.')
        console.error('Error deleting user:', error)
      }
    }
  }

  useImperativeHandle(ref, () => ({
    open: (movieToDelete) => {
      setSelectedMovie(movieToDelete)
      modalRef.current?.showModal()
    },
    close: () => {
      modalRef.current?.close()
    }
  }))

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
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
  )
})

export default ModalDeleteMovie
