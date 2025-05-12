import { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import axios from 'axios'
import InputAddUser from '../../components/InputAddUser'

const ModalAddUser = forwardRef(({ API_URL, onSuccess }, ref) => {
  const modalRef = useRef()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState('')

  useImperativeHandle(ref, () => ({
    open: () => {
      modalRef.current?.showModal()
    },
    close: () => {
      modalRef.current?.close()
    }
  }))

  const checkUsernameAvailability = async (username) => {
    try {
      await axios.get(`${API_URL}/api/users/check-username/${username}`)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const checkEmailAvailability = async (email) => {
    try {
      await axios.get(`${API_URL}/api/users/check-email/${email}`)
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/
    return regex.test(password)
  }

  const getAvatarUrl = (name) => {
    if (!name) return ''
    const onlyNamePart = name.split(' ')[0]
    const backgroundColor = getRandomLightColor()
    return `https://ui-avatars.com/api/?length=1&name=${onlyNamePart}&size=128&bold=true&background=${backgroundColor}`
  }

  const handleNameChange = (e) => {
    const nameValue = e.target.value
    setName(nameValue)
    setAvatar(getAvatarUrl(nameValue))
  }

  const getRandomLightColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16)
    return `${randomColor.padStart(6, '0')}`
  }

  const handleRegister = async () => {
    if (username.trim() === '') {
      alert('Username is required!')
      return
    }

    if (username.length < 4) {
      alert('Username must be at least 4 characters long!')
      return
    }

    const isUsernameAvailable = await checkUsernameAvailability(username)
    if (!isUsernameAvailable) {
      alert('Username is already taken!')
      return
    }

    const isEmailAvailable = await checkEmailAvailability(email)
    if (!isEmailAvailable) {
      alert('Email is already taken!')
      return
    }

    if (email.trim() === '') {
      alert('Email is required!')
      return
    }

    if (!email.includes('@') || !email.includes('.')) {
      alert('Email is not valid!')
      return
    }

    if (!validatePassword(password)) {
      alert(
        'Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, and 1 special character!'
      )
      return
    }

    try {
      await axios.post(`${API_URL}/api/users/register`, {
        name,
        username,
        email,
        password,
        avatar
      })

      setName('')
      setUsername('')
      setEmail('')
      setPassword('')
      setAvatar('')

      onSuccess?.()

      modalRef.current?.close()
    } catch (error) {
      alert('Error registering user. Try again later.')
      console.error(error)
    }
  }

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box w-full max-w-3xl">
        <h3 className="!font-bold text-lg">Add a new user!</h3>

        <div className="flex flex-col gap-5 !my-8">
          <div className="flex gap-5">
            <InputAddUser
              placeholder="Full Name"
              type="text"
              value={name}
              onChange={handleNameChange}
            />
            <InputAddUser
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex gap-5">
            <InputAddUser
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputAddUser
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between modal-action">
          <button
            className="btn bg-green-400 hover:bg-green-500 transition-all duration-300 ease-in-out"
            onClick={handleRegister}
          >
            Add
          </button>
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
})

export default ModalAddUser
