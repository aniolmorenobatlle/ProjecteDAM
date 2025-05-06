import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import axios from 'axios'
import InputAddUser from '../../components/InputAddUser'
import TextArea from '../../components/TextArea'

const ModalEditMovie = forwardRef(({ token, API_URL, onSuccess }, ref) => {
  const modalRef = useRef()
  const [movie, setMovie] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    release_year: '',
    director: '',
    poster: '',
    cover: '',
    synopsis: ''
  })

  useImperativeHandle(ref, () => ({
    open: (movieToDelete) => {
      setMovie(movieToDelete)
      setFormData(movieToDelete)
      modalRef.current?.showModal()
    },
    close: () => {
      modalRef.current?.close()
    }
  }))

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box w-full max-w-3xl">
        <h3 className="!font-bold text-lg">Edit the movie!</h3>

        <div className="flex flex-col gap-5 !my-8">
          {/* <div className="flex items-center gap-5">
            <img
              src={formData.poster || null}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <button className="text-blue-500" onClick={() => alert('Change profile photo')}>
              Change profile photo
            </button>
          </div> */}

          <div className="flex gap-5">
            <InputAddUser
              placeholder="Title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <InputAddUser
              placeholder="Release Year"
              type="date"
              value={
                formData.release_year
                  ? new Date(formData.release_year).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) => setFormData({ ...formData, release_year: e.target.value })}
            />
          </div>

          <div className="flex gap-5">
            <div className="flex-1">
              <InputAddUser
                placeholder="Director"
                type="text"
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
              />
            </div>

            <div className="flex-1">
              <TextArea
                placeholder="Director"
                rows={6}
                value={formData.synopsis}
                onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between modal-action">
          <button
            className="btn bg-green-400 hover:bg-green-500 transition-all duration-300 ease-in-out"
            onClick={() => alert('Confirm changes')}
          >
            Confirm changes
          </button>
          <form method="dialog">
            <button className="btn">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  )
})

export default ModalEditMovie
