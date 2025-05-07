import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import axios from 'axios'
import InputAddUser from '../../components/InputAddUser'
import TextArea from '../../components/TextArea'
import AsyncSelect from 'react-select/async'

const ModalEditMovie = forwardRef(({ token, API_URL, onSuccess }, ref) => {
  const modalRef = useRef()
  const [, setMovie] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    release_year: '',
    director: '',
    director_id: null,
    synopsis: '',
    id_api: null
  })

  const loadDirectorOptions = async (inputValue) => {
    try {
      const response = await axios.get(`${API_URL}/api/movies/directors?query=${inputValue}`)
      return response.data.directors.map((dir) => ({
        value: dir.id,
        label: dir.name
      }))
    } catch (error) {
      console.error('Error loading director options:', error)
      return []
    }
  }

  const handleEditMovie = async () => {
    try {
      const updatedData = {
        title: formData.title,
        release_year: formData.release_year,
        synopsis: formData.synopsis
      }

      // Afegir nomes si s'ha canviat
      if (formData.director_id !== null) {
        updatedData.director_id = formData.director_id
      }

      await axios.put(`${API_URL}/api/movies/update-movie/${formData.id_api}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      alert('Movie edited successfully!')
      onSuccess()
      modalRef.current?.close()
    } catch (error) {
      console.error('Error editing movie:', error)
      alert('Error editing movie')
    }
  }

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
              <AsyncSelect
                cacheOptions
                loadOptions={loadDirectorOptions}
                value={
                  formData.director
                    ? {
                        value: formData.director_id,
                        label: formData.director
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    director: selectedOption?.label || '',
                    director_id: selectedOption?.value || null
                  })
                }
                isSearchable
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
            onClick={handleEditMovie}
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
