import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import axios from 'axios'
import InputAddUser from '../../components/InputAddUser'
import TextArea from '../../components/TextArea'
import Select from 'react-select'

const ModalEditMovie = forwardRef(({ token, API_URL, onSuccess }, ref) => {
  const modalRef = useRef()
  const [, setMovie] = useState(null)
  const [directors, setDirectors] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    release_year: '',
    director: '',
    poster: '',
    cover: '',
    synopsis: ''
  })

  const fetchDirectors = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/movies/directors`)
      setDirectors(response.data.directors)
      console.log('Directors:', response.data)
    } catch (error) {
      console.error('Error fetching directors:', error)
    }
  }

  useEffect(() => {
    fetchDirectors() // Crida a fetchDirectors quan el component es munta
  }, [])

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
              <Select
                options={directors.map((dir) => ({
                  value: dir.id,
                  label: dir.name
                }))}
                value={directors
                  .map((dir) => ({ value: dir.id, label: dir.name }))
                  .find((option) => option.value === formData.director)}
                onChange={(selectedOption) =>
                  setFormData({ ...formData, director: selectedOption?.value })
                }
                isSearchable={true}
                placeholder="Select a director..."
                styles={{
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: '150px',
                    overflowY: 'auto'
                  })
                }}
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
