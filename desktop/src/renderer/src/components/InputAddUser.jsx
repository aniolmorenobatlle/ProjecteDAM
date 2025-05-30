export default function InputAddUser({ placeholder, type, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300"
      value={value}
      onChange={onChange}
    />
  )
}
