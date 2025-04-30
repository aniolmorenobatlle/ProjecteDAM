import { useState } from 'react'
import Sidebar from './../components/Sidebar'
import Header from '../components/Header'
import PaginatedTable from '../components/PaginatedTable'
import { API_URL } from '../../../../config'
import { GoPencil } from 'react-icons/go'
import { AiOutlineDelete } from 'react-icons/ai'
import axios from 'axios'
import InputAddUser from '../components/InputAddUser'

const CLOUNDINARY_URL = 'https://res.cloudinary.com/dwe0on2fw/image/upload/recommendme-cover'

const posters = [
  'toyStory',
  'interstellar',
  'whiplash',
  'spiderman',
  'lotr',
  'walle',
  'topGun',
  'theBatman',
  'lionKing',
  'pp',
  'noah',
  'hp'
]

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState('')

  const token = localStorage.getItem('token')

  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user)
    document.getElementById('modal_delete_user').showModal()
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

        document.getElementById('modal_delete_user').close()
        setRefreshTrigger((prev) => prev + 1)
      } catch (error) {
        alert('Error deleting user. Try again later.')
        console.error('Error deleting user:', error)
      }
    }
  }

  const handleOpenAddModal = () => {
    document.getElementById('modal_add_user').showModal()
  }

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

  const getRandomLightColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16)
    return `${randomColor.padStart(6, '0')}`
  }

  const getAvatarUrl = (name) => {
    if (!name) return ''

    const onlyNamePart = name.split(' ')[0]
    const backgroundColor = getRandomLightColor()
    return `https://ui-avatars.com/api/?length=1&name=${onlyNamePart}&size=128&bold=true&background=${backgroundColor}`
  }

  const getRandomPoster = () => {
    const randomIndex = Math.floor(Math.random() * posters.length)
    return `${CLOUNDINARY_URL}/${posters[randomIndex]}.jpg`
  }

  const handleNameChange = (e) => {
    const nameValue = e.target.value
    setName(nameValue)
    setAvatar(getAvatarUrl(nameValue))
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

    const randomPoster = getRandomPoster()

    try {
      await axios.post(`${API_URL}/api/users/register`, {
        name,
        username,
        email,
        password,
        avatar,
        poster: randomPoster
      })

      alert('User registered successfully!')

      setName('')
      setUsername('')
      setEmail('')
      setPassword('')
      setAvatar('')

      setRefreshTrigger((prev) => prev + 1)

      document.getElementById('modal_add_user').close()
    } catch (error) {
      alert('Error registering user. Try again later.')
      console.error(error)
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

      <dialog id="modal_delete_user" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="!font-bold text-lg">Delete user</h3>
          <p className="py-4">
            Are you sure you want to delete <span className="!font-bold">{selectedUser?.name}</span>
            ?
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

      <dialog id="modal_add_user" className="modal">
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
    </div>
  )
}
