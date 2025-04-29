import { CiSearch } from 'react-icons/ci'
import { IoCloseCircleOutline } from 'react-icons/io5'

// eslint-disable-next-line react/prop-types
export default function Header({ title, titleButton }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl !font-bold">{title}</h1>

      <div className="flex items-center gap-2 border-2 border-[#bfbfbf] rounded-lg p-1 w-[30%]">
        <CiSearch className="text-2xl text-gray-500" />
        <input type="text" placeholder="Search..." className="flex-1 text-xl" />
        <IoCloseCircleOutline className="text-2xl text-gray-500 ml-auto" />
      </div>

      <button className="p-2 px-5 bg-amber-400 rounded-lg text-xl text-white">{titleButton}</button>
    </div>
  )
}
