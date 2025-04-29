import Sidebar from './../components/Sidebar'
import Header from '../components/Header'
import Body from './UsersScreen/Body'

function Users() {
  return (
    <div className="flex w-screen h-screen gap-5">
      <Sidebar activePage="users" />

      <div className="flex flex-col flex-1 gap-5 py-5 !mr-5">
        <Header title="Users List" titleButton="Add new User" />

        <div className="w-full h-0.5 bg-[#dbdee3]" />

        <Body />
      </div>

      <dialog id="modal_add_user" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default Users
